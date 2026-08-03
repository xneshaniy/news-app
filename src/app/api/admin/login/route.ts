import { NextRequest, NextResponse } from "next/server";
import { signAdminToken } from "@/lib/auth";
import { verifyAdminCredentials } from "@/lib/admin-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body?.password || typeof body.password !== "string") {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    if (!verifyAdminCredentials(body.password)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = await signAdminToken();
    const response = NextResponse.json({ success: true });

    response.cookies.set("admin-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 86400,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
