"use client";

import { useState } from "react";
import { Article } from "@/types/news";
import { formatDate } from "@/lib/constants";
import NewsCard from "@/components/NewsCard";
import AISummary from "@/components/AISummary";
import ShareButtons from "@/components/ShareButtons";
import BookmarkButton from "@/components/BookmarkButton";
import AutoTranslate from "@/components/AutoTranslate";
import ReadingMode from "@/components/ReadingMode";
import AITags from "@/components/AITags";
import AdUnit from "@/components/AdUnit";
import { Heart, ExternalLink, Clock } from "lucide-react";
import { useFavorites } from "@/components/FavoritesProvider";

interface ArticleClientProps {
  article: Article;
  relatedArticles: Article[];
}

export default function ArticleClient({ article, relatedArticles }: ArticleClientProps) {
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const favorited = isFavorite(article.id);

  return (
    <>
      <article>
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full">
            {article.source.name}
          </span>
          <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            {formatDate(article.publishedAt)}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
          {article.title}
        </h1>

        {article.description && (
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {article.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={() => favorited ? removeFavorite(article.id) : addFavorite(article)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              favorited
                ? "bg-red-50 dark:bg-red-900/30 text-red-600"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <Heart className={`w-4 h-4 ${favorited ? "fill-red-500" : ""}`} />
            {favorited ? "Saved" : "Save"}
          </button>

          <BookmarkButton article={article} />

          <ReadingMode
            title={article.title}
            content={article.content || article.description || ""}
            description={article.description}
          />

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Read Original
          </a>
        </div>

        <div className="mb-6">
          <ShareButtons title={article.title} url={article.url} />
        </div>

        <div className="mb-6">
          <AITags title={article.title} description={article.description} content={article.content} />
        </div>

        <AISummary content={article.content} description={article.description} />

        {article.image && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8 bg-gray-100 dark:bg-gray-800">
            <img
              src={article.image}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        )}

        <div className="mb-6">
          <AutoTranslate
            text={translatedContent || article.content || article.description}
            onTranslated={setTranslatedContent}
          />
        </div>

        {translatedContent && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">
              Translated Content
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {translatedContent}
            </p>
          </div>
        )}

        {!translatedContent && article.content && (
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {article.content}
            </p>
          </div>
        )}
      </article>

      <div className="mb-12">
        <AdUnit slot="5948153172" format="fluid" layout="in-article" />
      </div>

      <div className="mb-12">
        <AdUnit slot="2064748486" format="autorelaxed" />
      </div>

      {relatedArticles.length > 0 && (
        <section className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <h2 className="text-2xl font-bold mb-6">Related News</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedArticles.map((a) => (
              <NewsCard key={a.id} article={a} variant="compact" />
            ))}
          </div>
        </section>
      )}

      <div className="mt-12">
        <AdUnit slot="2125266469" format="fluid" layout="in-article" />
      </div>
    </>
  );
}