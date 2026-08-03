import fs from "fs";
import path from "path";

export interface EmailConfig {
  adminEmail: string;
  recoveryEmail: string;
  fromName: string;
  fromEmail: string;
  provider: "smtp" | "resend";
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpSecure: boolean;
  resendApiKey: string;
  features: Record<string, boolean>;
  updatedAt?: string;
}

const DEFAULT_ADMIN_EMAIL = "xneshaniya@gmail.com";

const DEFAULT_FEATURES: Record<string, boolean> = {
  passwordReset: true,
  accountRecovery: true,
  loginOtp: true,
  twoFactor: true,
  securityAlert: true,
  newLogin: true,
  passwordChange: true,
  emailChangeVerify: true,
  adminNotification: true,
  contactNotification: true,
  registrationVerify: true,
  welcome: true,
  newsletter: true,
  systemError: true,
  backupMaintenance: true,
};

function defaultConfig(): EmailConfig {
  return {
    adminEmail: process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL,
    recoveryEmail: process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL,
    fromName: process.env.EMAIL_FROM_NAME || "WorldLive",
    fromEmail: process.env.EMAIL_FROM || "WorldLive <onboarding@resend.dev>",
    provider: process.env.SMTP_HOST ? "smtp" : "resend",
    smtpHost: process.env.SMTP_HOST || "",
    smtpPort: parseInt(process.env.SMTP_PORT || "587", 10),
    smtpUser: process.env.SMTP_USER || "",
    smtpPass: process.env.SMTP_PASS || "",
    smtpSecure: (process.env.SMTP_SECURE || "false") === "true",
    resendApiKey: process.env.RESEND_API_KEY || "",
    features: { ...DEFAULT_FEATURES },
  };
}

let memoryConfig: EmailConfig | null = null;

function storeFilePath(): string {
  return path.join(process.cwd(), "data", "email-config.json");
}

function loadConfig(): EmailConfig {
  if (memoryConfig) return memoryConfig;
  try {
    const file = storeFilePath();
    if (fs.existsSync(file)) {
      const parsed = JSON.parse(fs.readFileSync(file, "utf-8")) as EmailConfig;
      memoryConfig = {
        ...defaultConfig(),
        ...parsed,
        features: { ...DEFAULT_FEATURES, ...(parsed.features || {}) },
      };
      return memoryConfig;
    }
  } catch {
    // fall through to defaults
  }
  memoryConfig = defaultConfig();
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

export function getEmailConfig(): EmailConfig {
  return loadConfig();
}

export function isEmailFeatureEnabled(feature: keyof typeof DEFAULT_FEATURES): boolean {
  return loadConfig().features[feature] !== false;
}

export function updateEmailConfig(patch: Partial<EmailConfig>): EmailConfig {
  const config = loadConfig();
  const next: EmailConfig = { ...config };

  if (patch.adminEmail !== undefined) next.adminEmail = patch.adminEmail.trim().toLowerCase();
  if (patch.recoveryEmail !== undefined) next.recoveryEmail = patch.recoveryEmail.trim().toLowerCase();
  if (patch.fromName !== undefined) next.fromName = patch.fromName.trim();
  if (patch.fromEmail !== undefined) next.fromEmail = patch.fromEmail.trim();
  if (patch.provider !== undefined) next.provider = patch.provider;
  if (patch.smtpHost !== undefined) next.smtpHost = patch.smtpHost.trim();
  if (patch.smtpPort !== undefined) next.smtpPort = Number(patch.smtpPort) || 587;
  if (patch.smtpUser !== undefined) next.smtpUser = patch.smtpUser;
  if (patch.smtpPass !== undefined) next.smtpPass = patch.smtpPass;
  if (patch.smtpSecure !== undefined) next.smtpSecure = Boolean(patch.smtpSecure);
  if (patch.resendApiKey !== undefined) next.resendApiKey = patch.resendApiKey;
  if (patch.features !== undefined) next.features = { ...next.features, ...patch.features };

  next.updatedAt = new Date().toISOString();
  memoryConfig = next;
  persist();
  return memoryConfig;
}

export function getAdminEmail(): string {
  return loadConfig().adminEmail;
}

export function getRecoveryEmail(): string {
  return loadConfig().recoveryEmail;
}
