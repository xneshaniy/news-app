import { randomBytes, createHash, timingSafeEqual } from "crypto";

interface ResetRecord {
  emailHash: string;
  codeHash: string;
  expiresAt: number;
  attempts: number;
}

const RESETS = new Map<string, ResetRecord>();
const MAX_ATTEMPTS = 5;
const CODE_TTL_MS = 15 * 60 * 1000;

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function createResetCode(email: string): string {
  const code = randomBytes(3).toString("hex").toUpperCase();
  RESETS.set(sha256(email.toLowerCase()), {
    emailHash: sha256(email.toLowerCase()),
    codeHash: sha256(code),
    expiresAt: Date.now() + CODE_TTL_MS,
    attempts: 0,
  });
  return code;
}

export function verifyResetCode(email: string, code: string): boolean {
  const emailHash = sha256(email.toLowerCase());
  const record = RESETS.get(emailHash);
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    RESETS.delete(emailHash);
    return false;
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    RESETS.delete(emailHash);
    return false;
  }
  const candidate = Buffer.from(sha256(code.trim().toUpperCase()), "hex");
  const expected = Buffer.from(record.codeHash, "hex");
  if (candidate.length !== expected.length || !timingSafeEqual(candidate, expected)) {
    record.attempts++;
    return false;
  }
  RESETS.delete(emailHash);
  return true;
}
