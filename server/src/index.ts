import express from 'express';
import cors from 'cors';
import http from 'http';
import { PrismaClient } from '@prisma/client';
import { evaluateDoubleBlindMatch, RawAnswer } from './services/matchingEngine';
import { aiOrchestrator } from './services/aiOrchestrator';
import { socketServer } from './services/socketServer';

const app = express();
const server = http.createServer(app);
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Initialize WebSocket server
socketServer.initialize(server);

// --- AUTH & PAIRING ROUTES ---
app.post('/api/auth/register-device', async (req, res) => {
  try {
    const { deviceIdentity, publicKey, anonymousAlias } = req.body;
    let user = await prisma.user.findUnique({ where: { deviceIdentity } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          deviceIdentity,
          publicKey: publicKey || 'ECDH_KEY_DEFAULT',
          anonymousAlias: anonymousAlias || `Partner_${Math.floor(1000 + Math.random() * 9000)}`
        }
      });
    }

    res.json({ success: true, user });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/create-couple', async (req, res) => {
  try {
    const { userId } = req.body;
    const pairCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const coupleSalt = `Salt_${Math.random().toString(36).substring(2, 12)}`;

    const couple = await prisma.couple.create({
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

    res.json({ success: true, couple });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/join-couple', async (req, res) => {
  try {
    const { userId, pairCode } = req.body;
    const couple = await prisma.couple.findUnique({
      where: { pairCode: pairCode.toUpperCase() },
      include: { users: true }
    });

    if (!couple) {
      return res.status(404).json({ error: 'Pair code not found' });
    }

    if (couple.users.length >= 2 && !couple.users.some(u => u.id === userId)) {
      return res.status(400).json({ error: 'Couple already has 2 partners linked' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { coupleId: couple.id }
    });

    const updatedCouple = await prisma.couple.findUnique({
      where: { id: couple.id },
      include: { users: true }
    });

    // Notify connected WS clients
    socketServer.broadcastToCouple(couple.id, {
      type: 'COUPLE_LINKED',
      payload: { coupleId: couple.id, users: updatedCouple?.users }
    });

    res.json({ success: true, couple: updatedCouple });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
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

    const questions = await prisma.questionCatalog.findMany({
      where: whereClause,
      include: { linkedQuestion: true }
    });

    res.json({ success: true, questions });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// --- USER ANSWERS & DOUBLE-BLIND MATCHING ROUTES ---
app.post('/api/answers/submit', async (req, res) => {
  try {
    const { userId, questionId, encryptedValue, answerHash, rawValue } = req.body;
    // rawValue is provided client-side for immediate local double-blind evaluation

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { couple: { include: { users: true } } }
    });

    if (!user || !user.coupleId) {
      return res.status(400).json({ error: 'User must be linked in a couple' });
    }

    // Upsert User Answer
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

    // Fetch both partners' answers for matching calculation
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

      // Construct raw answer objects for double-blind engine
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

      // Save/Update SharedMatches
      for (const m of matchResults) {
        await prisma.sharedMatch.upsert({
          where: {
            coupleId_questionId: { coupleId: user.coupleId, questionId: m.questionId }
          },
          update: { matchStatus: m.matchStatus },
          create: { coupleId: user.coupleId, questionId: m.questionId, matchStatus: m.matchStatus }
        });

        // If mutual match discovered, broadcast via WS
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
    res.status(500).json({ error: e.message });
  }
});

// --- MATCHES ROUTE ---
app.get('/api/matches', async (req, res) => {
  try {
    const { coupleId } = req.query;
    if (!coupleId) return res.status(400).json({ error: 'coupleId required' });

    const matches = await prisma.sharedMatch.findMany({
      where: {
        coupleId: coupleId as string,
        matchStatus: { not: 'HIDDEN' } // Never expose HIDDEN / NO choices
      }
    });

    // Populate question catalog details
    const populated = await Promise.all(
      matches.map(async (m) => {
        const question = await prisma.questionCatalog.findUnique({ where: { id: m.questionId } });
        return { ...m, question };
      })
    );

    res.json({ success: true, matches: populated });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// --- DARES & CHALLENGES ROUTES ---
app.get('/api/dares', async (req, res) => {
  try {
    const { coupleId } = req.query;
    if (!coupleId) return res.status(400).json({ error: 'coupleId required' });

    const challenges = await prisma.coupleChallenge.findMany({
      where: { coupleId: coupleId as string },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, challenges });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
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
    res.status(500).json({ error: e.message });
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
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/intimacy/logs', async (req, res) => {
  try {
    const { coupleId } = req.query;
    if (!coupleId) return res.status(400).json({ error: 'coupleId required' });

    const logs = await prisma.intimacyLog.findMany({
      where: { coupleId: coupleId as string },
      orderBy: { loggedAt: 'desc' }
    });

    // Calculate analytics metrics
    const totalSessions = logs.length;
    const avgDuration = totalSessions > 0 ? Math.round(logs.reduce((acc, l) => acc + (l.durationMinutes || 0), 0) / totalSessions) : 0;
    const avgMood = totalSessions > 0 ? (logs.reduce((acc, l) => acc + l.moodRating, 0) / totalSessions).toFixed(1) : '5.0';

    res.json({
      success: true,
      logs,
      metrics: { totalSessions, avgDuration, avgMood }
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
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
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/ai/aria-advice', async (req, res) => {
  try {
    const { prompt } = req.body;
    const advice = aiOrchestrator.getAriaAdvice(prompt || 'How to talk about boundaries?');
    res.json({ success: true, advice });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Start Server if not running in Vercel serverless environment
if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`🚀 MyKink Backend running at http://localhost:${PORT}`);
  });
}

export default app;

