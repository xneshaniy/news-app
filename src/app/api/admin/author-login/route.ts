import { NextRequest, NextResponse } from "next/server";
import { signAuthorToken } from "@/lib/auth";
import { verifyAuthorCredentials } from "@/lib/author-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body?.email || !body?.password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    if (typeof body.email !== "string" || typeof body.password !== "string") {
      return NextResponse.json({ error: "Invalid credentials format" }, { status: 400 });
    }

    const author = verifyAuthorCredentials(body.email, body.password);
    if (!author) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await signAuthorToken({
      email: author.email,
      role: author.role,
      name: author.name,
    });
    const response = NextResponse.json({ success: true, author });

    response.cookies.set("author-session", token, {
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
