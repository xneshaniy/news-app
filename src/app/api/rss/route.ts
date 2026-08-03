import { NextRequest, NextResponse } from "next/server";

const PRIVATE_IP_PATTERN = /^(0\.|10\.|127\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|::1$|fe80:|fc00:|fd00:|[fF][eE]80:|localhost)/;

function isBlockedTarget(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return true;
    const host = parsed.hostname.toLowerCase();
    if (host === "localhost" || host.endsWith(".local")) return true;
    return PRIVATE_IP_PATTERN.test(host);
  } catch {
    return true;
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  if (isBlockedTarget(url)) {
    return NextResponse.json({ error: "URL not allowed" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "WorldLive RSS Reader/1.0",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch feed" }, { status: 502 });
    }

    const content = await res.text();
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ error: "Failed to fetch feed" }, { status: 502 });
  }
}
