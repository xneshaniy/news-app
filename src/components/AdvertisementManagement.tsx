"use client";

import { useState } from "react";
import { Megaphone, Plus, Trash2, Eye, EyeOff, DollarSign, Calendar, Search, PauseCircle, PlayCircle } from "lucide-react";

interface Advertisement {
  id: string;
  name: string;
  type: "banner" | "sidebar" | "inline" | "popup";
  position: string;
  status: "active" | "paused" | "scheduled" | "ended";
  impressions: number;
  clicks: number;
  ctr: number;
  revenue: number;
  startDate: string;
  endDate: string;
  targetUrl: string;
}

const INITIAL_ADS: Advertisement[] = [
  { id: "ad1", name: "Tech Sponsor Banner", type: "banner", position: "Homepage Top", status: "active", impressions: 145230, clicks: 3421, ctr: 2.36, revenue: 2890, startDate: "2026-01-01", endDate: "2026-06-30", targetUrl: "https://sponsor.com" },
  { id: "ad2", name: "Newsletter Signup Promo", type: "sidebar", position: "Sidebar Widget", status: "active", impressions: 89450, clicks: 5672, ctr: 6.34, revenue: 0, startDate: "2026-01-01", endDate: "2026-12-31", targetUrl: "/newsletter" },
  { id: "ad3", name: "Breaking News Sponsor", type: "inline", position: "Article Page", status: "paused", impressions: 67800, clicks: 1234, ctr: 1.82, revenue: 1450, startDate: "2026-02-15", endDate: "2026-05-15", targetUrl: "https://sponsor2.com" },
  { id: "ad4", name: "Summer Campaign", type: "popup", position: "Exit Intent", status: "scheduled", impressions: 0, clicks: 0, ctr: 0, revenue: 0, startDate: "2026-06-01", endDate: "2026-08-31", targetUrl: "https://summer-sale.com" },
  { id: "ad5", name: "App Install Ad", type: "banner", position: "Mobile Footer", status: "active", impressions: 234560, clicks: 8901, ctr: 3.79, revenue: 4520, startDate: "2026-03-01", endDate: "2026-12-31", targetUrl: "https://worldlive.dpdns.org" },
];

const TYPE_CONFIG = {
  banner: { color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600", label: "Banner" },
  sidebar: { color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600", label: "Sidebar" },
  inline: { color: "bg-green-100 dark:bg-green-900/30 text-green-600", label: "Inline" },
  popup: { color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600", label: "Popup" },
};

const STATUS_CONFIG = {
  active: { color: "bg-green-100 dark:bg-green-900/30 text-green-600", icon: PlayCircle, label: "Active" },
  paused: { color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600", icon: PauseCircle, label: "Paused" },
  scheduled: { color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600", icon: Calendar, label: "Scheduled" },
  ended: { color: "bg-gray-100 dark:bg-gray-700 text-gray-600", icon: EyeOff, label: "Ended" },
};

export default function AdvertisementManagement() {
  const [ads, setAds] = useState<Advertisement[]>(INITIAL_ADS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newAd, setNewAd] = useState<{ name: string; type: "banner" | "sidebar" | "inline" | "popup"; position: string; targetUrl: string; startDate: string; endDate: string }>({ name: "", type: "banner", position: "", targetUrl: "", startDate: "", endDate: "" });

  const filtered = ads.filter((a) => {
    const matchesFilter = filter === "all" || a.status === filter;
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const addAd = () => {
    if (!newAd.name) return;
    const ad: Advertisement = {
      id: `ad-${Date.now()}`,
      name: newAd.name,
      type: newAd.type,
      position: newAd.position,
      status: "scheduled",
      impressions: 0,
      clicks: 0,
      ctr: 0,
      revenue: 0,
      startDate: newAd.startDate,
      endDate: newAd.endDate,
      targetUrl: newAd.targetUrl,
    };
    setAds((prev) => [ad, ...prev]);
    setNewAd({ name: "", type: "banner", position: "", targetUrl: "", startDate: "", endDate: "" });
    setShowAddForm(false);
  };

  const toggleStatus = (id: string) => {
    setAds((prev) => prev.map((a) => {
      if (a.id !== id) return a;
      if (a.status === "active") return { ...a, status: "paused" as const };
      if (a.status === "paused") return { ...a, status: "active" as const };
      return a;
    }));
  };

  const totalRevenue = ads.reduce((sum, a) => sum + a.revenue, 0);
  const totalImpressions = ads.reduce((sum, a) => sum + a.impressions, 0);
  const activeCount = ads.filter((a) => a.status === "active").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Advertisements</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your ad placements</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          New Ad
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg"><DollarSign className="w-5 h-5 text-green-600" /></div>
            <div>
              <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"><Eye className="w-5 h-5 text-blue-600" /></div>
            <div>
              <p className="text-2xl font-bold">{(totalImpressions / 1000).toFixed(0)}K</p>
              <p className="text-xs text-gray-500">Total Impressions</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg"><Megaphone className="w-5 h-5 text-purple-600" /></div>
            <div>
              <p className="text-2xl font-bold">{activeCount}</p>
              <p className="text-xs text-gray-500">Active Campaigns</p>
            </div>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5 mb-6">
          <h3 className="font-semibold mb-4">New Advertisement</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Ad name" value={newAd.name} onChange={(e) => setNewAd({ ...newAd, name: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            <select value={newAd.type} onChange={(e) => setNewAd({ ...newAd, type: e.target.value as "banner" | "sidebar" | "inline" | "popup" })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm">
              <option value="banner">Banner</option>
              <option value="sidebar">Sidebar</option>
              <option value="inline">Inline</option>
              <option value="popup">Popup</option>
            </select>
            <input placeholder="Position" value={newAd.position} onChange={(e) => setNewAd({ ...newAd, position: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            <input placeholder="Target URL" value={newAd.targetUrl} onChange={(e) => setNewAd({ ...newAd, targetUrl: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            <input type="date" value={newAd.startDate} onChange={(e) => setNewAd({ ...newAd, startDate: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            <input type="date" value={newAd.endDate} onChange={(e) => setNewAd({ ...newAd, endDate: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={addAd} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Create Ad</button>
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700/50 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input placeholder="Search ads..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm outline-none" />
          </div>
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {[{ value: "all", label: "All" }, { value: "active", label: "Active" }, { value: "paused", label: "Paused" }, { value: "scheduled", label: "Scheduled" }].map((f) => (
              <button key={f.value} onClick={() => setFilter(f.value)} className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${filter === f.value ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700/50 text-left">
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Ad</th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Type</th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-right">Impressions</th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-right">CTR</th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-right">Revenue</th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((ad) => {
                const typeCfg = TYPE_CONFIG[ad.type];
                const statusCfg = STATUS_CONFIG[ad.status];
                const StatusIcon = statusCfg.icon;
                return (
                  <tr key={ad.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{ad.name}</p>
                      <p className="text-xs text-gray-400">{ad.position}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${typeCfg.color}`}>{typeCfg.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full w-fit ${statusCfg.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">{ad.impressions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">{ad.ctr}%</td>
                    <td className="px-4 py-3 text-right font-medium">${ad.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {(ad.status === "active" || ad.status === "paused") && (
                          <button onClick={() => toggleStatus(ad.id)} className={`p-1.5 rounded-lg transition-colors ${ad.status === "active" ? "text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20" : "text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"}`} title={ad.status === "active" ? "Pause" : "Resume"}>
                            {ad.status === "active" ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                          </button>
                        )}
                        <button onClick={() => setAds((prev) => prev.filter((a) => a.id !== ad.id))} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
