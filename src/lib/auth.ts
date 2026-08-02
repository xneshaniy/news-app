function getSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) {
    throw new Error("JWT_SECRET must be set and at least 32 characters");
  }
  return s;
}

function base64url(data: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(data)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signAdminToken(): Promise<string> {
  const header = base64url(new TextEncoder().encode(JSON.stringify({ alg: "HS256", typ: "JWT" })).buffer);
  const now = Math.floor(Date.now() / 1000);
  const payload = base64url(new TextEncoder().encode(JSON.stringify({
    role: "admin",
    iat: now,
    exp: now + 86400,
  })).buffer);
  const key = await getKey();
  const signature = base64url(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${header}.${payload}`)));
  return `${header}.${payload}.${signature}`;
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [header, payload, sig] = parts;
    const key = await getKey();
    const sigBytes = base64urlDecode(sig);
    const dataBytes = new TextEncoder().encode(`${header}.${payload}`);
    const valid = await crypto.subtle.verify("HMAC", key, sigBytes.buffer as ArrayBuffer, dataBytes);
    if (!valid) return false;
    const data = JSON.parse(new TextDecoder().decode(base64urlDecode(payload)));
    return data.role === "admin" && (!data.exp || data.exp > Math.floor(Date.now() / 1000));
  } catch {
    return false;
  }
}
