"use client";

import Header from "@/components/Header";
import { useFavorites } from "@/components/FavoritesProvider";
import NewsCard from "@/components/NewsCard";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold">Saved Articles</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 ml-14">
            {favorites.length} article{favorites.length !== 1 ? "s" : ""} saved
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No saved articles</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start saving articles by clicking the heart icon
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse News
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
