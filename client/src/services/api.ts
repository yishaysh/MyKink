const API_BASE = 'http://localhost:4000/api';

export async function registerDevice(deviceIdentity: string, publicKey: string) {
  const res = await fetch(`${API_BASE}/auth/register-device`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceIdentity, publicKey })
  });
  return res.json();
}

export async function createCouple(userId: string) {
  const res = await fetch(`${API_BASE}/auth/create-couple`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  return res.json();
}

export async function joinCouple(userId: string, pairCode: string) {
  const res = await fetch(`${API_BASE}/auth/join-couple`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, pairCode })
  });
  return res.json();
}

export async function fetchQuestions(category = 'ALL', intensity = 'ALL') {
  const res = await fetch(`${API_BASE}/questions?category=${category}&intensity=${intensity}`);
  return res.json();
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
  return res.json();
}

export async function fetchMatches(coupleId: string) {
  const res = await fetch(`${API_BASE}/matches?coupleId=${coupleId}`);
  return res.json();
}

export async function fetchDares(coupleId: string) {
  const res = await fetch(`${API_BASE}/dares?coupleId=${coupleId}`);
  return res.json();
}

export async function createDare(coupleId: string, title: string, description: string, durationHours = 24) {
  const res = await fetch(`${API_BASE}/dares/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coupleId, title, description, durationHours })
  });
  return res.json();
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
  return res.json();
}

export async function fetchIntimacyLogs(coupleId: string) {
  const res = await fetch(`${API_BASE}/intimacy/logs?coupleId=${coupleId}`);
  return res.json();
}

export async function generateAIScenario(coupleId: string, intensityMode: 'VANILLA' | 'SPICY' | 'ADVENTUROUS') {
  const res = await fetch(`${API_BASE}/ai/generate-scenario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coupleId, intensityMode })
  });
  return res.json();
}

export async function askAria(prompt: string) {
  const res = await fetch(`${API_BASE}/ai/aria-advice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  return res.json();
}
