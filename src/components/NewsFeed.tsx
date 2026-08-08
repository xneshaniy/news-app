"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Article } from "@/types/news";
import { useCountry } from "./CountryProvider";
import NewsCard from "./NewsCard";
import InfiniteScroll from "./InfiniteScroll";
import AdUnit from "./AdUnit";

const IN_FEED_SLOT = "8308778547";

interface NewsFeedProps {
  category?: string;
  searchQuery?: string;
  pageSize?: number;
  showActions?: boolean;
}

export default function NewsFeed({
  category,
  searchQuery,
  pageSize = 20,
  showActions = false,
}: NewsFeedProps) {
  const { country } = useCountry();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const loadingRef = useRef(false);

  useEffect(() => {
    setLoading(true);
    setArticles([]);
    setPage(1);
    setHasMore(true);
    setInitialLoad(true);
    loadingRef.current = false;

    const fetchArticles = async () => {
      try {
        let url: string;
        if (searchQuery) {
          url = `/api/news/search?q=${encodeURIComponent(searchQuery)}&page=1&pageSize=${pageSize}`;
        } else {
          const params = new URLSearchParams({
            country,
            page: "1",
            pageSize: String(pageSize),
          });
          if (category) params.set("category", category);
          url = `/api/news?${params.toString()}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setArticles(data.articles || []);
        setHasMore((data.articles || []).length >= pageSize);
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    fetchArticles();
  }, [country, category, searchQuery, pageSize]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);

    const nextPage = page + 1;
    try {
      let url: string;
      if (searchQuery) {
        url = `/api/news/search?q=${encodeURIComponent(searchQuery)}&page=${nextPage}&pageSize=${pageSize}`;
      } else {
        const params = new URLSearchParams({
          country,
          page: String(nextPage),
          pageSize: String(pageSize),
        });
        if (category) params.set("category", category);
        url = `/api/news?${params.toString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      const newArticles = data.articles || [];
      setArticles((prev) => [...prev, ...newArticles]);
      setPage(nextPage);
      setHasMore(newArticles.length >= pageSize);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [country, category, searchQuery, pageSize, page, hasMore]);

  if (initialLoad && loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Loading news...</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No articles found
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
          Try changing your country or category
        </p>
      </div>
    );
  }

  return (
    <InfiniteScroll loadMore={loadMore} hasMore={hasMore} loading={loading && !initialLoad}>
      {articles.length > 0 && (
        <div className="mb-6">
          <NewsCard article={articles[0]} variant="featured" showActions={showActions} />
        </div>
      )}

      {articles.length > 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.slice(1).map((article, index) => (
            <div key={article.id}>
              <NewsCard article={article} showActions={showActions} />
              {index > 0 && index % 4 === 0 && (
                <div className="mt-4">
                  <AdUnit slot={IN_FEED_SLOT} format="fluid" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </InfiniteScroll>
  );
}
