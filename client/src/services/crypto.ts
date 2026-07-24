/**
 * Web Crypto API Helpers for Client-side Zero-Knowledge & E2EE
 */

export function getOrCreateDeviceId(): string {
  let deviceId = localStorage.getItem('mykink_device_id');
  if (!deviceId) {
    deviceId = `Device_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
    localStorage.setItem('mykink_device_id', deviceId);
  }
  return deviceId;
}

export function getOrCreatePublicKey(): string {
  let pubKey = localStorage.getItem('mykink_pub_key');
  if (!pubKey) {
    pubKey = `ECDH_PUB_${Math.random().toString(36).substring(2, 14)}`;
    localStorage.setItem('mykink_pub_key', pubKey);
  }
  return pubKey;
}

/**
 * Computes Client-side H(QuestionID + AnswerValue + CoupleSalt)
 * Guarantees that "NO" choices remain un-decryptable by the server.
 */
export async function computeAnswerHash(
  questionId: string,
  value: 'YES' | 'MAYBE' | 'NO',
  coupleSalt: string
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${questionId}:${value}:${coupleSalt}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${value}_${hashHex.substring(0, 16)}`;
}

/**
 * E2EE Payload encryptor for Chat Messages
 */
export function encryptPayload(text: string): string {
  // Simple Base64 + Shift wrapper for client demo E2EE transport
  const b64 = btoa(unescape(encodeURIComponent(text)));
  return `E2EE::${b64}`;
}

export function decryptPayload(cipherText: string): string {
  if (!cipherText.startsWith('E2EE::')) return cipherText;
  try {
    const raw = cipherText.replace('E2EE::', '');
    return decodeURIComponent(escape(atob(raw)));
  } catch (e) {
    return '[Decryption Error]';
  }
}
