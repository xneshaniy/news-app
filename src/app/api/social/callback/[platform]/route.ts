import { NextRequest, NextResponse } from "next/server";
import { connectAccount, platformNameForKey, getPlatformCreds } from "@/lib/social-store";

interface CallbackContext {
  params: Promise<{ platform: string }>;
}

function redirect(path: string): NextResponse {
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}${path}`);
}

async function exchangeCode(platform: string, code: string): Promise<{ accessToken: string; handle: string } | { error: string }> {
  const creds = getPlatformCreds(platform);
  if (!creds) return { error: "Provider credentials are not configured. Add Client ID and Client Secret to environment variables." };

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const redirectUri = `${base}/api/social/callback/${platform}`;

  const tokenUrlMap: Record<string, string> = {
    facebook: "https://graph.facebook.com/v18.0/oauth/access_token",
    linkedin: "https://www.linkedin.com/oauth/v2/accessToken",
    instagram: "https://api.instagram.com/oauth/access_token",
    youtube: "https://oauth2.googleapis.com/token",
    tiktok: "https://open.tiktokapis.com/v2/oauth/token/",
    x: "https://api.x.com/2/oauth2/token",
  };

  try {
    if (platform === "facebook") {
      const params = new URLSearchParams({
        client_id: creds.clientId,
        client_secret: creds.clientSecret,
        redirect_uri: redirectUri,
        code,
      });
      const res = await fetch(`${tokenUrlMap.facebook}?${params}`);
      const data = await res.json();
      if (!res.ok || !data.access_token) return { error: data.error?.message || "Facebook token exchange failed" };
      const me = await fetch("https://graph.facebook.com/me?fields=name&access_token=" + data.access_token).then((r) => r.json());
      return { accessToken: data.access_token, handle: me.name || "@facebook" };
    }

    if (platform === "linkedin") {
      const form = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: creds.clientId,
        client_secret: creds.clientSecret,
      });
      const res = await fetch(tokenUrlMap.linkedin, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: form });
      const data = await res.json();
      if (!res.ok || !data.access_token) return { error: data.error_description || "LinkedIn token exchange failed" };
      const me = await fetch("https://api.linkedin.com/v2/userinfo", { headers: { Authorization: `Bearer ${data.access_token}` } }).then((r) => r.json());
      return { accessToken: data.access_token, handle: me.name || "LinkedIn account" };
    }

    if (platform === "instagram") {
      const form = new URLSearchParams({
        client_id: creds.clientId,
        client_secret: creds.clientSecret,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code,
      });
      const res = await fetch(tokenUrlMap.instagram, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: form });
      const data = await res.json();
      if (!res.ok || !data.access_token) return { error: "Instagram token exchange failed" };
      return { accessToken: data.access_token, handle: "@instagram" };
    }

    if (platform === "youtube") {
      const form = new URLSearchParams({
        code,
        client_id: creds.clientId,
        client_secret: creds.clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      });
      const res = await fetch(tokenUrlMap.youtube, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: form });
      const data = await res.json();
      if (!res.ok || !data.access_token) return { error: data.error_description || "YouTube token exchange failed" };
      const me = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", { headers: { Authorization: `Bearer ${data.access_token}` } }).then((r) => r.json());
      return { accessToken: data.access_token, handle: me.items?.[0]?.snippet?.title || "YouTube channel" };
    }

    if (platform === "tiktok") {
      const form = new URLSearchParams({
        client_key: creds.clientId,
        client_secret: creds.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      });
      const res = await fetch(tokenUrlMap.tiktok, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: form });
      const data = await res.json();
      if (!res.ok || !data.access_token) return { error: "TikTok token exchange failed" };
      return { accessToken: data.access_token, handle: "@tiktok" };
    }

    if (platform === "x") {
      const form = new URLSearchParams({
        code,
        client_id: creds.clientId,
        client_secret: creds.clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
        code_verifier: "challenge",
      });
      const res = await fetch(tokenUrlMap.x, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: form });
      const data = await res.json();
      if (!res.ok || !data.access_token) return { error: data.error_description || "X token exchange failed" };
      return { accessToken: data.access_token, handle: "@x" };
    }

    return { error: `Token exchange not implemented for ${platform}` };
  } catch {
    return { error: "Network error during token exchange" };
  }
}

export async function GET(request: NextRequest, context: CallbackContext) {
  try {
    const { platform } = await context.params;
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    const state = searchParams.get("state");

    if (error) {
      return redirect(`/admin/social?error=${encodeURIComponent(errorDescription || `Authorization failed for ${platformNameForKey(platform)}`)}`);
    }

    if (!code) {
      return redirect(`/admin/social?error=${encodeURIComponent("Missing authorization code from provider")}`);
    }

    const storedState = request.cookies.get("oauth_state")?.value;
    if (!state || !storedState || state !== storedState) {
      return redirect(`/admin/social?error=${encodeURIComponent("OAuth state validation failed. Please try connecting again.")}`);
    }

    const exchanged = await exchangeCode(platform, code);
    if ("error" in exchanged) {
      return redirect(`/admin/social?error=${encodeURIComponent(exchanged.error)}`);
    }

    const result = connectAccount(platform, true, exchanged.handle);
    if ("error" in result) {
      return redirect(`/admin/social?error=${encodeURIComponent(result.error)}`);
    }

    return redirect(`/admin/social?connected=${encodeURIComponent(`${result.platform} (${result.handle}) connected successfully.`)}`);
  } catch {
    return redirect(`/admin/social?error=${encodeURIComponent("OAuth callback failed. Please try again.")}`);
  }
}
