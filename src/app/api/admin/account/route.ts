import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { getAdminEmail, verifyAdminCredentials, updateAdminConfig } from "@/lib/admin-store";
import { validateEmail } from "@/lib/validation";
import { sendPasswordChangeConfirmation, sendEmailChangeVerification, isFeatureEnabled } from "@/lib/email-service";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("admin-session");
  if (!session?.value || !(await verifyAdminToken(session.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ email: getAdminEmail() });
}

export async function PUT(request: NextRequest) {
  try {
    const session = request.cookies.get("admin-session");
    if (!session?.value || !(await verifyAdminToken(session.value))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const currentPassword = body?.currentPassword;
    const newPassword = body?.newPassword;
    const newEmail = body?.newEmail;

    if (typeof currentPassword !== "string" || !currentPassword) {
      return NextResponse.json({ error: "Current password is required" }, { status: 400 });
    }

    if (!verifyAdminCredentials(currentPassword)) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    if (newEmail !== undefined) {
      if (typeof newEmail !== "string" || !validateEmail(newEmail)) {
        return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
      }
    }

    if (newPassword !== undefined && newPassword !== "") {
      if (typeof newPassword !== "string" || newPassword.length < 8) {
        return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
      }
    }

    if (newEmail === undefined && (newPassword === undefined || newPassword === "")) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const result = updateAdminConfig({
      email: typeof newEmail === "string" && newEmail !== "" ? newEmail : undefined,
      password: typeof newPassword === "string" && newPassword !== "" ? newPassword : undefined,
    });

    const adminEmail = getAdminEmail();
    if (newPassword && newPassword !== "" && isFeatureEnabled("passwordChange")) {
      try {
        await sendPasswordChangeConfirmation(adminEmail);
      } catch {
        // notification failure is non-fatal
      }
    }

    return NextResponse.json({ success: true, email: result.email });
  } catch {
    return NextResponse.json({ error: "Failed to update account" }, { status: 500 });
  }
}
