"use client";

import { useEffect, useState, useRef } from "react";
import { Article } from "@/types/news";
import { formatDate } from "@/lib/constants";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function LiveNewsTicker() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const fetchBreaking = async () => {
      try {
        const res = await fetch("/api/news?q=breaking+news&pageSize=15");
        const data = await res.json();
        setArticles(data.articles?.slice(0, 15) || []);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchBreaking();
    const interval = setInterval(fetchBreaking, 120000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!scrollRef.current || isPaused || articles.length === 0) return;

    const el = scrollRef.current;
    let scrollPos = el.scrollLeft;

    const animate = () => {
      scrollPos += 0.5;
      if (scrollPos >= el.scrollWidth - el.clientWidth) {
        scrollPos = 0;
      }
      el.scrollLeft = scrollPos;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused, articles.length]);

  if (loading || articles.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-10 gap-3">
          <div className="flex items-center gap-1.5 shrink-0 pr-3 border-r border-white/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <Zap className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Live</span>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="flex gap-8 whitespace-nowrap">
              {[...articles, ...articles].map((article, i) => (
                <Link
                  key={`${article.id}-${i}`}
                  href={`/article/${encodeURIComponent(article.id)}`}
                  className="flex items-center gap-2 text-sm hover:underline shrink-0"
                >
                  <span className="w-1.5 h-1.5 bg-white rounded-full shrink-0" />
                  <span className="font-medium">{article.title}</span>
                  <span className="text-white/70 text-xs shrink-0">
                    {formatDate(article.publishedAt)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
