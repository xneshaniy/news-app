import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, verifyAuthorToken } from "@/lib/auth";
import {
  connectAccount,
  getSocialAccounts,
  disconnectAccount,
  getPlatformAuthUrl,
} from "@/lib/social-store";

async function requireAccess(request: NextRequest): Promise<boolean> {
  const adminSession = request.cookies.get("admin-session");
  if (adminSession?.value && (await verifyAdminToken(adminSession.value))) return true;
  const authorSession = request.cookies.get("author-session");
  if (authorSession?.value) {
    const author = await verifyAuthorToken(authorSession.value);
    if (author && (author.role === "admin" || author.role === "editor")) return true;
  }
  return false;
}

export async function GET(request: NextRequest) {
  if (!(await requireAccess(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ accounts: getSocialAccounts() });
}

export async function POST(request: NextRequest) {
  if (!(await requireAccess(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const platform = String(body?.platform || "").toLowerCase();

  if (!platform) {
    return NextResponse.json({ error: "Platform is required" }, { status: 400 });
  }

  const oauthUrl = getPlatformAuthUrl(platform);
  if (oauthUrl) {
    return NextResponse.json({ mode: "oauth", url: oauthUrl, message: "Redirecting to platform authorization..." });
  }

  const account = connectAccount(platform, false);
  if ("error" in account) {
    return NextResponse.json({ error: account.error }, { status: 400 });
  }
  return NextResponse.json({
    mode: "simulated",
    account,
    message: `${account.platform} connected successfully. To enable real OAuth publishing, add the platform's Client ID and Client Secret to your environment variables.`,
  });
}

export async function DELETE(request: NextRequest) {
  if (!(await requireAccess(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const removed = disconnectAccount(id);
  if (!removed) return NextResponse.json({ error: "Account not found" }, { status: 404 });
  return NextResponse.json({ success: true, account: removed, message: `${removed.platform} disconnected.` });
}
