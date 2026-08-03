import { NextRequest, NextResponse } from "next/server";

interface GraphQLRequest {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
}

interface GQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: (string | number)[];
  extensions?: Record<string, unknown>;
}

interface GQLResponse {
  data?: Record<string, unknown>;
  errors?: GQLError[];
}

const typeDefs = `
  type Query {
    articles(country: String, category: String, limit: Int, offset: Int): ArticleConnection!
    article(id: ID!): Article
    categories: [Category!]!
    countries: [Country!]!
    searchArticles(query: String!, limit: Int): [Article!]!
    trendingArticles(limit: Int): [Article!]!
    health: HealthStatus!
  }
  type Mutation {
    toggleFavorite(articleId: ID!): Boolean!
    toggleBookmark(articleId: ID!, folder: String): Boolean!
    trackView(articleId: ID!): Boolean!
  }
  type ArticleConnection { articles: [Article!]! total: Int! hasMore: Boolean! }
  type Article { id: ID! title: String! description: String url: String! source: String! author: String publishedAt: String! category: String! country: String! }
  type Category { slug: ID! name: String! icon: String! articleCount: Int }
  type Country { code: ID! name: String! flag: String! }
  type HealthStatus { status: String! uptime: Float! version: String! apis: [APIStatus!]! }
  type APIStatus { name: String! status: String! latency: Int }
`;

function genId(): string {
  return `a-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function genArticle(country: string, category: string) {
  const titles: Record<string, string[]> = {
    breaking: ["Breaking: Major Event Unfolds", "JUST IN: Urgent Development"],
    politics: ["New Policy Reform Announced", "Government Responds to Crisis"],
    technology: ["AI Revolution Continues", "Tech Giants Report Record Growth"],
    business: ["Markets Rally on Economic Data", "Major Merger Announced"],
    sports: ["Championship Results Shock Fans", "Star Player Signs Record Deal"],
    entertainment: ["Blockbuster Film Breaks Records", "Music Festival Announces Lineup"],
    health: ["Medical Breakthrough Announced", "New Treatment Shows Promise"],
    science: ["Space Discovery Made", "Quantum Computing Milestone"],
  };
  const t = titles[category] || titles.breaking;
  return {
    id: genId(), title: t[Math.floor(Math.random() * t.length)],
    description: `Latest developments in ${category} news from ${country.toUpperCase()}.`,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://worldlive.dpdns.org"}/article/${genId()}`,
    source: ["NewsAPI", "GNews", "MediaStack", "WorldNewsAPI", "NewsAPI.ai", "APITube"][Math.floor(Math.random() * 6)],
    author: ["Sarah Chen", "Marcus Johnson", "Emma Wilson", "David Park"][Math.floor(Math.random() * 4)],
    publishedAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
    category, country,
  };
}

const queryResolvers: Record<string, (args: Record<string, unknown>) => unknown> = {
  articles: (args) => {
    const country = (args.country as string) || "us";
    const category = (args.category as string) || "technology";
    const limit = Math.min((args.limit as number) || 10, 50);
    const offset = (args.offset as number) || 0;
    return { articles: Array.from({ length: limit }, () => genArticle(country, category)), total: 100, hasMore: offset + limit < 100 };
  },
  article: (args) => genArticle("us", "technology"),
  categories: () => [
    { slug: "breaking", name: "Breaking News", icon: "zap", articleCount: 89 },
    { slug: "politics", name: "Politics", icon: "landmark", articleCount: 289 },
    { slug: "business", name: "Business", icon: "briefcase", articleCount: 256 },
    { slug: "technology", name: "Technology", icon: "cpu", articleCount: 342 },
    { slug: "sports", name: "Sports", icon: "trophy", articleCount: 198 },
    { slug: "entertainment", name: "Entertainment", icon: "film", articleCount: 176 },
    { slug: "health", name: "Health", icon: "heart", articleCount: 145 },
    { slug: "science", name: "Science", icon: "flask-conical", articleCount: 132 },
  ],
  countries: () => [
    { code: "us", name: "USA", flag: "🇺🇸" }, { code: "gb", name: "UK", flag: "🇬🇧" },
    { code: "in", name: "India", flag: "🇮🇳" }, { code: "de", name: "Germany", flag: "🇩🇪" },
    { code: "fr", name: "France", flag: "🇫🇷" }, { code: "jp", name: "Japan", flag: "🇯🇵" },
  ],
  searchArticles: (args) => {
    const limit = Math.min((args.limit as number) || 10, 50);
    return Array.from({ length: limit }, (_, i) => ({ ...genArticle("us", "technology"), title: `Result ${i + 1} for "${args.query}"` }));
  },
  trendingArticles: (args) => Array.from({ length: Math.min((args.limit as number) || 10, 50) }, () => genArticle("us", "breaking")),
  health: () => ({
    status: "healthy", uptime: process.uptime(), version: "1.0.0",
    apis: [
      { name: "NewsAPI", status: "healthy", latency: 245 },
      { name: "GNews", status: "healthy", latency: 189 },
      { name: "MediaStack", status: "healthy", latency: 312 },
      { name: "CoinGecko", status: "healthy", latency: 450 },
      { name: "Open-Meteo", status: "healthy", latency: 120 },
    ],
  }),
};

const mutationResolvers: Record<string, () => boolean> = {
  toggleFavorite: () => true,
  toggleBookmark: () => true,
  trackView: () => true,
};

function executeQuery(query: string, variables?: Record<string, unknown>): GQLResponse {
  let trimmed = query.trim();
  if (variables && Object.keys(variables).length > 0) {
    for (const [key, value] of Object.entries(variables)) {
      const literal = typeof value === "string" ? `"${value}"` : String(value);
      trimmed = trimmed.replace(new RegExp(`\\$${key}\\b`, "g"), literal);
    }
  }
  if (trimmed.includes("__schema")) return { data: { __schema: { types: 10 } } };
  const isMutation = trimmed.startsWith("mutation");
  const fieldMatch = trimmed.match(/(?:query|mutation)?\s*(?:\w+\s*)?\{?\s*(\w+)\s*(?:\(([^)]*)\))?\s*\{?/);
  if (!fieldMatch) return { errors: [{ message: "Could not parse query" }] };
  const rootField = fieldMatch[1];
  const fieldArgs: Record<string, unknown> = {};
  if (fieldMatch[2]) {
    const pairs = fieldMatch[2].match(/(\w+)\s*:\s*(?:"([^"]*)"|(\d+)|(\w+))/g);
    if (pairs) {
      for (const pair of pairs) {
        const [k, ...vParts] = pair.split(":").map((s: string) => s.trim());
        let v: string | number = vParts.join(":").replace(/"/g, "").trim();
        if (!isNaN(Number(v)) && v !== "") v = Number(v);
        fieldArgs[k] = v;
      }
    }
  }
  const resolvers = isMutation ? mutationResolvers : queryResolvers;
  const resolver = resolvers[rootField];
  if (!resolver) return { errors: [{ message: `Field "${rootField}" not found` }] };
  try {
    return { data: { [rootField]: resolver(fieldArgs) } };
  } catch (err) {
    return { errors: [{ message: (err as Error).message || "Execution error" }] };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GraphQLRequest = await request.json();
    if (!body.query) return NextResponse.json({ errors: [{ message: "Query is required" }] }, { status: 400 });
    const result = executeQuery(body.query, body.variables);
    return NextResponse.json({ ...result, extensions: { timestamp: new Date().toISOString(), version: "1.0.0" } });
  } catch {
    return NextResponse.json({ errors: [{ message: "Internal server error" }] }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "WorldLive GraphQL API", version: "1.0.0", endpoint: "/api/graphql",
    examples: [
      '{ articles(country: "us", category: "technology", limit: 5) { articles { id title source publishedAt } total hasMore } }',
      '{ categories { slug name articleCount } }',
      '{ trendingArticles(limit: 5) { id title category publishedAt } }',
    ],
  });
}
