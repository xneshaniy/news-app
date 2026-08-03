import { NextRequest, NextResponse } from "next/server";
import { sendContactNotification, isFeatureEnabled } from "@/lib/email-service";
import { getAdminEmail } from "@/lib/email-config";
import { validateEmail, clampString, sanitizeInput } from "@/lib/validation";

const MAX_MESSAGE = 5000;
const MAX_NAME = 100;
const MAX_SUBJECT = 200;

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

    if (!isFeatureEnabled("contactNotification")) {
      return NextResponse.json({ error: "Email notifications are disabled" }, { status: 400 });
    }

    const safeName = sanitizeInput(clampString(name.trim(), MAX_NAME));
    const safeEmail = email.trim().toLowerCase();
    const safeSubject = sanitizeInput(clampString(subject?.trim() || "Contact form submission", MAX_SUBJECT));
    const safeMessage = sanitizeInput(clampString(message.trim(), MAX_MESSAGE));

    const adminTarget = getAdminEmail();

    const result = await sendContactNotification(adminTarget, {
      name: safeName,
      email: safeEmail,
      subject: safeSubject,
      message: safeMessage,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
