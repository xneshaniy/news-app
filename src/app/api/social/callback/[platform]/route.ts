import { NextRequest, NextResponse } from "next/server";
import { connectAccount, platformNameForKey, getPlatformCreds } from "@/lib/social-store";

interface CallbackContext {
  params: Promise<{ platform: string }>;
}

export async function GET(request: NextRequest, context: CallbackContext) {
  try {
    const { platform } = await context.params;
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/social?error=${encodeURIComponent(
          errorDescription || `Authorization failed for ${platformNameForKey(platform)}`
        )}`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/social?error=${encodeURIComponent("Missing authorization code from provider")}`
      );
    }

    const creds = getPlatformCreds(platform);
    if (!creds) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/social?error=${encodeURIComponent("Provider credentials are not configured. Add Client ID and Client Secret to environment variables.")}`
      );
    }

    const result = connectAccount(platform, true);
    if ("error" in result) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/social?error=${encodeURIComponent(result.error)}`
      );
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/social?connected=${encodeURIComponent(`${result.platform} connected successfully.`)}`
    );
  } catch {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/social?error=${encodeURIComponent("OAuth callback failed. Please try again.")}`
    );
  }
}
