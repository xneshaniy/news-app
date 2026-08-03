import { NextRequest, NextResponse } from "next/server";
import { verifyResetCode } from "@/lib/reset-store";
import { updateAdminConfig, getAdminEmail } from "@/lib/admin-store";
import { validateEmail } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const email = body?.email;
    const code = body?.code;
    const newPassword = body?.newPassword;

    if (typeof email !== "string" || !validateEmail(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    if (typeof code !== "string" || !code.trim()) {
      return NextResponse.json({ error: "Reset code required" }, { status: 400 });
    }
    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
    }

    if (email.trim().toLowerCase() !== getAdminEmail().toLowerCase()) {
      return NextResponse.json({ error: "Email does not match the registered admin email" }, { status: 400 });
    }

    if (!verifyResetCode(email, code)) {
      return NextResponse.json({ error: "Invalid or expired reset code" }, { status: 400 });
    }

    updateAdminConfig({ password: newPassword });
    return NextResponse.json({ success: true, message: "Password reset successfully. You can now sign in." });
  } catch {
    return NextResponse.json({ error: "Reset failed" }, { status: 500 });
  }
}
