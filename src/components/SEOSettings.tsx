"use client";

import { useState } from "react";
import { Globe, Code, Save, Check, BarChart3, AlertTriangle } from "lucide-react";

interface SEOSettings {
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  ogImage: string;
  twitterHandle: string;
  googleAnalyticsId: string;
  googleSearchConsole: string;
  bingVerification: string;
  defaultKeywords: string[];
  robotsTxt: string;
  sitemapEnabled: boolean;
  canonicalUrl: string;
  structuredData: boolean;
  metaRobots: string;
}

const DEFAULT_SETTINGS: SEOSettings = {
  siteTitle: "WorldLive - World News from Every Country",
  siteDescription: "Stay informed with breaking news, politics, business, technology, sports, entertainment, health, and science from around the world.",
  siteUrl: "https://worldlive.dpdns.org",
  ogImage: "/og-image.png",
  twitterHandle: "@globalnews",
  googleAnalyticsId: "G-XXXXXXXXXX",
  googleSearchConsole: "",
  bingVerification: "",
  defaultKeywords: ["news", "world news", "breaking news", "politics", "technology", "sports", "entertainment"],
  robotsTxt: "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://worldlive.dpdns.org/sitemap.xml",
  sitemapEnabled: true,
  canonicalUrl: "https://worldlive.dpdns.org",
  structuredData: true,
  metaRobots: "index, follow",
};

export default function SEOSettingsPanel() {
  const [settings, setSettings] = useState<SEOSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [tab, setTab] = useState<"general" | "social" | "analytics" | "advanced">("general");

  const saveSettings = () => {
    localStorage.setItem("seo-settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addKeyword = () => {
    if (newKeyword && !settings.defaultKeywords.includes(newKeyword)) {
      setSettings((prev) => ({ ...prev, defaultKeywords: [...prev.defaultKeywords, newKeyword] }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (kw: string) => {
    setSettings((prev) => ({ ...prev, defaultKeywords: prev.defaultKeywords.filter((k) => k !== kw) }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">SEO Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Optimize your site for search engines</p>
        </div>
        <button onClick={saveSettings} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Settings</>}
        </button>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6 overflow-x-auto">
        {[
          { key: "general", label: "General", icon: Globe },
          { key: "social", label: "Social Media", icon: Share2 },
          { key: "analytics", label: "Analytics", icon: BarChart3 },
          { key: "advanced", label: "Advanced", icon: Code },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${tab === t.key ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            <t.icon className="w-3 h-3" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6">
        {tab === "general" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Site Title</label>
              <input value={settings.siteTitle} onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
              <p className="text-xs text-gray-400 mt-1">{settings.siteTitle.length}/60 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Meta Description</label>
              <textarea value={settings.siteDescription} onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm h-24 resize-none" />
              <p className="text-xs text-gray-400 mt-1">{settings.siteDescription.length}/160 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Site URL</label>
              <input value={settings.siteUrl} onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Default Keywords</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {settings.defaultKeywords.map((kw) => (
                  <span key={kw} className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                    {kw}
                    <button onClick={() => removeKeyword(kw)} className="text-gray-400 hover:text-red-500"><AlertTriangle className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addKeyword()} placeholder="Add keyword" className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
                <button onClick={addKeyword} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Add</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Meta Robots</label>
              <select value={settings.metaRobots} onChange={(e) => setSettings({ ...settings, metaRobots: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm">
                <option value="index, follow">Index, Follow (default)</option>
                <option value="noindex, follow">No Index, Follow</option>
                <option value="index, nofollow">Index, No Follow</option>
                <option value="noindex, nofollow">No Index, No Follow</option>
              </select>
            </div>
          </div>
        )}

        {tab === "social" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">OG Image</label>
              <input value={settings.ogImage} onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
              <p className="text-xs text-gray-400 mt-1">Recommended: 1200x630px</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Twitter Handle</label>
              <input value={settings.twitterHandle} onChange={(e) => setSettings({ ...settings, twitterHandle: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Preview</p>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded mb-3 flex items-center justify-center text-gray-400 text-xs">OG Image Preview</div>
                <p className="font-medium text-sm">{settings.siteTitle}</p>
                <p className="text-xs text-gray-500 mt-1">{settings.siteDescription}</p>
                <p className="text-xs text-blue-500 mt-1">{settings.siteUrl}</p>
              </div>
            </div>
          </div>
        )}

        {tab === "analytics" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Google Analytics ID</label>
              <input value={settings.googleAnalyticsId} onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })} placeholder="G-XXXXXXXXXX" className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Google Search Console Verification</label>
              <input value={settings.googleSearchConsole} onChange={(e) => setSettings({ ...settings, googleSearchConsole: e.target.value })} placeholder="Verification code" className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Bing Verification</label>
              <input value={settings.bingVerification} onChange={(e) => setSettings({ ...settings, bingVerification: e.target.value })} placeholder="Verification code" className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            </div>
          </div>
        )}

        {tab === "advanced" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sitemap</p>
                <p className="text-xs text-gray-400">Auto-generate XML sitemap</p>
              </div>
              <button onClick={() => setSettings({ ...settings, sitemapEnabled: !settings.sitemapEnabled })} className={`relative w-11 h-6 rounded-full transition-colors ${settings.sitemapEnabled ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.sitemapEnabled ? "translate-x-5" : ""}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Structured Data (JSON-LD)</p>
                <p className="text-xs text-gray-400">Enable rich results in search</p>
              </div>
              <button onClick={() => setSettings({ ...settings, structuredData: !settings.structuredData })} className={`relative w-11 h-6 rounded-full transition-colors ${settings.structuredData ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.structuredData ? "translate-x-5" : ""}`} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">robots.txt</label>
              <textarea value={settings.robotsTxt} onChange={(e) => setSettings({ ...settings, robotsTxt: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm font-mono h-32 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Canonical URL</label>
              <input value={settings.canonicalUrl} onChange={(e) => setSettings({ ...settings, canonicalUrl: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Share2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
    </svg>
  );
}
