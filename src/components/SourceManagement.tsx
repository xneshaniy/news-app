"use client";

import { useState } from "react";
import {
  Globe, Key, RefreshCw, CheckCircle, XCircle, Eye, EyeOff,
  Copy, Plus, Trash2, Edit3, Settings, Activity, Clock,
  BarChart3, AlertTriangle, Zap, Database, Link, ToggleLeft,
  ToggleRight, Shield, ChevronDown, ExternalLink,
} from "lucide-react";

interface NewsSource {
  id: string;
  name: string;
  type: "api" | "rss" | "scraper";
  status: "active" | "error" | "paused" | "rate-limited" | "degraded";
  apiKey: string;
  baseUrl: string;
  articlesFetched: number;
  lastFetch: string;
  avgLatency: string;
  errorRate: number;
  rateLimit: number;
  rateUsed: number;
  categories: string[];
  countries: string[];
  priority: number;
  autoRetry: boolean;
}

const MOCK_SOURCES: NewsSource[] = [
  {
    id: "src-1", name: "NewsAPI", type: "api", status: "active",
    apiKey: "••••••••••••4024", baseUrl: "newsapi.org/v2",
    articlesFetched: 45230, lastFetch: "2 min ago", avgLatency: "245ms",
    errorRate: 0.2, rateLimit: 100, rateUsed: 34,
    categories: ["breaking", "politics", "business", "technology", "sports"],
    countries: ["us", "gb", "in", "de", "fr"], priority: 1, autoRetry: true,
  },
  {
    id: "src-2", name: "GNews", type: "api", status: "active",
    apiKey: "••••••••••••e299", baseUrl: "gnews.io/api/v4",
    articlesFetched: 28450, lastFetch: "5 min ago", avgLatency: "189ms",
    errorRate: 0.1, rateLimit: 100, rateUsed: 22,
    categories: ["breaking", "politics", "technology", "health", "science"],
    countries: ["us", "gb", "in", "au", "ca"], priority: 2, autoRetry: true,
  },
  {
    id: "src-3", name: "MediaStack", type: "api", status: "active",
    apiKey: "••••••••••••04f3", baseUrl: "mediastack.com/api/v1",
    articlesFetched: 19800, lastFetch: "8 min ago", avgLatency: "312ms",
    errorRate: 0.3, rateLimit: 100, rateUsed: 18,
    categories: ["business", "entertainment", "sports", "technology"],
    countries: ["us", "gb", "de", "jp", "br"], priority: 3, autoRetry: true,
  },
  {
    id: "src-4", name: "WorldNewsAPI", type: "api", status: "active",
    apiKey: "••••••••••••83de", baseUrl: "worldnewsapi.com/v1",
    articlesFetched: 18200, lastFetch: "10 min ago", avgLatency: "278ms",
    errorRate: 0.15, rateLimit: 100, rateUsed: 15,
    categories: ["breaking", "politics", "science", "health"],
    countries: ["us", "gb", "in", "jp", "au"], priority: 4, autoRetry: true,
  },
  {
    id: "src-5", name: "NewsAPI.ai", type: "api", status: "degraded",
    apiKey: "••••••••••••2355", baseUrl: "newsapi.ai/api/v1",
    articlesFetched: 17400, lastFetch: "15 min ago", avgLatency: "890ms",
    errorRate: 2.8, rateLimit: 100, rateUsed: 12,
    categories: ["politics", "business", "technology"],
    countries: ["us", "gb", "de", "fr"], priority: 5, autoRetry: false,
  },
  {
    id: "src-6", name: "APITube", type: "api", status: "active",
    apiKey: "••••••••••••HDS0rOu", baseUrl: "api.apitube.io/v1",
    articlesFetched: 31200, lastFetch: "3 min ago", avgLatency: "198ms",
    errorRate: 0.1, rateLimit: 100, rateUsed: 28,
    categories: ["breaking", "technology", "sports", "entertainment", "science"],
    countries: ["us", "gb", "in", "jp", "br", "de"], priority: 1, autoRetry: true,
  },
];

export default function SourceManagement() {
  const [sources, setSources] = useState(MOCK_SOURCES);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [newSource, setNewSource] = useState({
    name: "",
    type: "api" as "api" | "rss" | "scraper",
    apiKey: "",
    baseUrl: "",
  });

  const showNotice = (type: "success" | "error", message: string) => {
    setNotice({ type, message });
    window.setTimeout(() => setNotice(null), 5000);
  };

  const addSource = () => {
    if (!newSource.name || !newSource.baseUrl) {
      showNotice("error", "Name and Base URL are required");
      return;
    }
    const source: NewsSource = {
      id: `src-${Date.now()}`,
      name: newSource.name,
      type: newSource.type,
      status: "active",
      apiKey: newSource.apiKey ? "••••••••••••" + newSource.apiKey.slice(-4) : "Not configured",
      baseUrl: newSource.baseUrl,
      articlesFetched: 0,
      lastFetch: "Just now",
      avgLatency: "—",
      errorRate: 0,
      rateLimit: 100,
      rateUsed: 0,
      categories: ["breaking"],
      countries: ["us"],
      priority: sources.length + 1,
      autoRetry: true,
    };
    setSources((prev) => [source, ...prev]);
    setNewSource({ name: "", type: "api", apiKey: "", baseUrl: "" });
    setShowAddForm(false);
    showNotice("success", `${source.name} added successfully.`);
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyApiKey = (key: string) => {
    navigator.clipboard?.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSourceStatus = (id: string) => {
    setSources((prev) => prev.map((s) =>
      s.id === id ? { ...s, status: s.status === "active" ? "paused" as const : "active" as const } : s
    ));
  };

  const deleteSource = (id: string) => {
    const source = sources.find((s) => s.id === id);
    if (!confirm(`Delete source ${source?.name}? This cannot be undone.`)) return;
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  const statusColors: Record<string, string> = {
    active: "bg-green-100 dark:bg-green-900/30 text-green-600",
    error: "bg-red-100 dark:bg-red-900/30 text-red-600",
    paused: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600",
    "rate-limited": "bg-orange-100 dark:bg-orange-900/30 text-orange-600",
    degraded: "bg-orange-100 dark:bg-orange-900/30 text-orange-600",
  };

  const dotColors: Record<string, string> = {
    active: "bg-green-500",
    error: "bg-red-500",
    paused: "bg-yellow-500",
    "rate-limited": "bg-orange-500",
    degraded: "bg-orange-500",
  };

  const totalArticles = sources.reduce((s, src) => s + src.articlesFetched, 0);
  const activeSources = sources.filter((s) => s.status === "active").length;
  const avgErrorRate = sources.reduce((s, src) => s + src.errorRate, 0) / sources.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-500" />
            Source Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage news API sources, priorities, and health</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Source
        </button>
      </div>

      {notice && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg mb-6 text-sm ${notice.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"}`}>
          {notice.type === "success" ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
          {notice.message}
        </div>
      )}

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5 mb-6">
          <h3 className="font-semibold mb-4">Add News Source</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Source name (e.g. Reuters)" value={newSource.name} onChange={(e) => setNewSource({ ...newSource, name: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            <select value={newSource.type} onChange={(e) => setNewSource({ ...newSource, type: e.target.value as "api" | "rss" | "scraper" })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm">
              <option value="api">API</option>
              <option value="rss">RSS</option>
              <option value="scraper">Scraper</option>
            </select>
            <input placeholder="Base URL (e.g. newsapi.org/v2)" value={newSource.baseUrl} onChange={(e) => setNewSource({ ...newSource, baseUrl: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm md:col-span-2" />
            <input placeholder="API Key (optional)" value={newSource.apiKey} onChange={(e) => setNewSource({ ...newSource, apiKey: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm font-mono" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={addSource} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Add Source</button>
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><Database className="w-4 h-4 text-blue-500" /><span className="text-xs text-gray-500">Total Sources</span></div>
          <p className="text-2xl font-bold">{sources.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-xs text-gray-500">Active</span></div>
          <p className="text-2xl font-bold text-green-600">{activeSources}</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><Activity className="w-4 h-4 text-purple-500" /><span className="text-xs text-gray-500">Total Articles</span></div>
          <p className="text-2xl font-bold">{(totalArticles / 1000).toFixed(1)}K</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><AlertTriangle className="w-4 h-4 text-orange-500" /><span className="text-xs text-gray-500">Avg Error Rate</span></div>
          <p className="text-2xl font-bold">{avgErrorRate.toFixed(1)}%</p>
        </div>
      </div>

      <div className="space-y-3">
        {sources.map((source) => (
          <div key={source.id} className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
            <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors" onClick={() => setExpandedId(expandedId === source.id ? null : source.id)}>
              <div className={`w-2.5 h-2.5 rounded-full ${source.status === "active" ? "bg-green-500" : source.status === "error" ? "bg-red-500" : source.status === "degraded" ? "bg-orange-500" : "bg-yellow-500"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{source.name}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${statusColors[source.status]}`}>{source.status}</span>
                  <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-medium">{source.type.toUpperCase()}</span>
                  <span className="text-[10px] text-gray-400">P{source.priority}</span>
                </div>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{source.baseUrl}</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{source.articlesFetched.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">articles</p>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium">{source.avgLatency}</p>
                <p className="text-[10px] text-gray-400">latency</p>
              </div>
              <div className="text-right hidden md:block">
                <p className={`text-sm font-medium ${source.errorRate > 1 ? "text-red-500" : "text-green-500"}`}>{source.errorRate}%</p>
                <p className="text-[10px] text-gray-400">errors</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedId === source.id ? "rotate-180" : ""}`} />
            </div>

            {expandedId === source.id && (
              <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">API Key</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono truncate">
                        {showKeys.has(source.id) ? source.apiKey : source.apiKey.replace(/.{12}/, "••••••••••••")}
                      </code>
                      <button onClick={(e) => { e.stopPropagation(); toggleKeyVisibility(source.id); }} className="p-1.5 text-gray-400 hover:text-gray-600">
                        {showKeys.has(source.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); copyApiKey(source.apiKey); }} className="p-1.5 text-gray-400 hover:text-blue-500">
                        {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Rate Limit Usage</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div className={`h-2 rounded-full ${source.rateUsed / source.rateLimit > 0.8 ? "bg-red-500" : source.rateUsed / source.rateLimit > 0.5 ? "bg-yellow-500" : "bg-green-500"}`} style={{ width: `${(source.rateUsed / source.rateLimit) * 100}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{source.rateUsed}/{source.rateLimit}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Categories</label>
                  <div className="flex flex-wrap gap-1.5">
                    {source.categories.map((cat) => (
                      <span key={cat} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full text-[10px] font-medium">{cat}</span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Countries</label>
                  <div className="flex flex-wrap gap-1.5">
                    {source.countries.map((c) => (
                      <span key={c} className="px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-full text-[10px] font-medium uppercase">{c}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">Last fetch: {source.lastFetch}</span>
                    <label className="flex items-center gap-1.5 text-xs">
                      <span className="text-gray-400">Auto-retry:</span>
                      <span className={source.autoRetry ? "text-green-500" : "text-gray-400"}>{source.autoRetry ? "ON" : "OFF"}</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={(e) => { e.stopPropagation(); toggleSourceStatus(source.id); }} className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${source.status === "active" ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                      {source.status === "active" ? "Pause" : "Resume"}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); }} className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"><RefreshCw className="w-3.5 h-3.5" /></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteSource(source.id); }} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
