"use client";

import { useState } from "react";
import {
  Globe, Key, Rss, Zap, Webhook, Search, Settings,
  CheckCircle, XCircle, ExternalLink, Plus, Trash2,
  Edit3, Eye, EyeOff, Copy, RefreshCw, Code,
  AlertTriangle, Clock, Activity, Link, Database,
} from "lucide-react";

interface RSSFeed {
  id: string;
  name: string;
  url: string;
  category: string;
  status: "active" | "error" | "paused";
  articles: number;
  lastFetched: string;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: "active" | "inactive";
  lastTriggered: string;
  successRate: number;
}

interface GoogleNewsConfig {
  enabled: boolean;
  publisherId: string;
  topics: string[];
  language: string;
  country: string;
}

interface AIConfig {
  provider: string;
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

const MOCK_RSS: RSSFeed[] = [
  { id: "r1", name: "Reuters World", url: "https://feeds.reuters.com/reuters/worldNews", category: "World", status: "active", articles: 156, lastFetched: "5 min ago" },
  { id: "r2", name: "BBC Tech", url: "https://feeds.bbci.co.uk/news/technology/rss.xml", category: "Technology", status: "active", articles: 89, lastFetched: "10 min ago" },
  { id: "r3", name: "ESPN Sports", url: "https://www.espn.com/espn/rss/news", category: "Sports", status: "active", articles: 234, lastFetched: "3 min ago" },
  { id: "r4", name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml", category: "World", status: "error", articles: 0, lastFetched: "2 hours ago" },
  { id: "r5", name: "TechCrunch", url: "https://techcrunch.com/feed/", category: "Technology", status: "paused", articles: 45, lastFetched: "1 day ago" },
];

const MOCK_WEBHOOKS: Webhook[] = [
  { id: "w1", name: "Slack Notification", url: "https://hooks.slack.com/services/T00/B00/xxx", events: ["article.published", "breaking.news"], status: "active", lastTriggered: "2 hours ago", successRate: 100 },
  { id: "w2", name: "Analytics Pipeline", url: "https://analytics.example.com/webhook", events: ["article.viewed", "user.registered"], status: "active", lastTriggered: "15 min ago", successRate: 99.8 },
  { id: "w3", name: "Backup Trigger", url: "https://backup.example.com/trigger", events: ["daily.backup"], status: "active", lastTriggered: "6 hours ago", successRate: 100 },
];

export default function APIIntegrations() {
  const [rssFeeds, setRssFeeds] = useState(MOCK_RSS);
  const [webhooks, setWebhooks] = useState(MOCK_WEBHOOKS);
  const [googleNews, setGoogleNews] = useState<GoogleNewsConfig>({ enabled: true, publisherId: "pub-1234567890", topics: ["Technology", "Politics", "Business"], language: "en", country: "us" });
  const [aiConfig, setAiConfig] = useState<AIConfig>({ provider: "OpenAI", apiKey: "sk-xxxx...xxxx", model: "gpt-4o", maxTokens: 2048, temperature: 0.7 });
  const [activeTab, setActiveTab] = useState<"rss" | "google-news" | "ai" | "webhooks" | "settings">("rss");
  const [showApiKey, setShowApiKey] = useState(false);
  const [showAddFeed, setShowAddFeed] = useState(false);
  const [showAddWebhook, setShowAddWebhook] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [newFeed, setNewFeed] = useState({ name: "", url: "", category: "World" });
  const [newWebhook, setNewWebhook] = useState({ name: "", url: "", events: "" });

  const showNotice = (type: "success" | "error", message: string) => {
    setNotice({ type, message });
    window.setTimeout(() => setNotice(null), 5000);
  };

  const addFeed = () => {
    if (!newFeed.name || !newFeed.url) {
      showNotice("error", "Feed name and URL are required");
      return;
    }
    const feed: RSSFeed = {
      id: `r-${Date.now()}`,
      name: newFeed.name,
      url: newFeed.url,
      category: newFeed.category,
      status: "active",
      articles: 0,
      lastFetched: "Just now",
    };
    setRssFeeds((prev) => [feed, ...prev]);
    setNewFeed({ name: "", url: "", category: "World" });
    setShowAddFeed(false);
    showNotice("success", `RSS feed "${feed.name}" added.`);
  };

  const deleteFeed = (id: string) => {
    const feed = rssFeeds.find((f) => f.id === id);
    if (!confirm(`Delete feed "${feed?.name}"?`)) return;
    setRssFeeds((prev) => prev.filter((f) => f.id !== id));
    showNotice("success", `Feed "${feed?.name}" deleted.`);
  };

  const addWebhook = () => {
    if (!newWebhook.name || !newWebhook.url) {
      showNotice("error", "Webhook name and URL are required");
      return;
    }
    const events = newWebhook.events.split(",").map((e) => e.trim()).filter(Boolean);
    const webhook: Webhook = {
      id: `w-${Date.now()}`,
      name: newWebhook.name,
      url: newWebhook.url,
      events: events.length > 0 ? events : ["article.published"],
      status: "active",
      lastTriggered: "Never",
      successRate: 100,
    };
    setWebhooks((prev) => [webhook, ...prev]);
    setNewWebhook({ name: "", url: "", events: "" });
    setShowAddWebhook(false);
    showNotice("success", `Webhook "${webhook.name}" added.`);
  };

  const deleteWebhook = (id: string) => {
    const webhook = webhooks.find((w) => w.id === id);
    if (!confirm(`Delete webhook "${webhook?.name}"?`)) return;
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
    showNotice("success", `Webhook "${webhook?.name}" deleted.`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="w-6 h-6 text-green-500" />
            API & Integrations
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">RSS feeds, webhooks, and third-party integrations</p>
        </div>
      </div>

      {notice && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg mb-6 text-sm ${notice.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"}`}>
          {notice.type === "success" ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
          {notice.message}
        </div>
      )}

      {showAddFeed && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5 mb-6">
          <h3 className="font-semibold mb-4">Add RSS Feed</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Feed name (e.g. BBC World)" value={newFeed.name} onChange={(e) => setNewFeed({ ...newFeed, name: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            <select value={newFeed.category} onChange={(e) => setNewFeed({ ...newFeed, category: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm">
              {["World", "Technology", "Politics", "Business", "Sports", "Entertainment", "Health", "Science"].map((c) => <option key={c}>{c}</option>)}
            </select>
            <input placeholder="RSS URL (https://...)" value={newFeed.url} onChange={(e) => setNewFeed({ ...newFeed, url: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm font-mono md:col-span-2" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={addFeed} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">Add Feed</button>
            <button onClick={() => setShowAddFeed(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
          </div>
        </div>
      )}

      {showAddWebhook && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5 mb-6">
          <h3 className="font-semibold mb-4">Add Webhook</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Webhook name (e.g. Slack Alerts)" value={newWebhook.name} onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            <input placeholder="Events (comma separated, e.g. article.published, breaking.news)" value={newWebhook.events} onChange={(e) => setNewWebhook({ ...newWebhook, events: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            <input placeholder="Webhook URL (https://...)" value={newWebhook.url} onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm font-mono md:col-span-2" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={addWebhook} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Add Webhook</button>
            <button onClick={() => setShowAddWebhook(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><Rss className="w-4 h-4 text-orange-500" /><span className="text-xs text-gray-500">RSS Feeds</span></div>
          <p className="text-2xl font-bold">{rssFeeds.filter((f) => f.status === "active").length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><Webhook className="w-4 h-4 text-blue-500" /><span className="text-xs text-gray-500">Webhooks</span></div>
          <p className="text-2xl font-bold">{webhooks.filter((w) => w.status === "active").length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><Search className="w-4 h-4 text-purple-500" /><span className="text-xs text-gray-500">Google News</span></div>
          <p className="text-2xl font-bold">{googleNews.enabled ? "ON" : "OFF"}</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><Zap className="w-4 h-4 text-yellow-500" /><span className="text-xs text-gray-500">AI Provider</span></div>
          <p className="text-2xl font-bold">{aiConfig.provider}</p>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
        {[
          { key: "rss", label: "RSS Feeds", icon: Rss },
          { key: "google-news", label: "Google News", icon: Search },
          { key: "ai", label: "AI API", icon: Zap },
          { key: "webhooks", label: "Webhooks", icon: Webhook },
          { key: "settings", label: "Settings", icon: Settings },
        ].map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key as typeof activeTab)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex-1 ${activeTab === t.key ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            <t.icon className="w-3 h-3" /> {t.label}
          </button>
        ))}
      </div>

      {activeTab === "rss" && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700/50">
            <h3 className="font-semibold">RSS Feed Sources</h3>
            <button onClick={() => setShowAddFeed(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-600 transition-colors">
              <Plus className="w-3 h-3" /> Add Feed
            </button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {rssFeeds.map((feed) => (
              <div key={feed.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <div className={`w-2.5 h-2.5 rounded-full ${feed.status === "active" ? "bg-green-500" : feed.status === "error" ? "bg-red-500" : "bg-yellow-500"}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{feed.name}</p>
                  <p className="text-xs text-gray-400 font-mono truncate">{feed.url}</p>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 dark:bg-gray-700 rounded">{feed.category}</span>
                <span className="text-xs text-gray-400 hidden sm:block">{feed.articles} articles</span>
                <span className="text-xs text-gray-400 hidden md:block">{feed.lastFetched}</span>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"><RefreshCw className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteFeed(feed.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "google-news" && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6 space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium">Enable Google News Integration</p><p className="text-xs text-gray-400">Auto-import articles from Google News</p></div>
            <button onClick={() => setGoogleNews({ ...googleNews, enabled: !googleNews.enabled })} className={`relative w-11 h-6 rounded-full transition-colors ${googleNews.enabled ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${googleNews.enabled ? "translate-x-5" : ""}`} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Publisher ID</label><input value={googleNews.publisherId} onChange={(e) => setGoogleNews({ ...googleNews, publisherId: e.target.value })} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm font-mono" /></div>
            <div><label className="block text-sm font-medium mb-1">Language</label><select value={googleNews.language} onChange={(e) => setGoogleNews({ ...googleNews, language: e.target.value })} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"><option value="en">English</option><option value="es">Spanish</option><option value="fr">French</option><option value="de">German</option><option value="zh">Chinese</option></select></div>
          </div>
          <div><label className="block text-sm font-medium mb-2">Topics</label><div className="flex flex-wrap gap-2">{["Technology", "Politics", "Business", "Sports", "Entertainment", "Health", "Science", "World"].map((topic) => (
            <button key={topic} onClick={() => { const t = googleNews.topics.includes(topic) ? googleNews.topics.filter((x) => x !== topic) : [...googleNews.topics, topic]; setGoogleNews({ ...googleNews, topics: t }); }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${googleNews.topics.includes(topic) ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
              {topic}
          </button>))}</div></div>
        </div>
      )}

      {activeTab === "ai" && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Provider</label><select value={aiConfig.provider} onChange={(e) => setAiConfig({ ...aiConfig, provider: e.target.value })} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"><option>OpenAI</option><option>Anthropic</option><option>Google Gemini</option><option>Local LLM</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Model</label><select value={aiConfig.model} onChange={(e) => setAiConfig({ ...aiConfig, model: e.target.value })} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"><option>gpt-4o</option><option>gpt-4o-mini</option><option>gpt-3.5-turbo</option></select></div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">API Key</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input type={showApiKey ? "text" : "password"} value={aiConfig.apiKey} onChange={(e) => setAiConfig({ ...aiConfig, apiKey: e.target.value })} className="w-full px-4 py-2 pr-10 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm font-mono" />
                <button onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
                <button onClick={() => { navigator.clipboard?.writeText(aiConfig.apiKey); showNotice("success", "API key copied to clipboard."); }} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"><Copy className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Max Tokens</label><input type="number" value={aiConfig.maxTokens} onChange={(e) => setAiConfig({ ...aiConfig, maxTokens: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Temperature</label><input type="number" step="0.1" min="0" max="2" value={aiConfig.temperature} onChange={(e) => setAiConfig({ ...aiConfig, temperature: parseFloat(e.target.value) })} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" /></div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">AI API Usage</p>
                <p className="text-xs text-gray-500 mt-1">Current usage: 12,450 tokens/day. Estimated monthly cost: $45.60</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "webhooks" && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700/50">
            <h3 className="font-semibold">Webhooks</h3>
            <button onClick={() => setShowAddWebhook(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors">
              <Plus className="w-3 h-3" /> Add Webhook
            </button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {webhooks.map((wh) => (
              <div key={wh.id} className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <div className={`w-2.5 h-2.5 rounded-full ${wh.status === "active" ? "bg-green-500" : "bg-gray-300"}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{wh.name}</p>
                  <p className="text-xs text-gray-400 font-mono truncate">{wh.url}</p>
                </div>
                <div className="flex items-center gap-1">
                  {wh.events.map((e) => (
                    <span key={e} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-mono">{e}</span>
                  ))}
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-medium">{wh.successRate}%</p>
                  <p className="text-[10px] text-gray-400">{wh.lastTriggered}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteWebhook(wh.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">Auto-Fetch RSS Feeds</p><p className="text-xs text-gray-400">Automatically fetch new articles every 5 minutes</p></div>
            <button className="relative w-11 h-6 bg-blue-600 rounded-full"><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-5" /></button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">Duplicate Detection</p><p className="text-xs text-gray-400">Auto-detect and merge duplicate articles</p></div>
            <button className="relative w-11 h-6 bg-blue-600 rounded-full"><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-5" /></button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">API Rate Limiting</p><p className="text-xs text-gray-400">Limit API requests to 1000/minute</p></div>
            <button className="relative w-11 h-6 bg-blue-600 rounded-full"><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-5" /></button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">Webhook Retry Logic</p><p className="text-xs text-gray-400">Retry failed webhooks up to 3 times</p></div>
            <button className="relative w-11 h-6 bg-blue-600 rounded-full"><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-5" /></button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">CORS Settings</p><p className="text-xs text-gray-400">Configure allowed origins for API access</p></div>
            <button className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 rounded-lg text-xs font-medium">Configure</button>
          </div>
        </div>
      )}
    </div>
  );
}
