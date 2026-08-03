"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/Header";
import NewsFeed from "@/components/NewsFeed";
import AdvancedSearch from "@/components/AdvancedSearch";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useSEOMeta } from "@/lib/seo";
import { Search } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  useSEOMeta(query ? `Search results for "${query}"` : "Search News", {
    description: query
      ? `Search results for "${query}" across world news sources.`
      : "Search global news by topic, category, country, or source.",
    canonicalPath: `/search${query ? `?q=${encodeURIComponent(query)}` : ""}`,
    type: "website",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Search", url: "/search" },
    ],
  });

  const handleSearch = (filters: { query: string; category: string; country: string; dateRange: string; sortBy: string; sources: string[] }) => {
    const params = new URLSearchParams();
    if (filters.query) params.set("q", filters.query);
    if (filters.category) params.set("category", filters.category);
    if (filters.country) params.set("country", filters.country);
    if (filters.dateRange !== "all") params.set("date", filters.dateRange);
    if (filters.sortBy !== "relevancy") params.set("sort", filters.sortBy);
    if (filters.sources.length > 0) params.set("sources", filters.sources.join(","));
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Search News" },
          ]}
        />
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Search className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold">Search News</h1>
          </div>
          <AdvancedSearch onSearch={handleSearch} initialQuery={query} />
        </div>

        {query ? (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Results for &quot;{query}&quot;
            </p>
            <NewsFeed searchQuery={query} pageSize={20} />
          </>
        ) : (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Search global news</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Use the search bar and filters to find specific articles, topics, or sources
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
          <Header />
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
