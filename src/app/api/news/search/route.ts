import { NextRequest, NextResponse } from "next/server";
import { API_KEYS } from "@/lib/constants";
import { Article } from "@/types/news";
import { normalizeNewsArticle, upsertNewsArticle } from "@/lib/news-storage";

interface RawArticle {
  id?: string;
  title: string;
  description?: string | null;
  content?: string | null;
  url: string;
  image?: string;
  publishedAt?: string;
  source?: { name: string; url?: string };
  [key: string]: unknown;
}

async function fetchAndPersist(
  fetcher: () => Promise<RawArticle[]>,
  source: string
): Promise<Article[]> {
  try {
    const rawArticles = await fetcher();
    const persistedArticles: Article[] = [];

    for (const rawArticle of rawArticles) {
      const normalized = normalizeNewsArticle(rawArticle, source);
      const dbArticle = await upsertNewsArticle(normalized);

      persistedArticles.push({
        id: dbArticle.id,
        title: dbArticle.title,
        description: dbArticle.description || "",
        content: dbArticle.content || "",
        url: dbArticle.canonicalUrl,
        image: dbArticle.image || "",
        publishedAt: dbArticle.publishedAt.toISOString(),
        source: { name: dbArticle.source, url: "" },
        category: dbArticle.category || undefined,
        country: dbArticle.country || undefined,
      });
    }

    return persistedArticles;
  } catch (error) {
    console.error(`Error fetching from ${source}:`, error);
    return [];
  }
}

async function searchNewsAPI(
  query: string,
  page: number,
  pageSize: number
): Promise<RawArticle[]> {
  const from = new Date();
  from.setDate(from.getDate() - 30);
  const fromDate = from.toISOString().split("T")[0];

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}&from=${fromDate}&sortBy=relevancy&apiKey=${API_KEYS.newsapi}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return [];
  const data = await res.json();

  return (data.articles || [])
    .filter((a: { title: string; url: string }) => a.title && a.title !== "[Removed]" && a.url)
    .map((a: { title: string; description: string; content: string; urlToImage: string; url: string; publishedAt: string; source: { name: string; url: string } }) => ({
      title: a.title,
      description: a.description || "",
      content: a.content || a.description || "",
      url: a.url,
      image: a.urlToImage || "",
      publishedAt: a.publishedAt,
      source: { name: a.source?.name || "Unknown", url: a.source?.url || "" },
    }));
}

async function searchGNews(
  query: string,
  page: number,
  pageSize: number
): Promise<RawArticle[]> {
  const max = Math.min(pageSize, 10);
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=${max}&page=${page}&apikey=${API_KEYS.gnews}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return [];
  const data = await res.json();

  return (data.articles || []).map(
    (a: { title: string; description: string; content: string; url: string; image: string; publishedAt: string; source: { name: string; url: string } }) => ({
      title: a.title,
      description: a.description || "",
      content: a.content || a.description || "",
      url: a.url,
      image: a.image || "",
      publishedAt: a.publishedAt,
      source: { name: a.source?.name || "Unknown", url: a.source?.url || "" },
    })
  );
}

async function searchApitube(
  query: string,
  page: number,
  pageSize: number
): Promise<RawArticle[]> {
  const limit = Math.min(pageSize, 10);
  const url = `https://api.apitube.io/v1/news/everything?q=${encodeURIComponent(query)}&language=en&per_page=${limit}&page=${page}`;
  const res = await fetch(url, {
    headers: { "X-API-Key": API_KEYS.apitube },
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  const data = await res.json();

  return (data.data || []).map(
    (a: {
      title: string;
      description: string;
      body: string;
      url: string;
      image: string;
      published_at: string;
      source: { name: string; url: string };
    }) => ({
      title: a.title || "",
      description: a.description || "",
      content: a.body || a.description || "",
      url: a.url || "",
      image: a.image || "",
      publishedAt: a.published_at || new Date().toISOString(),
      source: { name: a.source?.name || "APITube", url: a.source?.url || "" },
    })
  );
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
    fetchAndPersist(() => searchNewsAPI(query, page, pageSize), "newsapi"),
    fetchAndPersist(() => searchGNews(query, page, Math.min(pageSize, 10)), "gnews"),
    fetchAndPersist(() => searchApitube(query, page, Math.min(pageSize, 10)), "apitube"),
  ]);

  const allArticles = [...newsApiArticles, ...gnewsArticles, ...apitubeArticles];

  const seen = new Set<string>();
  const uniqueArticles = allArticles.filter((article) => {
    const key = article.url.toLowerCase().trim();
    if (seen.has(key) || !article.url) return false;
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