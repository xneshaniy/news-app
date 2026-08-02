"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Loader2 } from "lucide-react";

interface InfiniteScrollProps {
  loadMore: () => Promise<void>;
  hasMore: boolean;
  loading: boolean;
  children: React.ReactNode;
}

export default function InfiniteScroll({ loadMore, hasMore, loading, children }: InfiniteScrollProps) {
  const observerRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading) {
        loadMore();
      }
    },
    [hasMore, loading, loadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    if (!loading && initialLoad) {
      setInitialLoad(false);
    }
  }, [loading, initialLoad]);

  return (
    <div>
      {children}
      <div ref={observerRef} className="h-4" />
      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Loading more articles...
            </span>
          </div>
        </div>
      )}
      {!hasMore && !initialLoad && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            You&apos;ve reached the end of the feed
          </p>
        </div>
      )}
    </div>
  );
}
