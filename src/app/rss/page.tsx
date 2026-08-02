"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import NewsCard from "@/components/NewsCard";
import { Article } from "@/types/news";
import { Rss, Plus, Trash2, Globe, RefreshCw, Loader2, ExternalLink } from "lucide-react";

interface RSSFeed {
  id: string;
  name: string;
  url: string;
  lastFetched: string;
  articleCount: number;
}

const POPULAR_RSS_FEEDS = [
  { name: "BBC News", url: "http://feeds.bbci.co.uk/news/rss.xml" },
  { name: "CNN", url: "http://rss.cnn.com/rss/edition.rss" },
  { name: "Reuters", url: "https://www.reutersagency.com/feed/" },
  { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" },
  { name: "TechCrunch", url: "https://techcrunch.com/feed/" },
  { name: "The Verge", url: "https://www.theverge.com/rss/index.xml" },
  { name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index" },
  { name: "Hacker News", url: "https://hnrss.org/frontpage" },
];

export default function RSSPage() {
  const [feeds, setFeeds] = useState<RSSFeed[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [newFeedName, setNewFeedName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("rssFeeds");
    if (saved) {
      try {
        setFeeds(JSON.parse(saved));
      } catch {
        setFeeds([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("rssFeeds", JSON.stringify(feeds));
  }, [feeds]);

  const parseRSS = (xmlText: string, feedName: string): Article[] => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "text/xml");
    const items = xml.querySelectorAll("item");
    const articles: Article[] = [];

    items.forEach((item, i) => {
      const title = item.querySelector("title")?.textContent || "";
      const description = item.querySelector("description")?.textContent || "";
      const link = item.querySelector("link")?.textContent || "";
      const pubDate = item.querySelector("pubDate")?.textContent || new Date().toISOString();
      const enclosure = item.querySelector("enclosure");
      const image = enclosure?.getAttribute("url") || "";

      if (title) {
        articles.push({
          id: `rss-${feedName}-${i}-${Date.now()}`,
          title,
          description: description.replace(/<[^>]*>/g, ""),
          content: description,
          url: link,
          image,
          publishedAt: pubDate,
          source: { name: feedName, url: link },
        });
      }
    });

    return articles;
  };

  const fetchFeed = async (url: string, name: string): Promise<Article[]> => {
    try {
      const proxyUrl = `/api/rss?url=${encodeURIComponent(url)}`;
      const res = await fetch(proxyUrl);
      const data = await res.json();
      if (data.content) {
        return parseRSS(data.content, name);
      }
    } catch {
      // fallback to mock data
    }
    return [];
  };

  const addFeed = async (url: string, name: string) => {
    const newFeed: RSSFeed = {
      id: `feed-${Date.now()}`,
      name,
      url,
      lastFetched: new Date().toISOString(),
      articleCount: 0,
    };

    setFeeds((prev) => [...prev, newFeed]);
    setNewFeedUrl("");
    setNewFeedName("");
    setShowAddForm(false);
    await refreshFeeds();
  };

  const removeFeed = (id: string) => {
    setFeeds((prev) => prev.filter((f) => f.id !== id));
  };

  const refreshFeeds = async () => {
    setLoading(true);
    const allArticles: Article[] = [];

    for (const feed of feeds) {
      const feedArticles = await fetchFeed(feed.url, feed.name);
      allArticles.push(...feedArticles);
    }

    const seen = new Set<string>();
    const unique = allArticles.filter((a) => {
      const key = a.title.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    unique.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    setArticles(unique);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <Rss className="w-6 h-6 text-orange-600" />
              </div>
              <h1 className="text-3xl font-bold">RSS Feeds</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 ml-14">
              Import and read your favorite RSS feeds
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshFeeds}
              disabled={loading || feeds.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh All
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Feed
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6 mb-6">
            <h3 className="font-semibold mb-4">Add RSS Feed</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Feed name"
                value={newFeedName}
                onChange={(e) => setNewFeedName(e.target.value)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
              />
              <input
                type="url"
                placeholder="RSS feed URL"
                value={newFeedUrl}
                onChange={(e) => setNewFeedUrl(e.target.value)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
              />
              <button
                onClick={() => {
                  if (newFeedUrl && newFeedName) {
                    addFeed(newFeedUrl, newFeedName);
                  }
                }}
                disabled={!newFeedUrl || !newFeedName}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50 transition-colors"
              >
                Add Feed
              </button>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Popular Feeds
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_RSS_FEEDS.map((feed) => (
                  <button
                    key={feed.name}
                    onClick={() => {
                      setNewFeedName(feed.name);
                      setNewFeedUrl(feed.url);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Globe className="w-3 h-3" />
                    {feed.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {feeds.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {feeds.map((feed) => (
              <div
                key={feed.id}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg"
              >
                <Rss className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium">{feed.name}</span>
                <button
                  onClick={() => removeFeed(feed.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Fetching feeds...</p>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} showActions />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Rss className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {feeds.length === 0 ? "No RSS feeds added" : "No articles yet"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {feeds.length === 0
                ? "Add your first RSS feed to get started"
                : "Click Refresh All to fetch articles"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
