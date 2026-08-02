import { Country, Category } from "@/types/news";

export const API_KEYS = {
  newsapi: process.env.NEWSAPI_KEY || "",
  gnews: process.env.GNEWS_KEY || "",
  mediastack: process.env.MEDIASTACK_KEY || "",
  worldnewsapi: process.env.WORLDNEWSAPI_KEY || "",
  newsapiAi: process.env.NEWSAPI_AI_KEY || "",
  apitube: process.env.APITUBE_KEY || "",
};

export const COUNTRIES: Country[] = [
  { code: "us", name: "USA", flag: "🇺🇸" },
  { code: "gb", name: "UK", flag: "🇬🇧" },
  { code: "in", name: "India", flag: "🇮🇳" },
  { code: "pk", name: "Pakistan", flag: "🇵🇰" },
  { code: "ca", name: "Canada", flag: "🇨🇦" },
  { code: "au", name: "Australia", flag: "🇦🇺" },
  { code: "de", name: "Germany", flag: "🇩🇪" },
  { code: "fr", name: "France", flag: "🇫🇷" },
  { code: "jp", name: "Japan", flag: "🇯🇵" },
  { code: "cn", name: "China", flag: "🇨🇳" },
  { code: "br", name: "Brazil", flag: "🇧🇷" },
  { code: "za", name: "South Africa", flag: "🇿🇦" },
  { code: "ae", name: "UAE", flag: "🇦🇪" },
  { code: "sa", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "ng", name: "Nigeria", flag: "🇳🇬" },
  { code: "eg", name: "Egypt", flag: "🇪🇬" },
  { code: "tr", name: "Turkey", flag: "🇹🇷" },
  { code: "ru", name: "Russia", flag: "🇷🇺" },
  { code: "it", name: "Italy", flag: "🇮🇹" },
  { code: "es", name: "Spain", flag: "🇪🇸" },
];

export const CATEGORIES: Category[] = [
  { slug: "breaking", name: "Breaking News", icon: "zap" },
  { slug: "politics", name: "Politics", icon: "landmark" },
  { slug: "business", name: "Business", icon: "briefcase" },
  { slug: "technology", name: "Technology", icon: "cpu" },
  { slug: "sports", name: "Sports", icon: "trophy" },
  { slug: "entertainment", name: "Entertainment", icon: "film" },
  { slug: "health", name: "Health", icon: "heart" },
  { slug: "science", name: "Science", icon: "flask-conical" },
];

export const TRANSLATION_LANGUAGES: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  nl: "Dutch",
  ru: "Russian",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
  ar: "Arabic",
  hi: "Hindi",
  bn: "Bengali",
  ur: "Urdu",
  tr: "Turkish",
  vi: "Vietnamese",
  th: "Thai",
  pl: "Polish",
  uk: "Ukrainian",
  cs: "Czech",
  sv: "Swedish",
  da: "Danish",
  fi: "Finnish",
  no: "Norwegian",
  el: "Greek",
  he: "Hebrew",
  ro: "Romanian",
  hu: "Hungarian",
  id: "Indonesian",
  ms: "Malay",
  tl: "Filipino",
  sw: "Swahili",
};

export function getCategoryQuery(slug: string): string {
  const queries: Record<string, string> = {
    breaking: "breaking OR urgent OR developing",
    politics: "politics OR government OR election OR parliament",
    business: "business OR economy OR market OR finance OR stock",
    technology: "technology OR AI OR software OR startup OR digital",
    sports: "sports OR football OR basketball OR soccer OR cricket",
    entertainment: "entertainment OR movie OR music OR celebrity OR hollywood",
    health: "health OR medical OR disease OR wellness OR hospital",
    science: "science OR research OR discovery OR space OR climate",
  };
  return queries[slug] || slug;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || "";
  return text.slice(0, maxLength).trimEnd() + "...";
}

export function generateAISummary(content: string): string {
  if (!content || content.length < 100) return content;
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  if (sentences.length <= 3) return content;
  const scored = sentences.map((s, i) => ({
    sentence: s.trim(),
    score: (i === 0 ? 3 : 0) +
      (i === sentences.length - 1 ? 2 : 0) +
      (/\b(breaking|announce|confirm|report|reveal|launch|introduce)\b/i.test(s) ? 3 : 0) +
      (/\b(government|president|minister|ceo|company|country)\b/i.test(s) ? 2 : 0) +
      (/\b\d+%|\$\d+|\d+ (million|billion|thousand)\b/i.test(s) ? 2 : 0) +
      (s.length > 50 && s.length < 200 ? 1 : 0),
  }));
  const topSentences = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .sort((a, b) => {
      const origA = content.indexOf(a.sentence);
      const origB = content.indexOf(b.sentence);
      return origA - origB;
    });
  return topSentences.map((s) => s.sentence).join(". ") + ".";
}

export function getShareUrls(article: { title: string; url: string }) {
  const encodedUrl = encodeURIComponent(article.url);
  const encodedTitle = encodeURIComponent(article.title);
  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=Check%20this%20out:%20${encodedUrl}`,
  };
}
