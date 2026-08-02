"use client";

import Header from "@/components/Header";
import NewsCard from "@/components/NewsCard";
import { useReadingHistory } from "@/components/ReadingHistoryProvider";
import { Clock, Trash2, History } from "lucide-react";

export default function ReadingHistoryPage() {
  const { history, clearHistory } = useReadingHistory();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                <History className="w-6 h-6 text-indigo-600" />
              </div>
              <h1 className="text-3xl font-bold">Reading History</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 ml-14">
              {history.length} articles read
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
          )}
        </div>

        {history.length > 0 ? (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={`${item.article.id}-${item.readAt}`} className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                <div className="flex items-start gap-4 pl-2">
                  <div className="relative z-10 w-10 h-10 bg-white dark:bg-gray-900 border-2 border-indigo-200 dark:border-indigo-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="flex-1 min-w-0 pb-4">
                    <p className="text-xs text-gray-400 mb-2">
                      {new Date(item.readAt).toLocaleString()}
                    </p>
                    <NewsCard article={item.article} variant="compact" showActions />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <History className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No reading history</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Articles you read will appear here
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
