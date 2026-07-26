import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { evaluateDoubleBlindMatch, RawAnswer } from './services/matchingEngine';
import { aiOrchestrator } from './services/aiOrchestrator';
import { socketServer } from './services/socketServer';

const app = express();
const server = http.createServer(app);

// Ensure sslmode=require for Supabase PostgreSQL in Vercel environment
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('sslmode=')) {
  const separator = process.env.DATABASE_URL.includes('?') ? '&' : '?';
  process.env.DATABASE_URL = `${process.env.DATABASE_URL}${separator}sslmode=require`;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Supabase REST client fallback
const supabaseUrl = process.env.SUPABASE_URL || 'https://vasuxemwjunbtccfppmg.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_bsAR8dUrV4W-9Re_VsQkxQ_44pQC-Yt';
const supabase = createClient(supabaseUrl, supabaseKey);

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Initialize WebSocket server
socketServer.initialize(server);

// --- AUTH & PAIRING ROUTES ---
app.post('/api/auth/register-device', async (req, res) => {
  try {
    const { deviceIdentity, publicKey, anonymousAlias } = req.body;
    let user = null;

    try {
      user = await prisma.user.findUnique({ where: { deviceIdentity } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            deviceIdentity,
            publicKey: publicKey || 'ECDH_KEY_DEFAULT',
            anonymousAlias: anonymousAlias || `Partner_${Math.floor(1000 + Math.random() * 9000)}`
          }
        });
      }
    } catch (dbErr) {
      console.warn('Prisma query warning, trying Supabase fallback:', dbErr);
      const { data: existingUser } = await supabase.from('User').select('*').eq('deviceIdentity', deviceIdentity).single();
      if (existingUser) {
        user = existingUser;
      } else {
        const newUser = {
          id: `User_${Math.random().toString(36).substring(2, 10)}`,
          deviceIdentity,
          publicKey: publicKey || 'ECDH_KEY_DEFAULT',
          anonymousAlias: anonymousAlias || `Partner_${Math.floor(1000 + Math.random() * 9000)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const { data: created } = await supabase.from('User').insert([newUser]).select().single();
        user = created || newUser;
      }
    }

    res.json({ success: true, user });
  } catch (e: any) {
    console.error('register-device error:', e);
    res.status(500).json({ success: false, error: e.message || String(e) });
  }
});

app.post('/api/auth/create-couple', async (req, res) => {
  try {
    const { userId } = req.body;
    const pairCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const coupleSalt = `Salt_${Math.random().toString(36).substring(2, 12)}`;

    let couple = null;
    try {
      couple = await prisma.couple.create({
        data: {
          pairCode,
          coupleSalt,
          users: { connect: [{ id: userId }] }
        },
        include: { users: true }
      });

      await prisma.user.update({
        where: { id: userId },
        data: { coupleId: couple.id }
      });
    } catch (dbErr) {
      const newCouple = {
        id: `Couple_${Math.random().toString(36).substring(2, 10)}`,
        pairCode,
        coupleSalt,
        createdAt: new Date().toISOString()
      };
      await supabase.from('Couple').insert([newCouple]);
      await supabase.from('User').update({ coupleId: newCouple.id }).eq('id', userId);
      couple = newCouple;
    }

    res.json({ success: true, couple });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message || String(e) });
  }
});

app.post('/api/auth/join-couple', async (req, res) => {
  try {
    const { userId, pairCode } = req.body;
    let couple = await prisma.couple.findUnique({
      where: { pairCode: pairCode.toUpperCase() },
      include: { users: true }
    });

    if (!couple) {
      return res.status(404).json({ success: false, error: 'Pair code not found' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { coupleId: couple.id }
    });

    const updatedCouple = await prisma.couple.findUnique({
      where: { id: couple.id },
      include: { users: true }
    });

    socketServer.broadcastToCouple(couple.id, {
      type: 'COUPLE_LINKED',
      payload: { coupleId: couple.id, users: updatedCouple?.users }
    });

    res.json({ success: true, couple: updatedCouple });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message || String(e) });
  }
});

// --- QUESTIONS CATALOG ROUTES ---
app.get('/api/questions', async (req, res) => {
  try {
    const { category, intensity } = req.query;
    const whereClause: any = {};

    if (category && category !== 'ALL') {
      whereClause.category = category as string;
    }
    if (intensity && intensity !== 'ALL') {
      whereClause.intensityLevel = intensity as string;
    }

    let questions = [];
    try {
      questions = await prisma.questionCatalog.findMany({
        where: whereClause,
        include: { linkedQuestion: true }
      });
    } catch (dbErr) {
      console.warn('Prisma questions query warning, fetching via Supabase REST:', dbErr);
      let query = supabase.from('QuestionCatalog').select('*');
      if (category && category !== 'ALL') query = query.eq('category', category as string);
      if (intensity && intensity !== 'ALL') query = query.eq('intensityLevel', intensity as string);
      const { data } = await query;
      questions = data || [];
    }

    res.json({ success: true, questions });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message || String(e) });
  }
});

// --- USER ANSWERS & DOUBLE-BLIND MATCHING ROUTES ---
app.post('/api/answers/submit', async (req, res) => {
  try {
    const { userId, questionId, encryptedValue, answerHash, rawValue } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { couple: { include: { users: true } } }
    });

    if (!user || !user.coupleId) {
      return res.status(400).json({ success: false, error: 'User must be linked in a couple' });
    }

    await prisma.userAnswer.upsert({
      where: {
        userId_questionId: { userId, questionId }
      },
      update: {
        encryptedValue: encryptedValue || 'AES_ENCRYPTED_BLOB',
        answerHash
      },
      create: {
        userId,
        questionId,
        encryptedValue: encryptedValue || 'AES_ENCRYPTED_BLOB',
        answerHash
      }
    });

    const partnerIds = user.couple?.users.map((u) => u.id) || [];
    const partnerAId = partnerIds[0];
    const partnerBId = partnerIds[1];

    if (partnerAId && partnerBId) {
      const answersA = await prisma.userAnswer.findMany({
        where: { userId: partnerAId },
        include: { question: true }
      });

      const answersB = await prisma.userAnswer.findMany({
        where: { userId: partnerBId },
        include: { question: true }
      });

      const mappedA: RawAnswer[] = answersA.map((a) => ({
        userId: a.userId,
        questionId: a.questionId,
        value: (a.userId === userId ? rawValue : a.answerHash.includes('NO') ? 'NO' : a.answerHash.includes('MAYBE') ? 'MAYBE' : 'YES') as any,
        roleType: a.question.roleType as any,
        linkedQuestionId: a.question.linkedQuestionId
      }));

      const mappedB: RawAnswer[] = answersB.map((b) => ({
        userId: b.userId,
        questionId: b.questionId,
        value: (b.userId === userId ? rawValue : b.answerHash.includes('NO') ? 'NO' : b.answerHash.includes('MAYBE') ? 'MAYBE' : 'YES') as any,
        roleType: b.question.roleType as any,
        linkedQuestionId: b.question.linkedQuestionId
      }));

      const matchResults = evaluateDoubleBlindMatch(mappedA, mappedB);

      for (const m of matchResults) {
        await prisma.sharedMatch.upsert({
          where: {
            coupleId_questionId: { coupleId: user.coupleId, questionId: m.questionId }
          },
          update: { matchStatus: m.matchStatus },
          create: { coupleId: user.coupleId, questionId: m.questionId, matchStatus: m.matchStatus }
        });

        if (m.matchStatus !== 'HIDDEN') {
          socketServer.broadcastToCouple(user.coupleId, {
            type: 'MATCH_DISCOVERED',
            payload: { questionId: m.questionId, status: m.matchStatus }
          });
        }
      }
    }

    res.json({ success: true, message: 'Answer recorded & double-blind engine updated' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message || String(e) });
  }
});

// --- MATCHES ROUTE ---
app.get('/api/matches', async (req, res) => {
  try {
    const { coupleId } = req.query;
    if (!coupleId) return res.status(400).json({ success: false, error: 'coupleId required' });

    let matches = await prisma.sharedMatch.findMany({
      where: {
        coupleId: coupleId as string,
        matchStatus: { not: 'HIDDEN' }
      }
    });

    const populated = await Promise.all(
      matches.map(async (m) => {
        const question = await prisma.questionCatalog.findUnique({ where: { id: m.questionId } });
        return { ...m, question };
      })
    );

    res.json({ success: true, matches: populated });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message || String(e) });
  }
});

// --- DARES & CHALLENGES ROUTES ---
app.get('/api/dares', async (req, res) => {
  try {
    const { coupleId } = req.query;
    if (!coupleId) return res.status(400).json({ success: false, error: 'coupleId required' });

    const challenges = await prisma.coupleChallenge.findMany({
      where: { coupleId: coupleId as string },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, challenges });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message || String(e) });
  }
});

app.post('/api/dares/create', async (req, res) => {
  try {
    const { coupleId, title, description, durationHours } = req.body;
    const hours = durationHours || 24;
    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

    const challenge = await prisma.coupleChallenge.create({
      data: {
        coupleId,
        title,
        description,
        expiresAt,
        status: 'PENDING',
        pointsValue: hours === 48 ? 25 : 15
      }
    });

    socketServer.broadcastToCouple(coupleId, {
      type: 'CHALLENGE_ISSUED',
      payload: challenge
    });

    res.json({ success: true, challenge });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message || String(e) });
  }
});

// --- INTIMACY TRACKER ROUTES ---
app.post('/api/intimacy/log', async (req, res) => {
  try {
    const { coupleId, activityType, durationMinutes, location, protectionUsed, moodRating } = req.body;

    const log = await prisma.intimacyLog.create({
      data: {
        coupleId,
        activityType: activityType || 'Sensual Exploration',
        durationMinutes: parseInt(durationMinutes) || 30,
        location: location || 'Bedroom',
        protectionUsed: protectionUsed ?? true,
        moodRating: parseInt(moodRating) || 5
      }
    });

    res.json({ success: true, log });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message || String(e) });
  }
});

app.get('/api/intimacy/logs', async (req, res) => {
  try {
    const { coupleId } = req.query;
    if (!coupleId) return res.status(400).json({ success: false, error: 'coupleId required' });

    const logs = await prisma.intimacyLog.findMany({
      where: { coupleId: coupleId as string },
      orderBy: { loggedAt: 'desc' }
    });

    const totalSessions = logs.length;
    const avgDuration = totalSessions > 0 ? Math.round(logs.reduce((acc, l) => acc + (l.durationMinutes || 0), 0) / totalSessions) : 0;
    const avgMood = totalSessions > 0 ? (logs.reduce((acc, l) => acc + l.moodRating, 0) / totalSessions).toFixed(1) : '5.0';

    res.json({
      success: true,
      logs,
      metrics: { totalSessions, avgDuration, avgMood }
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message || String(e) });
  }
});

// --- AI ORCHESTRATOR ROUTES ---
app.post('/api/ai/generate-scenario', async (req, res) => {
  try {
    const { coupleId, intensityMode } = req.body;
    const matches = await prisma.sharedMatch.findMany({
      where: { coupleId, matchStatus: { not: 'HIDDEN' } }
    });

    const populatedMatches = await Promise.all(
      matches.map(async (m) => {
        const q = await prisma.questionCatalog.findUnique({ where: { id: m.questionId } });
        return {
          title: q?.title || 'Sensual Connection',
          category: q?.category || 'Sensual',
          intensityLevel: q?.intensityLevel || 'VANILLA',
          matchStatus: m.matchStatus
        };
      })
    );

    const scenario = aiOrchestrator.generateEveningScenario(populatedMatches, intensityMode);
    res.json({ success: true, scenario });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message || String(e) });
  }
});

app.post('/api/ai/aria-advice', async (req, res) => {
  try {
    const { prompt } = req.body;
    const advice = aiOrchestrator.getAriaAdvice(prompt || 'How to talk about boundaries?');
    res.json({ success: true, advice });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message || String(e) });
  }
});

// Global Express error handler middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('🔥 Serverless API Error:', err);
  res.status(500).json({ success: false, error: err?.message || String(err) });
});

// Start Server if not running in Vercel serverless environment
if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`🚀 MyKink Backend running at http://localhost:${PORT}`);
  });
}

export default app;
