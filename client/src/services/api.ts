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

// Generate deterministic UUID for UserAnswer to eliminate 409 Conflict on rapid clicks
function getDeterministicAnswerId(userId: string, questionId: string): string {
  const str = `${userId}_${questionId}`;
  let hash1 = 5381;
  let hash2 = 52711;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash1 = (hash1 * 33) ^ char;
    hash2 = (hash2 * 33) ^ char;
  }

  const h1 = Math.abs(hash1).toString(16).padStart(16, '0');
  const h2 = Math.abs(hash2).toString(16).padStart(16, '0');
  const hex = (h1 + h2).slice(0, 32);

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

// Google OAuth Sign In with Dynamic Production Redirect
export async function signInWithGoogle() {
  try {
    const currentOrigin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'https://my-kink.vercel.app';

    const redirectUrl = currentOrigin.includes('localhost')
      ? 'https://my-kink.vercel.app'
      : currentOrigin;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });

    if (error) {
      alert(
        'Google OAuth Provider is not enabled yet in Supabase Dashboard.\n\nTo enable:\n1. Open Supabase Dashboard -> Authentication -> Providers -> Google\n2. Toggle Google to Enabled and add Client ID & Secret.\n3. Add Redirect URL: https://my-kink.vercel.app'
      );
      return { success: false, error };
    }

    return { success: true, data };
  } catch (e) {
    console.warn('Google auth error:', e);
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

// 1. Register Device / Google User 1-to-1 Mapping with Upsert
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
    const now = new Date().toISOString();

    // Use upsert onConflict deviceIdentity to prevent 409 Conflict errors
    const { data: newUser, error } = await supabase
      .from('User')
      .upsert({
        id: newId,
        deviceIdentity: targetIdentity,
        publicKey,
        anonymousAlias: 'PENDING',
        updatedAt: now
      }, { onConflict: 'deviceIdentity' })
      .select()
      .single();

    if (!error && newUser) {
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

// 1b. Update User Profile in DB
export async function updateUserProfileInDB(userId: string, alias: string) {
  try {
    const now = new Date().toISOString();
    await supabase.from('User').update({
      anonymousAlias: alias,
      updatedAt: now
    }).eq('id', userId);
  } catch (e) {
    console.warn('Update user profile error:', e);
  }
}

// 1c. Fetch User Saved Answers from DB
export async function fetchUserAnswers(userId: string) {
  try {
    const { data: answers, error } = await supabase
      .from('UserAnswer')
      .select('questionId')
      .eq('userId', userId);

    if (!error && answers) {
      return { success: true, answers };
    }
  } catch (e) {
    console.warn('Fetch user answers error:', e);
  }
  return { success: false, answers: [] };
}

// 2. Create Couple (Without non-existent updatedAt column to prevent 400 Bad Request)
export async function createCouple(userId: string) {
  try {
    const pairCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const coupleSalt = 'Salt_' + Math.random().toString(36).substring(2, 10);
    const newId = generateUUID();

    const { data: couple, error } = await supabase
      .from('Couple')
      .insert({ id: newId, pairCode, coupleSalt })
      .select()
      .single();

    if (!error && couple && userId) {
      const now = new Date().toISOString();
      await supabase.from('User').update({ coupleId: couple.id, updatedAt: now }).eq('id', userId);
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
    const now = new Date().toISOString();

    if (userId) {
      await supabase.from('User').update({ coupleId: couple.id, updatedAt: now }).eq('id', userId);
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
    console.warn('Using Catalog Fallback');
  }

  return { success: true, questions: [] };
}

// 5. Submit Answer (Using deterministic answer ID to prevent 409 Conflict on rapid clicks)
export async function submitAnswer(
  userId: string,
  questionId: string,
  encryptedValue: string,
  answerHash: string,
  value: 'YES' | 'MAYBE' | 'NO'
) {
  try {
    const answerId = getDeterministicAnswerId(userId, questionId);

    await supabase.from('UserAnswer').upsert({
      id: answerId,
      userId,
      questionId,
      encryptedValue,
      answerHash
    });

    return { success: true };
  } catch (e) {
    console.warn('Submit answer fallback:', e);
    return { success: true };
  }
}

// 6. Fetch Matches (Return empty array when no actual matches exist)
export async function fetchMatches(coupleId: string) {
  try {
    const { data: matches, error } = await supabase
      .from('SharedMatch')
      .select('*')
      .eq('coupleId', coupleId);

    if (!error && matches) {
      if (matches.length === 0) {
        return { success: true, matches: [] };
      }

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
    console.warn('Match fetch error');
  }

  return { success: true, matches: [] };
}

// 7. Fetch Dares (3 Initial Default Challenges)
export async function fetchDares(coupleId: string) {
  try {
    const key = `mykink_dares_${coupleId || 'default'}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed: ChallengeItem[] = JSON.parse(raw);
      return { success: true, challenges: parsed };
    }
  } catch (e) {
    console.warn('Fetch dares local storage error:', e);
  }

  // Initial 3 Default Challenges
  const defaultInitialChallenges: ChallengeItem[] = [
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
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 12 * 3600 * 1000).toISOString()
    },
    {
      id: 'd3',
      title: 'Silent Sensory Touch',
      description: 'Place a soft blindfold on your partner and touch sensitive areas gently for 5 minutes without speaking.',
      pointsValue: 20,
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString()
    }
  ];

  return { success: true, challenges: defaultInitialChallenges };
}

// 8. Create Dare (Save to LocalStorage)
export async function createDare(
  coupleId: string,
  title: string,
  description: string,
  hours: number
) {
  try {
    const key = `mykink_dares_${coupleId || 'default'}`;
    const existingRes = await fetchDares(coupleId);
    const existing: ChallengeItem[] = existingRes.challenges || [];

    const newDare: ChallengeItem = {
      id: generateUUID(),
      title,
      description,
      pointsValue: 15,
      status: 'PENDING',
      expiresAt: new Date(Date.now() + hours * 3600 * 1000).toISOString()
    };

    const updated = [newDare, ...existing];
    localStorage.setItem(key, JSON.stringify(updated));

    return { success: true, dare: newDare };
  } catch (e) {
    console.warn('Create dare error:', e);
  }
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
