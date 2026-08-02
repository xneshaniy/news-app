export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
  category?: string;
  country?: string;
  factCheck?: FactCheck;
  readingTime?: number;
  topics?: string[];
  summary?: string;
  translatedTitle?: string;
  translatedDescription?: string;
}

export interface FactCheck {
  status: "verified" | "unverified" | "disputed" | "satire";
  confidence: number;
  sources?: string[];
}

export interface NewsResponse {
  articles: Article[];
  totalResults: number;
  status?: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
}

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  forecast: ForecastDay[];
}

export interface ForecastDay {
  date: string;
  tempHigh: number;
  tempLow: number;
  description: string;
  icon: string;
}

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  history: number[];
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  marketCap: number;
  volume24h: number;
  sparkline: number[];
}

export interface ElectionResult {
  country: string;
  year: number;
  title: string;
  candidates: Candidate[];
  lastUpdated: string;
}

export interface Candidate {
  name: string;
  party: string;
  votes: number;
  percentage: number;
  color: string;
}

export interface Podcast {
  id: string;
  title: string;
  description: string;
  image: string;
  episodes: Episode[];
  category: string;
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  audioUrl: string;
}

export interface LiveTVChannel {
  id: string;
  name: string;
  country: string;
  streamUrl: string;
  logo: string;
  category: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface Bookmark {
  id: string;
  article: Article;
  folder: string;
  savedAt: string;
  tags: string[];
}

export interface AdminStats {
  totalArticles: number;
  totalViews: number;
  totalFavorites: number;
  topCategories: { name: string; count: number }[];
  topSources: { name: string; count: number }[];
  recentActivity: { type: string; description: string; time: string }[];
}
