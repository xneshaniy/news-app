"use client";

import Header from "@/components/Header";
import NewsFeed from "@/components/NewsFeed";
import BreakingNewsBanner from "@/components/BreakingNewsBanner";
import LiveNewsTicker from "@/components/LiveNewsTicker";
import WeatherWidget from "@/components/WeatherWidget";
import StockWidget from "@/components/StockWidget";
import CryptoWidget from "@/components/CryptoWidget";
import TrendingNews from "@/components/TrendingNews";
import NewsletterSubscription from "@/components/NewsletterSubscription";
import AdUnit from "@/components/AdUnit";
import { useLanguage } from "@/components/LanguageProvider";
import { useSEOMeta } from "@/lib/seo";
import { Sparkles, Globe, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { t } = useLanguage();

  useSEOMeta("WorldLive - World News from Every Country", {
    description:
      "Stay informed with breaking news, politics, business, technology, sports, entertainment, health, and science from around the world. AI-powered news from 6+ sources.",
    canonicalPath: "/",
    type: "website",
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <BreakingNewsBanner />
      <LiveNewsTicker />
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <AdUnit slot="1934941881" format="auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{t("home.title")}</h1>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Powered
                </div>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                {t("home.subtitle")}
              </p>
            </div>

            <TrendingNews />

            <div className="mb-8">
              <AdUnit slot="1934941881" format="horizontal" />
            </div>

            <NewsFeed pageSize={20} showActions />
          </div>

          <div className="space-y-6">
            <AdUnit slot="1934941881" format="vertical" />
            <NewsletterSubscription variant="sidebar" />
            <WeatherWidget />
            <StockWidget />
            <CryptoWidget />

            <Link
              href="/recommendations"
              className="block bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 text-white text-center hover:shadow-lg transition-shadow"
            >
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-90" />
              <p className="font-semibold">{t("home.forYou")}</p>
              <p className="text-xs opacity-80 mt-1">
                Personalized news powered by AI
              </p>
            </Link>

            <Link
              href="/country-recommendations"
              className="block bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 text-white text-center hover:shadow-lg transition-shadow"
            >
              <Globe className="w-8 h-8 mx-auto mb-2 opacity-90" />
              <p className="font-semibold">Country News</p>
              <p className="text-xs opacity-80 mt-1">
                News by your country selection
              </p>
            </Link>

            <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Quick Links
              </h3>
              <div className="space-y-2">
                {[
                  { href: "/live-tv", label: "Live TV News", emoji: "📺" },
                  { href: "/podcasts", label: "News Podcasts", emoji: "🎙️" },
                  { href: "/elections", label: "Election Results", emoji: "🗳️" },
                  { href: "/bookmarks", label: "My Bookmarks", emoji: "📑" },
                  { href: "/admin", label: "Admin Dashboard", emoji: "⚙️" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <span className="text-lg">{link.emoji}</span>
                    <span className="text-sm font-medium">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
