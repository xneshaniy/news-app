"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Share2, BarChart3, Plus, Settings, Globe, AlertCircle,
  CheckCircle, Link2, Unlink, RefreshCw, X, ExternalLink,
} from "lucide-react";

interface SocialAccount {
  id: string;
  platform: string;
  handle: string;
  connected: boolean;
  connectedAt?: string;
  lastPost: string;
  followers: string;
  engagement: string;
  posts: number;
  color: string;
  oauth?: boolean;
}

const PLATFORMS = [
  { key: "facebook", name: "Facebook", color: "from-blue-600 to-blue-700", icon: "F" },
  { key: "x", name: "X (Twitter)", color: "from-gray-800 to-black", icon: "X" },
  { key: "linkedin", name: "LinkedIn", color: "from-blue-700 to-blue-800", icon: "in" },
  { key: "instagram", name: "Instagram", color: "from-purple-500 to-pink-500", icon: "IG" },
  { key: "youtube", name: "YouTube", color: "from-red-500 to-red-600", icon: "YT" },
  { key: "tiktok", name: "TikTok", color: "from-gray-900 to-gray-700", icon: "TT" },
];

interface Notice {
  type: "success" | "error" | "info";
  message: string;
}

export default function SocialMediaManagement() {
  const searchParams = useSearchParams();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"accounts" | "settings">("accounts");
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const showNotice = useCallback((type: Notice["type"], message: string) => {
    setNotice({ type, message });
    window.setTimeout(() => setNotice(null), 6000);
  }, []);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/social");
      if (!res.ok) throw new Error("Failed to load accounts");
      const data = await res.json();
      setAccounts(data.accounts || []);
    } catch {
      showNotice("error", "Could not load social accounts. Check that you are logged in as admin.");
    } finally {
      setLoading(false);
    }
  }, [showNotice]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  useEffect(() => {
    const connectedMsg = searchParams.get("connected");
    const errorMsg = searchParams.get("error");
    if (connectedMsg) {
      showNotice("success", connectedMsg);
      loadAccounts();
    } else if (errorMsg) {
      showNotice("error", errorMsg);
    }
    if (connectedMsg || errorMsg) {
      window.history.replaceState({}, "", "/admin/social");
    }
  }, [searchParams, showNotice, loadAccounts]);

  const connectAccount = async (platformKey: string) => {
    setConnecting(platformKey);
    try {
      const res = await fetch("/api/admin/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: platformKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to connect account");

      if (data.mode === "oauth" && data.url) {
        showNotice("info", data.message || "Redirecting to platform...");
        window.location.href = data.url;
        return;
      }

      setAccounts((prev) => [data.account, ...prev]);
      showNotice("success", data.message || `${data.account.platform} connected.`);
      setShowConnectModal(false);
    } catch (e) {
      showNotice("error", e instanceof Error ? e.message : "Failed to connect account");
    } finally {
      setConnecting(null);
    }
  };

  const disconnectAccount = async (account: SocialAccount) => {
    if (!confirm(`Disconnect ${account.platform} (${account.handle})? You can reconnect any time.`)) return;
    try {
      const res = await fetch(`/api/admin/social?id=${account.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to disconnect");
      setAccounts((prev) => prev.filter((a) => a.id !== account.id));
      showNotice("success", data.message || `${account.platform} disconnected.`);
    } catch (e) {
      showNotice("error", e instanceof Error ? e.message : "Failed to disconnect account");
    }
  };

  const reconnectAccount = async (account: SocialAccount) => {
    const platform = PLATFORMS.find((p) => p.name === account.platform);
    if (!platform) return;
    setConnecting(account.id);
    try {
      await disconnectAccount(account);
      await new Promise((r) => setTimeout(r, 100));
      await connectAccount(platform.key);
    } catch {
      // handled in helpers
    } finally {
      setConnecting(null);
    }
  };

  const noticeStyle = {
    success: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700/50",
    error: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700/50",
    info: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700/50",
  };

  const NoticeIcon = notice?.type === "success" ? CheckCircle : notice?.type === "error" ? AlertCircle : AlertCircle;

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
        <button
          onClick={() => setShowConnectModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Connect Account
        </button>
      </div>

      {notice && (
        <div className={`flex items-center gap-2 border px-4 py-3 rounded-lg mb-6 text-sm ${noticeStyle[notice.type]}`}>
          <NoticeIcon className="w-4 h-4 flex-shrink-0" />
          {notice.message}
        </div>
      )}

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6 w-fit">
        {[
          { key: "accounts", label: `Accounts (${accounts.length})`, icon: Globe },
          { key: "settings", label: "Settings", icon: Settings },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as typeof activeTab)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === t.key ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <t.icon className="w-3 h-3" /> {t.label}
          </button>
        ))}
      </div>

      {activeTab === "accounts" && (
        <div>
          {loading ? (
            <div className="p-8 text-center text-sm text-gray-500">Loading accounts...</div>
          ) : accounts.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No social accounts connected. Click &quot;Connect Account&quot; to get started.
            </div>
          ) : (
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
                    <span className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full ${acc.connected ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>
                      <CheckCircle className="w-3 h-3" />
                      Connected
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
                  <p className="text-xs text-gray-400 mt-3 mb-3">
                    {acc.connectedAt ? `Connected ${acc.connectedAt}` : ""}
                    {acc.oauth ? " · Real OAuth" : " · Simulated (no API keys configured)"}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => reconnectAccount(acc)}
                      disabled={connecting === acc.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${connecting === acc.id ? "animate-spin" : ""}`} />
                      Reconnect
                    </button>
                    <button
                      onClick={() => disconnectAccount(acc)}
                      disabled={connecting === acc.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                    >
                      <Unlink className="w-3 h-3" />
                      Disconnect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
        </div>
      )}

      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowConnectModal(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700/50">
              <div>
                <h3 className="font-semibold">Connect Account</h3>
                <p className="text-xs text-gray-400 mt-0.5">Select a platform to connect</p>
              </div>
              <button onClick={() => setShowConnectModal(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PLATFORMS.map((platform) => {
                const alreadyConnected = accounts.some((a) => a.platform === platform.name);
                return (
                  <button
                    key={platform.key}
                    onClick={() => connectAccount(platform.key)}
                    disabled={connecting === platform.key || alreadyConnected}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      alreadyConnected
                        ? "border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md"
                    }`}
                  >
                    <div className={`w-9 h-9 bg-gradient-to-br ${platform.color} rounded-lg flex items-center justify-center text-white text-xs font-bold`}>
                      {platform.icon}
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-semibold">{platform.name}</p>
                      <p className="text-[10px] text-gray-400">
                        {alreadyConnected ? "Already connected" : connecting === platform.key ? "Connecting..." : "Click to connect"}
                      </p>
                    </div>
                    {alreadyConnected ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Link2 className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="px-6 pb-5">
              <div className="flex items-start gap-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg p-3 text-xs text-gray-500 dark:text-gray-400">
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <p>
                  Platforms with configured Client ID &amp; Client Secret (env variables)
                  will use real OAuth. Others connect in simulated mode so you can test the
                  workflow before adding API keys.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
