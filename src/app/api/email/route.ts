import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { validateEmail, clampString, validateUrl } from "@/lib/validation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://worldlive.dpdns.org";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface EmailRequest {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

interface NewsletterRequest {
  subscribers: string[];
  subject: string;
  html: string;
}

interface BreakingNewsRequest {
  subscribers: string[];
  headline: string;
  summary: string;
  url: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    const resend = getResend();
    if (!resend) {
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 503 }
      );
    }

    if (action === "send") {
      const { to, subject, html, from, replyTo } = body as EmailRequest;
      if (!to || !subject || !html) {
        return NextResponse.json({ error: "Missing required fields: to, subject, html" }, { status: 400 });
      }
      const emails = Array.isArray(to) ? to : [to];
      const invalid = emails.filter((e) => !validateEmail(e));
      if (invalid.length > 0) {
        return NextResponse.json({ error: `Invalid email addresses: ${invalid.join(", ")}` }, { status: 400 });
      }
      const result = await resend.emails.send({
        from: from || "WorldLive <onboarding@resend.dev>",
        to: emails,
        subject: clampString(subject, 200),
        html: clampString(html, 100000),
        replyTo,
      });
      return NextResponse.json({ success: true, id: result.data?.id });
    }

    if (action === "newsletter") {
      const { subscribers, subject, html } = body as NewsletterRequest;
      if (!subscribers?.length || !subject || !html) {
        return NextResponse.json({ error: "Missing required fields: subscribers, subject, html" }, { status: 400 });
      }
      const results = await Promise.allSettled(
        subscribers.map((email) =>
          resend.emails.send({
            from: "WorldLive Newsletter <onboarding@resend.dev>",
            to: [email],
            subject,
            html,
          })
        )
      );
      const sent = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;
      return NextResponse.json({ success: true, sent, failed, total: subscribers.length });
    }

    if (action === "breaking-news") {
      const { subscribers, headline, summary, url } = body as BreakingNewsRequest;
      if (!subscribers?.length || !headline) {
        return NextResponse.json({ error: "Missing required fields: subscribers, headline" }, { status: 400 });
      }
      const safeHeadline = escapeHtml(clampString(String(headline), 200));
      const safeSummary = summary ? escapeHtml(clampString(String(summary), 500)) : "";
      const safeUrl = url && validateUrl(String(url)) ? String(url) : "";
      const html = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
          <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">⚡ Breaking News</h1>
          </div>
          <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
            <h2 style="color: #1e293b; margin: 0 0 12px; font-size: 22px; line-height: 1.3;">${safeHeadline}</h2>
            ${safeSummary ? `<p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">${safeSummary}</p>` : ""}
            ${safeUrl ? `<a href="${safeUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Read Full Story →</a>` : ""}
          </div>
          <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 12px;">
            <p>You received this because you're subscribed to WorldLive breaking news alerts.</p>
            <p><a href="${SITE_URL}/newsletter" style="color: #2563eb;">Manage Preferences</a> · <a href="${SITE_URL}/unsubscribe" style="color: #ef4444;">Unsubscribe</a></p>
          </div>
        </body>
        </html>
      `;
      const results = await Promise.allSettled(
        subscribers.map((email) =>
          resend.emails.send({
            from: "WorldLive Breaking <onboarding@resend.dev>",
            to: [email],
            subject: `⚡ BREAKING: ${clampString(safeHeadline, 120)}`,
            html,
          })
        )
      );
      const sent = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;
      return NextResponse.json({ success: true, sent, failed, total: subscribers.length });
    }

    if (action === "welcome") {
      const { to, name } = body as { to: string; name?: string };
      if (!to) {
        return NextResponse.json({ error: "Missing required field: to" }, { status: 400 });
      }
      const safeName = name ? escapeHtml(clampString(String(name), 100)) : "";
      const html = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
          <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to WorldLive!</h1>
          </div>
          <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
            <p style="color: #334155; font-size: 16px; line-height: 1.6;">Hi ${safeName || "there"},</p>
            <p style="color: #334155; font-size: 16px; line-height: 1.6;">Thank you for subscribing to WorldLive! You'll receive the best news from around the world, powered by AI.</p>
            <p style="color: #334155; font-size: 16px; line-height: 1.6;">Here's what you can expect:</p>
            <ul style="color: #334155; font-size: 15px; line-height: 1.8;">
              <li>Breaking news alerts from 20+ countries</li>
              <li>AI-powered summaries and analysis</li>
              <li>Weekly newsletter with top stories</li>
              <li>Personalized recommendations</li>
            </ul>
            <a href="${SITE_URL}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 12px;">Start Reading →</a>
          </div>
          <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 12px;">
            <p><a href="${SITE_URL}/unsubscribe" style="color: #ef4444;">Unsubscribe</a></p>
          </div>
        </body>
        </html>
      `;
      const result = await resend.emails.send({
        from: "WorldLive <onboarding@resend.dev>",
        to: [to],
        subject: "Welcome to WorldLive! 🌍",
        html,
      });
      return NextResponse.json({ success: true, id: result.data?.id });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
