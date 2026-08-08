"use client";

import { useEffect } from "react";
import { Newspaper, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ArticleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Article page error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-6">
        <Newspaper className="w-10 h-10 text-red-400" />
      </div>
      <h1 className="text-2xl font-bold mb-3 text-center">
        Something went wrong loading this article
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-8 max-w-md">
        The article could not be displayed. This may be a temporary issue with
        the news feed. You can try again or go back to the homepage.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}