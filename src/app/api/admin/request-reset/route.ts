import { NextRequest, NextResponse } from "next/server";
import { sendPasswordReset, isFeatureEnabled } from "@/lib/email-service";
import { getAdminEmail } from "@/lib/email-config";
import { createResetCode } from "@/lib/reset-store";
import { validateEmail } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const email = body?.email;

    if (typeof email !== "string" || !validateEmail(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const registeredEmail = getAdminEmail();

    // Always return the same generic response to avoid email enumeration.
    const generic = NextResponse.json({ success: true, message: "If this email is registered, a reset code has been sent." });

    if (email.trim().toLowerCase() !== registeredEmail.toLowerCase()) {
      return generic;
    }

    const code = createResetCode(email);

    const devCode = process.env.RESEND_API_KEY ? null : code;
    let delivered = true;

    if (isFeatureEnabled("passwordReset")) {
      try {
        await sendPasswordReset(email, code);
      } catch {
        delivered = false;
      }
    } else {
      delivered = false;
    }

    if (devCode && !delivered) {
      const cloned = NextResponse.json({ success: true, message: "Email service not configured. Development reset code provided.", devCode: code });
      return cloned;
    }
    if (!delivered && !devCode) {
      return NextResponse.json({ success: true, message: "If this email is registered, a reset code has been sent." });
    }
    return generic;
  } catch {
    return NextResponse.json({ error: "Reset request failed" }, { status: 500 });
  }
}
