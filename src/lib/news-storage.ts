import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export interface NormalizedArticle {
  source: string;
  sourceArticleId: string | null;
  canonicalUrl: string;
  title: string;
  description: string | null;
  content: string | null;
  image: string | null;
  author: string | null;
  publishedAt: Date;
  category?: string | null;
  country?: string | null;
}

interface RawArticleInput {
  id?: string | number | null;
  sourceId?: string | number | null;
  sourceIdStr?: string | null;
  guid?: string | null;
  uuid?: string | null;
  url?: string;
  link?: string;
  title?: string;
  headline?: string;
  description?: string | null;
  summary?: string | null;
  text?: string | null;
  contentSnippet?: string | null;
  body?: string | null;
  content?: string | null;
  urlToImage?: string;
  image?: string | { url?: string } | null;
  imageUrl?: string | null;
  thumbnail?: string | null;
  media?: string | { url?: string } | null;
  author?: string | null;
  authorName?: string | null;
  byline?: string | null;
  source?: { name?: string; url?: string } | null;
  sourceName?: string | null;
  source_name?: string | null;
  publishedAt?: string | null;
  published_at?: string | null;
  publish_date?: string | null;
  date?: string | null;
  publishedAtDate?: string | null;
  publishedDate?: string | null;
  category?: string | null;
  categories?: string[] | null;
  country?: string | null;
  [key: string]: unknown;
}

function generateStableId(source: string, sourceArticleId: string | null, canonicalUrl: string): string {
  if (sourceArticleId) {
    return `${source}-${sourceArticleId}`;
  }
  const hash = crypto.createHash("sha256").update(canonicalUrl).digest("hex").slice(0, 16);
  return `url-${hash}`;
}

function extractSourceArticleId(raw: RawArticleInput): string | null {
  if (raw.id !== undefined && raw.id !== null) {
    return String(raw.id);
  }
  if (raw.sourceId !== undefined && raw.sourceId !== null) {
    return String(raw.sourceId);
  }
  if (raw.sourceIdStr !== undefined && raw.sourceIdStr !== null) {
    return String(raw.sourceIdStr);
  }
  if (raw.guid !== undefined && raw.guid !== null) {
    return String(raw.guid);
  }
  if (raw.uuid !== undefined && raw.uuid !== null) {
    return String(raw.uuid);
  }
  return null;
}

function extractPublishedAt(raw: RawArticleInput): Date {
  const dateFields = [
    "publishedAt",
    "published_at",
    "publish_date",
    "date",
    "publishedAtDate",
    "publishedDate",
  ];

  for (const field of dateFields) {
    const value = raw[field];
    if (value) {
      const parsed = new Date(value as string);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
  }
  return new Date();
}

function extractDescription(raw: RawArticleInput): string | null {
  const descFields = ["description", "summary", "text", "contentSnippet", "body"];
  for (const field of descFields) {
    const value = raw[field];
    if (value && typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function extractContent(raw: RawArticleInput): string | null {
  const contentFields = ["content", "body", "full_text", "text", "description", "summary"];
  for (const field of contentFields) {
    const value = raw[field];
    if (value && typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function extractImage(raw: RawArticleInput): string | null {
  const imageFields = ["image", "urlToImage", "imageUrl", "thumbnail", "media"];
  for (const field of imageFields) {
    const value = raw[field];
    if (value && typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (value && typeof value === "object" && value !== null && "url" in value) {
      const url = (value as { url?: string }).url;
      if (url && typeof url === "string" && url.trim()) {
        return url.trim();
      }
    }
  }
  return null;
}

function extractAuthor(raw: RawArticleInput): string | null {
  const authorFields = ["author", "authorName", "byline", "source.name"];
  for (const field of authorFields) {
    const value = field.includes(".")
      ? (raw[field.split(".")[0]] as Record<string, unknown> | undefined)?.[field.split(".")[1]]
      : raw[field];
    if (value && typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function extractCategory(raw: RawArticleInput): string | null {
  if (raw.category && typeof raw.category === "string") {
    return raw.category;
  }
  if (raw.categories && Array.isArray(raw.categories) && raw.categories.length > 0) {
    return raw.categories[0] as string;
  }
  return null;
}

export function normalizeNewsArticle(raw: RawArticleInput, source: string): NormalizedArticle {
  const canonicalUrl = (raw.url as string) || (raw.link as string) || "";
  const sourceArticleId = extractSourceArticleId(raw);
  generateStableId(source, sourceArticleId, canonicalUrl);

  return {
    source,
    sourceArticleId,
    canonicalUrl,
    title: (raw.title as string) || (raw.headline as string) || "Untitled",
    description: extractDescription(raw),
    content: extractContent(raw),
    image: extractImage(raw),
    author: extractAuthor(raw),
    publishedAt: extractPublishedAt(raw),
    category: extractCategory(raw),
    country: (raw.country as string | null) ?? null,
  };
}

export async function upsertNewsArticle(normalized: NormalizedArticle) {
  try {
    const article = await prisma.article.upsert({
      where: {
        source_sourceArticleId: {
          source: normalized.source,
          sourceArticleId: normalized.sourceArticleId || "",
        },
      },
      update: {
        canonicalUrl: normalized.canonicalUrl,
        title: normalized.title,
        description: normalized.description,
        content: normalized.content,
        image: normalized.image,
        author: normalized.author,
        publishedAt: normalized.publishedAt,
        category: normalized.category,
        country: normalized.country,
        updatedAt: new Date(),
      },
      create: {
        source: normalized.source,
        sourceArticleId: normalized.sourceArticleId,
        canonicalUrl: normalized.canonicalUrl,
        title: normalized.title,
        description: normalized.description,
        content: normalized.content,
        image: normalized.image,
        author: normalized.author,
        publishedAt: normalized.publishedAt,
        category: normalized.category,
        country: normalized.country,
      },
    });
    return article;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      const existing = await prisma.article.findUnique({
        where: { canonicalUrl: normalized.canonicalUrl },
      });
      if (existing) return existing;
    }
    throw error;
  }
}

export async function getArticleById(id: string) {
  return prisma.article.findUnique({ where: { id } });
}

export async function getArticleByCanonicalUrl(canonicalUrl: string) {
  return prisma.article.findUnique({ where: { canonicalUrl } });
}

export async function getArticlesByIds(ids: string[]) {
  return prisma.article.findMany({
    where: { id: { in: ids } },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getRecentArticles(limit: number = 20) {
  return prisma.article.findMany({
    take: limit,
    orderBy: { publishedAt: "desc" },
  });
}