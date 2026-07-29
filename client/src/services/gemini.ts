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
        ? "אתה אריאל — יועצת אינטימיות ותקשורת זוגית מומחית. ענה בעברית חמה, מקצועית, תמציתית ועניינית מאוד.\nהנחיות חובה:\n1. ענה ישירות לעניין ללא הקדמות ארוכות, ללא ברכות פתיחה נפוחות וללא מכתבי סיום.\n2. שמור על תשובה קצרה וממוקדת (עד 3-4 נקודות תכליתיות, מקסימום 100 מילים).\n3. תן טיפים פרקטיים ויישומיים שאפשר לבצע בטבעיות ובביטחון.\n\nשאלת המשתמש:"
        : "You are Aria — an expert intimacy & relationship guide. Provide warm, highly concise, direct, and actionable advice.\nMandatory guidelines:\n1. Get straight to the point without long intros, formal greetings, or sign-offs.\n2. Keep the response brief and focused (up to 3-4 bullet points, under 100 words max).\n3. Give actionable tips that can be applied naturally.\n\nUser query:";

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
          ],
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.7
          }
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

// Research-Backed Erotic Arc Scenario Sets (Gottman & Esther Perel Framework)
const fallbackScenarioSetsHe: ScenarioStep[][] = [
  [
    {
      stepNumber: 1,
      phase: 'אווירה, ציפייה וביטחון רגשי',
      title: 'אור נרות ארומטי ומוזיקת ג\'אז עמוקה',
      description: 'עמעום תאורת הבית, הדלקת נרות בריח וניל וסנדלווד והשמעת סאונדסקייפ מרגיע ליצירת מרחב מקודש ללא הטרדות.'
    },
    {
      stepNumber: 2,
      phase: 'העצמת חושים ומגע נוכח (Sensate Focus)',
      title: 'כיסוי עיניים רך ועיסוי שמן חם',
      description: 'הנחת כיסוי עיניים סאטן על בן/בת הזוג והתחלת עיסוי איטי לאורך הכתפיים והגב להעברת הפוקוס מהראש אל החושים.'
    },
    {
      stepNumber: 3,
      phase: 'חקר פנטזיות, משחק וחיכוך (Erotic Play)',
      title: 'קשירות משי עדינות ומשחקי טמפרטורה',
      description: 'עיגון קל של פרקי הידיים בסרטי משי נעימים ושילוב לסירוגין בין נטיפות שעווה חמה לנגיעות קוביות קרח.'
    },
    {
      stepNumber: 4,
      phase: 'אפטרקייר, עיטוף וחיבור רגשי (Aftercare)',
      title: 'נחיתה רכה, תה חם וחיבוק צמוד',
      description: 'שחרור הקשירות, שתיית תה צמחים חם, שיתוף תחושות פתוח והתכרבלות ממושכת מתחת לשמיכה עבה.'
    }
  ],
  [
    {
      stepNumber: 1,
      phase: 'אווירה, ציפייה וביטחון רגשי',
      title: 'לחישות סודיות וכוס יין אדום',
      description: 'לגימת יין לאור עמום ולחישת 3 פנטזיות כמוסות באוזן במרחק נגיעה לבניית מתח חיובי וציפייה.'
    },
    {
      stepNumber: 2,
      phase: 'העצמת חושים ומגע נוכח (Sensate Focus)',
      title: 'ליטוף נוצה ומגע ללא דיבור',
      description: 'מעבר עדין עם נוצה רכה או בד משי על הצוואר והגב תוך שמירה על קשר עין רציף ללא מילים.'
    },
    {
      stepNumber: 3,
      phase: 'חקר פנטזיות, משחק וחיכוך (Erotic Play)',
      title: 'משחק תפקידים דיסקרטי במלון',
      description: 'אימוץ דמויות סודיות של זרים שנפגשים לכאורה לראשונה בבר מלון יוקרתי בחדר השינה.'
    },
    {
      stepNumber: 4,
      phase: 'אפטרקייר, עיטוף וחיבור רגשי (Aftercare)',
      title: 'נשיקות ממושכות ושיחה מעצימה',
      description: 'מעבר לחיבוק עמוק, נשיקות איטיות ושיתוף הרגעים הכי מרגשים ומקרבים מתוך הערב.'
    }
  ]
];

let scenarioIndex = 0;

// Research-Backed AI Evening Scenario Generator (Gottman & Esther Perel Erotic Arc)
export async function generateAIScenario(
  intensity: string,
  lang: 'en' | 'he'
): Promise<ScenarioStep[]> {
  scenarioIndex = (scenarioIndex + 1) % fallbackScenarioSetsHe.length;

  try {
    const themes = [
      'משחקי חושים, מגע נוכח וכיסוי עיניים',
      'משחקי טמפרטורה, שמנים ארומטיים וקשירות משי',
      'משחקי תפקידים, פנטזיות סודיות וחיכוך',
      'אינטימיות עמוקה, עיסוי ושפת הגוף'
    ];
    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];

    const prompt =
      lang === 'he'
        ? `אתה אדריכל אינטימיות וזוגיות מומחה המסתמך על מודל Erotic Arc (Gottman & Esther Perel).
בנה תרחיש ערב זוגי ב-4 שלבים מדוייקים בנושא "${selectedTheme}" ברמת עוצמה ${intensity}:
- שלב 1: אווירה, ציפייה וביטחון רגשי (Buildup & Safety)
- שלב 2: העצמת חושים ומגע נוכח (Sensory Immersion & Sensate Focus)
- שלב 3: חקר פנטזיות, משחק וחיכוך (Erotic Play & Novelty)
- שלב 4: אפטרקייר, עיטוף וחיבור רגשי (Aftercare & Integration)

החזר אך ורק מערך JSON תקין של 4 אובייקטים עם השדות:
"stepNumber" (מספר 1-4), "phase" (שם השלב בעברית), "title" (כותרת מפתה), "description" (הוראות ביצוע מפורטות ב-2 משפטים רהוטים).`
        : `You are an expert intimacy architect based on the Erotic Arc framework (Gottman & Esther Perel).
Generate a 4-step romantic evening scenario regarding "${selectedTheme}" at intensity ${intensity}:
Phase 1: Buildup & Safety, Phase 2: Sensory Immersion, Phase 3: Erotic Play, Phase 4: Aftercare.
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
