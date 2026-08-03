"use client";

import Link from "next/link";
import { Heart, Clock } from "lucide-react";
import { Article } from "@/types/news";
import { useFavorites } from "./FavoritesProvider";
import { formatDate, truncateText } from "@/lib/constants";
import ShareButtons from "./ShareButtons";
import BookmarkButton from "./BookmarkButton";

interface NewsCardProps {
  article: Article;
  variant?: "default" | "featured" | "compact";
  showActions?: boolean;
}

function ImageWithFallback({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = "none";
        const parent = target.parentElement;
        if (parent) {
          const fallback = document.createElement("div");
          fallback.className = "absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30";
          fallback.innerHTML = `<svg class="w-8 h-8 text-blue-300 dark:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`;
          parent.appendChild(fallback);
        }
      }}
    />
  );
}

export default function NewsCard({ article, variant = "default", showActions = false }: NewsCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(article.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorited) {
      removeFavorite(article.id);
    } else {
      addFavorite(article);
    }
  };

  if (variant === "featured") {
    return (
      <Link href={`/article/${encodeURIComponent(article.id)}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 aspect-[16/9]">
          {article.image ? (
            <ImageWithFallback
              src={article.image}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-4xl font-bold">
                {article.title.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                {article.source.name}
              </span>
              <span className="flex items-center gap-1 text-white/80 text-xs">
                <Clock className="w-3 h-3" />
                {formatDate(article.publishedAt)}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 line-clamp-3">
              {article.title}
            </h2>
            <p className="text-white/80 text-sm line-clamp-2">
              {truncateText(article.description, 150)}
            </p>
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleFavorite}
              className="p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${
                  favorited ? "fill-red-500 text-red-500" : "text-white"
                }`}
              />
            </button>
          </div>
          {showActions && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <BookmarkButton article={article} variant="icon" />
              <ShareButtons title={article.title} url={article.url} compact />
            </div>
          )}
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/article/${encodeURIComponent(article.id)}`}
        className="group flex gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800">
          {article.image ? (
            <ImageWithFallback
              src={article.image}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-400">
                {article.title.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {article.source.name} · {formatDate(article.publishedAt)}
          </p>
          {showActions && (
            <div className="flex items-center gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
              <BookmarkButton article={article} variant="icon" />
              <ShareButtons title={article.title} url={article.url} compact />
            </div>
          )}
        </div>
        <button onClick={handleFavorite} className="shrink-0 self-start">
          <Heart
            className={`w-4 h-4 ${
              favorited
                ? "fill-red-500 text-red-500"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        </button>
      </Link>
    );
  }

  return (
    <Link href={`/article/${encodeURIComponent(article.id)}`} className="group block">
      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300">
        <div className="relative aspect-[16/10] bg-gray-100 dark:bg-gray-800">
          {article.image ? (
            <ImageWithFallback
              src={article.image}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
              <span className="text-3xl font-bold text-blue-300 dark:text-blue-600">
                {article.title.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <BookmarkButton article={article} variant="icon" />
            <button
              onClick={handleFavorite}
              className="p-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-900 transition-colors shadow-sm"
            >
              <Heart
                className={`w-4 h-4 ${
                  favorited ? "fill-red-500 text-red-500" : "text-gray-400"
                }`}
              />
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {article.source.name}
            </span>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3" />
              {formatDate(article.publishedAt)}
            </span>
          </div>
          <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {truncateText(article.description, 120)}
          </p>
          {showActions && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50" onClick={(e) => e.stopPropagation()}>
              <ShareButtons title={article.title} url={article.url} compact />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
