import { NextRequest, NextResponse } from "next/server";
import { API_KEYS, getCategoryQuery } from "@/lib/constants";
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

async function fetchArticles(query: string, country: string): Promise<RawArticle[]> {
  const from = new Date();
  from.setDate(from.getDate() - 7);
  const fromDate = from.toISOString().split("T")[0];

  const url = `https://newsapi.org/v2/top-headlines?q=${encodeURIComponent(query)}&country=${country}&pageSize=10&from=${fromDate}&apiKey=${API_KEYS.newsapi}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return [];
  const data = await res.json();

  return (data.articles || [])
    .filter((a: RawArticle) => a.title && a.title !== "[Removed]" && a.url)
    .map((a: RawArticle) => ({
      id: a.id,
      title: a.title,
      description: a.description || "",
      content: a.content || a.description || "",
      url: a.url,
      image: a.urlToImage || "",
      publishedAt: a.publishedAt,
      source: { name: a.source?.name || "Unknown", url: a.source?.url || "" },
    }));
}

function extractTopics(text: string): string[] {
  const topicKeywords: Record<string, string[]> = {
    AI: ["ai", "artificial intelligence", "machine learning", "chatgpt", "openai"],
    Climate: ["climate", "global warming", "environment", "carbon", "emissions"],
    Economy: ["economy", "gdp", "inflation", "interest rate", "federal reserve"],
    Space: ["space", "nasa", "spacex", "rocket", "mars", "moon"],
    Health: ["health", "medical", "disease", "vaccine", "hospital"],
    Sports: ["football", "basketball", "soccer", "cricket", "tennis", "nba", "nfl"],
    Tech: ["technology", "apple", "google", "microsoft", "amazon", "startup"],
    Politics: ["election", "president", "congress", "senate", "vote"],
  };

  const lowerText = text.toLowerCase();
  const topics: string[] = [];

  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some((kw) => lowerText.includes(kw))) {
      topics.push(topic);
    }
  });

  return topics.length > 0 ? topics : ["General"];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const country = searchParams.get("country") || "us";
  const categories = ["technology", "business", "politics", "science", "health"];

  const queries = categories.map((cat) => getCategoryQuery(cat));

  const allArticles = await Promise.all(
    queries.map((query) => fetchAndPersist(() => fetchArticles(query, country), "newsapi"))
  );

  const flat = allArticles.flat();
  const seen = new Set<string>();
  const unique = flat.filter((a) => {
    const key = a.url.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const enriched = unique.map((article, i) => ({
    ...article,
    category: categories[i % categories.length],
    topics: extractTopics(article.title + " " + (article.description || "")),
  }));

  return NextResponse.json({
    recommendations: enriched.slice(0, 20),
    totalResults: enriched.length,
  });
}