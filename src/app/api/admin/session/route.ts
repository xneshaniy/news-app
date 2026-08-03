import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, verifyAuthorToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const adminSession = request.cookies.get("admin-session");
    const authorSession = request.cookies.get("author-session");

    if (adminSession?.value && (await verifyAdminToken(adminSession.value))) {
      return NextResponse.json({ role: "admin", type: "admin", name: "Admin" });
    }

    if (authorSession?.value) {
      const author = await verifyAuthorToken(authorSession.value);
      if (author) {
        return NextResponse.json({ role: author.role, type: "author", name: author.name, email: author.email });
      }
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
