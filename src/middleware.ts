import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT_MAP = new Map<string, { count: number; resetTime: number }>();
const BLOCKED_IPS = new Set<string>();
const API_KEY_HEADER = "x-api-key";

const SECURITY_HEADERS: Record<string, string> = {
  "X-DNS-Prefetch-Control": "on",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-XSS-Protection": "1; mode=block",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "X-Permitted-Cross-Domain-Policies": "none",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.open-meteo.com https://api.coingecko.com https://openrouter.ai https://www.alphavantage.co https://api.twelvedata.com https://*.resend.com",
    "frame-src 'self' https://www.youtube.com https://www.google.com https://www.youtube-nocookie.com",
    "media-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests",
  ].join("; "),
};

const RATE_LIMITS: Record<string, { max: number; window: number }> = {
  "/api/admin/login": { max: 5, window: 300000 },
  "/api/admin/author-login": { max: 10, window: 300000 },
  "/api/": { max: 60, window: 60000 },
  "/api/ai": { max: 10, window: 60000 },
  "/api/email": { max: 5, window: 60000 },
  "/api/graphql": { max: 30, window: 60000 },
  "/api/news": { max: 30, window: 60000 },
};

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

function checkRateLimit(key: string, limit: { max: number; window: number }): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT_MAP.get(key);
  if (!entry || now > entry.resetTime) {
    RATE_LIMIT_MAP.set(key, { count: 1, resetTime: now + limit.window });
    return true;
  }
  if (entry.count >= limit.max) return false;
  entry.count++;
  return true;
}

function detectThreats(request: NextRequest): string | null {
  const url = request.nextUrl.pathname + request.nextUrl.search;
  const ua = request.headers.get("user-agent") || "";

  const sqlPatterns = [/union\s+select/i, /;\s*drop\s+table/i, /'\s*or\s*'1'\s*=\s*'1/i, /insert\s+into/i, /--\s$/];
  for (const p of sqlPatterns) {
    if (p.test(url)) return "SQL injection attempt";
  }

  const xssPatterns = [/<script[\s>]/i, /javascript:/i, /on\w+\s*=/i, /data:text\/html/i, /<iframe/i];
  for (const p of xssPatterns) {
    if (p.test(url)) return "XSS attempt";
  }

  const pathTraversal = [/\.\.\//, /\.\.\\/, /%2e%2e/i, /%252e%252e/i];
  for (const p of pathTraversal) {
    if (p.test(url)) return "Path traversal attempt";
  }

  const blocked = [/\.env/i, /\.git/i, /\.svn/i, /\.htaccess/i, /wp-admin/i, /wp-login/i, /phpmyadmin/i, /\.well-known\/security/i];
  for (const p of blocked) {
    if (p.test(url)) return "Prohibited path access";
  }

  if (ua.toLowerCase().includes("bot") && !ua.includes("Googlebot") && !ua.includes("Bingbot")) {
    return null;
  }

  return null;
}

function sanitizeHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  response.headers.delete("X-Powered-By");
  response.headers.delete("Server");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIP = getClientIP(request);

  if (BLOCKED_IPS.has(clientIP)) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const threat = detectThreats(request);
  if (threat) {
    console.warn(`[SECURITY] ${threat} from ${clientIP} on ${pathname}`);
    return NextResponse.json(
      { error: "Request blocked by security policy", reason: threat },
      { status: 403 }
    );
  }

  if (pathname.startsWith("/api/")) {
    let matched = false;
    for (const [pattern, limit] of Object.entries(RATE_LIMITS)) {
      if (pathname.startsWith(pattern)) {
        const key = `${clientIP}:${pattern}`;
        if (!checkRateLimit(key, limit)) {
          return NextResponse.json(
            { error: "Rate limit exceeded", retryAfter: Math.ceil(limit.window / 1000) },
            { status: 429, headers: { "Retry-After": String(Math.ceil(limit.window / 1000)) } }
          );
        }
        matched = true;
        break;
      }
    }
    if (!matched && !checkRateLimit(`${clientIP}:default`, { max: 100, window: 60000 })) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }
  }

  if (pathname.startsWith("/admin")) {
    const adminSession = request.cookies.get("admin-session");
    const authorSession = request.cookies.get("author-session");
    const session = adminSession?.value || authorSession?.value;
    if (pathname !== "/admin/login") {
      if (!session) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }
      const ADMIN_ONLY_PAGES = [
        "/admin/users", "/admin/authors", "/admin/rbac",
        "/admin/security", "/admin/advertisements", "/admin/subscriptions",
        "/admin/sources", "/admin/seo", "/admin/settings",
        "/admin/integrations", "/admin/activity",
      ];
      if (!adminSession?.value && ADMIN_ONLY_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    } else if (session) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/api/")) {
    if (pathname.startsWith("/api/admin/") && pathname !== "/api/admin/login" && pathname !== "/api/admin/author-login") {
      const adminSession = request.cookies.get("admin-session");
      const authorSession = request.cookies.get("author-session");
      const session = adminSession?.value || authorSession?.value;
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    if (pathname.startsWith("/api/ai") || pathname.startsWith("/api/email") || pathname.startsWith("/api/graphql")) {
      const session = request.cookies.get("admin-session");
      if (!session || !session.value) {
        return NextResponse.json({ error: "Admin access required" }, { status: 401 });
      }
    }

    const apiKey = request.headers.get(API_KEY_HEADER);
    if (pathname.startsWith("/api/news")) {
      // Public API endpoint
    } else if (apiKey) {
      const validKeys = (process.env.API_KEYS || "").split(",").filter(Boolean);
      if (validKeys.length > 0 && !validKeys.includes(apiKey)) {
        return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
      }
    }
  }

  const response = NextResponse.next();
  sanitizeHeaders(response);

  if (pathname.startsWith("/api/")) {
    response.headers.set("Access-Control-Allow-Origin", process.env.NEXT_PUBLIC_SITE_URL || "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key");
    response.headers.set("Access-Control-Max-Age", "86400");
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  }

  if (pathname === "/" || pathname.startsWith("/category/")) {
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  }

  if (pathname.startsWith("/article/")) {
    response.headers.set("Cache-Control", "public, s-maxage=600, stale-while-revalidate=1200");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons/|manifest.json|sw.js|yandex_5e3140fe1aeefc15.html|google[0-9a-f]+\.html|BingSiteAuth\.xml).*)",
  ],
};
