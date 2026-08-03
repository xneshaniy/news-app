import { NextResponse } from "next/server";

export async function GET() {
  const email = process.env.ADMIN_EMAIL || "";
  return NextResponse.json({ email });
}
