export const FREE_SERVICES = {
  news: {
    newsapi: process.env.NEWSAPI_KEY || "",
    gnews: process.env.GNEWS_KEY || "",
    mediastack: process.env.MEDIASTACK_KEY || "",
    worldnewsapi: process.env.WORLDNEWSAPI_KEY || "",
    newsapiAi: process.env.NEWSAPI_AI_KEY || "",
    apitube: process.env.APITUBE_KEY || "",
    newsdata: process.env.NEWSDATA_KEY || "",
  },
  ai: {
    openrouter: process.env.OPENROUTER_API_KEY || "",
    gemini: process.env.GEMINI_API_KEY || "",
    huggingface: process.env.HF_API_KEY || "",
  },
  email: {
    resend: process.env.RESEND_API_KEY || "",
    brevo: process.env.BREVO_API_KEY || "",
    mailgun: process.env.MAILGUN_API_KEY || "",
  },
  weather: {
    openMeteo: "https://api.open-meteo.com/v1",
  },
  finance: {
    alphaVantage: process.env.ALPHA_VANTAGE_KEY || "",
    finnhub: process.env.FINNHUB_KEY || "",
  },
  crypto: {
    coingecko: "https://api.coingecko.com/api/v3",
  },
  storage: {
    cloudinary: process.env.CLOUDINARY_URL || "",
    uploadthing: process.env.UPLOADTHING_SECRET || "",
  },
  auth: {
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    },
    clerk: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
  },
  search: {
    meilisearch: process.env.MEILISEARCH_HOST || "",
    meilisearchKey: process.env.MEILISEARCH_API_KEY || "",
  },
  push: {
    firebase: process.env.FIREBASE_CONFIG || "",
    onesignal: process.env.ONESIGNAL_APP_ID || "",
  },
  analytics: {
    posthog: process.env.NEXT_PUBLIC_POSTHOG_KEY || "",
    plausible: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "",
  },
  monitoring: {
    sentry: process.env.SENTRY_DSN || "",
    betterstack: process.env.BETTER_STACK_KEY || "",
  },
  translation: {
    libretranslate: process.env.LIBRETRANSLATE_URL || "https://libretranslate.com",
    deepl: process.env.DEEPL_API_KEY || "",
  },
  maps: {
    nominatim: "https://nominatim.openstreetmap.org",
  },
  seo: {
    pagespeed: process.env.GOOGLE_PAGESPEED_KEY || "",
    searchConsole: process.env.GOOGLE_SEARCH_CONSOLE_KEY || "",
  },
};

export const COUNTRY_COORDS: Record<string, { lat: number; lon: number; city: string }> = {
  us: { lat: 40.71, lon: -74.01, city: "New York" },
  gb: { lat: 51.51, lon: -0.13, city: "London" },
  in: { lat: 28.61, lon: 77.21, city: "New Delhi" },
  pk: { lat: 33.69, lon: 73.04, city: "Islamabad" },
  ca: { lat: 43.65, lon: -79.38, city: "Toronto" },
  au: { lat: -33.87, lon: 151.21, city: "Sydney" },
  de: { lat: 52.52, lon: 13.41, city: "Berlin" },
  fr: { lat: 48.86, lon: 2.35, city: "Paris" },
  jp: { lat: 35.68, lon: 139.69, city: "Tokyo" },
  cn: { lat: 39.90, lon: 116.41, city: "Beijing" },
  br: { lat: -23.55, lon: -46.63, city: "São Paulo" },
  za: { lat: -33.93, lon: 18.42, city: "Cape Town" },
  ae: { lat: 25.20, lon: 55.27, city: "Dubai" },
  sa: { lat: 24.71, lon: 46.68, city: "Riyadh" },
  ng: { lat: 6.52, lon: 3.38, city: "Lagos" },
  eg: { lat: 30.04, lon: 31.24, city: "Cairo" },
  tr: { lat: 41.01, lon: 28.98, city: "Istanbul" },
  ru: { lat: 55.76, lon: 37.62, city: "Moscow" },
  it: { lat: 41.90, lon: 12.50, city: "Rome" },
  es: { lat: 40.42, lon: -3.70, city: "Madrid" },
};

export const STOCK_SYMBOLS: Record<string, { symbol: string; name: string }[]> = {
  us: [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "GOOGL", name: "Alphabet Inc." },
    { symbol: "MSFT", name: "Microsoft Corp." },
    { symbol: "AMZN", name: "Amazon.com Inc." },
    { symbol: "NVDA", name: "NVIDIA Corp." },
    { symbol: "TSLA", name: "Tesla Inc." },
    { symbol: "META", name: "Meta Platforms" },
    { symbol: "JPM", name: "JPMorgan Chase" },
  ],
  gb: [
    { symbol: "SHEL.L", name: "Shell plc" },
    { symbol: "AZN.L", name: "AstraZeneca" },
    { symbol: "HSBA.L", name: "HSBC Holdings" },
    { symbol: "BP.L", name: "BP plc" },
    { symbol: "GSK.L", name: "GSK plc" },
  ],
  in: [
    { symbol: "RELIANCE.BSE", name: "Reliance Industries" },
    { symbol: "TCS.BSE", name: "Tata Consultancy" },
    { symbol: "HDFCBANK.BSE", name: "HDFC Bank" },
    { symbol: "INFY.BSE", name: "Infosys Ltd." },
    { symbol: "ICICIBANK.BSE", name: "ICICI Bank" },
  ],
};

export const COINGECKO_IDS = [
  "bitcoin", "ethereum", "tether", "binancecoin", "solana",
  "ripple", "usd-coin", "cardano", "dogecoin", "polkadot",
];
