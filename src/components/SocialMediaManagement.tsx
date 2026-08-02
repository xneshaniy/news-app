"use client";

import { useState } from "react";
import {
  Share2, Clock, CheckCircle, XCircle,
  BarChart3, ExternalLink, RefreshCw, Plus, Settings,
  Eye, MessageSquare, Heart, TrendingUp, Zap, Globe,
} from "lucide-react";

interface SocialAccount {
  id: string;
  platform: string;
  handle: string;
  connected: boolean;
  lastPost: string;
  followers: string;
  engagement: string;
  posts: number;
  color: string;
}

interface SocialPost {
  id: string;
  article: string;
  platforms: string[];
  status: "published" | "scheduled" | "failed";
  scheduledFor?: string;
  publishedAt?: string;
  clicks: number;
  shares: number;
  likes: number;
}

const MOCK_ACCOUNTS: SocialAccount[] = [
  { id: "s1", platform: "Facebook", handle: "@WorldLiveDaily", connected: true, lastPost: "2 hours ago", followers: "245K", engagement: "3.2%", posts: 1234, color: "from-blue-600 to-blue-700" },
  { id: "s2", platform: "X (Twitter)", handle: "@WorldLiveDaily", connected: true, lastPost: "30 min ago", followers: "189K", engagement: "2.8%", posts: 4567, color: "from-gray-800 to-black" },
  { id: "s3", platform: "LinkedIn", handle: "WorldLive Inc.", connected: true, lastPost: "1 hour ago", followers: "67K", engagement: "4.1%", posts: 890, color: "from-blue-700 to-blue-800" },
  { id: "s4", platform: "Instagram", handle: "@globalnews", connected: false, lastPost: "Never", followers: "0", engagement: "0%", posts: 0, color: "from-purple-500 to-pink-500" },
];

const MOCK_POSTS: SocialPost[] = [
  { id: "p1", article: "AI Revolution in Healthcare: New Breakthrough", platforms: ["Facebook", "X (Twitter)", "LinkedIn"], status: "published", publishedAt: "2 hours ago", clicks: 1234, shares: 89, likes: 456 },
  { id: "p2", article: "Global Climate Summit Reaches Historic Agreement", platforms: ["Facebook", "X (Twitter)"], status: "published", publishedAt: "5 hours ago", clicks: 890, shares: 123, likes: 678 },
  { id: "p3", article: "Stock Markets Rally on Positive Economic Data", platforms: ["LinkedIn", "X (Twitter)"], status: "scheduled", scheduledFor: "In 3 hours", clicks: 0, shares: 0, likes: 0 },
  { id: "p4", article: "Breaking: Major Tech Company Announces Merger", platforms: ["Facebook"], status: "failed", clicks: 0, shares: 0, likes: 0 },
];

export default function SocialMediaManagement() {
  const [accounts, setAccounts] = useState(MOCK_ACCOUNTS);
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [activeTab, setActiveTab] = useState<"accounts" | "posts" | "analytics" | "settings">("accounts");

  const totalClicks = posts.reduce((s, p) => s + p.clicks, 0);
  const totalShares = posts.reduce((s, p) => s + p.shares, 0);
  const totalLikes = posts.reduce((s, p) => s + p.likes, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Share2 className="w-6 h-6 text-blue-500" />
            Social Media Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Auto-publishing and social analytics</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Connect Account
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><Eye className="w-4 h-4 text-blue-500" /><span className="text-xs text-gray-500">Total Clicks</span></div>
          <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><Share2 className="w-4 h-4 text-green-500" /><span className="text-xs text-gray-500">Total Shares</span></div>
          <p className="text-2xl font-bold">{totalShares.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><Heart className="w-4 h-4 text-red-500" /><span className="text-xs text-gray-500">Total Likes</span></div>
          <p className="text-2xl font-bold">{totalLikes.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-purple-500" /><span className="text-xs text-gray-500">Avg Engagement</span></div>
          <p className="text-2xl font-bold">3.4%</p>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
        {[
          { key: "accounts", label: "Accounts", icon: Globe },
          { key: "posts", label: "Posts", icon: Share2 },
          { key: "analytics", label: "Analytics", icon: BarChart3 },
          { key: "settings", label: "Settings", icon: Settings },
        ].map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key as typeof activeTab)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex-1 ${activeTab === t.key ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            <t.icon className="w-3 h-3" /> {t.label}
          </button>
        ))}
      </div>

      {activeTab === "accounts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((acc) => (
            <div key={acc.id} className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${acc.color} rounded-xl flex items-center justify-center text-white text-sm font-bold`}>
                    {acc.platform[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{acc.platform}</p>
                    <p className="text-xs text-gray-400">{acc.handle}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${acc.connected ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>
                  {acc.connected ? "Connected" : "Not Connected"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <p className="text-sm font-bold">{acc.followers}</p>
                  <p className="text-[10px] text-gray-400">Followers</p>
                </div>
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <p className="text-sm font-bold">{acc.engagement}</p>
                  <p className="text-[10px] text-gray-400">Engagement</p>
                </div>
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <p className="text-sm font-bold">{acc.posts.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">Posts</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">Last post: {acc.lastPost}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "posts" && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <div className={`w-2.5 h-2.5 rounded-full ${post.status === "published" ? "bg-green-500" : post.status === "scheduled" ? "bg-yellow-500" : "bg-red-500"}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{post.article}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {post.platforms.map((p) => (
                      <span key={p} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-medium">{p}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  {post.status === "published" && (
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{post.clicks} clicks</span>
                      <span>{post.shares} shares</span>
                      <span>{post.likes} likes</span>
                    </div>
                  )}
                  {post.status === "scheduled" && <span className="text-xs text-yellow-500">{post.scheduledFor}</span>}
                  {post.status === "failed" && <span className="text-xs text-red-500">Failed to publish</span>}
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${post.status === "published" ? "bg-green-100 dark:bg-green-900/30 text-green-600" : post.status === "scheduled" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600" : "bg-red-100 dark:bg-red-900/30 text-red-600"}`}>
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6">
            <h3 className="font-semibold mb-4">Platform Performance</h3>
            <div className="space-y-4">
              {[
                { platform: "Facebook", clicks: 2124, shares: 212, likes: 1134, color: "bg-blue-600" },
                { platform: "X (Twitter)", clicks: 1890, shares: 345, likes: 890, color: "bg-gray-800" },
                { platform: "LinkedIn", clicks: 456, shares: 67, likes: 234, color: "bg-blue-700" },
              ].map((p) => (
                <div key={p.platform} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium">{p.platform}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-400">Clicks</span>
                          <span className="font-medium">{p.clicks.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full"><div className={`h-2 ${p.color} rounded-full`} style={{ width: `${(p.clicks / 2124) * 100}%` }} /></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-400">Shares</span>
                          <span className="font-medium">{p.shares}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full"><div className="h-2 bg-green-500 rounded-full" style={{ width: `${(p.shares / 345) * 100}%` }} /></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-400">Likes</span>
                          <span className="font-medium">{p.likes}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full"><div className="h-2 bg-red-500 rounded-full" style={{ width: `${(p.likes / 1134) * 100}%` }} /></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">Auto-Publish New Articles</p><p className="text-xs text-gray-400">Automatically share new articles on connected platforms</p></div>
            <button className="relative w-11 h-6 bg-blue-600 rounded-full"><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-5" /></button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">Include Featured Image</p><p className="text-xs text-gray-400">Attach article featured image to social posts</p></div>
            <button className="relative w-11 h-6 bg-blue-600 rounded-full"><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-5" /></button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">Hashtag Auto-Generation</p><p className="text-xs text-gray-400">Generate relevant hashtags from article content</p></div>
            <button className="relative w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full" /></button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">Thread Mode (X)</p><p className="text-xs text-gray-400">Post long articles as a thread on X/Twitter</p></div>
            <button className="relative w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
