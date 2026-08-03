"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header";
import NewsCard from "@/components/NewsCard";
import { Article } from "@/types/news";
import { useCountry } from "@/components/CountryProvider";
import { Sparkles, RefreshCw, TrendingUp } from "lucide-react";

export default function RecommendationsPage() {
  const { country } = useCountry();
  const [recommendations, setRecommendations] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState<string[]>([]);

  const fetchRecommendations = useCallback(() => {
    setLoading(true);
    fetch(`/api/recommendations?country=${country}`)
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data.recommendations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [country]);

  useEffect(() => {
    fetchRecommendations();
    setTrending([
      "AI & Machine Learning",
      "Climate Change",
      "Space Exploration",
      "Global Economy",
      "Health & Wellness",
      "Tech Startups",
      "Cryptocurrency",
      "Elections 2024",
    ]);
  }, [country, fetchRecommendations]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">For You</h1>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                AI Powered
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Personalized news recommendations based on your reading history
            </p>
          </div>
          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden animate-pulse"
                  >
                    <div className="aspect-[16/10] bg-gray-200 dark:bg-gray-700" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Sparkles className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  No recommendations yet
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Start reading and saving articles to get personalized
                  recommendations
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                Trending Topics
              </h3>
              <div className="space-y-2">
                {trending.map((topic, i) => (
                  <div
                    key={topic}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-bold text-gray-300 dark:text-gray-600 w-5">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-4 text-white">
              <Sparkles className="w-8 h-8 mb-3 opacity-90" />
              <h3 className="font-semibold mb-2">How it works</h3>
              <ul className="text-sm space-y-1.5 opacity-90">
                <li>• We analyze your reading patterns</li>
                <li>• Articles are scored by relevance</li>
                <li>• Fresh content gets priority</li>
                <li>• Your data stays on your device</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
