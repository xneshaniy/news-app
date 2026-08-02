import type { Metadata } from "next";
import Header from "@/components/Header";
import BreakingNewsBanner from "@/components/BreakingNewsBanner";
import { Globe, Zap, Shield, Users, LineChart, Sparkles } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://worldlive.dpdns.org";

export const metadata: Metadata = {
  title: "About Us | WorldLive",
  description:
    "Learn about WorldLive — how we aggregate global news from 6+ sources, use AI to personalize your feed, and deliver breaking news from every country.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us | WorldLive",
    description:
      "Learn about WorldLive — how we aggregate global news from 6+ sources, use AI to personalize your feed, and deliver breaking news from every country.",
    url: `${SITE_URL}/about`,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | WorldLive",
    description:
      "Learn about WorldLive — how we aggregate global news from 6+ sources.",
  },
};

const features = [
  {
    icon: Globe,
    title: "Global Coverage",
    description:
      "We aggregate news from 6+ leading sources across 20 countries, delivering breaking headlines from every corner of the world.",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    description:
      "Our platform fetches live news continuously, so you always see the latest headlines as they break.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Personalization",
    description:
      "Advanced AI analyzes your reading habits to recommend stories you'll care about, and provides AI-generated summaries and fact-checking.",
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    description:
      "Every article links to its original source. We never rewrite or fabricate content — you always know where the news comes from.",
  },
  {
    icon: LineChart,
    title: "Markets & Weather",
    description:
      "Beyond headlines, we bring live stocks, crypto prices, elections coverage, and real-time weather for 20+ countries.",
  },
  {
    icon: Users,
    title: "Community Features",
    description:
      "Save favorites, bookmark articles, build reading history, and subscribe to our daily newsletter for curated top stories.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <BreakingNewsBanner />
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold mb-4">
            <Globe className="w-3.5 h-3.5" />
            ABOUT WORLD LIVE
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            World news from{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              every country
            </span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            WorldLive is an AI-powered global news platform that brings together
            breaking news, politics, business, technology, sports, and more from
            the world&apos;s most trusted sources — all in one place.
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p>
            In a world flooded with information, finding reliable, up-to-date news
            from around the globe can be overwhelming. Our mission is simple: to
            make global news accessible, trustworthy, and personalized for every
            reader — whether you&apos;re in New York, London, Tokyo, or anywhere
            else.
          </p>
          <p>
            We believe everyone deserves to understand the world around them.
            That&apos;s why we built a platform that aggregates verified news from
            multiple independent sources, uses AI to surface what matters to you,
            and always links back to the original reporting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Join thousands of readers</h2>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">
            Start exploring world news personalized for you. Free to use, no
            registration required.
          </p>
          <a
            href="/"
            className="inline-flex px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            Explore News
          </a>
        </div>
      </main>
    </div>
  );
}
