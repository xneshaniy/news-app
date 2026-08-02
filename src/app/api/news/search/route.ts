import { NextRequest, NextResponse } from "next/server";
import { API_KEYS } from "@/lib/constants";
import { Article } from "@/types/news";

async function searchNewsAPI(
  query: string,
  page: number,
  pageSize: number
): Promise<Article[]> {
  try {
    const from = new Date();
    from.setDate(from.getDate() - 30);
    const fromDate = from.toISOString().split("T")[0];

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}&from=${fromDate}&sortBy=relevancy&apiKey=${API_KEYS.newsapi}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();

    return (data.articles || [])
      .filter((a: { title: string; url: string }) => a.title && a.title !== "[Removed]" && a.url)
      .map((a: { title: string; description: string; content: string; urlToImage: string; url: string; publishedAt: string; source: { name: string; url: string } }, i: number) => ({
        id: `search-newsapi-${page}-${i}-${Date.now()}`,
        title: a.title,
        description: a.description || "",
        content: a.content || a.description || "",
        url: a.url,
        image: a.urlToImage || "",
        publishedAt: a.publishedAt,
        source: { name: a.source?.name || "Unknown", url: a.source?.url || "" },
      }));
  } catch {
    return [];
  }
}

async function searchGNews(
  query: string,
  page: number,
  pageSize: number
): Promise<Article[]> {
  try {
    const max = Math.min(pageSize, 10);
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=${max}&page=${page}&apikey=${API_KEYS.gnews}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();

    return (data.articles || []).map(
      (
        a: { title: string; description: string; content: string; url: string; image: string; publishedAt: string; source: { name: string; url: string } },
        i: number
      ) => ({
        id: `search-gnews-${page}-${i}-${Date.now()}`,
        title: a.title,
        description: a.description || "",
        content: a.content || a.description || "",
        url: a.url,
        image: a.image || "",
        publishedAt: a.publishedAt,
        source: { name: a.source?.name || "Unknown", url: a.source?.url || "" },
      })
    );
  } catch {
    return [];
  }
}

async function searchApitube(
  query: string,
  page: number,
  pageSize: number
): Promise<Article[]> {
  try {
    const limit = Math.min(pageSize, 10);
    const url = `https://api.apitube.io/v1/news/everything?q=${encodeURIComponent(query)}&language=en&per_page=${limit}&page=${page}`;
    const res = await fetch(url, {
      headers: { "X-API-Key": API_KEYS.apitube },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();

    return (data.data || []).map(
      (
        a: {
          title: string;
          description: string;
          body: string;
          url: string;
          image: string;
          published_at: string;
          source: { name: string; url: string };
        },
        i: number
      ) => ({
        id: `search-apitube-${page}-${i}-${Date.now()}`,
        title: a.title || "",
        description: a.description || "",
        content: a.body || a.description || "",
        url: a.url || "",
        image: a.image || "",
        publishedAt: a.published_at || new Date().toISOString(),
        source: { name: a.source?.name || "APITube", url: a.source?.url || "" },
      })
    );
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "20");

  if (!query.trim()) {
    return NextResponse.json({ articles: [], totalResults: 0 });
  }

  const [newsApiArticles, gnewsArticles, apitubeArticles] = await Promise.all([
    searchNewsAPI(query, page, pageSize),
    searchGNews(query, page, Math.min(pageSize, 10)),
    searchApitube(query, page, Math.min(pageSize, 10)),
  ]);

  const allArticles = [...newsApiArticles, ...gnewsArticles, ...apitubeArticles];

  const seen = new Set<string>();
  const uniqueArticles = allArticles.filter((article) => {
    const key = article.title.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  uniqueArticles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return NextResponse.json({
    articles: uniqueArticles.slice(0, pageSize),
    totalResults: uniqueArticles.length,
    sources: {
      newsapi: newsApiArticles.length,
      gnews: gnewsArticles.length,
      apitube: apitubeArticles.length,
    },
  });
}
