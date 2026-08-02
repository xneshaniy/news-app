import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { validateEmail, clampString, sanitizeInput } from "@/lib/validation";

const CONTACT_TO = process.env.CONTACT_EMAIL || "contact@worldlive.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://worldlive.dpdns.org";

const MAX_MESSAGE = 5000;
const MAX_NAME = 100;
const MAX_SUBJECT = 200;

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

interface ContactRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body as ContactRequest;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, message" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 }
      );
    }

    const safeName = sanitizeInput(clampString(name.trim(), MAX_NAME));
    const safeEmail = email.trim().toLowerCase();
    const safeSubject = sanitizeInput(clampString(subject?.trim() || "Contact form submission", MAX_SUBJECT));
    const safeMessage = sanitizeInput(clampString(message.trim(), MAX_MESSAGE));

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
        <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">New Contact Form Submission</h1>
        </div>
        <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
          <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
            <strong style="color: #1e293b;">Name:</strong> ${safeName}<br/>
            <strong style="color: #1e293b;">Email:</strong> ${safeEmail}<br/>
            <strong style="color: #1e293b;">Subject:</strong> ${safeSubject}
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;"/>
          <p style="color: #475569; font-size: 15px; line-height: 1.7; white-space: pre-wrap; margin: 0;">${safeMessage.replace(/\n/g, "<br/>")}</p>
        </div>
        <div style="text-align: center; padding: 16px; color: #94a3b8; font-size: 12px;">
          <p>Sent from ${SITE_URL}</p>
        </div>
      </body>
      </html>
    `;

    const resend = getResend();
    if (!resend) {
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 503 }
      );
    }

    const result = await resend.emails.send({
      from: "WorldLive Contact <onboarding@resend.dev>",
      to: [CONTACT_TO],
      replyTo: safeEmail,
      subject: `[Contact] ${safeSubject}`,
      html,
    });

    if (result.error) {
      console.error("Contact email error:", result.error);
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
