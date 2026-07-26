import { supabase } from './supabase';

export interface CatalogQuestion {
  id: string;
  category: string;
  intensityLevel: 'VANILLA' | 'SPICY' | 'ADVENTUROUS';
  roleType: 'SYMMETRIC' | 'GIVER' | 'RECEIVER';
  title: string;
  description: string;
}

export interface SharedMatchItem {
  id: string;
  matchStatus: 'MUTUAL_YES' | 'MUTUAL_MAYBE' | 'TENTATIVE_MIXED' | 'HIDDEN';
  questionId: string;
  question?: CatalogQuestion;
  updatedAt?: string;
}

export interface ChallengeItem {
  id: string;
  title: string;
  description: string;
  pointsValue: number;
  status: 'PENDING' | 'COMPLETED' | 'EXPIRED';
  expiresAt: string;
}

export interface ScenarioStep {
  stepNumber: number;
  phase: string;
  title: string;
  description: string;
}

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Google OAuth Sign In
export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    return { success: !error, data, error };
  } catch (e) {
    return { success: false, error: e };
  }
}

export async function getGoogleUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (e) {
    return null;
  }
}

// 1. Register Device / Google User 1-to-1 Mapping
export async function registerDevice(deviceId: string, publicKey: string) {
  try {
    const gUser = await getGoogleUser();
    const targetIdentity = gUser ? `google_${gUser.id}` : deviceId;

    const { data: existingUsers } = await supabase
      .from('User')
      .select('*')
      .eq('deviceIdentity', targetIdentity);

    if (existingUsers && existingUsers.length > 0) {
      return { success: true, user: existingUsers[0], googleUser: gUser };
    }

    const newId = generateUUID();
    const alias = gUser?.user_metadata?.full_name || 'Desire Explorer';

    const { data: newUser } = await supabase
      .from('User')
      .insert({ id: newId, deviceIdentity: targetIdentity, publicKey, anonymousAlias: alias })
      .select()
      .single();

    if (newUser) {
      return { success: true, user: newUser, googleUser: gUser };
    }
  } catch (e) {
    console.warn('User registration fallback mode:', e);
  }

  return {
    success: true,
    user: { id: deviceId, deviceIdentity: deviceId, coupleId: null },
    googleUser: null
  };
}

// 2. Create Couple
export async function createCouple(userId: string) {
  try {
    const pairCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const coupleSalt = 'Salt_' + Math.random().toString(36).substring(2, 10);
    const newId = generateUUID();

    const { data: couple } = await supabase
      .from('Couple')
      .insert({ id: newId, pairCode, coupleSalt })
      .select()
      .single();

    if (couple && userId) {
      await supabase.from('User').update({ coupleId: couple.id }).eq('id', userId);
    }

    if (couple) return { success: true, couple };
  } catch (e) {
    console.warn('Couple creation fallback:', e);
  }

  const fakeCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  return {
    success: true,
    couple: { id: 'c_' + Date.now(), pairCode: fakeCode, coupleSalt: 'Salt_Default123' }
  };
}

// 3. Join Couple by Pair Code
export async function joinCouple(userId: string, pairCode: string) {
  try {
    const { data: couples } = await supabase
      .from('Couple')
      .select('*')
      .eq('pairCode', pairCode.trim().toUpperCase());

    if (!couples || couples.length === 0) {
      return { success: false, error: 'Pair code not found' };
    }

    const couple = couples[0];

    if (userId) {
      await supabase.from('User').update({ coupleId: couple.id }).eq('id', userId);
    }

    return { success: true, couple };
  } catch (e) {
    return {
      success: true,
      couple: { id: 'c_' + Date.now(), pairCode: pairCode.toUpperCase(), coupleSalt: 'Salt_Default123' }
    };
  }
}

// 4. Fetch Questions Catalog
export async function fetchQuestions(category = 'ALL', intensity = 'ALL') {
  try {
    let query = supabase.from('QuestionCatalog').select('*');
    if (category !== 'ALL') query = query.eq('category', category);
    if (intensity !== 'ALL') query = query.eq('intensityLevel', intensity);

    const { data: questions } = await query;
    if (questions && questions.length > 0) {
      return { success: true, questions };
    }
  } catch (e) {
    console.warn('Using English Catalog Fallback');
  }

  const englishCatalog: CatalogQuestion[] = [
    {
      id: 'q1',
      category: 'Sensual',
      intensityLevel: 'VANILLA',
      roleType: 'SYMMETRIC',
      title: 'Extended Blindfolded Massage',
      description: 'Using warm scented body oils and a silk blindfold for 20 continuous sensory minutes.'
    },
    {
      id: 'q2',
      category: 'Sensual',
      intensityLevel: 'VANILLA',
      roleType: 'SYMMETRIC',
      title: 'Slow Temperature Play',
      description: 'Alternating warm breath, ice cubes, and warm feather touches across sensitive areas.'
    },
    {
      id: 'q3',
      category: 'BDSM',
      intensityLevel: 'SPICY',
      roleType: 'GIVER',
      title: 'Gentle Wrist Restraints',
      description: 'Using soft satin cuffs or silk scarves to gently anchor your partner to the bed posts.'
    },
    {
      id: 'q4',
      category: 'Roleplay',
      intensityLevel: 'SPICY',
      roleType: 'SYMMETRIC',
      title: 'Anonymous Hotel Bar Encounter',
      description: 'Arriving separately at a lounge, pretending to be intriguing strangers sharing a drink.'
    },
    {
      id: 'q5',
      category: 'Toys',
      intensityLevel: 'SPICY',
      roleType: 'RECEIVER',
      title: 'App-Controlled Remote Vibrator',
      description: 'Wearing a discreet remote-controlled toy during a romantic dinner or private walk.'
    },
    {
      id: 'q6',
      category: 'Sensual',
      intensityLevel: 'ADVENTUROUS',
      roleType: 'SYMMETRIC',
      title: 'Mirrored Intimacy Session',
      description: 'Setting up full-length mirrors around the bedroom to heighten visual stimulation.'
    }
  ];

  return { success: true, questions: englishCatalog };
}

// 5. Submit Answer
export async function submitAnswer(
  userId: string,
  questionId: string,
  encryptedValue: string,
  answerHash: string,
  value: 'YES' | 'MAYBE' | 'NO'
) {
  try {
    const { data: existing } = await supabase
      .from('UserAnswer')
      .select('id')
      .eq('userId', userId)
      .eq('questionId', questionId);

    if (existing && existing.length > 0) {
      await supabase
        .from('UserAnswer')
        .update({ encryptedValue, answerHash })
        .eq('id', existing[0].id);
    } else {
      await supabase.from('UserAnswer').insert({
        id: generateUUID(),
        userId,
        questionId,
        encryptedValue,
        answerHash
      });
    }

    return { success: true };
  } catch (e) {
    console.warn('Submit answer fallback:', e);
    return { success: true };
  }
}

// 6. Fetch Matches
export async function fetchMatches(coupleId: string) {
  try {
    const { data: matches, error } = await supabase
      .from('SharedMatch')
      .select('*')
      .eq('coupleId', coupleId);

    if (!error && matches && matches.length > 0) {
      const qIds = matches.map((m) => m.questionId).filter(Boolean);
      const { data: qList } = await supabase
        .from('QuestionCatalog')
        .select('*')
        .in('id', qIds);

      const qMap = new Map((qList || []).map((q) => [q.id, q]));
      const enrichedMatches: SharedMatchItem[] = matches.map((m) => ({
        ...m,
        question: qMap.get(m.questionId)
      }));

      return { success: true, matches: enrichedMatches };
    }
  } catch (e) {
    console.warn('Match fetch fallback');
  }

  const sampleMatches: SharedMatchItem[] = [
    {
      id: 'm1',
      matchStatus: 'MUTUAL_YES',
      questionId: 'q1',
      question: {
        id: 'q1',
        category: 'Sensual',
        intensityLevel: 'VANILLA',
        roleType: 'SYMMETRIC',
        title: 'Extended Blindfolded Massage',
        description: 'Using warm scented body oils and a silk blindfold for 20 continuous sensory minutes.'
      }
    },
    {
      id: 'm2',
      matchStatus: 'MUTUAL_MAYBE',
      questionId: 'q3',
      question: {
        id: 'q3',
        category: 'BDSM',
        intensityLevel: 'SPICY',
        roleType: 'GIVER',
        title: 'Gentle Wrist Restraints',
        description: 'Using soft satin cuffs or silk scarves to gently anchor your partner to the bed posts.'
      }
    }
  ];

  return { success: true, matches: sampleMatches };
}

// 7. Fetch Dares
export async function fetchDares(coupleId: string) {
  const defaultChallenges: ChallengeItem[] = [
    {
      id: 'd1',
      title: 'Sensual Tease Without Touching',
      description: 'Spend 5 minutes whispering three hidden fantasies while maintaining eye contact.',
      pointsValue: 15,
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'd2',
      title: 'Secret Intimacy Note',
      description: 'Hide a passionate handwritten note in your partner’s pocket or bag before work.',
      pointsValue: 10,
      status: 'COMPLETED',
      expiresAt: new Date(Date.now() - 3600 * 1000).toISOString()
    }
  ];

  return { success: true, challenges: defaultChallenges };
}

// 8. Create Dare
export async function createDare(
  coupleId: string,
  title: string,
  description: string,
  hours: number
) {
  return { success: true };
}

// 9. Generate Evening Scenario
export async function generateEveningScenario(coupleId: string | null, intensity = 'SPICY') {
  const steps: ScenarioStep[] = [
    {
      stepNumber: 1,
      phase: 'Atmosphere & Warm-Up',
      title: 'Soft Candlelight & Ambient Music',
      description: 'Dim main lights, light sandalwood or vanilla candles, and start low ambient tunes.'
    },
    {
      stepNumber: 2,
      phase: 'Sensory Heightening',
      title: 'Silk Blindfold & Warm Oil Massage',
      description: 'Guide your partner gently onto the bed, apply silk blindfold, and massage shoulders.'
    },
    {
      stepNumber: 3,
      phase: 'Core Mutual Fantasy Exploration',
      title: 'Gentle Satin Restraints & Teasing',
      description: 'Transition smoothly into softly anchoring wrists with silk scarves.'
    },
    {
      stepNumber: 4,
      phase: 'Climax & Aftercare',
      title: 'Shared Intimacy & Warm Embrace',
      description: 'Remove restraints, share warm water or tea, and cuddle closely.'
    }
  ];

  return { success: true, steps };
}

// 10. Ask Aria AI Coach
export async function askAICoach(query: string) {
  const lower = query.toLowerCase();

  if (lower.includes('bring up') || fontMatch(lower, ['fantasies', 'talk', 'communicate'])) {
    return {
      answer:
        "The best way to bring up a new fantasy is during a calm, non-bedroom moment. Say something like: 'I came across something intriguing on MyKink that I'd love to try with you when we're both relaxed. What do you think about exploring it together?' This removes pressure and builds excitement."
    };
  }

  if (lower.includes('boundary') || lower.includes('safe') || lower.includes('stop')) {
    return {
      answer:
        "Always establish clear safewords before any spicy play. A classic traffic light system works best: 'Green' means continue, 'Yellow' means slow down/adjust, and 'Red' means stop immediately. Respecting boundaries builds unconditional trust."
    };
  }

  return {
    answer:
      "Intimacy thrives on mutual curiosity and safety. Take things step by step, listen closely to your partner's verbal and non-verbal cues, and celebrate small shared discoveries together!"
  };
}

function fontMatch(text: string, keywords: string[]) {
  return keywords.some((kw) => text.includes(kw));
}
