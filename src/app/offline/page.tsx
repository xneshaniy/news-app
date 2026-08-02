"use client";

import Header from "@/components/Header";
import { WifiOff, RefreshCw, BookOpen, Heart } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold mb-3">You&apos;re Offline</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
          No internet connection detected. Check your connection and try again.
          Previously viewed articles may still be available.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Retry Connection
          </button>
          <Link
            href="/favorites"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Heart className="w-5 h-5" />
            View Favorites
          </Link>
          <Link
            href="/bookmarks"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            View Bookmarks
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6 text-left">
          <h2 className="font-semibold mb-3">Available Offline</h2>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Bookmarked articles
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Favorite saved articles
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Previously read articles
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              RSS feed articles
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
