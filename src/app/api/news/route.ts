import { NextRequest, NextResponse } from "next/server";
import { API_KEYS, getCategoryQuery } from "@/lib/constants";
import { Article } from "@/types/news";
import { fetchWithTimeout, sanitizeString } from "@/lib/api-utils";

const VALID_COUNTRIES = new Set([
  "us","gb","in","pk","ca","au","de","fr","jp","cn","br","za",
  "ae","sa","ng","eg","tr","ru","it","es","kr","mx","ar","se",
  "no","fi","nl","be","ch","at","pt","pl","cz","ro","bg","hr",
]);
const VALID_CATEGORIES = new Set([
  "breaking","politics","business","technology","sports",
  "entertainment","health","science",
]);

async function fetchNewsAPI(
  query: string,
  country: string,
  page: number,
  pageSize: number
): Promise<{ articles: Article[]; totalResults: number }> {
  try {
    const from = new Date();
    from.setDate(from.getDate() - 7);
    const fromDate = from.toISOString().split("T")[0];

    const url = `https://newsapi.org/v2/top-headlines?q=${encodeURIComponent(query)}&country=${country}&page=${page}&pageSize=${pageSize}&from=${fromDate}&apiKey=${API_KEYS.newsapi}`;
    const res = await fetchWithTimeout(url, { next: { revalidate: 300 }, timeout: 8000 });
    if (!res.ok) return { articles: [], totalResults: 0 };
    const data = await res.json();

    const articles: Article[] = (data.articles || [])
      .filter((a: { title: string; url: string }) => a.title && a.title !== "[Removed]" && a.url)
      .map((a: { title: string; description: string; content: string; urlToImage: string; url: string; publishedAt: string; source: { name: string; url: string } }, i: number) => ({
        id: `newsapi-${country}-${page}-${i}-${Date.now()}`,
        title: a.title,
        description: a.description || "",
        content: a.content || a.description || "",
        url: a.url,
        image: a.urlToImage || "",
        publishedAt: a.publishedAt,
        source: { name: a.source?.name || "Unknown", url: a.source?.url || "" },
      }));

    return { articles, totalResults: data.totalResults || 0 };
  } catch {
    return { articles: [], totalResults: 0 };
  }
}

async function fetchGNews(
  query: string,
  country: string,
  page: number,
  pageSize: number
): Promise<{ articles: Article[]; totalResults: number }> {
  try {
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

    const articles: Article[] = (data.articles || []).map(
      (a: { title: string; description: string; content: string; url: string; image: string; publishedAt: string; source: { name: string; url: string } }, i: number) => ({
        id: `gnews-${country}-${page}-${i}-${Date.now()}`,
        title: a.title, description: a.description || "",
        content: a.content || a.description || "", url: a.url,
        image: a.image || "", publishedAt: a.publishedAt,
        source: { name: a.source?.name || "Unknown", url: a.source?.url || "" },
      })
    );

    return { articles, totalResults: data.totalArticles || articles.length };
  } catch {
    return { articles: [], totalResults: 0 };
  }
}

async function fetchMediaStack(
  query: string,
  country: string,
  page: number,
  pageSize: number
): Promise<{ articles: Article[]; totalResults: number }> {
  try {
    const msCountry = country;
    const limit = Math.min(pageSize, 25);
    const offset = (page - 1) * limit;
    const url = `http://api.mediastack.com/v1/news?access_key=${API_KEYS.mediastack}&keywords=${encodeURIComponent(query)}&countries=${msCountry}&limit=${limit}&offset=${offset}`;
    const res = await fetchWithTimeout(url, { next: { revalidate: 300 }, timeout: 8000 });
    if (!res.ok) return { articles: [], totalResults: 0 };
    const data = await res.json();

    const articles: Article[] = (data.data || []).map(
      (a: { title: string; description: string; body: string; url: string; image: string; published_at: string; source: string }, i: number) => ({
        id: `mediastack-${country}-${page}-${i}-${Date.now()}`,
        title: a.title, description: a.description || "",
        content: a.body || a.description || "", url: a.url,
        image: a.image || "", publishedAt: a.published_at,
        source: { name: a.source || "Unknown", url: "" },
      })
    );

    return { articles, totalResults: data.pagination?.total || articles.length };
  } catch {
    return { articles: [], totalResults: 0 };
  }
}

async function fetchWorldNewsAPI(
  query: string,
  country: string,
  page: number,
  pageSize: number
): Promise<{ articles: Article[]; totalResults: number }> {
  try {
    const url = `https://api.worldnewsapi.com/search-news?api-key=${API_KEYS.worldnewsapi}&text=${encodeURIComponent(query)}&source-countries=${country}&number=${Math.min(pageSize, 10)}&offset=${(page - 1) * Math.min(pageSize, 10)}`;
    const res = await fetchWithTimeout(url, { next: { revalidate: 300 }, timeout: 8000 });
    if (!res.ok) return { articles: [], totalResults: 0 };
    const data = await res.json();

    const articles: Article[] = (data.news || []).map(
      (a: { title: string; text: string; url: string; image: string; publish_date: string; source: string; id: number }, i: number) => ({
        id: `worldnewsapi-${page}-${i}-${a.id}`,
        title: a.title, description: a.text?.substring(0, 200) || "",
        content: a.text || "", url: a.url || "",
        image: a.image || "", publishedAt: a.publish_date || new Date().toISOString(),
        source: { name: a.source || "WorldNewsAPI", url: "" },
      })
    );

    return { articles, totalResults: data.available || articles.length };
  } catch {
    return { articles: [], totalResults: 0 };
  }
}

async function fetchNewsApiAi(
  query: string,
  country: string,
  page: number,
  pageSize: number
): Promise<{ articles: Article[]; totalResults: number }> {
  try {
    const url = `https://newsapi.ai/api/v1/article/getArticles?apiKey=${API_KEYS.newsapiAi}&query=${encodeURIComponent(query)}&source=${country}&articlesPage=${page}&articlesCount=${Math.min(pageSize, 10)}`;
    const res = await fetchWithTimeout(url, { next: { revalidate: 300 }, timeout: 8000 });
    if (!res.ok) return { articles: [], totalResults: 0 };
    const data = await res.json();

    const articles: Article[] = (data.posts || []).map(
      (a: { title: string; summary: string; url: string; image: string; date: string; source: { name: string }; body?: string }, i: number) => ({
        id: `newsapai-${page}-${i}-${Date.now()}`,
        title: a.title || "", description: a.summary || "",
        content: a.body || a.summary || "", url: a.url || "",
        image: a.image || "", publishedAt: a.date || new Date().toISOString(),
        source: { name: a.source?.name || "NewsAPI.ai", url: "" },
      })
    );

    return { articles, totalResults: data.totals?.articles || articles.length };
  } catch {
    return { articles: [], totalResults: 0 };
  }
}

async function fetchApitube(
  query: string,
  country: string,
  page: number,
  pageSize: number
): Promise<{ articles: Article[]; totalResults: number }> {
  try {
    const limit = Math.min(pageSize, 10);
    const url = `https://api.apitube.io/v1/news/everything?q=${encodeURIComponent(query)}&language=en&countries=${country.toUpperCase()}&per_page=${limit}&page=${page}`;
    const res = await fetchWithTimeout(url, {
      headers: { "X-API-Key": API_KEYS.apitube },
      next: { revalidate: 300 },
      timeout: 8000,
    });
    if (!res.ok) return { articles: [], totalResults: 0 };
    const data = await res.json();

    const articles: Article[] = (data.data || []).map(
      (
        a: {
          title: string;
          description: string;
          body: string;
          url: string;
          image: string;
          published_at: string;
          source: { name: string; url: string };
          sentiment?: { polarity: string; score: number };
          categories?: string[];
        },
        i: number
      ) => ({
        id: `apitube-${country}-${page}-${i}-${Date.now()}`,
        title: a.title || "",
        description: a.description || "",
        content: a.body || a.description || "",
        url: a.url || "",
        image: a.image || "",
        publishedAt: a.published_at || new Date().toISOString(),
        source: { name: a.source?.name || "APITube", url: a.source?.url || "" },
        category: a.categories?.[0] || undefined,
      })
    );

    return { articles, totalResults: data.total || articles.length };
  } catch {
    return { articles: [], totalResults: 0 };
  }
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
      fetchNewsAPI(finalQuery, safeCountry, page, pageSize),
      fetchGNews(finalQuery, safeCountry, page, Math.min(pageSize, 10)),
      fetchMediaStack(finalQuery, safeCountry, page, Math.min(pageSize, 10)),
      fetchWorldNewsAPI(finalQuery, safeCountry, page, Math.min(pageSize, 10)),
      fetchNewsApiAi(finalQuery, safeCountry, page, Math.min(pageSize, 10)),
      fetchApitube(finalQuery, safeCountry, page, Math.min(pageSize, 10)),
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
    const key = article.title.toLowerCase().trim();
    if (seen.has(key) || !article.title) return false;
    seen.add(key);
    return true;
  });

  uniqueArticles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return NextResponse.json({
    articles: uniqueArticles.slice(0, pageSize),
    totalResults:
      newsApiResult.totalResults + gnewsResult.totalResults +
      mediaStackResult.totalResults + worldNewsResult.totalResults +
      newsApiAiResult.totalResults + apitubeResult.totalResults,
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
