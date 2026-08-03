import nodemailer from "nodemailer";
import { Resend } from "resend";
import fs from "fs";
import path from "path";
import { getEmailConfig, isEmailFeatureEnabled } from "@/lib/email-config";
import { validateEmail, clampString } from "@/lib/validation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://worldlive.dpdns.org";

export interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export interface EmailLogEntry {
  id: string;
  type: string;
  to: string;
  subject: string;
  provider: string;
  status: "sent" | "failed";
  error?: string;
  timestamp: string;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function logPath(): string {
  return path.join(process.cwd(), "data", "email-log.json");
}

export function getEmailLog(): EmailLogEntry[] {
  try {
    if (fs.existsSync(logPath())) {
      return JSON.parse(fs.readFileSync(logPath(), "utf-8")) as EmailLogEntry[];
    }
  } catch {
    // ignore
  }
  return [];
}

function appendLog(entry: EmailLogEntry) {
  try {
    const dir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const entries = getEmailLog();
    entries.unshift(entry);
    const trimmed = entries.slice(0, 500);
    fs.writeFileSync(logPath(), JSON.stringify(trimmed, null, 2), "utf-8");
  } catch {
    // logging is non-fatal
  }
}

function logSend(type: string, to: string | string[], subject: string, status: "sent" | "failed", provider: string, error?: string) {
  appendLog({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    to: Array.isArray(to) ? to.join(", ") : to,
    subject,
    provider,
    status,
    error,
    timestamp: new Date().toISOString(),
  });
}

function fromAddress(provider?: string): string {
  const config = getEmailConfig();
  const mode = provider || config.provider;
  if (mode === "smtp") {
    return config.fromEmail || "WorldLive <content@worldlive.dpdns.org>";
  }
  return "WorldLive <onboarding@resend.dev>";
}

async function sendViaSmtp(message: EmailMessage): Promise<void> {
  const config = getEmailConfig();
  if (!config.smtpHost) {
    throw new Error("SMTP host is not configured");
  }
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort || 587,
    secure: config.smtpSecure,
    auth: config.smtpUser
      ? { user: config.smtpUser, pass: config.smtpPass }
      : undefined,
    tls: { rejectUnauthorized: false },
  });
  await transporter.sendMail({
    from: fromAddress("smtp"),
    to: message.to,
    subject: message.subject,
    html: message.html,
    replyTo: message.replyTo,
    text: message.html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 1000),
  });
}

async function sendViaResend(message: EmailMessage): Promise<void> {
  const config = getEmailConfig();
  const apiKey = config.resendApiKey || process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Email service is not configured (no RESEND_API_KEY)");
  }
  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from: fromAddress("resend"),
    to: message.to,
    subject: clampString(message.subject, 200),
    html: clampString(message.html, 100000),
    replyTo: message.replyTo,
  });
  if (result.error) {
    throw new Error(String(result.error.message || result.error.name || "Resend send failed"));
  }
}

export async function sendEmail(type: string, message: EmailMessage): Promise<{ id: string; provider: string }> {
  const emails = Array.isArray(message.to) ? message.to : [message.to];
  const invalid = emails.filter((e) => !validateEmail(e));
  if (invalid.length > 0) {
    logSend(type, message.to, message.subject, "failed", "none", `Invalid email addresses: ${invalid.join(", ")}`);
    throw new Error(`Invalid email addresses: ${invalid.join(", ")}`);
  }

  const config = getEmailConfig();
  const primary = config.provider === "smtp" ? "smtp" : "resend";
  const fallback = primary === "smtp" ? "resend" : "smtp";

  try {
    if (primary === "smtp") {
      await sendViaSmtp(message);
    } else {
      await sendViaResend(message);
    }
    logSend(type, message.to, message.subject, "sent", primary);
    return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, provider: primary };
  } catch (error) {
    const fallbackAvailable = fallback === "resend"
      ? Boolean((config.resendApiKey || process.env.RESEND_API_KEY))
      : Boolean(config.smtpHost);
    if (!fallbackAvailable) {
      const messageText = error instanceof Error ? error.message : String(error);
      logSend(type, message.to, message.subject, "failed", primary, messageText);
      throw error;
    }
    try {
      if (fallback === "smtp") {
        await sendViaSmtp(message);
      } else {
        await sendViaResend(message);
      }
      logSend(type, message.to, message.subject, "sent", fallback);
      return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, provider: fallback };
    } catch (fallbackError) {
      const messageText = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
      logSend(type, message.to, message.subject, "failed", fallback, messageText);
      throw fallbackError;
    }
  }
}

export function buildLayout(title: string, bodyHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
      <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 28px; border-radius: 12px 12px 0 0; text-align: center;">
        <div style="display: inline-block; background: white; color: #2563eb; font-size: 22px; font-weight: 800; letter-spacing: 1px; padding: 10px 20px; border-radius: 10px;">WorldLive</div>
        <h1 style="color: white; margin: 16px 0 0; font-size: 18px;">${title}</h1>
      </div>
      <div style="background: white; padding: 28px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
        ${bodyHtml}
      </div>
      <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 12px;">
        <p>© ${new Date().getFullYear()} WorldLive · <a href="${SITE_URL}" style="color: #2563eb;">${SITE_URL.replace(/^https?:\/\//, "")}</a></p>
      </div>
    </body>
    </html>
  `;
}

export function buildCodeBlock(code: string): string {
  return `
    <div style="background: #eff6ff; border: 1px dashed #93c5fd; border-radius: 8px; text-align: center; padding: 16px; margin: 16px 0;">
      <span style="font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #1d4ed8;">${escapeHtml(code)}</span>
    </div>
  `;
}

export function buildParagraph(text: string): string {
  return `<p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 12px;">${escapeHtml(text)}</p>`;
}

export function buildButton(text: string, url: string): string {
  return `
    <div style="text-align: center; margin: 20px 0;">
      <a href="${url}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">${escapeHtml(text)}</a>
    </div>
  `;
}

export function buildKeyValue(label: string, value: string): string {
  return `<p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 6px;"><strong style="color: #1e293b;">${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;
}

export async function sendPasswordReset(to: string, code: string): Promise<{ id: string; provider: string }> {
  const html = buildLayout(
    "Password Reset Request",
    buildParagraph("We received a request to reset your WorldLive account password. Use the code below to set a new password. It expires in 15 minutes.") +
      buildCodeBlock(code) +
      buildParagraph("If you did not request this, you can safely ignore this email.")
  );
  return sendEmail("password-reset", { to, subject: "WorldLive Password Reset Code", html });
}

export async function sendAccountRecovery(to: string, code: string): Promise<{ id: string; provider: string }> {
  const html = buildLayout(
    "Account Recovery",
    buildParagraph("We received a request to recover your WorldLive account. Use the code below to regain access.") +
      buildCodeBlock(code) +
      buildParagraph("The code expires in 15 minutes. If you did not request this, you can safely ignore this email.")
  );
  return sendEmail("account-recovery", { to, subject: "WorldLive Account Recovery Code", html });
}

export async function sendLoginOtp(to: string, code: string): Promise<{ id: string; provider: string }> {
  const html = buildLayout(
    "Login Verification",
    buildParagraph("Use the verification code below to complete signing in to your WorldLive account.") +
      buildCodeBlock(code) +
      buildParagraph("The code expires in 10 minutes. Never share this code with anyone.")
  );
  return sendEmail("login-otp", { to, subject: "Your WorldLive Login Code", html });
}

export async function sendTwoFactor(to: string, code: string): Promise<{ id: string; provider: string }> {
  const html = buildLayout(
    "Two-Factor Authentication",
    buildParagraph("Two-factor authentication is required for your WorldLive account. Enter the code below to continue.") +
      buildCodeBlock(code) +
      buildParagraph("The code expires in 10 minutes.")
  );
  return sendEmail("2fa", { to, subject: "WorldLive Two-Factor Authentication Code", html });
}

export async function sendSecurityAlert(to: string, details: string): Promise<{ id: string; provider: string }> {
  const html = buildLayout(
    "Security Alert",
    buildParagraph("A security event was detected on your WorldLive account.") +
      buildParagraph(details) +
      buildParagraph("If this was you, no action is needed. If you don't recognize this activity, please reset your password immediately.")
  );
  return sendEmail("security-alert", { to, subject: "⚠ Security Alert: WorldLive Account", html });
}

export async function sendNewLoginNotification(to: string, details: string): Promise<{ id: string; provider: string }> {
  const html = buildLayout(
    "New Sign-In Detected",
    buildParagraph("Your WorldLive account was just signed in from a new device or location.") +
      buildParagraph(details) +
      buildParagraph("If this was you, you can ignore this email. Otherwise, please secure your account.")
  );
  return sendEmail("new-login", { to, subject: "New Sign-In on Your WorldLive Account", html });
}

export async function sendPasswordChangeConfirmation(to: string): Promise<{ id: string; provider: string }> {
  const html = buildLayout(
    "Password Changed",
    buildParagraph("Your WorldLive account password was just changed.") +
      buildParagraph("If this was you, no further action is needed. If you did not make this change, please reset your password immediately.")
  );
  return sendEmail("password-changed", { to, subject: "Your WorldLive Password Was Changed", html });
}

export async function sendEmailChangeVerification(to: string, code: string): Promise<{ id: string; provider: string }> {
  const html = buildLayout(
    "Email Change Verification",
    buildParagraph("You requested to change the email address on your WorldLive account. Enter the code below to confirm the new address.") +
      buildCodeBlock(code) +
      buildParagraph("The code expires in 15 minutes.")
  );
  return sendEmail("email-change", { to, subject: "Confirm Your New Email Address", html });
}

export async function sendAdminNotification(to: string, title: string, body: string): Promise<{ id: string; provider: string }> {
  const html = buildLayout(
    "Admin Notification",
    buildParagraph(title) + buildParagraph(body)
  );
  return sendEmail("admin-notification", { to, subject: `[WorldLive Admin] ${clampString(title, 120)}`, html });
}

export async function sendContactNotification(to: string, data: { name: string; email: string; subject: string; message: string }): Promise<{ id: string; provider: string }> {
  const html = buildLayout(
    "New Contact Form Submission",
    buildKeyValue("Name", data.name) +
      buildKeyValue("Email", data.email) +
      buildKeyValue("Subject", data.subject) +
      `<div style="background: #f1f5f9; border-radius: 8px; padding: 14px; margin-top: 8px;"><p style="color: #475569; font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${escapeHtml(data.message)}</p></div>`
  );
  return sendEmail("contact", { to, subject: `[Contact] ${clampString(data.subject, 120)}`, html, replyTo: data.email });
}

export async function sendRegistrationVerification(to: string, code: string): Promise<{ id: string; provider: string }> {
  const html = buildLayout(
    "Verify Your Email",
    buildParagraph("Thanks for creating a WorldLive account. Enter the code below to verify your email address.") +
      buildCodeBlock(code) +
      buildParagraph("The code expires in 24 hours.")
  );
  return sendEmail("registration-verify", { to, subject: "Verify Your WorldLive Account", html });
}

export async function sendWelcome(to: string, name?: string): Promise<{ id: string; provider: string }> {
  const safeName = name ? escapeHtml(clampString(name, 100)) : "";
  const html = buildLayout(
    "Welcome to WorldLive!",
    buildParagraph(`Hi ${safeName || "there"},`) +
      buildParagraph("Thank you for subscribing to WorldLive! You'll receive the best news from around the world, powered by AI.") +
      `<ul style="color: #334155; font-size: 15px; line-height: 1.8; padding-left: 20px;">
        <li>Breaking news alerts from 20+ countries</li>
        <li>AI-powered summaries and analysis</li>
        <li>Weekly newsletter with top stories</li>
        <li>Personalized recommendations</li>
      </ul>` +
      buildButton("Start Reading", SITE_URL)
  );
  return sendEmail("welcome", { to, subject: "Welcome to WorldLive! 🌍", html });
}

export async function sendNewsletter(to: string, subject: string, bodyHtml: string): Promise<{ id: string; provider: string }> {
  const html = buildLayout("WorldLive Newsletter", bodyHtml);
  return sendEmail("newsletter", { to, subject: clampString(subject, 200), html });
}

export async function sendBreakingNews(to: string, headline: string, summary: string, url: string): Promise<{ id: string; provider: string }> {
  const safeSummary = summary ? escapeHtml(clampString(summary, 500)) : "";
  const safeUrl = url ? url : SITE_URL;
  const html = buildLayout(
    "⚡ Breaking News",
    `<h2 style="color: #1e293b; margin: 0 0 12px; font-size: 22px; line-height: 1.3;">${escapeHtml(clampString(headline, 200))}</h2>` +
      (safeSummary ? buildParagraph(safeSummary) : "") +
      buildButton("Read Full Story", safeUrl)
  );
  return sendEmail("breaking-news", { to, subject: `⚡ BREAKING: ${clampString(headline, 120)}`, html });
}

export async function sendSystemError(to: string, component: string, error: string): Promise<{ id: string; provider: string }> {
  const html = buildLayout(
    "System Error Notification",
    buildKeyValue("Component", component) +
      `<div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px; margin-top: 8px;"><p style="color: #b91c1c; font-family: monospace; font-size: 13px; margin: 0; white-space: pre-wrap;">${escapeHtml(clampString(error, 2000))}</p></div>`
  );
  return sendEmail("system-error", { to, subject: `[WorldLive Error] ${clampString(component, 100)}`, html });
}

export async function sendBackupNotification(to: string, message: string): Promise<{ id: string; provider: string }> {
  const html = buildLayout(
    "Backup & Maintenance",
    buildParagraph(message)
  );
  return sendEmail("backup", { to, subject: "WorldLive Backup & Maintenance Notification", html });
}

export function isFeatureEnabled(feature: string): boolean {
  return isEmailFeatureEnabled(feature as keyof ReturnType<typeof getEmailConfig>["features"]);
}
