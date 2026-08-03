import { NextRequest, NextResponse } from "next/server";
import {
  sendEmail,
  sendPasswordReset,
  sendAccountRecovery,
  sendLoginOtp,
  sendTwoFactor,
  sendSecurityAlert,
  sendNewLoginNotification,
  sendPasswordChangeConfirmation,
  sendEmailChangeVerification,
  sendAdminNotification,
  sendContactNotification,
  sendRegistrationVerification,
  sendWelcome,
  sendNewsletter,
  sendBreakingNews,
  sendSystemError,
  sendBackupNotification,
  getEmailLog,
  isFeatureEnabled,
} from "@/lib/email-service";
import { getEmailConfig, getAdminEmail, getRecoveryEmail } from "@/lib/email-config";
import { validateEmail } from "@/lib/validation";

function toArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
  return typeof v === "string" ? [v] : [];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const { action } = body || {};

    const registered = getAdminEmail();
    const adminTarget = (body?.adminEmail as string) || registered;

    switch (action) {
      case "test": {
        const to = (body?.to as string) || adminTarget;
        if (!validateEmail(to)) {
          return NextResponse.json({ error: "Invalid recipient email" }, { status: 400 });
        }
        if (!isFeatureEnabled("adminNotification")) {
          return NextResponse.json({ error: "Email features are disabled" }, { status: 400 });
        }
        const result = await sendAdminNotification(
          to,
          "WorldLive Email System Test",
          `This is a test email confirming the email system is fully operational on ${new Date().toLocaleString()}.`
        );
        return NextResponse.json({ success: true, ...result });
      }

      case "send": {
        const { subject, html } = body as { subject?: string; html?: string };
        const to = toArray(body?.to);
        if (!to.length || !subject || !html) {
          return NextResponse.json({ error: "Missing required fields: to, subject, html" }, { status: 400 });
        }
        const result = await sendEmail("generic", { to, subject: String(subject), html: String(html), replyTo: body?.replyTo });
        return NextResponse.json({ success: true, ...result });
      }

      case "password-reset": {
        const to = (body?.to as string) || adminTarget;
        const code = String(body?.code || "000000");
        const result = await sendPasswordReset(to, code);
        return NextResponse.json({ success: true, ...result });
      }

      case "account-recovery": {
        const to = (body?.to as string) || getRecoveryEmail() || registered;
        const code = String(body?.code || "000000");
        const result = await sendAccountRecovery(to, code);
        return NextResponse.json({ success: true, ...result });
      }

      case "login-otp": {
        const to = (body?.to as string) || adminTarget;
        const code = String(body?.code || "000000");
        const result = await sendLoginOtp(to, code);
        return NextResponse.json({ success: true, ...result });
      }

      case "2fa": {
        const to = (body?.to as string) || adminTarget;
        const code = String(body?.code || "000000");
        const result = await sendTwoFactor(to, code);
        return NextResponse.json({ success: true, ...result });
      }

      case "security-alert": {
        const to = (body?.to as string) || adminTarget;
        const details = String(body?.details || "A security event was detected on your WorldLive account.");
        const result = await sendSecurityAlert(to, details);
        return NextResponse.json({ success: true, ...result });
      }

      case "new-login": {
        const to = (body?.to as string) || adminTarget;
        const details = String(body?.details || "A new sign-in was detected.");
        const result = await sendNewLoginNotification(to, details);
        return NextResponse.json({ success: true, ...result });
      }

      case "password-changed": {
        const to = (body?.to as string) || adminTarget;
        const result = await sendPasswordChangeConfirmation(to);
        return NextResponse.json({ success: true, ...result });
      }

      case "email-change": {
        const to = (body?.to as string) || adminTarget;
        const code = String(body?.code || "000000");
        const result = await sendEmailChangeVerification(to, code);
        return NextResponse.json({ success: true, ...result });
      }

      case "admin-notification": {
        const to = (body?.to as string) || adminTarget;
        const title = String(body?.title || "Notification");
        const message = String(body?.message || "");
        const result = await sendAdminNotification(to, title, message);
        return NextResponse.json({ success: true, ...result });
      }

      case "contact": {
        const to = (body?.to as string) || adminTarget;
        const data = {
          name: String(body?.name || "Visitor"),
          email: String(body?.email || ""),
          subject: String(body?.subject || "Contact form submission"),
          message: String(body?.message || ""),
        };
        const result = await sendContactNotification(to, data);
        return NextResponse.json({ success: true, ...result });
      }

      case "registration-verify": {
        const to = (body?.to as string) || adminTarget;
        const code = String(body?.code || "000000");
        const result = await sendRegistrationVerification(to, code);
        return NextResponse.json({ success: true, ...result });
      }

      case "welcome": {
        const to = (body?.to as string) || adminTarget;
        const result = await sendWelcome(to, body?.name as string | undefined);
        return NextResponse.json({ success: true, ...result });
      }

      case "newsletter": {
        const subscribers = toArray(body?.subscribers || body?.to);
        const subject = String(body?.subject || "");
        const html = String(body?.html || "");
        if (!subscribers.length || !subject || !html) {
          return NextResponse.json({ error: "Missing required fields: subscribers, subject, html" }, { status: 400 });
        }
        const results = await Promise.allSettled(subscribers.map((email) => sendNewsletter(email, subject, html)));
        const sent = results.filter((r) => r.status === "fulfilled").length;
        const failed = results.filter((r) => r.status === "rejected").length;
        return NextResponse.json({ success: true, sent, failed, total: subscribers.length });
      }

      case "breaking-news": {
        const subscribers = toArray(body?.subscribers || body?.to);
        const headline = String(body?.headline || "");
        if (!subscribers.length || !headline) {
          return NextResponse.json({ error: "Missing required fields: subscribers, headline" }, { status: 400 });
        }
        const summary = String(body?.summary || "");
        const url = String(body?.url || "");
        const results = await Promise.allSettled(subscribers.map((email) => sendBreakingNews(email, headline, summary, url)));
        const sent = results.filter((r) => r.status === "fulfilled").length;
        const failed = results.filter((r) => r.status === "rejected").length;
        return NextResponse.json({ success: true, sent, failed, total: subscribers.length });
      }

      case "system-error": {
        const to = (body?.to as string) || adminTarget;
        const component = String(body?.component || "unknown");
        const error = String(body?.error || "Unknown error");
        const result = await sendSystemError(to, component, error);
        return NextResponse.json({ success: true, ...result });
      }

      case "backup": {
        const to = (body?.to as string) || adminTarget;
        const message = String(body?.message || "A backup or maintenance task completed.");
        const result = await sendBackupNotification(to, message);
        return NextResponse.json({ success: true, ...result });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");
  const adminSession = request.cookies.get("admin-session");
  if (!adminSession?.value) {
    return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  }
  if (type === "config") {
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
  if (type === "logs") {
    const logs = getEmailLog();
    return NextResponse.json({ logs });
  }
  return NextResponse.json({ error: "Unknown type" }, { status: 400 });
}
