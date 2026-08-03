"use client";

import { useState } from "react";
import { Search, Filter, X, Calendar, Globe, Tag, Clock } from "lucide-react";
import { COUNTRIES, CATEGORIES } from "@/lib/constants";

interface SearchFilters {
  query: string;
  category: string;
  country: string;
  dateRange: "all" | "today" | "week" | "month" | "year";
  sortBy: "relevancy" | "publishedAt" | "popularity";
  sources: string[];
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  initialQuery?: string;
}

const DATE_RANGES = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
];

const SORT_OPTIONS = [
  { value: "relevancy", label: "Most Relevant" },
  { value: "publishedAt", label: "Newest First" },
  { value: "popularity", label: "Most Popular" },
];

const NEWS_SOURCES = [
  "NewsAPI", "GNews", "MediaStack", "WorldNewsAPI", "NewsAPI.ai", "APITube",
];

export default function AdvancedSearch({ onSearch, initialQuery = "" }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialQuery,
    category: "",
    country: "",
    dateRange: "all",
    sortBy: "relevancy",
    sources: [],
  });
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSource = (source: string) => {
    setFilters((prev) => ({
      ...prev,
      sources: prev.sources.includes(source)
        ? prev.sources.filter((s) => s !== source)
        : [...prev.sources, source],
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      category: "",
      country: "",
      dateRange: "all",
      sortBy: "relevancy",
      sources: [],
    });
  };

  const activeFilterCount = [
    filters.category,
    filters.country,
    filters.dateRange !== "all" ? filters.dateRange : "",
    filters.sources.length > 0 ? "sources" : "",
  ].filter(Boolean).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles, topics, sources..."
              value={filters.query}
              onChange={(e) => updateFilter("query", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
              showFilters || activeFilterCount > 0
                ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-600"
                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                  <Tag className="w-3 h-3 inline mr-1" />
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilter("category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                  <Globe className="w-3 h-3 inline mr-1" />
                  Country
                </label>
                <select
                  value={filters.country}
                  onChange={(e) => updateFilter("country", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
                >
                  <option value="">All Countries</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => updateFilter("dateRange", e.target.value as SearchFilters["dateRange"])}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
                >
                  {DATE_RANGES.map((dr) => (
                    <option key={dr.value} value={dr.value}>{dr.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter("sortBy", e.target.value as SearchFilters["sortBy"])}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                Sources
              </label>
              <div className="flex flex-wrap gap-2">
                {NEWS_SOURCES.map((source) => (
                  <button
                    key={source}
                    type="button"
                    onClick={() => toggleSource(source)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      filters.sources.includes(source)
                        ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-600"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {source}
                  </button>
                ))}
              </div>
            </div>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear all filters
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
