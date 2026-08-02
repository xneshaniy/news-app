"use client";

import { use } from "react";
import Header from "@/components/Header";
import NewsFeed from "@/components/NewsFeed";
import BreakingNewsBanner from "@/components/BreakingNewsBanner";
import { CATEGORIES } from "@/lib/constants";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useSEOMeta } from "@/lib/seo";
import {
  Zap,
  Landmark,
  Briefcase,
  Cpu,
  Trophy,
  Film,
  HeartPulse,
  FlaskConical,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  breaking: <Zap className="w-6 h-6" />,
  politics: <Landmark className="w-6 h-6" />,
  business: <Briefcase className="w-6 h-6" />,
  technology: <Cpu className="w-6 h-6" />,
  sports: <Trophy className="w-6 h-6" />,
  entertainment: <Film className="w-6 h-6" />,
  health: <HeartPulse className="w-6 h-6" />,
  science: <FlaskConical className="w-6 h-6" />,
};

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const category = CATEGORIES.find((c) => c.slug === slug);
  const categoryName = category?.name || slug;

  useSEOMeta(`${categoryName} News`, {
    description: `Latest ${categoryName.toLowerCase()} news, headlines and updates from around the world.`,
    canonicalPath: `/category/${slug}`,
    type: "website",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: categoryName, url: `/category/${slug}` },
    ],
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <BreakingNewsBanner />
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: categoryName },
          ]}
        />
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              {categoryIcons[slug] || <Zap className="w-6 h-6" />}
            </div>
            <h1 className="text-3xl font-bold">
              {categoryName}
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 ml-14">
            Latest {categoryName.toLowerCase()} news and updates
          </p>
        </div>
        <NewsFeed category={slug} pageSize={20} />
      </main>
    </div>
  );
}
