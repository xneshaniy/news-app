import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getAdminEmail } from "@/lib/admin-store";
import { createResetCode } from "@/lib/reset-store";
import { validateEmail } from "@/lib/validation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://worldlive.dpdns.org";

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

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: "WorldLive <onboarding@resend.dev>",
          to: [email],
          subject: "WorldLive Admin Password Reset",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
              <div style="background: #2563eb; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 18px;">Password Reset Request</h1>
              </div>
              <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
                <p style="color: #334155; font-size: 15px; line-height: 1.6;">We received a request to reset your WorldLive admin password. Use the code below to set a new password. The code expires in 15 minutes.</p>
                <div style="background: #eff6ff; border: 1px dashed #93c5fd; border-radius: 8px; text-align: center; padding: 16px; margin: 16px 0;">
                  <span style="font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #1d4ed8;">${code}</span>
                </div>
                <p style="color: #64748b; font-size: 13px;">If you did not request this, you can safely ignore this email.</p>
              </div>
              <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 12px;">
                <a href="${SITE_URL}/admin/login" style="color: #2563eb;">WorldLive Admin</a>
              </div>
            </div>
          `,
        });
      } catch {
        // email delivery failure is non-fatal; dev mode returns code below
      }
    }

    // In dev (no Resend key) the code is returned so the flow can be tested.
    const response = generic;
    if (!apiKey) {
      const cloned = NextResponse.json({ success: true, message: "Email service not configured. Development reset code provided.", devCode: code });
      return cloned;
    }
    return response;
  } catch {
    return NextResponse.json({ error: "Reset request failed" }, { status: 500 });
  }
}
