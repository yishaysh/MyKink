// Gemini 2.5 API Integration Service for Aria AI & Dare Generator

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export async function askGeminiAria(userQuery: string, lang: 'en' | 'he'): Promise<string> {
  if (!GEMINI_API_KEY) {
    // Fallback response if API key is not provided yet
    if (lang === 'he') {
      return "אני אריאל — יועצת האינטימיות שלכם. כדי לקבל מענה אינטליגנטי ומותאם אישית בזמן אמת, יש להזין מפתח VITE_GEMINI_API_KEY בקובץ .env. בינתיים: תקשורת פתוחה, הקשבה ללא שיפוטיות ושימוש במילות בטיחות הם המפתח לזוגיות מעצימה!";
    }
    return "I am Aria, your intimacy & communication guide. To enable real-time Gemini AI responses, please add VITE_GEMINI_API_KEY in your .env file. Meanwhile: open communication and clear safewords build deep trust!";
  }

  try {
    const systemPrompt =
      lang === 'he'
        ? "אתה אריאל — יועצת אינטימיות ותקשורת זוגית דיסקרטית, תומכת ולא שיפוטית. ענה בעברית רהוטה, מעצימה ומכבדת לשאלת המשתמש:"
        : "You are Aria — a empathetic, respectful, non-judgmental intimacy & relationship guide. Provide insightful, empowering advice for the user query:";

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

export async function generateAIDare(
  intensity: string,
  lang: 'en' | 'he'
): Promise<{ title: string; description: string }> {
  if (!GEMINI_API_KEY) {
    if (lang === 'he') {
      return {
        title: 'עיסוי חושני בלחישות',
        description: 'הקדישו 10 דקות לעיסוי כתפיים וגב עם שמנים חמים תוך לחישת פנטזיות באוזן.'
      };
    }
    return {
      title: 'Whispered Sensory Massage',
      description: 'Spend 10 minutes giving a gentle shoulder massage while whispering romantic desires.'
    };
  }

  try {
    const prompt =
      lang === 'he'
        ? `צור אתגר זוגי אינטימי ורומנטי ברמת עוצמה ${intensity}. החזר אך ורק פורמט JSON תקין עם השדות "title" (כותרת קצרה) ו-"description" (הוראות ב-2 משפטים).`
        : `Generate a romantic intimacy dare for a couple with intensity level ${intensity}. Return JSON with "title" and "description" fields ONLY.`;

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
