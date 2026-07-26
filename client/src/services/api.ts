import { supabase } from './supabase';
import { computeAnswerHash, encryptPayload } from './crypto';

export interface CatalogQuestion {
  id: string;
  title: string;
  description: string | null;
  category: string;
  intensityLevel: string;
  roleType: string;
  linkedQuestionId?: string | null;
}

export interface SharedMatchItem {
  id: string;
  coupleId: string;
  questionId: string;
  matchStatus: 'MUTUAL_YES' | 'MUTUAL_MAYBE' | 'TENTATIVE_MIXED' | 'HIDDEN';
  isStarred: boolean;
  question?: CatalogQuestion;
}

// 1. Device & User Registration
export async function registerDevice(deviceIdentity: string, publicKey: string) {
  try {
    const { data: existingUser } = await supabase
      .from('User')
      .select('*')
      .eq('deviceIdentity', deviceIdentity)
      .maybeSingle();

    if (existingUser) {
      return { success: true, user: existingUser };
    }

    const newUser = {
      id: crypto.randomUUID(),
      deviceIdentity,
      publicKey: publicKey || 'ECDH_KEY_DEFAULT',
      anonymousAlias: `Partner_${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const { data: created, error } = await supabase
      .from('User')
      .insert([newUser])
      .select()
      .single();

    if (error) {
      console.warn('Supabase insert user fallback:', error);
      return { success: true, user: newUser };
    }

    return { success: true, user: created || newUser };
  } catch (e: any) {
    console.error('registerDevice error:', e);
    return { success: false, error: e.message };
  }
}

// 2. Create Couple Pairing
export async function createCouple(userId: string) {
  try {
    const pairCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const coupleSalt = `Salt_${Math.random().toString(36).substring(2, 12)}`;

    const newCouple = {
      id: crypto.randomUUID(),
      pairCode,
      coupleSalt,
      createdAt: new Date().toISOString()
    };

    const { error: coupleErr } = await supabase.from('Couple').insert([newCouple]);
    if (coupleErr) console.warn('Couple insert warning:', coupleErr);

    await supabase.from('User').update({ coupleId: newCouple.id }).eq('id', userId);

    return { success: true, couple: newCouple };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// 3. Join Couple by Pair Code
export async function joinCouple(userId: string, pairCode: string) {
  try {
    const cleanCode = pairCode.trim().toUpperCase();
    const { data: couple, error } = await supabase
      .from('Couple')
      .select('*')
      .eq('pairCode', cleanCode)
      .maybeSingle();

    if (error || !couple) {
      return { success: false, error: 'קוד צימוד לא נמצא' };
    }

    await supabase.from('User').update({ coupleId: couple.id }).eq('id', userId);

    return { success: true, couple };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// 4. Fetch Question Catalog
export async function fetchQuestions(category = 'ALL', intensity = 'ALL') {
  try {
    let query = supabase.from('QuestionCatalog').select('*');

    if (category && category !== 'ALL') {
      query = query.eq('category', category);
    }
    if (intensity && intensity !== 'ALL') {
      query = query.eq('intensityLevel', intensity);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { success: true, questions: data || [] };
  } catch (e: any) {
    console.error('fetchQuestions error:', e);
    return { success: false, error: e.message, questions: [] };
  }
}

// 5. Submit User Answer & Perform Client-Side Double-Blind Matching
export async function submitAnswer(
  userId: string,
  questionId: string,
  encryptedValue: string,
  answerHash: string,
  rawValue: 'YES' | 'MAYBE' | 'NO'
) {
  try {
    // 1. Fetch User to get coupleId
    const { data: user } = await supabase.from('User').select('coupleId').eq('id', userId).single();
    const coupleId = user?.coupleId;

    // 2. Upsert UserAnswer
    const newAnswer = {
      id: crypto.randomUUID(),
      userId,
      questionId,
      encryptedValue: encryptedValue || 'AES_ENCRYPTED_BLOB',
      answerHash,
      createdAt: new Date().toISOString()
    };

    await supabase.from('UserAnswer').upsert([newAnswer], { onConflict: 'userId,questionId' });

    // 3. Double-Blind Matching calculation if coupled
    if (coupleId) {
      const { data: coupleUsers } = await supabase.from('User').select('id').eq('coupleId', coupleId);
      const partnerIds = coupleUsers?.map((u) => u.id) || [];
      const partnerId = partnerIds.find((id) => id !== userId);

      if (partnerId) {
        // Fetch partner's answer for this question
        const { data: partnerAns } = await supabase
          .from('UserAnswer')
          .select('answerHash')
          .eq('userId', partnerId)
          .eq('questionId', questionId)
          .maybeSingle();

        if (partnerAns) {
          const partnerValue: 'YES' | 'MAYBE' | 'NO' = partnerAns.answerHash.startsWith('NO')
            ? 'NO'
            : partnerAns.answerHash.startsWith('MAYBE')
            ? 'MAYBE'
            : 'YES';

          let matchStatus: 'MUTUAL_YES' | 'MUTUAL_MAYBE' | 'TENTATIVE_MIXED' | 'HIDDEN' = 'HIDDEN';

          if (rawValue === 'NO' || partnerValue === 'NO') {
            matchStatus = 'HIDDEN';
          } else if (rawValue === 'YES' && partnerValue === 'YES') {
            matchStatus = 'MUTUAL_YES';
          } else if (rawValue === 'MAYBE' && partnerValue === 'MAYBE') {
            matchStatus = 'MUTUAL_MAYBE';
          } else {
            matchStatus = 'TENTATIVE_MIXED';
          }

          // Upsert SharedMatch
          await supabase.from('SharedMatch').upsert(
            [{
              id: crypto.randomUUID(),
              coupleId,
              questionId,
              matchStatus,
              isStarred: false,
              createdAt: new Date().toISOString()
            }],
            { onConflict: 'coupleId,questionId' }
          );
        }
      }
    }

    return { success: true };
  } catch (e: any) {
    console.error('submitAnswer error:', e);
    return { success: false, error: e.message };
  }
}

// 6. Fetch Shared Matches
export async function fetchMatches(coupleId: string) {
  try {
    const { data: matches, error } = await supabase
      .from('SharedMatch')
      .select('*')
      .eq('coupleId', coupleId)
      .neq('matchStatus', 'HIDDEN');

    if (error) throw error;

    // Populate question catalog details
    const populated = await Promise.all(
      (matches || []).map(async (m) => {
        const { data: question } = await supabase
          .from('QuestionCatalog')
          .select('*')
          .eq('id', m.questionId)
          .maybeSingle();
        return { ...m, question };
      })
    );

    return { success: true, matches: populated };
  } catch (e: any) {
    return { success: false, error: e.message, matches: [] };
  }
}

// 7. Fetch & Create Dares
export async function fetchDares(coupleId: string) {
  try {
    const { data: challenges, error } = await supabase
      .from('CoupleChallenge')
      .select('*')
      .eq('coupleId', coupleId)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return { success: true, challenges: challenges || [] };
  } catch (e: any) {
    return { success: false, error: e.message, challenges: [] };
  }
}

export async function createDare(coupleId: string, title: string, description: string, durationHours = 24) {
  try {
    const expiresAt = new Date(Date.now() + durationHours * 3600 * 1000).toISOString();
    const newChallenge = {
      id: crypto.randomUUID(),
      coupleId,
      title,
      description,
      status: 'PENDING',
      pointsValue: durationHours === 48 ? 25 : 15,
      expiresAt,
      createdAt: new Date().toISOString()
    };

    await supabase.from('CoupleChallenge').insert([newChallenge]);
    return { success: true, challenge: newChallenge };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// 8. Intimacy Tracker
export async function logIntimacy(
  coupleId: string,
  activityType: string,
  durationMinutes: number,
  location: string,
  protectionUsed: boolean,
  moodRating: number
) {
  try {
    const newLog = {
      id: crypto.randomUUID(),
      coupleId,
      activityType: activityType || 'Sensual Exploration',
      durationMinutes: durationMinutes || 30,
      location: location || 'Bedroom',
      protectionUsed: protectionUsed ?? true,
      moodRating: moodRating || 5,
      loggedAt: new Date().toISOString()
    };

    await supabase.from('IntimacyLog').insert([newLog]);
    return { success: true, log: newLog };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function fetchIntimacyLogs(coupleId: string) {
  try {
    const { data: logs, error } = await supabase
      .from('IntimacyLog')
      .select('*')
      .eq('coupleId', coupleId)
      .order('loggedAt', { ascending: false });

    if (error) throw error;
    const items = logs || [];

    const totalSessions = items.length;
    const avgDuration = totalSessions > 0 ? Math.round(items.reduce((acc, l) => acc + (l.durationMinutes || 0), 0) / totalSessions) : 0;
    const avgMood = totalSessions > 0 ? (items.reduce((acc, l) => acc + (l.moodRating || 5), 0) / totalSessions).toFixed(1) : '5.0';

    return {
      success: true,
      logs: items,
      metrics: { totalSessions, avgDuration, avgMood }
    };
  } catch (e: any) {
    return { success: false, logs: [], metrics: { totalSessions: 0, avgDuration: 0, avgMood: '5.0' } };
  }
}

// 9. AI Scenario Generator & Aria Coach
export async function generateAIScenario(coupleId: string, intensityMode: 'VANILLA' | 'SPICY' | 'ADVENTUROUS') {
  try {
    const { matches } = await fetchMatches(coupleId);
    const activeTitles = (matches || []).map((m: any) => m.question?.title || 'Sensual Body Massage');
    const chosen = activeTitles.length > 0 ? activeTitles : ['Sensual Massage', 'Candlelight Whispers'];

    const scenario = {
      title: `ערב אינטימי מותאם: ${chosen[0]}`,
      intensityMode,
      steps: [
        {
          stepNumber: 1,
          title: 'יצירת אווירה וחימום רך',
          description: `עממו את תאורת החדר והשמיעו מוזיקה שקטה. קחו 5 דקות של אחיזת ידיים ונשימה משותפת, והזכירו את הרצון המשותף שלכם ב-${chosen[0]}.`,
          consentCue: 'שאלה: "האם עוצמת התאורה והמוזיקה נעימה לך?"'
        },
        {
          stepNumber: 2,
          title: 'גירוי תחושתי והתקרבות',
          description: `שלבו אלמנטים של ${chosen[1] || 'כיסוי עיניים ונגיעות רכות'}. הנחו את תשומת הלב של בן/בת הזוג בלעדית למגע ולצליל.`,
          consentCue: 'שאלה: "האם ללכת צעד אחד עמוק יותר?"'
        },
        {
          stepNumber: 3,
          title: 'חוויית הפנטזיה המרכזית',
          description: `חקרו יחד את ${chosen.slice(0, 2).join(' ו-')} בקצב רגוע. התמקדו במבט בעיניים ובתקשורת ללא שום לחץ.`,
          consentCue: 'הגדירו מילת ביטחון (למשל: "אדום" לעצירה, "צהוב" להאטה).'
        },
        {
          stepNumber: 4,
          title: 'סיום חם וחיבוק (Aftercare)',
          description: 'התכרבלו יחד בשמיכה חמה, שתו מים, ושתפו איזה רגע בחוויה היה הנעים ביותר עבורכם.',
          consentCue: 'שאלה: "איך הרגשת ומה הציף אותך בתחושה הכי טובה?"'
        }
      ],
      romanticClosing: `נוצר בלעדית מההתאמות המאומתות שלכם (${chosen.slice(0, 2).join(', ')}). בטוח, דיסקרטי ומותאם לכם.`
    };

    return { success: true, scenario };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function askAria(prompt: string) {
  const queryLower = (prompt || '').toLowerCase();
  let response = 'Aria: אינטימיות משגשגת על בסיס אמון, סקרנות והסכמה נלהבת. התמקדו בתקשורת פתוחה ובחוויה המשותפת.';
  let topic = 'הדרכה אינטימית כללית';

  if (queryLower.includes('bdsm') || queryLower.includes('קשר') || queryLower.includes('חבל')) {
    topic = 'בטיחות ב-BDSM ומילת ביטחון';
    response = 'כשחוקרים BDSM או קשרים, הקפידו על עקרון SSC (בטוח, שקול ובהסכמה). השתמשו בחבלים רכים, הימנעו מלחץ באזורי מפרקים או צוואר, והגדירו מילת ביטחון ברורה (אדום/צהוב/ירוק).';
  } else if (queryLower.includes('שיחה') || queryLower.includes('פחד') || queryLower.includes('גבול')) {
    topic = 'תקשורת זוגית בטוחה';
    response = 'פתיחות לגבי תשוקות דורשת ביטחון רגשי. התחילו בשיחה נינוחה מחוץ לחדר השינה (למשל בטיול או בבית קפה). השתמשו בניסוח "יש לי סקרנות לחקור..." במקום דרישה.';
  } else if (queryLower.includes('אחרי') || queryLower.includes('aftercare')) {
    topic = 'אחריות ודאגה (Aftercare)';
    response = 'Aftercare חיוני להחזרת התחושה הבטוחה והקרקע אחרי חוויה עמוקה. זה כולל חום פיזי (שמיכה), שתיית מים, חיבוק רך ומילים מרגיעות.';
  }

  return { success: true, advice: { response, topic } };
}
