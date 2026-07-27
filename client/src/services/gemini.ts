// Gemini 2.5 API Integration Service for Aria AI, Evening Scenarios & AI Dare Generator

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export interface ScenarioStep {
  stepNumber: number;
  phase: string;
  title: string;
  description: string;
}

export async function askGeminiAria(userQuery: string, lang: 'en' | 'he'): Promise<string> {
  if (!GEMINI_API_KEY) {
    if (lang === 'he') {
      return "אני אריאל — יועצת האינטימיות שלכם. כדי לקבל מענה אינטליגנטי ומותאם אישית בזמן אמת, יש להזין מפתח VITE_GEMINI_API_KEY בקובץ .env. בינתיים: תקשורת פתוחה, הקשבה ללא שיפוטיות ושימוש במילות בטיחות הם המפתח לזוגיות מעצימה!";
    }
    return "I am Aria, your intimacy & communication guide. To enable real-time Gemini AI responses, please add VITE_GEMINI_API_KEY in your .env file. Meanwhile: open communication and clear safewords build deep trust!";
  }

  try {
    const systemPrompt =
      lang === 'he'
        ? "אתה אריאל — יועצת אינטימיות ותקשורת זוגית דיסקרטית, תומכת ולא שיפוטית. ענה בעברית רהוטה, מעצימה ומכבדת לשאלת המשתמש:"
        : "You are Aria — an empathetic, respectful, non-judgmental intimacy & relationship guide. Provide insightful, empowering advice for the user query:";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `${systemPrompt}\n\n${userQuery}` }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) return text.trim();
  } catch (e) {
    console.warn('Gemini API Error:', e);
  }

  return lang === 'he'
    ? "אריאל זמינה עבורכם! זכרו שהסכמה הדדית ומילות בטיחות (אדום/צהוב/ירוק) הן הבסיס לחקירה זוגית מהנה ובטוחה."
    : "Intimacy flourishes with mutual respect. Always use clear safewords and open dialogue!";
}

// Dynamic AI Evening Scenario Generator (Generates a 4-step romantic plan in selected language)
export async function generateAIScenario(
  intensity: string,
  lang: 'en' | 'he'
): Promise<ScenarioStep[]> {
  const fallbackStepsHe: ScenarioStep[] = [
    {
      stepNumber: 1,
      phase: 'אווירה וחימום ראשוני',
      title: 'אור נרות עמום ומוזיקת ג\'אז איטית',
      description: 'עמעום תאורת החדר, הדלקת נרות ארומטיים בריח וניל והשמעת מוזיקה מרגיעה ללא מילים.'
    },
    {
      stepNumber: 2,
      phase: 'העצמת החושים והמגע',
      title: 'עיסוי שמן חם בכיסוי עיניים',
      description: 'הנחת כיסוי עיניים רך על בן/בת הזוג ומתן עיסוי איטי ומפנק לאורכי הגב והכתפיים.'
    },
    {
      stepNumber: 3,
      phase: 'חקר תשוקות ומשחק זוגי',
      title: 'קשירות משי עדינות ומשחקי טמפרטורה',
      description: 'עיגון קל של פרקי הידיים בסרטי סאטן נעימים ושילוב לסירוגין בין נטיפות שעווה חמה לקוביות קרח.'
    },
    {
      stepNumber: 4,
      phase: 'שיא התשוקה ואפטרקייר',
      title: 'אינטימיות עמוקה וחיבוק חם',
      description: 'שחרור הקשירות, שיתוף תחושות, שתיית תה חם וחיבוק צמוד במיטה ללא הפרעות.'
    }
  ];

  const fallbackStepsEn: ScenarioStep[] = [
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

  if (!GEMINI_API_KEY) {
    return lang === 'he' ? fallbackStepsHe : fallbackStepsEn;
  }

  try {
    const prompt =
      lang === 'he'
        ? `צור תרחיש ערב רומנטי ואינטימי ב-4 שלבים לבני זוג ברמת עוצמה ${intensity}.
החזר אך ורק מערך JSON תקין של 4 אובייקטים עם השדות:
"stepNumber" (מספר 1-4), "phase" (שם השלב), "title" (כותרת השלב), "description" (תיאור מפורט ב-2 משפטים).
שפה: עברית רהוטה ורומנטית.`
        : `Generate a 4-step romantic evening progression scenario for a couple at intensity level ${intensity}.
Return JSON array of 4 objects with fields: "stepNumber", "phase", "title", "description".`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      }
    );

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawText) {
      const parsed = JSON.parse(rawText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Gemini Scenario Error:', e);
  }

  return lang === 'he' ? fallbackStepsHe : fallbackStepsEn;
}

// Dynamic AI Dare Generator (Generates a unique new dare on every click)
export async function generateAIDare(
  intensity: string,
  lang: 'en' | 'he'
): Promise<{ title: string; description: string }> {
  // Diverse seed themes to ensure a UNIQUE new dare on every click
  const themesHe = [
    'משחקי מגע וחושים בכיסוי עיניים',
    'לחישת פנטזיות כמוסות באוזן',
    'עיסוי שמן חם בנרות',
    'אתגר 5 דקות ללא מגע',
    'פתק אינטימי סודי',
    'משחקי תפקידים בבר מלון',
    'משחקי טמפרטורה עם שעווה וקרח',
    'קשירות משי רכות במיטה'
  ];

  const randomTheme = themesHe[Math.floor(Math.random() * themesHe.length)];

  if (!GEMINI_API_KEY) {
    const fallbackDaresHe = [
      {
        title: 'עיסוי חושני בלחישות',
        description: 'הקדישו 10 דקות לעיסוי כתפיים וגב עם שמנים חמים תוך לחישת פנטזיות באוזן.'
      },
      {
        title: 'מגע ללא דיבור 5 דקות',
        description: 'שמרו על קשר עין רציף ומגע עדין בלבד ללא מילים במשך 5 דקות שלמות.'
      },
      {
        title: 'פתק רומנטי בכיס',
        description: 'כתבו פתק תשוקה סודי והחביאו אותו בתיק או בכיס של בן/בת הזוג.'
      },
      {
        title: 'משחק כיסוי עיניים ונוצה',
        description: 'כסו את עיני בן/בת הזוג וגעו בעדינות באזורים רגישים עם נוצה או משי.'
      }
    ];

    const pick = fallbackDaresHe[Math.floor(Math.random() * fallbackDaresHe.length)];
    if (lang === 'he') return pick;
    return {
      title: 'Whispered Sensory Massage',
      description: 'Spend 10 minutes giving a gentle shoulder massage while whispering romantic desires.'
    };
  }

  try {
    const prompt =
      lang === 'he'
        ? `צור אתגר זוגי אינטימי וחדש בנושא: "${randomTheme}" ברמת עוצמה ${intensity}.
החזר אך ורק פורמט JSON תקין עם השדות:
"title" (כותרת קצרה ומפתה) ו-"description" (הוראות ביצוע ב-2 משפטים).`
        : `Generate a unique romantic dare for a couple regarding "${randomTheme}" at intensity ${intensity}. Return JSON with "title" and "description" fields ONLY.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      }
    );

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawText) {
      const parsed = JSON.parse(rawText);
      if (parsed.title && parsed.description) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Gemini Dare Gen Error:', e);
  }

  return {
    title: lang === 'he' ? 'משחק לחישות וחושים' : 'Sensory Tease',
    description: lang === 'he' ? 'לחישת פנטזיה סודית תוך שמירה על קשר עין ללא מגע במשך 3 דקות.' : 'Whispering a secret fantasy while maintaining eye contact.'
  };
}
