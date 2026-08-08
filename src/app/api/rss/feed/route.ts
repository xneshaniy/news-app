import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(_request: NextRequest) {
  void _request;
  try {
    const articles = await prisma.article.findMany({
      take: 50,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        canonicalUrl: true,
        image: true,
        publishedAt: true,
        source: true,
        author: true,
        category: true,
      },
    });

    const baseUrl = "https://worldlive.dpdns.org";

    const rssItems = articles.map((article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <description><![CDATA[${article.description || ""}]]></description>
      <content:encoded><![CDATA[${article.content || article.description || ""}]]></content:encoded>
      <link>${baseUrl}/article/${article.id}</link>
      <guid isPermaLink="true">${baseUrl}/article/${article.id}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <dc:creator><![CDATA[${article.author || article.source}]]></dc:creator>
      <category><![CDATA[${article.category || "General"}]]></category>
      ${article.image ? `<enclosure url="${article.image}" type="image/jpeg" />` : ""}
    </item>
  `).join("");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>WorldLive - World News from Every Country</title>
    <description>Stay informed with breaking news, politics, business, technology, sports, entertainment, health, and science from around the world.</description>
    <link>${baseUrl}</link>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>WorldLive RSS Generator</generator>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>WorldLive</title>
      <link>${baseUrl}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("RSS feed generation error:", error);
    return NextResponse.json({ error: "Failed to generate RSS feed" }, { status: 500 });
  }
}