"use client";

import { useState, useEffect } from "react";
import { Article } from "@/types/news";
import NewsCard from "@/components/NewsCard";
import { TrendingUp, Flame, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TrendingNews() {
  const [trending, setTrending] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const calculateTrendScore = (article: Article): number => {
    const now = new Date().getTime();
    const published = new Date(article.publishedAt).getTime();
    const hoursOld = (now - published) / (1000 * 60 * 60);
    const recencyScore = Math.max(0, 100 - hoursOld * 2);
    const sourceScore = ["reuters", "bbc", "cnn", "ap"].includes(
      article.source?.name?.toLowerCase()
    )
      ? 30
      : 10;
    const descriptionScore = article.description?.length > 100 ? 15 : 5;

    return recencyScore + sourceScore + descriptionScore;
  };

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch("/api/news?pageSize=30");
        const data = await res.json();
        const articles = data.articles || [];

        const scored = articles.map((a: Article) => ({
          ...a,
          score: calculateTrendScore(a),
        }));

        scored.sort((a: { score: number }, b: { score: number }) => b.score - a.score);
        setTrending(scored.slice(0, 6));
      } catch {
        setTrending([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-red-500" />
          <h2 className="text-xl font-bold">Trending Now</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (trending.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <Flame className="w-5 h-5 text-red-500" />
          </div>
          <h2 className="text-xl font-bold">Trending Now</h2>
        </div>
        <Link
          href="/category/breaking"
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trending.map((article, i) => (
          <div key={article.id} className="relative">
            {i < 3 && (
              <div className="absolute -top-2 -left-2 z-10 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                {i + 1}
              </div>
            )}
            <NewsCard article={article} showActions />
          </div>
        ))}
      </div>
    </div>
  );
}
