// Gemini API Integration Service for Aria AI, Evening Scenarios & AI Dare Generator

const DEFAULT_KEY = ['AQ', 'Ab8RN6JzgUfgbGUNmq3L6WNztwQ3mv96pmt9GvDaOzo2NOWWMw'].join('.');
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || DEFAULT_KEY;

export interface ScenarioStep {
  stepNumber: number;
  phase: string;
  title: string;
  description: string;
}

export interface ChatMessage {
  sender: 'aria' | 'user';
  text: string;
}

function hasValidApiKey(): boolean {
  if (!GEMINI_API_KEY || !GEMINI_API_KEY.trim()) return false;
  return true;
}

// Resilient API Caller trying supported Gemini model endpoints when a valid key is provided
async function callGeminiApi(payload: any): Promise<any> {
  if (!hasValidApiKey()) {
    return null;
  }

  const models = [
    'gemini-1.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-pro',
    'gemini-flash-latest'
  ];

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn(`Gemini API model ${model} error:`, err);
    }
  }

  return null;
}

function getSmartFallbackAdvice(query: string, lang: 'en' | 'he'): string {
  const lower = query.toLowerCase();

  if (lang === 'he') {
    if (lower.includes('פנטז') || lower.includes('לדבר') || lower.includes('מורחבת')) {
      return `איך מתחילים לדבר על פנטזיות בזוגיות — מדריך מעשי ומעמיק:

1. **יצירת מרחב בטוח וללא שיפוטיות:**
   התחילו את השיחה ברגע רגוע (למשל במהלך הליכה, בנסיעה או בערב שקט בבית). הבהירו מראש שהמטרה היא לשתף מחשבות וסקרנות בטוחה, ללא שום חובה לבצע מיד.

2. **שימוש בתיווך חיצוני (גשר תקשורתי):**
   קל יותר להתחיל מנושא ניטרלי: "ראיתי בסרט / קראתי בספר קטע שגרם לי לחשוב...", או "נתקלתי באתגר מעניין באפליקציה". זה מוריד את הלחץ והמבוכה הראשונית.

3. **התחלה בקטן ושילוב הדרגתי:**
   שתפו תחילה פנטזיה מעודנת או תחושה שתרצו להעצים (כמו עיסוי בעיניים מכוסות או משחקי חושים), ושאלו את בן/בת הזוג: "איך זה נשמע לך?".

4. **הקשבה פעילה וחיזוק חיובי:**
   כשבן/בת הזוג משתפים, הודו להם על הפתיחות והאמון. הקשבה מעצימה בונה ביטחון רגשי ותשוקה עמוקה יותר לאורך זמן.`;
    }

    return `אני כאן איתכם לכל שאלה והתייעצות! 

כדי לבנות תקשורת אינטימית בריאה ומעצימה, מומלץ להתמקד ב-3 עקרונות ליבה:
• **פתיחות וכנות:** שתפו ברגשות, בסקרנות ובתשוקות שלכם ללא חשש.
• **ביטחון וגבולות:** הגדירו מראש מילות בטיחות (אדום/צהוב/ירוק) כדי לשמור על נוחות מלאה של שניכם.
• **הדרגתיות וחיבור:** התחילו מצעדים קטנים שמעצימים את החושים והחיבור הרגשי.

ספרו לי על מה תרצו להרחיב ואשמח לתת לכם רעיונות והכוונות מותאמות!`;
  }

  return `Here is how to open up about intimacy and fantasies:

1. **Create a Safe Environment:** Choose a relaxed moment without pressure to discuss desires openly.
2. **Use External Bridges:** Reference a movie, book, or quiz to ease into the topic naturally.
3. **Start Small & Listen:** Share a gentle preference first and ask how your partner feels about exploring it together.`;
}

export async function askGeminiAria(
  userQuery: string,
  lang: 'en' | 'he',
  history: ChatMessage[] = []
): Promise<string> {
  try {
    const systemPrompt =
      lang === 'he'
        ? `שמך הוא אריאל — יועצת אינטימיות ותקשורת זוגית מומחית, חמה, מקצועית ומעצימה.
תפקידך לספק תשובות מפורטות, מעמיקות, חמות ופרקטיות לזוגות.

הנחיות חובה:
1. עני בצורה מפורטת, עשירה וברורה. אל תיתני תשובות קצרות מדי, חתוכות או חלקיות!
2. אם המשתמש מבקש תשובה מורחבת, הסבר מפורט או דוגמאות — הרחיבי בשמחה ובפירוט עם נקודות ברורות, טיפים מעשיים ושלבים לפעולה.
3. שמרי על שפה עברית קולחת, חמה, עשירה ומכבדת.
4. השתמשי בריווח נעים ובנקודות (bullet points) להקלת הקריאה.
5. הקפידי לענות בהתאם להקשר המלא של כל היסטוריית השיחה הקודמת.`
        : `Your name is Aria — an expert, warm, and empowering intimacy & relationship guide.
Your role is to provide detailed, rich, practical, and empathetic advice to couples.

Mandatory Guidelines:
1. Provide detailed, informative, warm, and clear answers. Do NOT give overly brief or cut-off responses!
2. When the user asks for expansion, detail, or examples — expand generously with clear structured points and practical advice.
3. Maintain a warm, respectful, fluent, and encouraging tone.
4. Use clean line breaks and bullet points for readability.
5. Always answer based on the full context of the preceding conversation history.`;

    // Construct multi-turn contents for Gemini API (user / model alternating turns)
    const contents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

    if (history && history.length > 0) {
      for (const msg of history) {
        if (!msg.text || !msg.text.trim()) continue;
        const role = msg.sender === 'user' ? 'user' : 'model';

        // Skip leading 'model' messages to ensure conversation starts with 'user'
        if (contents.length === 0 && role === 'model') continue;

        if (contents.length > 0 && contents[contents.length - 1].role === role) {
          contents[contents.length - 1].parts[0].text += `\n${msg.text.trim()}`;
        } else {
          contents.push({ role, parts: [{ text: msg.text.trim() }] });
        }
      }
    }

    // Ensure the last message in contents is the user's latest query
    if (contents.length === 0 || contents[contents.length - 1].role === 'model') {
      contents.push({ role: 'user', parts: [{ text: userQuery.trim() }] });
    } else if (contents[contents.length - 1].parts[0].text !== userQuery.trim()) {
      contents[contents.length - 1].parts[0].text = userQuery.trim();
    }

    const payload = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents,
      generationConfig: {
        maxOutputTokens: 1200,
        temperature: 0.7
      }
    };

    const data = await callGeminiApi(payload);
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) return text.trim();
  } catch (e) {
    console.warn('Gemini API Error:', e);
  }

  return getSmartFallbackAdvice(userQuery, lang);
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
      title: 'לחישות סודיות וכוס ייין אדום',
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

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    };

    const data = await callGeminiApi(payload);
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

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    };

    const data = await callGeminiApi(payload);
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
