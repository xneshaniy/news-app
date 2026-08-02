"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import NewsCard from "@/components/NewsCard";
import { useCountry } from "@/components/CountryProvider";
import { Article } from "@/types/news";
import { COUNTRIES } from "@/lib/constants";
import { Globe, TrendingUp, Sparkles } from "lucide-react";

export default function CountryRecommendationsPage() {
  const { country, setCountry } = useCountry();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(country);

  useEffect(() => {
    setLoading(true);
    const fetchCountryNews = async () => {
      try {
        const res = await fetch(`/api/recommendations?country=${selectedCountry}`);
        const data = await res.json();
        setArticles(data.recommendations || []);
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCountryNews();
  }, [selectedCountry]);

  const currentCountry = COUNTRIES.find((c) => c.code === selectedCountry);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Country News</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 ml-14">
            Personalized news recommendations for {currentCountry?.name || "your country"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-4 sticky top-24">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Select Country
              </h3>
              <div className="space-y-1 max-h-[500px] overflow-y-auto">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setSelectedCountry(c.code);
                      setCountry(c.code);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCountry === c.code
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span className="text-lg">{c.flag}</span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Sparkles className="w-4 h-4 text-purple-500" />
                AI-powered recommendations for {currentCountry?.flag} {currentCountry?.name}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden animate-pulse">
                    <div className="aspect-[16/10] bg-gray-200 dark:bg-gray-700" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Globe className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  No news available for {currentCountry?.name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Try selecting a different country
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
