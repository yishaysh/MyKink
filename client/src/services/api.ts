const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Non-JSON server response:', text);
    return { success: false, error: text || 'Server Error' };
  }
}

export async function registerDevice(deviceIdentity: string, publicKey: string) {
  const res = await fetch(`${API_BASE}/auth/register-device`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceIdentity, publicKey })
  });
  return safeJson(res);
}

export async function createCouple(userId: string) {
  const res = await fetch(`${API_BASE}/auth/create-couple`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  return safeJson(res);
}

export async function joinCouple(userId: string, pairCode: string) {
  const res = await fetch(`${API_BASE}/auth/join-couple`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, pairCode })
  });
  return safeJson(res);
}

export async function fetchQuestions(category = 'ALL', intensity = 'ALL') {
  const res = await fetch(`${API_BASE}/questions?category=${category}&intensity=${intensity}`);
  return safeJson(res);
}

export async function submitAnswer(
  userId: string,
  questionId: string,
  encryptedValue: string,
  answerHash: string,
  rawValue: 'YES' | 'MAYBE' | 'NO'
) {
  const res = await fetch(`${API_BASE}/answers/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, questionId, encryptedValue, answerHash, rawValue })
  });
  return safeJson(res);
}

export async function fetchMatches(coupleId: string) {
  const res = await fetch(`${API_BASE}/matches?coupleId=${coupleId}`);
  return safeJson(res);
}

export async function fetchDares(coupleId: string) {
  const res = await fetch(`${API_BASE}/dares?coupleId=${coupleId}`);
  return safeJson(res);
}

export async function createDare(coupleId: string, title: string, description: string, durationHours = 24) {
  const res = await fetch(`${API_BASE}/dares/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coupleId, title, description, durationHours })
  });
  return safeJson(res);
}

export async function logIntimacy(
  coupleId: string,
  activityType: string,
  durationMinutes: number,
  location: string,
  protectionUsed: boolean,
  moodRating: number
) {
  const res = await fetch(`${API_BASE}/intimacy/log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coupleId, activityType, durationMinutes, location, protectionUsed, moodRating })
  });
  return safeJson(res);
}

export async function fetchIntimacyLogs(coupleId: string) {
  const res = await fetch(`${API_BASE}/intimacy/logs?coupleId=${coupleId}`);
  return safeJson(res);
}

export async function generateAIScenario(coupleId: string, intensityMode: 'VANILLA' | 'SPICY' | 'ADVENTUROUS') {
  const res = await fetch(`${API_BASE}/ai/generate-scenario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coupleId, intensityMode })
  });
  return safeJson(res);
}

export async function askAria(prompt: string) {
  const res = await fetch(`${API_BASE}/ai/aria-advice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  return safeJson(res);
}
