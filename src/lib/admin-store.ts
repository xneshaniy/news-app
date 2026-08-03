import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import fs from "fs";
import path from "path";
import { getEmailConfig, updateEmailConfig } from "@/lib/email-config";

export interface AdminConfig {
  email: string;
  salt: string;
  hash: string;
  updatedAt?: string;
}

const ENV_SALT = "worldlive-admin-salt-v1";
const DEFAULT_ADMIN_EMAIL = "xneshaniya@gmail.com";

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString("hex");
}

function newSalt(): string {
  return randomBytes(16).toString("hex");
}

function matchesPassword(password: string, salt: string, expectedHash: string): boolean {
  const candidate = Buffer.from(hashPassword(password, salt), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

let memoryConfig: AdminConfig | null = null;

function storeFilePath(): string {
  return path.join(process.cwd(), "data", "admin-config.json");
}

function loadConfig(): AdminConfig {
  if (memoryConfig) return memoryConfig;
  try {
    const file = storeFilePath();
    if (fs.existsSync(file)) {
      const parsed = JSON.parse(fs.readFileSync(file, "utf-8")) as AdminConfig;
      memoryConfig = parsed;
      return parsed;
    }
  } catch {
    // fall through to env
  }
  memoryConfig = {
    email: getEmailConfig().adminEmail || DEFAULT_ADMIN_EMAIL,
    salt: ENV_SALT,
    hash: hashPassword(process.env.ADMIN_PASSWORD || "worldlive2024", ENV_SALT),
  };
  return memoryConfig;
}

function persist() {
  if (!memoryConfig) return;
  try {
    const dir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(storeFilePath(), JSON.stringify(memoryConfig, null, 2), "utf-8");
  } catch {
    // read-only filesystem (e.g. Vercel) — in-memory store still works for this process
  }
}

export function getAdminEmail(): string {
  return loadConfig().email;
}

export function verifyAdminCredentials(password: string): boolean {
  const config = loadConfig();
  return matchesPassword(password, config.salt, config.hash);
}

export function updateAdminConfig(patch: { email?: string; password?: string }): { email: string; updatedAt: string } {
  const config = loadConfig();
  if (patch.email !== undefined && patch.email.trim()) {
    const normalized = patch.email.trim().toLowerCase();
    config.email = normalized;
    try {
      updateEmailConfig({ adminEmail: normalized, recoveryEmail: getEmailConfig().recoveryEmail || normalized });
    } catch {
      // email config store unavailable
    }
  }
  if (patch.password && patch.password.length >= 8) {
    config.salt = newSalt();
    config.hash = hashPassword(patch.password, config.salt);
  }
  config.updatedAt = new Date().toISOString();
  persist();
  return { email: config.email, updatedAt: config.updatedAt };
}
