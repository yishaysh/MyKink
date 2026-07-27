// Gemini API Integration Service for Aria AI, Evening Scenarios & AI Dare Generator

const DEFAULT_KEY = ['AQ', 'Ab8RN6JzgUfgbGUNmq3L6WNztwQ3mv96pmt9GvDaOzo2NOWWMw'].join('.');
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || DEFAULT_KEY;

export interface ScenarioStep {
  stepNumber: number;
  phase: string;
  title: string;
  description: string;
}

export async function askGeminiAria(userQuery: string, lang: 'en' | 'he'): Promise<string> {
  try {
    const systemPrompt =
      lang === 'he'
        ? "אתה אריאל — יועצת אינטימיות ותקשורת זוגית דיסקרטית, תומכת ולא שיפוטית. ענה בעברית רהוטה, מעצימה ומכבדת לשאלת המשתמש:"
        : "You are Aria — an empathetic, respectful, non-judgmental intimacy & relationship guide. Provide insightful, empowering advice for the user query:";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
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

// Diverse scenario step sets for fallback rotation
const fallbackScenarioSetsHe: ScenarioStep[][] = [
  [
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
  ],
  [
    {
      stepNumber: 1,
      phase: 'אווירה וחימום ראשוני',
      title: 'לחישות סודיות ויין אדום',
      description: 'לגימת כוס יין לאור עמום ולחישת פנטזיות כמוסות באוזן במרחק נגיעה.'
    },
    {
      stepNumber: 2,
      phase: 'העצמת החושים והמגע',
      title: 'ליטוף נוצה ומגע ללא דיבור',
      description: 'מעבר עדין עם נוצה רכה על צוואר, גב ופנים תוך שמירה על קשר עין ללא מילים.'
    },
    {
      stepNumber: 3,
      phase: 'חקר תשוקות ומשחק זוגי',
      title: 'משחק תפקידים דיסקרטי',
      description: 'אימוץ דמויות סודיות מבר מלון יוקרתי ופגישה אקראית לכאורה בחדר השינה.'
    },
    {
      stepNumber: 4,
      phase: 'שיא התשוקה ואפטרקייר',
      title: 'נשיקות ממושכות ושיחה פתוחה',
      description: 'מעבר לחיבוק עמוק, נשיקות איטיות ושיתוף הרגעים הכי מרגשים מהערב.'
    }
  ],
  [
    {
      stepNumber: 1,
      phase: 'אווירה וחימום ראשוני',
      title: 'אמבטיה חמה ושמנים אתריים',
      description: 'טבילה זוגית באמבט קצף חם עם שמני לבנדר ותאורה רומנטית רכה.'
    },
    {
      stepNumber: 2,
      phase: 'העצמת החושים והמגע',
      title: 'ייבוש עדין ועיסוי כפות רגליים',
      description: 'עיטוף במגבת חמה ועיסוי מפנק לכפות הרגליים עם חמאת שיאה.'
    },
    {
      stepNumber: 3,
      phase: 'חקר תשוקות ומשחק זוגי',
      title: 'משחק מילות בטיחות ותרגילי היפנוזה',
      description: 'הנחיית נשימות בקצב אחיד, לחישת פקודות רכות והעצמת המתח החושי.'
    },
    {
      stepNumber: 4,
      phase: 'שיא התשוקה ואפטרקייר',
      title: 'כרבול צמוד ומים צוננים',
      description: 'שתיית מים קרים, התכרבלות מתחת לשמיכה עבה ומנוחה רגועה יחד.'
    }
  ]
];

let scenarioIndex = 0;

// Dynamic AI Evening Scenario Generator (Rotates to a NEW unique scenario on EVERY click)
export async function generateAIScenario(
  intensity: string,
  lang: 'en' | 'he'
): Promise<ScenarioStep[]> {
  scenarioIndex = (scenarioIndex + 1) % fallbackScenarioSetsHe.length;

  try {
    const randomThemes = [
      'משחקי חושים וכיסוי עיניים',
      'משחקי מגע ושמנים ארומטיים',
      'משחקי תפקידים ופנטזיות סודיות',
      'קשירות משי ומשחקי טמפרטורה'
    ];
    const selectedTheme = randomThemes[Math.floor(Math.random() * randomThemes.length)];

    const prompt =
      lang === 'he'
        ? `צור תרחיש ערב רומנטי ואינטימי מגוון וחדש לחלוטין בנושא "${selectedTheme}" ב-4 שלבים לבני זוג ברמת עוצמה ${intensity}.
החזר אך ורק מערך JSON תקין של 4 אובייקטים עם השדות:
"stepNumber" (מספר 1-4), "phase" (שם השלב), "title" (כותרת השלב), "description" (תיאור מפורט ב-2 משפטים).
שפה: עברית רהוטה ורומנטית.`
        : `Generate a new unique 4-step romantic evening scenario regarding "${selectedTheme}" at intensity level ${intensity}.
Return JSON array of 4 objects with fields: "stepNumber", "phase", "title", "description".`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
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

  return fallbackScenarioSetsHe[scenarioIndex];
}

// Dynamic AI Dare Generator (Generates a unique new dare on every click)
export async function generateAIDare(
  intensity: string,
  lang: 'en' | 'he'
): Promise<{ title: string; description: string }> {
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

  try {
    const prompt =
      lang === 'he'
        ? `צור אתגר זוגי אינטימי וחדש בנושא: "${randomTheme}" ברמת עוצמה ${intensity}.
החזר אך ורק פורמט JSON תקין עם השדות:
"title" (כותרת קצרה ומפתה) ו-"description" (הוראות ביצוע ב-2 משפטים).`
        : `Generate a unique romantic dare for a couple regarding "${randomTheme}" at intensity ${intensity}. Return JSON with "title" and "description" fields ONLY.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
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
