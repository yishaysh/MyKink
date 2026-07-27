// Gemini 2.5 API Integration Service for Aria AI, Evening Scenarios & AI Dare Generator

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export interface ScenarioStep {
  stepNumber: number;
  phase: string;
  title: string;
  description: string;
}

// Smart Offline Knowledge Base for Aria AI when API key is not yet set
const ariaOfflineAnswersHe: Record<string, string> = {
  'default': "אינטימיות מעצימה מתחילה בתקשורת פתוחה, הקשבה ללא שיפוטיות ושימוש במילות בטיחות (אדום/צהוב/ירוק). ספרו לי מה הייתם רוצים לחקור יחד!",
  'fantasy': "כדי להעלות פנטזיה חדשה ללא מבוכה, מומלץ לשוחח בזמן רגוע מחוץ לחדר השינה. אפשר לומר: 'ראיתי משהו מעניין ב-MyKink שחשבתי שיהיה כיף לנסות יחד'. זה מוריד לחץ ובונה ציפייה!",
  'boundary': "מילות בטיחות הן הבסיס לכל משחק אינטימי. שיטת הרמזור עובדת מעולה: 'ירוק' = ממשיכים, 'צהוב' = האטה/התאמה, 'אדום' = עוצרים מיד. כבוד הדדי בונה אמון מוחלט.",
  'bdsm': "משחקי שליטה וקשירות דורשים הסכמה מפורשת מראש (SSC - Safe, Sane, Consensual). התחילו בקשירות משי רכות ומילות בטיחות ברורות, והקפידו על אפטרקייר (חיבוק ושיחה) בסיום.",
  'massage': "עיסוי חושני הוא דרך נפלאה להורדת מתחים. השתמשו בשמנים חמים, עמעמו תאורה והתחילו בכתפיים ובגב. מגע איטי בלחישות בונה מתח חיובי נהדר!"
};

export async function askGeminiAria(userQuery: string, lang: 'en' | 'he'): Promise<string> {
  if (!GEMINI_API_KEY) {
    const q = userQuery.toLowerCase();
    if (lang === 'he') {
      if (q.includes('פנטז') || q.includes('לספר') || q.includes('לשתף') || q.includes('רעיון')) return ariaOfflineAnswersHe['fantasy'];
      if (q.includes('גבול') || q.includes('בטיחות') || q.includes('עצור') || q.includes('מילה')) return ariaOfflineAnswersHe['boundary'];
      if (q.includes('קשיר') || q.includes('שליטה') || q.includes('bdsm') || q.includes('סאדו')) return ariaOfflineAnswersHe['bdsm'];
      if (q.includes('עיסוי') || q.includes('שמן') || q.includes('מגע')) return ariaOfflineAnswersHe['massage'];
      return ariaOfflineAnswersHe['default'];
    }
    return "Intimacy flourishes with mutual respect. Always use clear safewords and open dialogue!";
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
      description: 'לגימת כוס ין לאור עמום ולחישת פנטזיות כמוסות באוזן במרחק נגיעה.'
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

  if (!GEMINI_API_KEY) {
    return lang === 'he' ? fallbackScenarioSetsHe[scenarioIndex] : fallbackScenarioSetsHe[scenarioIndex];
  }

  try {
    const randomThemes = ['משחקי חושים וכיסוי עיניים', 'משחקי מגע ושמנים ארומטיים', 'משחקי תפקידים ופנטזיות סודיות', 'קשירות משי וטמפרטורה'];
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
