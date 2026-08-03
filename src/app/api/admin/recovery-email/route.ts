import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/admin-store";

export async function GET() {
  const email = getAdminEmail();
  return NextResponse.json({ email });
}
