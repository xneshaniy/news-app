import { NextResponse } from "next/server";
import { getAdminEmail, getRecoveryEmail } from "@/lib/email-config";

export async function GET() {
  return NextResponse.json({ email: getRecoveryEmail() || getAdminEmail() });
}
