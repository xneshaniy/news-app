import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { getEmailConfig, updateEmailConfig } from "@/lib/email-config";
import { validateEmail } from "@/lib/validation";

const FEATURE_KEYS = [
  "passwordReset",
  "accountRecovery",
  "loginOtp",
  "twoFactor",
  "securityAlert",
  "newLogin",
  "passwordChange",
  "emailChangeVerify",
  "adminNotification",
  "contactNotification",
  "registrationVerify",
  "welcome",
  "newsletter",
  "systemError",
  "backupMaintenance",
];

export async function PUT(request: NextRequest) {
  try {
    const session = request.cookies.get("admin-session");
    if (!session?.value || !(await verifyAdminToken(session.value))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

    const patch: Record<string, unknown> = {};

    if (body.adminEmail !== undefined) {
      if (typeof body.adminEmail !== "string" || !validateEmail(body.adminEmail)) {
        return NextResponse.json({ error: "Invalid admin email" }, { status: 400 });
      }
      patch.adminEmail = body.adminEmail;
      patch.recoveryEmail = body.adminEmail;
    }

    if (body.recoveryEmail !== undefined) {
      if (typeof body.recoveryEmail !== "string" || !validateEmail(body.recoveryEmail)) {
        return NextResponse.json({ error: "Invalid recovery email" }, { status: 400 });
      }
      patch.recoveryEmail = body.recoveryEmail;
    }

    if (body.fromName !== undefined) patch.fromName = String(body.fromName);
    if (body.fromEmail !== undefined) patch.fromEmail = String(body.fromEmail);
    if (body.provider === "smtp" || body.provider === "resend") patch.provider = body.provider;
    if (body.smtpHost !== undefined) patch.smtpHost = String(body.smtpHost);
    if (body.smtpPort !== undefined) patch.smtpPort = Number(body.smtpPort) || 587;
    if (body.smtpUser !== undefined) patch.smtpUser = String(body.smtpUser);
    if (body.smtpPass !== undefined && body.smtpPass !== "") patch.smtpPass = String(body.smtpPass);
    if (body.smtpSecure !== undefined) patch.smtpSecure = Boolean(body.smtpSecure);
    if (body.resendApiKey !== undefined && body.resendApiKey !== "") patch.resendApiKey = String(body.resendApiKey);

    if (body.features && typeof body.features === "object") {
      const features: Record<string, boolean> = {};
      for (const key of FEATURE_KEYS) {
        if (typeof body.features[key] === "boolean") features[key] = body.features[key];
      }
      if (Object.keys(features).length) patch.features = features;
    }

    const updated = updateEmailConfig(patch as never);
    return NextResponse.json({
      success: true,
      adminEmail: updated.adminEmail,
      recoveryEmail: updated.recoveryEmail,
      provider: updated.provider,
    });
  } catch {
    return NextResponse.json({ error: "Failed to update email configuration" }, { status: 500 });
  }
}

export async function GET() {
  const config = getEmailConfig();
  return NextResponse.json({
    adminEmail: config.adminEmail,
    recoveryEmail: config.recoveryEmail,
    fromName: config.fromName,
    fromEmail: config.fromEmail,
    provider: config.provider,
    smtpHost: config.smtpHost,
    smtpPort: config.smtpPort,
    smtpUser: config.smtpUser,
    smtpSecure: config.smtpSecure,
    resendConfigured: Boolean(config.resendApiKey || process.env.RESEND_API_KEY),
    features: config.features,
  });
}
