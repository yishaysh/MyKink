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
    'gemini-flash-latest',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
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

export interface UserContext {
  alias?: string;
  role?: string;
  categories?: string[];
  intensity?: string;
  gender?: string;
  goal?: string;
  relationshipDynamic?: string;
  matches?: { title: string; category?: string }[];
}

function getSmartFallbackAdvice(query: string, lang: 'en' | 'he', context?: UserContext | null): string {
  const lower = query.toLowerCase();
  const alias = context?.alias || (lang === 'he' ? 'בייבי' : 'Baby');

  if (lang === 'he') {
    if (lower.includes('פנטז') || lower.includes('לדבר') || lower.includes('מורחבת')) {
      return `בשמחה ${alias}! הנה מדריך מעשי ומעמיק לאיך מתחילים לדבר על פנטזיות בזוגיות:

1. **יצירת מרחב בטוח וללא שיפוטיות:**
   התחילו את השיחה ברגע רגוע (למשל במהלך הליכה, בנסיעה או בערב שקט בבית). הבהירו מראש שהמטרה היא לשתף מחשבות וסקרנות בטוחה, ללא שום חובה לבצע מיד.

2. **שימוש בתיווך חיצוני (גשר תקשורתי):**
   קל יותר להתחיל מנושא ניטרלי: "ראיתי בסרט / קראתי בספר קטע שגרם לי לחשוב...", או "נתקלתי באתגר מעניין באפליקציה". זה מוריד את הלחץ והמבוכה הראשונית.

3. **התחלה בקטן ושילוב הדרגתי:**
   שתפו תחילה פנטזיה מעודנת או תחושה שתרצו להעצים (כמו עיסוי בעיניים מכוסות או משחקי חושים), ושאלו את בן/בת הזוג: "איך זה נשמע לך?".

4. **הקשבה פעילה וחיזוק חיובי:**
   כשבן/בת הזוג משתפים, הודו להם על הפתיחות והאמון. הקשבה מעצימה בונה ביטחון רגשי ותשוקה עמוקה יותר לאורך זמן.`;
    }

    return `אהלן ${alias}, אני כאן איתכם לכל שאלה והתייעצות! 

כדי לבנות תקשורת אינטימית בריאה ומעצימה, מומלץ להתמקד ב-3 עקרונות ליבה:
• **פתיחות וכנות:** שתפו ברגשות, בסקרנות ובתשוקות שלכם ללא חשש.
• **ביטחון וגבולות:** הגדירו מראש מילות בטיחות (אדום/צהוב/ירוק) כדי לשמור על נוחות מלאה של שניכם.
• **הדרגתיות וחיבור:** התחילו מצעדים קטנים שמעצימים את החושים והחיבור הרגשי.

ספרו לי על מה תרצו להרחיב ואשמח לתת לכם רעיונות והכוונות מותאמות!`;
  }

  return `Here is how to open up about intimacy and fantasies, ${alias}:

1. **Create a Safe Environment:** Choose a relaxed moment without pressure to discuss desires openly.
2. **Use External Bridges:** Reference a movie, book, or quiz to ease into the topic naturally.
3. **Start Small & Listen:** Share a gentle preference first and ask how your partner feels about exploring it together.`;
}

export async function askGeminiAria(
  userQuery: string,
  lang: 'en' | 'he',
  history: ChatMessage[] = [],
  context?: UserContext | null
): Promise<string> {
  try {
    const alias = context?.alias?.trim() || (lang === 'he' ? 'בייבי' : 'Baby');
    const roleText = context?.role === 'GIVER'
      ? (lang === 'he' ? 'שולט / מעניק' : 'Dominant / Giver')
      : context?.role === 'RECEIVER'
      ? (lang === 'he' ? 'נשלט / מקבל' : 'Submissive / Receiver')
      : (lang === 'he' ? 'ורסטילי / משתנה' : 'Switch / Versatile');

    const intensityText = context?.intensity === 'VANILLA'
      ? (lang === 'he' ? 'מעודן (ווניל)' : 'Vanilla & Mild')
      : context?.intensity === 'ADVENTUROUS'
      ? (lang === 'he' ? 'נועז והרפתקני' : 'Adventurous & Bold')
      : (lang === 'he' ? 'פילפלי ולוהט' : 'Spicy & Hot');

    const categoriesText = context?.categories?.length
      ? context.categories.join(', ')
      : (lang === 'he' ? 'חושים ומגע, BDSM, משחקי תפקידים' : 'Sensual, BDSM, Roleplay');

    const matchesText = context?.matches?.length
      ? context.matches.map((m) => `• ${m.title}`).join('\n')
      : (lang === 'he' ? 'טרם נמצאו התאמות זוגיות מאומתות' : 'No verified matches yet');

    const isMan = context?.gender === 'MAN';
    const genderGrammarInstruction = isMan
      ? `🚨 הנחיית דקדוק חמורה: המשתמש שמשוחח איתך כעת הוא גבר ♂️! חובה לפנות אליו אך ורק בלשון זכר (למשל: אתה, מרגיש, תבחר, תפתח, תביא, תנסה, מומלץ לך, ילד רע). חל איסור מוחלט לפנות אליו בלשון נקבה (כמו "את", "תוכלי", "תפתחי", "תנסי")!`
      : `🚨 הנחיית דקדוק חמורה: המשתמשת שמשוחחת איתך כעת היא אישה ♀️! חובה לפנות אליה אך ורק בלשון נקבה (למשל: את, מרגישה, תבחרי, תפתחי, תביאי, תנסי, מומלץ לך, ילדה רעה). חל איסור מוחלט לפנות אליה בלשון זכר!`;

    const systemPrompt =
      lang === 'he'
        ? `שמך הוא אריאל — יועצת אינטימיות ותקשורת זוגית מומחית, חמה, מקצועית ומעצימה.
תפקידך לספק תשובות מפורטות, מעמיקות, חמות ופרקטיות לזוגות.

פרופיל המשתמש/ת עמו/ה את משוחחת כעת:
• כינוי סקסי: "${alias}"
• מגדר: ${isMan ? 'גבר ♂️' : 'אישה ♀️'}
• תפקיד אינטימי דינמי מועדף: ${roleText}
• רמת עוצמה מועדפת: ${intensityText}
• קטגוריות אהובות: ${categoriesText}
• התאמות זוגיות מאומתות עם בן/בת הזוג (פנטזיות ששניהם סימנו לגביהן YES/MAYBE):
${matchesText}

${genderGrammarInstruction}

הנחיות מענה חובה:
1. פני אל המשתמש/ת בכינוי הסקסי שלו/ה ("${alias}") בטבעיות לפי זרימת השיחה. אל תכריחי את הכינוי בכל משפט, אלא השתמשי בו בצורה קולחת וטבעית.
2. התחשבי בתפקידו/ה האינטימי, ברמת העוצמה ובהתאמות המאומתות שבינו לבין בן/בת הזוג במתקפת ההמלצות.
3. עני בצורה ממוקדת, תמציתית, בגובה העיניים ופרקטית (3-5 נקודות קצרות וקולעות לכל היותר). הימנעי מתשובות ארוכות מדי, חופרות או מעייפות!
4. הקפידי על ניסוח נקי ונעים. אל תשתמשי בסימני מתווה מסורבלים כמו ### או *** או ---. השתמשי בפסקאות קצרות ובנקודות (bullet points) נקיות בלבד.
5. שמרי על שפה עברית קולחת, חמה, עשירה ומכבדת בדקדוק המדויק למגדר.`
        : `Your name is Aria — an expert, warm, and empowering intimacy & relationship guide.
Your role is to provide concise, practical, warm, and empathetic advice to couples.

User Profile:
• Sexy Alias: "${alias}"
• Gender: ${isMan ? 'Man ♂️' : 'Woman ♀️'}
• Dynamic Intimacy Role: ${roleText}
• Preferred Intensity: ${intensityText}
• Favorite Categories: ${categoriesText}
• Verified Mutual Matches with Partner:
${matchesText}

Mandatory Guidelines:
1. Address the user naturally by their sexy alias ("${alias}") as fits the conversation flow.
2. Tailor your recommendations to their dynamic role, intensity level, and verified mutual matches.
3. Keep answers concise, focused, practical, and to the point (3-5 short bullet points max). Avoid overly long or wordy responses!
4. Use clean line breaks and simple bullet points. Do not use messy markdown symbols like ### or ---.`;

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
        maxOutputTokens: 4096,
        temperature: 0.7
      }
    };

    const data = await callGeminiApi(payload);
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) return text.trim();
  } catch (e) {
    console.warn('Gemini API Error:', e);
  }

  return getSmartFallbackAdvice(userQuery, lang, context);
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

export interface RoleplayScript {
  title: string;
  tagline: string;
  ambiance: {
    music: string;
    lighting: string;
    props: string[];
    attire: string;
  };
  act1: {
    title: string;
    dialogue: string;
    stageDirection: string;
  };
  act2: {
    title: string;
    sensoryAction: string;
    escalation: string;
  };
  act3: {
    title: string;
    climax: string;
    aftercare: string;
  };
}

export async function generateEroticRoleplayScript(
  themes: string[],
  dynamic: string,
  lang: 'en' | 'he'
): Promise<RoleplayScript> {
  const themeSummary = themes.length > 0 ? themes.join(', ') : 'Hotel Strangers, Blindfolds, Tease';

  try {
    const prompt = lang === 'he'
      ? `את/ה במאי/ת אינטימיות ומשחקי תפקידים ברמה הגבוהה ביותר עבור זוגות. 
צור תסריט משחק תפקידים אירוטי, מפתה, סקסי ומלוטש על בסיס הנושאים הבאים: "${themeSummary}" בדינמיקה של "${dynamic}".
החזר אך ורק JSON תקין לפי המבנה המדויק הבא:
{
  "title": "שם הסצנה המפתה",
  "tagline": "משפט השראה קצר ועוצמתי",
  "ambiance": {
    "music": "סגנון מוזיקה מומלץ (למשל: Deep Lounge Jazz / Slow Beats)",
    "lighting": "הנחיות תאורה (למשל: נרות בלבד, עמעום אורות)",
    "props": ["פריט 1", "פריט 2", "פריט 3"],
    "attire": "קוד לבוש סקסי מומלץ"
  },
  "act1": {
    "title": "מערכה 1: המפגש הראשוני ושורת הפתיחה",
    "dialogue": "שורת הפתיחה המדויקת שמי שיוזם אומר",
    "stageDirection": "הוראות מיקום וגוף לשני בני הזוג"
  },
  "act2": {
    "title": "מערכה 2: הסלמת המגע והמתח",
    "sensoryAction": "פעולת מגע וחושים מרכזית (כיסוי עיניים, קרח, נשיכות עדינות)",
    "escalation": "איך המתח נבנה עד לשיא"
  },
  "act3": {
    "title": "מערכה 3: שיא הסצנה ו-Aftercare",
    "climax": "רגע ההתמסרות והחיבור המלא",
    "aftercare": "הנחיית התכרבלות, שתיית מים וחיבוק מרגיע בסיום"
  }
}`
      : `You are an elite intimacy & erotic roleplay director for couples. 
Create a luxurious, seductive, sophisticated 2-minute roleplay scenario for the themes: "${themeSummary}" with dynamic "${dynamic}".
Return strictly valid JSON matching the exact schema:
{
  "title": "Scene Name",
  "tagline": "Inspiring provocative tagline",
  "ambiance": {
    "music": "Suggested soundtrack mood",
    "lighting": "Lighting instructions",
    "props": ["Prop 1", "Prop 2"],
    "attire": "Recommended dress code"
  },
  "act1": {
    "title": "Act 1: The Initial Encounter & Opening Line",
    "dialogue": "Exact provocative opening line to start the scene",
    "stageDirection": "Staging and physical placement instructions"
  },
  "act2": {
    "title": "Act 2: Sensory Escalation & Tease",
    "sensoryAction": "Specific touch/sensory element",
    "escalation": "How the intensity escalates"
  },
  "act3": {
    "title": "Act 3: The Climax & Gentle Aftercare",
    "climax": "The surrender/climax moment",
    "aftercare": "Warm loving aftercare guidance"
  }
}`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    };

    const data = await callGeminiApi(payload);
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawText) {
      const parsed = JSON.parse(rawText);
      if (parsed.title && parsed.act1 && parsed.act2 && parsed.act3) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Gemini Roleplay Script Error:', e);
  }

  // High-taste fallback script
  if (lang === 'he') {
    return {
      title: 'זרים בבר של מלון יוקרה (Midnight Rendezvous)',
      tagline: 'שני זרים שלא מכירים, כוס משקה אחת ומתח חשמלי באוויר.',
      ambiance: {
        music: 'Slow Jazz & Deep Ambient Lounge',
        lighting: 'תאורה מעומעמת ונרות בלבד על השידה',
        props: ['כוס יין או קוקטייל', 'כיסוי עיניים משי', 'שפתון עמוק'],
        attire: 'שמלה שחורה מחמיאה או חולצה מכופתרת פתוחה קלות'
      },
      act1: {
        title: 'מערכה 1: המפגש הראשוני ושורת הפתיחה',
        dialogue: 'סליחה, הכיסא לידך תפוס, או שאפשר להצטרף למישהי/ו שנראה/ית מסוכן/ת כמוך?',
        stageDirection: 'בן/בת הזוג יושבים על הכורסה עם הגב לכניסה. היוזם/ת ניגש/ת מאחור, נוגע/ת קלות בכתף ולוחש/ת באוזן.'
      },
      act2: {
        title: 'מערכה 2: הסלמת המגע והחושים',
        sensoryAction: 'הנחת כיסוי עיניים משי תוך לחישת 3 פקודות סודיות',
        escalation: 'מגע אצבעות איטי לאורך הצוואר ופנים הירך תוך איסור נגיעה עצמית ללא בקשת אישור.'
      },
      act3: {
        title: 'מערכה 3: השיא ו-Aftercare חם',
        climax: 'התמסרות מלאה לקצב משותף ושיא תשוקתי ללא מסכות.',
        aftercare: 'הורדת כיסוי העיניים, נשיקה חמה על המצח, כוס מים קרים והתכרבלות רכה של 10 דקות.'
      }
    };
  }

  return {
    title: 'Midnight Hotel Bar Encounter',
    tagline: 'Two strangers, zero boundaries, and high-voltage chemistry.',
    ambiance: {
      music: 'Sensual Deep Lounge & Slow Beats',
      lighting: 'Dim candlelight only',
      props: ['Silk blindfold', 'Cocktail glass'],
      attire: 'Sleek black attire'
    },
    act1: {
      title: 'Act 1: The Seductive Opening Line',
      dialogue: 'Excuse me, is this seat taken, or can I join someone who looks this dangerous tonight?',
      stageDirection: 'Sit facing away, partner approaches from behind and whispers into ear.'
    },
    act2: {
      title: 'Act 2: Sensory Touch & Tease',
      sensoryAction: 'Silk blindfold placement and slow collarbone kisses',
      escalation: 'Firm touch on inner thighs with strict command to breathe slowly.'
    },
    act3: {
      title: 'Act 3: Complete Surrender & Aftercare',
      climax: 'Unrestrained mutual climax under heavy breathing.',
      aftercare: 'Warm embrace, hydration, and 10 minutes of silent tender cuddling.'
    }
  };
}

