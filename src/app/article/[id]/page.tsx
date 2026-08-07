import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ArticleClient from "@/components/ArticleClient";

const prisma = new PrismaClient();

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getArticleFromDb(id: string) {
  return prisma.article.findUnique({ where: { id } });
}

async function getRelatedArticles(currentId: string, limit: number = 6) {
  return prisma.article.findMany({
    where: {
      id: { not: currentId },
    },
    take: limit,
    orderBy: { publishedAt: "desc" },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleFromDb(id);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: article.title,
    description: article.description || undefined,
    openGraph: {
      title: article.title,
      description: article.description || undefined,
      type: "article",
      publishedTime: article.publishedAt.toISOString(),
      authors: article.author ? [article.author] : [article.source],
      images: article.image ? [{ url: article.image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description || undefined,
      images: article.image ? [article.image] : [],
    },
    other: {
      "article:published_time": article.publishedAt.toISOString(),
      "article:author": article.author || article.source,
      "article:section": article.category || "General",
    },
  };
}

async function getArticleData(id: string) {
  const article = await getArticleFromDb(id);
  const relatedArticles = await getRelatedArticles(id);

  if (!article) {
    return null;
  }

  return {
    article: {
      id: article.id,
      title: article.title,
      description: article.description || "",
      content: article.content || "",
      url: article.canonicalUrl,
      image: article.image || "",
      publishedAt: article.publishedAt.toISOString(),
      source: { name: article.source, url: "" },
      category: article.category || undefined,
      country: article.country || undefined,
    },
    relatedArticles: relatedArticles.map((a: typeof relatedArticles[0]) => ({
      id: a.id,
      title: a.title,
      description: a.description || "",
      content: a.content || "",
      url: a.canonicalUrl,
      image: a.image || "",
      publishedAt: a.publishedAt.toISOString(),
      source: { name: a.source, url: "" },
      category: a.category || undefined,
      country: a.country || undefined,
    })),
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  const data = await getArticleData(id);

  if (!data) {
    notFound();
  }

  const { article, relatedArticles } = data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: article.source.name },
            { name: article.title },
          ]}
        />
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <ArticleClient article={article} relatedArticles={relatedArticles} />
      </main>
    </div>
  );
}