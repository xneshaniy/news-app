export interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  twitterTitle: string;
  twitterDescription: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://worldlive.dpdns.org";
const SITE_NAME = "WorldLive";

const COMMON_PATTERNS = [
  { pattern: /(\d+)\s*(people|individuals|citizens|workers)/i, replacement: "$1 people" },
  { pattern: /according to (a |an )?/i, replacement: "" },
  { pattern: /in a (recent|new|major)/i, replacement: "New:" },
];

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "as", "into", "has", "have", "had", "that", "this",
  "it", "its", "and", "or", "but", "not", "will", "can", "said", "says", "new",
  "also", "over", "after", "before", "while", "when", "which", "their", "there",
]);

export function generateSEOMeta(title: string, description?: string, content?: string): SEOData {
  const text = content || description || "";
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 20);
  const firstSentence = sentences[0]?.trim() || description || "";
  const summary = firstSentence.length > 160 ? firstSentence.slice(0, 157) + "..." : firstSentence;

  let metaDescription = summary;
  for (const { pattern, replacement } of COMMON_PATTERNS) {
    metaDescription = metaDescription.replace(pattern, replacement);
  }

  const words = `${title} ${text}`.toLowerCase().split(/[^a-z]+/);
  const wordFreq: Record<string, number> = {};
  words
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w))
    .forEach((w) => {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
    });
  const keywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
  const canonicalPath = slug ? `/${slug}` : "/";

  return {
    metaTitle: title.length > 60 ? title.slice(0, 57) + "..." : title,
    metaDescription: metaDescription || summary,
    keywords,
    ogTitle: title.length > 95 ? title.slice(0, 92) + "..." : title,
    ogDescription: metaDescription.slice(0, 200),
    ogUrl: `${SITE_URL}${canonicalPath}`,
    twitterTitle: title.length > 70 ? title.slice(0, 67) + "..." : title,
    twitterDescription: metaDescription.slice(0, 200),
  };
}

export interface Breadcrumb {
  name: string;
  url: string;
}

export function generateBreadcrumbJSONLD(items: Breadcrumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateNewsArticleJSONLD({
  title,
  description,
  publishedAt,
  author,
  publisher,
  url,
  image,
}: {
  title: string;
  description?: string;
  publishedAt?: string;
  author?: string;
  publisher: string;
  url: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description: description || undefined,
    datePublished: publishedAt || new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: author || publisher,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${url}`,
    },
    image: image
      ? {
          "@type": "ImageObject",
          url: image,
        }
      : undefined,
  };
}

export function generateWebsiteJSONLD() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateOrganizationJSONLD() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },
    description: "World news from every country, powered by AI.",
    sameAs: [
      "https://twitter.com/worldlive",
      "https://facebook.com/worldlive",
    ],
  };
}
