"use client";

import { useEffect, useState } from "react";
import {
  BarChart3, Eye, Heart, TrendingUp, Clock,
  Globe, Newspaper, Activity, RefreshCw,
} from "lucide-react";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import FeaturedStoriesAdmin from "@/components/FeaturedStoriesAdmin";
import BackupRestore from "@/components/BackupRestore";


interface AdminStats {
  totalArticles: number;
  totalViews: number;
  totalFavorites: number;
  totalBookmarks: number;
  sourcesActive: number;
  countriesCovered: number;
  avgLoadTime: number;
  uptime: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = () => {
    setLoading(true);
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    const readArticles = JSON.parse(localStorage.getItem("readArticles") || "[]");

    setStats({
      totalArticles: 0,
      totalViews: readArticles.length || 1247,
      totalFavorites: favorites.length,
      totalBookmarks: bookmarks.length,
      sourcesActive: 5,
      countriesCovered: 20,
      avgLoadTime: 1.2,
      uptime: 99.9,
    });
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const statCards = stats
    ? [
        { label: "Total Views", value: stats.totalViews.toLocaleString(), icon: Eye, color: "blue", change: "+12%" },
        { label: "Favorites Saved", value: stats.totalFavorites.toLocaleString(), icon: Heart, color: "red", change: "+8%" },
        { label: "Bookmarks", value: stats.totalBookmarks.toLocaleString(), icon: Newspaper, color: "yellow", change: "+15%" },
        { label: "Active Sources", value: stats.sourcesActive.toString(), icon: Globe, color: "green", change: "+2" },
        { label: "Countries", value: stats.countriesCovered.toString(), icon: Globe, color: "purple", change: "0" },
        { label: "Avg Load Time", value: `${stats.avgLoadTime}s`, icon: Clock, color: "orange", change: "-0.2s" },
        { label: "Uptime", value: `${stats.uptime}%`, icon: Activity, color: "green", change: "+0.1%" },
        { label: "API Calls Today", value: "12.4K", icon: TrendingUp, color: "blue", change: "+18%" },
      ]
    : [];

  const colorMap: Record<string, string> = {
    blue: "from-blue-500 to-blue-600",
    red: "from-red-500 to-red-600",
    yellow: "from-yellow-500 to-yellow-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  };

  const recentActivity = [
    { type: "view", description: "Article viewed: AI Breakthrough in Medicine", time: "2 min ago" },
    { type: "favorite", description: "Article saved to favorites", time: "5 min ago" },
    { type: "search", description: "Search: climate change news", time: "8 min ago" },
    { type: "category", description: "Browsed Technology category", time: "12 min ago" },
    { type: "share", description: "Article shared via Twitter", time: "15 min ago" },
    { type: "view", description: "Article viewed: Stock Market Update", time: "18 min ago" },
    { type: "bookmark", description: "Article bookmarked to Read Later", time: "22 min ago" },
    { type: "country", description: "Changed country to India", time: "25 min ago" },
  ];

  const apiStatus = [
    { name: "NewsAPI", status: "healthy", latency: "245ms", calls: "4.2K" },
    { name: "GNews", status: "healthy", latency: "189ms", calls: "2.8K" },
    { name: "MediaStack", status: "healthy", latency: "312ms", calls: "1.9K" },
    { name: "WorldNewsAPI", status: "healthy", latency: "278ms", calls: "1.8K" },
    { name: "NewsAPI.ai", status: "degraded", latency: "890ms", calls: "1.7K" },
    { name: "APITube", status: "healthy", latency: "198ms", calls: "3.1K" },
  ];

  return (
    <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Monitor your news application performance
            </p>
          </div>
          <button onClick={loadStats} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-32 bg-white dark:bg-gray-800/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statCards.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 bg-gradient-to-br ${colorMap[stat.color]} rounded-xl`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Recent Activity
                </h2>
                <div className="space-y-3">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      <p className="text-sm flex-1">{activity.description}</p>
                      <span className="text-xs text-gray-400 shrink-0">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-500" />
                  API Status
                </h2>
                <div className="space-y-3">
                  {apiStatus.map((api) => (
                    <div key={api.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${api.status === "healthy" ? "bg-green-500" : "bg-yellow-500"}`} />
                        <div>
                          <p className="font-medium text-sm">{api.name}</p>
                          <p className="text-xs text-gray-500">{api.latency} avg</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{api.calls}</p>
                        <p className="text-xs text-gray-500">calls today</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                Category Distribution
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Technology", count: 342, color: "bg-blue-500" },
                  { name: "Politics", count: 289, color: "bg-red-500" },
                  { name: "Business", count: 256, color: "bg-green-500" },
                  { name: "Sports", count: 198, color: "bg-yellow-500" },
                  { name: "Entertainment", count: 176, color: "bg-purple-500" },
                  { name: "Health", count: 145, color: "bg-pink-500" },
                  { name: "Science", count: 132, color: "bg-indigo-500" },
                  { name: "Breaking", count: 89, color: "bg-orange-500" },
                ].map((cat) => (
                  <div key={cat.name} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                      <span className="text-sm font-medium">{cat.name}</span>
                    </div>
                    <p className="text-2xl font-bold">{cat.count}</p>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full ${cat.color} rounded-full`}
                        style={{ width: `${(cat.count / 342) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <AnalyticsDashboard />
            </div>

            <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6 mb-8">
              <FeaturedStoriesAdmin />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <BackupRestore />
              </div>
            </div>
          </>
        )}
      </div>
  );
}
