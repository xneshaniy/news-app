import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
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
