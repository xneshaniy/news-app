import { NextRequest, NextResponse } from "next/server";
import { API_KEYS, getCategoryQuery } from "@/lib/constants";
import { Article } from "@/types/news";
import { fetchWithTimeout, sanitizeString } from "@/lib/api-utils";
import { normalizeNewsArticle, upsertNewsArticle } from "@/lib/news-storage";

const VALID_COUNTRIES = new Set([
  "us","gb","in","pk","ca","au","de","fr","jp","cn","br","za",
  "ae","sa","ng","eg","tr","ru","it","es","kr","mx","ar","se",
  "no","fi","nl","be","ch","at","pt","pl","cz","ro","bg","hr",
]);
const VALID_CATEGORIES = new Set([
  "breaking","politics","business","technology","sports",
  "entertainment","health","science",
]);

interface RawArticle {
  id?: string;
  title?: string;
  description?: string | null;
  content?: string | null;
  text?: string;
  url?: string;
  urlToImage?: string;
  image?: string;
  publishedAt?: string;
  published_at?: string;
  publish_date?: string;
  date?: string;
  source?: { name?: string; url?: string };
  summary?: string;
  body?: string;
  categories?: string[];
  [key: string]: unknown;
}

interface RawApiResponse {
  articles: RawArticle[];
  totalResults: number;
}

async function fetchAndPersist(
  fetcher: () => Promise<RawApiResponse>,
  source: string
): Promise<{ articles: Article[]; totalResults: number }> {
  try {
    const result = await fetcher();
    const persistedArticles: Article[] = [];

    for (const rawArticle of result.articles) {
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

    return { articles: persistedArticles, totalResults: persistedArticles.length };
  } catch (error) {
    console.error(`Error fetching from ${source}:`, error);
    return { articles: [], totalResults: 0 };
  }
}

async function fetchNewsAPI(
  query: string,
  country: string,
  page: number,
  pageSize: number
): Promise<RawApiResponse> {
  const from = new Date();
  from.setDate(from.getDate() - 7);
  const fromDate = from.toISOString().split("T")[0];

  const url = `https://newsapi.org/v2/top-headlines?q=${encodeURIComponent(query)}&country=${country}&page=${page}&pageSize=${pageSize}&from=${fromDate}&apiKey=${API_KEYS.newsapi}`;
  const res = await fetchWithTimeout(url, { next: { revalidate: 300 }, timeout: 8000 });
  if (!res.ok) return { articles: [], totalResults: 0 };
  const data = await res.json();

  const rawArticles: RawArticle[] = (data.articles || [])
    .filter((a: { title: string; url: string }) => a.title && a.title !== "[Removed]" && a.url)
    .map((a: RawArticle) => ({
      title: a.title,
      description: a.description || "",
      content: a.content || a.description || "",
      url: a.url,
      image: a.urlToImage || "",
      publishedAt: a.publishedAt,
      source: { name: a.source?.name || "Unknown", url: a.source?.url || "" },
    }));

  return { articles: rawArticles, totalResults: data.totalResults || 0 };
}

async function fetchGNews(
  query: string,
  country: string,
  page: number,
  pageSize: number
): Promise<RawApiResponse> {
  const gnewsCountryMap: Record<string, string> = {
    us: "united states", gb: "united kingdom", in: "india", pk: "pakistan",
    ca: "canada", au: "australia", de: "germany", fr: "france",
    jp: "japan", cn: "china", br: "brazil", za: "south africa",
    ae: "united arab emirates", sa: "saudi arabia", ng: "nigeria",
    eg: "egypt", tr: "turkey", ru: "russia", it: "italy", es: "spain",
  };

  const countryName = gnewsCountryMap[country] || country;
  const max = Math.min(pageSize, 10);
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=${countryName}&max=${max}&page=${page}&apikey=${API_KEYS.gnews}`;
  const res = await fetchWithTimeout(url, { next: { revalidate: 300 }, timeout: 8000 });
  if (!res.ok) return { articles: [], totalResults: 0 };
  const data = await res.json();

  const rawArticles: RawArticle[] = (data.articles || []).map(
    (a: RawArticle) => ({
      title: a.title,
      description: a.description || "",
      content: a.content || a.description || "",
      url: a.url,
      image: a.image || "",
      publishedAt: a.publishedAt,
      source: { name: a.source?.name || "Unknown", url: a.source?.url || "" },
    })
  );

  return { articles: rawArticles, totalResults: data.totalArticles || rawArticles.length };
}

async function fetchMediaStack(
  query: string,
  country: string,
  page: number,
  pageSize: number
): Promise<RawApiResponse> {
  const msCountry = country;
  const limit = Math.min(pageSize, 25);
  const offset = (page - 1) * limit;
  const url = `https://api.mediastack.com/v1/news?access_key=${API_KEYS.mediastack}&keywords=${encodeURIComponent(query)}&countries=${msCountry}&limit=${limit}&offset=${offset}`;
  const res = await fetchWithTimeout(url, { next: { revalidate: 300 }, timeout: 8000 });
  if (!res.ok) return { articles: [], totalResults: 0 };
  const data = await res.json();

  const rawArticles: RawArticle[] = (data.data || []).map(
    (a: RawArticle) => ({
      title: a.title,
      description: a.description || "",
      content: a.body || a.description || "",
      url: a.url,
      image: a.image || "",
      publishedAt: a.published_at,
      source: { name: a.source || "Unknown", url: "" },
    })
  );

  return { articles: rawArticles, totalResults: data.pagination?.total || rawArticles.length };
}

async function fetchWorldNewsAPI(
  query: string,
  country: string,
  page: number,
  pageSize: number
): Promise<RawApiResponse> {
  const url = `https://api.worldnewsapi.com/search-news?api-key=${API_KEYS.worldnewsapi}&text=${encodeURIComponent(query)}&source-countries=${country}&number=${Math.min(pageSize, 10)}&offset=${(page - 1) * Math.min(pageSize, 10)}`;
  const res = await fetchWithTimeout(url, { next: { revalidate: 300 }, timeout: 8000 });
  if (!res.ok) return { articles: [], totalResults: 0 };
  const data = await res.json();

  const rawArticles: RawArticle[] = (data.news || []).map(
    (a: RawArticle) => ({
      title: a.title,
      description: a.text?.substring(0, 200) || "",
      content: a.text || "",
      url: a.url || "",
      image: a.image || "",
      publishedAt: a.publish_date || new Date().toISOString(),
      source: { name: a.source || "WorldNewsAPI", url: "" },
    })
  );

  return { articles: rawArticles, totalResults: data.available || rawArticles.length };
}

async function fetchNewsApiAi(
  query: string,
  country: string,
  page: number,
  pageSize: number
): Promise<RawApiResponse> {
  const url = `https://newsapi.ai/api/v1/article/getArticles?apiKey=${API_KEYS.newsapiAi}&query=${encodeURIComponent(query)}&source=${country}&articlesPage=${page}&articlesCount=${Math.min(pageSize, 10)}`;
  const res = await fetchWithTimeout(url, { next: { revalidate: 300 }, timeout: 8000 });
  if (!res.ok) return { articles: [], totalResults: 0 };
  const data = await res.json();

  const rawArticles: RawArticle[] = (data.posts || []).map(
    (a: RawArticle) => ({
      title: a.title || "",
      description: a.summary || "",
      content: a.body || a.summary || "",
      url: a.url || "",
      image: a.image || "",
      publishedAt: a.date || new Date().toISOString(),
      source: { name: a.source?.name || "NewsAPI.ai", url: "" },
    })
  );

  return { articles: rawArticles, totalResults: data.totals?.articles || rawArticles.length };
}

async function fetchApitube(
  query: string,
  country: string,
  page: number,
  pageSize: number
): Promise<RawApiResponse> {
  const limit = Math.min(pageSize, 10);
  const url = `https://api.apitube.io/v1/news/everything?q=${encodeURIComponent(query)}&language=en&countries=${country.toUpperCase()}&per_page=${limit}&page=${page}`;
  const res = await fetchWithTimeout(url, {
    headers: { "X-API-Key": API_KEYS.apitube },
    next: { revalidate: 300 },
    timeout: 8000,
  });
  if (!res.ok) return { articles: [], totalResults: 0 };
  const data = await res.json();

  const rawArticles: RawArticle[] = (data.data || []).map(
    (a: RawArticle) => ({
      title: a.title || "",
      description: a.description || "",
      content: a.body || a.description || "",
      url: a.url || "",
      image: a.image || "",
      publishedAt: a.published_at || new Date().toISOString(),
      source: { name: a.source?.name || "APITube", url: a.source?.url || "" },
      category: a.categories?.[0],
    })
  );

  return { articles: rawArticles, totalResults: data.total || rawArticles.length };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = sanitizeString(searchParams.get("q") || "news", 200);
  const country = (searchParams.get("country") || "us").toLowerCase();
  const category = sanitizeString(searchParams.get("category") || "", 50);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "20") || 20));

  const safeCountry = VALID_COUNTRIES.has(country) ? country : "us";
  const safeCategory = VALID_CATEGORIES.has(category) ? category : "";
  const finalQuery = safeCategory ? getCategoryQuery(safeCategory) : query;

  const [newsApiResult, gnewsResult, mediaStackResult, worldNewsResult, newsApiAiResult, apitubeResult] =
    await Promise.all([
      fetchAndPersist(() => fetchNewsAPI(finalQuery, safeCountry, page, pageSize), "newsapi"),
      fetchAndPersist(() => fetchGNews(finalQuery, safeCountry, page, Math.min(pageSize, 10)), "gnews"),
      fetchAndPersist(() => fetchMediaStack(finalQuery, safeCountry, page, Math.min(pageSize, 10)), "mediastack"),
      fetchAndPersist(() => fetchWorldNewsAPI(finalQuery, safeCountry, page, Math.min(pageSize, 10)), "worldnewsapi"),
      fetchAndPersist(() => fetchNewsApiAi(finalQuery, safeCountry, page, Math.min(pageSize, 10)), "newsapiAi"),
      fetchAndPersist(() => fetchApitube(finalQuery, safeCountry, page, Math.min(pageSize, 10)), "apitube"),
    ]);

  const allArticles = [
    ...newsApiResult.articles,
    ...gnewsResult.articles,
    ...mediaStackResult.articles,
    ...worldNewsResult.articles,
    ...newsApiAiResult.articles,
    ...apitubeResult.articles,
  ];

  const seen = new Set<string>();
  const uniqueArticles = allArticles.filter((article) => {
    const key = article.url.toLowerCase().trim();
    if (seen.has(key) || !article.url) return false;
    seen.add(key);
    return true;
  });

  uniqueArticles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return NextResponse.json({
    articles: uniqueArticles.slice(0, pageSize),
    totalResults: uniqueArticles.length,
    sources: {
      newsapi: newsApiResult.articles.length,
      gnews: gnewsResult.articles.length,
      mediastack: mediaStackResult.articles.length,
      worldnewsapi: worldNewsResult.articles.length,
      newsapiAi: newsApiAiResult.articles.length,
      apitube: apitubeResult.articles.length,
    },
  });
}