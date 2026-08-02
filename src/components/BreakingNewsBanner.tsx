"use client";

import { useEffect, useState } from "react";
import { X, Zap } from "lucide-react";
import { Article } from "@/types/news";

export default function BreakingNewsBanner() {
  const [breakingNews, setBreakingNews] = useState<Article[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchBreaking = async () => {
      try {
        const res = await fetch("/api/news?q=breaking+news&category=breaking&pageSize=5");
        const data = await res.json();
        if (data.articles?.length > 0) {
          setBreakingNews(data.articles.slice(0, 5));
        }
      } catch {
        // Silently fail
      }
    };
    fetchBreaking();
  }, []);

  useEffect(() => {
    if (breakingNews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % breakingNews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [breakingNews.length]);

  if (dismissed || breakingNews.length === 0) return null;

  const current = breakingNews[currentIndex];

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 py-2.5">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
            </span>
            <Zap className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wider hidden sm:inline">
              Breaking
            </span>
          </div>

          <div className="flex-1 overflow-hidden">
            <div
              className="transition-all duration-500 ease-in-out"
              key={currentIndex}
            >
              <a
                href={current.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium line-clamp-1 hover:underline"
              >
                {current.title}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs opacity-80 hidden sm:inline">
              {currentIndex + 1}/{breakingNews.length}
            </span>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
