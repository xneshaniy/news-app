import fs from "fs";
import path from "path";

export interface ConnectedAccount {
  id: string;
  platform: string;
  handle: string;
  connected: boolean;
  connectedAt: string;
  lastPost: string;
  followers: string;
  engagement: string;
  posts: number;
  color: string;
  authProvider?: string;
  oauth?: boolean;
}

export const SOCIAL_PLATFORMS = [
  {
    key: "facebook",
    name: "Facebook",
    handle: "@WorldLiveDaily",
    color: "from-blue-600 to-blue-700",
  },
  {
    key: "x",
    name: "X (Twitter)",
    handle: "@WorldLiveDaily",
    color: "from-gray-800 to-black",
  },
  {
    key: "linkedin",
    name: "LinkedIn",
    handle: "WorldLive Inc.",
    color: "from-blue-700 to-blue-800",
  },
  {
    key: "instagram",
    name: "Instagram",
    handle: "@globalnews",
    color: "from-purple-500 to-pink-500",
  },
  {
    key: "youtube",
    name: "YouTube",
    handle: "WorldLive News",
    color: "from-red-500 to-red-600",
  },
  {
    key: "tiktok",
    name: "TikTok",
    handle: "@worldlive",
    color: "from-gray-900 to-gray-700",
  },
];

export const DEFAULT_ACCOUNTS: ConnectedAccount[] = [
  { id: "s1", platform: "Facebook", handle: "@WorldLiveDaily", connected: true, connectedAt: "2024-05-12", lastPost: "2 hours ago", followers: "245K", engagement: "3.2%", posts: 1234, color: "from-blue-600 to-blue-700", oauth: true },
  { id: "s2", platform: "X (Twitter)", handle: "@WorldLiveDaily", connected: true, connectedAt: "2024-04-03", lastPost: "30 min ago", followers: "189K", engagement: "2.8%", posts: 4567, color: "from-gray-800 to-black", oauth: true },
  { id: "s3", platform: "LinkedIn", handle: "WorldLive Inc.", connected: true, connectedAt: "2024-06-21", lastPost: "1 hour ago", followers: "67K", engagement: "4.1%", posts: 890, color: "from-blue-700 to-blue-800", oauth: true },
];

let memoryStore: ConnectedAccount[] | null = null;

function loadStore(): ConnectedAccount[] {
  if (memoryStore) return memoryStore;
  try {
    const file = path.join(process.cwd(), "data", "social-accounts.json");
    if (fs.existsSync(file)) {
      const parsed = JSON.parse(fs.readFileSync(file, "utf-8")) as ConnectedAccount[];
      memoryStore = parsed;
      return parsed;
    }
  } catch {
    // fall through to defaults
  }
  memoryStore = DEFAULT_ACCOUNTS.map((a) => ({ ...a }));
  return memoryStore;
}

function persist() {
  if (!memoryStore) return;
  try {
    const dir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "social-accounts.json"), JSON.stringify(memoryStore, null, 2), "utf-8");
  } catch {
    // read-only filesystem — in-memory store still works for this process
  }
}

export function getSocialAccounts(): ConnectedAccount[] {
  return loadStore();
}

export function connectAccount(platformKey: string, oauth: boolean, handle?: string): ConnectedAccount | { error: string } {
  const platform = SOCIAL_PLATFORMS.find((p) => p.key === platformKey);
  if (!platform) return { error: "Unsupported platform" };

  const existing = loadStore().find((a) => a.platform === platform.name);
  if (existing) return { error: `This account (${existing.handle}) is already connected to ${platform.name}` };

  const account: ConnectedAccount = {
    id: `s-${Date.now()}`,
    platform: platform.name,
    handle: handle || platform.handle,
    connected: true,
    connectedAt: new Date().toISOString().slice(0, 10),
    lastPost: "Never",
    followers: "0",
    engagement: "0%",
    posts: 0,
    color: platform.color,
    oauth,
  };
  memoryStore = [account, ...loadStore()];
  persist();
  return account;
}

export function disconnectAccount(id: string): ConnectedAccount | null {
  const store = loadStore();
  const idx = store.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const [removed] = store.splice(idx, 1);
  memoryStore = store;
  persist();
  return removed;
}

export function getPlatformCreds(platformKey: string): { clientId: string; clientSecret: string } | null {
  const map: Record<string, { id: string; secret: string }> = {
    facebook: { id: "FACEBOOK_CLIENT_ID", secret: "FACEBOOK_CLIENT_SECRET" },
    x: { id: "TWITTER_CLIENT_ID", secret: "TWITTER_CLIENT_SECRET" },
    linkedin: { id: "LINKEDIN_CLIENT_ID", secret: "LINKEDIN_CLIENT_SECRET" },
    instagram: { id: "INSTAGRAM_CLIENT_ID", secret: "INSTAGRAM_CLIENT_SECRET" },
    youtube: { id: "YOUTUBE_CLIENT_ID", secret: "YOUTUBE_CLIENT_SECRET" },
    tiktok: { id: "TIKTOK_CLIENT_KEY", secret: "TIKTOK_CLIENT_SECRET" },
  };
  const cfg = map[platformKey];
  if (!cfg) return null;
  const clientId = process.env[cfg.id];
  const clientSecret = process.env[cfg.secret];
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

export function getPlatformAuthUrl(platformKey: string): string | null {
  const creds = getPlatformCreds(platformKey);
  if (!creds) return null;
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const redirectUri = `${base}/api/social/callback/${platformKey}`;
  const state = Buffer.from(`worldlive:${Date.now()}:${platformKey}`).toString("base64url");
  const urls: Record<string, string> = {
    facebook: `https://www.facebook.com/v18.0/dialog/oauth?client_id=${creds.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=pages_show_list,pages_manage_posts,public_profile`,
    x: `https://x.com/i/oauth2/authorize?response_type=code&client_id=${creds.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=tweet.read%20users.read%20offline.access&state=${state}&code_challenge=challenge&code_challenge_method=plain`,
    linkedin: `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${creds.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=w_member_social%20r_liteprofile&state=${state}`,
    instagram: `https://api.instagram.com/oauth/authorize?client_id=${creds.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=instagram_business_basic%2Cinstagram_business_manage_comments%2Cinstagram_business_manage_content&response_type=code&state=${state}`,
    youtube: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${creds.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.upload&state=${state}`,
    tiktok: `https://www.tiktok.com/v2/auth/authorize/?client_key=${creds.clientId}&scope=user.info.basic,video.publish&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`,
  };
  return urls[platformKey] || null;
}

export function platformNameForKey(key: string): string {
  return SOCIAL_PLATFORMS.find((p) => p.key === key)?.name || key;
}
