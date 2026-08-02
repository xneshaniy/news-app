"use client";

import { useState, useEffect } from "react";
import {
  BarChart3, TrendingUp, Users, Eye, Clock, Globe,
  ArrowUpRight, ArrowDownRight, RefreshCw, Calendar,
} from "lucide-react";

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  bounceRate: number;
  topCategories: { name: string; views: number; change: number }[];
  topCountries: { name: string; visitors: number; flag: string }[];
  hourlyTraffic: number[];
  recentActivity: { action: string; time: string; detail: string }[];
}

const generateMockData = (): AnalyticsData => ({
  pageViews: 124832,
  uniqueVisitors: 45219,
  avgSessionDuration: 342,
  bounceRate: 32.4,
  topCategories: [
    { name: "Technology", views: 28451, change: 12.5 },
    { name: "Politics", views: 22103, change: -3.2 },
    { name: "Sports", views: 19845, change: 8.7 },
    { name: "Business", views: 15632, change: 5.1 },
    { name: "Health", views: 12430, change: -1.8 },
    { name: "Science", views: 10214, change: 15.3 },
  ],
  topCountries: [
    { name: "United States", visitors: 12450, flag: "🇺🇸" },
    { name: "United Kingdom", visitors: 8920, flag: "🇬🇧" },
    { name: "India", visitors: 7650, flag: "🇮🇳" },
    { name: "Germany", visitors: 5430, flag: "🇩🇪" },
    { name: "France", visitors: 4210, flag: "🇫🇷" },
    { name: "Japan", visitors: 3890, flag: "🇯🇵" },
  ],
  hourlyTraffic: [
    1200, 980, 650, 420, 380, 520, 1800, 4200, 6800, 8200, 9100, 9800,
    10200, 9500, 8800, 9200, 8500, 7200, 6100, 5400, 4200, 3100, 2400, 1800,
  ],
  recentActivity: [
    { action: "Article Read", time: "2 min ago", detail: "Tech Giants Report Record Earnings" },
    { action: "Bookmark Added", time: "5 min ago", detail: "Global Climate Summit 2026" },
    { action: "Share", time: "8 min ago", detail: "New AI Breakthrough in Medicine" },
    { action: "Search", time: "12 min ago", detail: "electric vehicle market trends" },
    { action: "Category View", time: "15 min ago", detail: "Sports - Premier League" },
  ],
});

function SparklineChart({ data, color = "#3b82f6" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 120;
  const height = 32;
  const padding = 2;

  const points = data
    .map((value, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((value - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`${padding},${height - padding} ${points} ${width - padding},${height - padding}`}
        fill={`url(#grad-${color.replace("#", "")})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setData(generateMockData());
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [period]);

  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-3" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    { label: "Page Views", value: data.pageViews.toLocaleString(), icon: Eye, change: 8.2, color: "text-blue-600" },
    { label: "Unique Visitors", value: data.uniqueVisitors.toLocaleString(), icon: Users, change: 5.7, color: "text-green-600" },
    { label: "Avg. Session", value: `${Math.floor(data.avgSessionDuration / 60)}m ${data.avgSessionDuration % 60}s`, icon: Clock, change: 12.3, color: "text-purple-600" },
    { label: "Bounce Rate", value: `${data.bounceRate}%`, icon: TrendingUp, change: -4.1, color: "text-orange-600" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold">Analytics Overview</h2>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {(["7d", "30d", "90d"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                period === p
                  ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="flex items-center gap-1 text-xs">
              {stat.change > 0 ? (
                <ArrowUpRight className="w-3 h-3 text-green-500" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-red-500" />
              )}
              <span className={stat.change > 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(stat.change)}%
              </span>
              <span className="text-gray-400">vs last period</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5">
          <h3 className="font-semibold mb-4">Hourly Traffic</h3>
          <div className="flex items-end gap-1 h-40">
            {data.hourlyTraffic.map((value, i) => {
              const maxVal = Math.max(...data.hourlyTraffic);
              const height = (value / maxVal) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600 relative group"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {i}:00 - {value.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>0:00</span>
            <span>6:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:00</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-500" />
            Top Countries
          </h3>
          <div className="space-y-3">
            {data.topCountries.map((country) => (
              <div key={country.name} className="flex items-center gap-3">
                <span className="text-lg">{country.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{country.name}</div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${(country.visitors / data.topCountries[0].visitors) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-500 font-medium">{country.visitors.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5">
          <h3 className="font-semibold mb-4">Top Categories</h3>
          <div className="space-y-3">
            {data.topCategories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-3">
                <span className="text-sm font-medium w-24">{cat.name}</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(cat.views / data.topCategories[0].views) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-16 text-right">{cat.views.toLocaleString()}</span>
                <span className={`text-xs font-medium w-12 text-right ${cat.change > 0 ? "text-green-500" : "text-red-500"}`}>
                  {cat.change > 0 ? "+" : ""}{cat.change}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {data.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-medium">{activity.action}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{activity.detail}</div>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
