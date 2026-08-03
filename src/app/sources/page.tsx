import type { Metadata } from "next";
import Header from "@/components/Header";
import BreakingNewsBanner from "@/components/BreakingNewsBanner";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ExternalLink, Newspaper, Link2, Globe, ShieldCheck } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://worldlive.dpdns.org";

export const metadata: Metadata = {
  title: "News Sources & Backlinks | WorldLive",
  description:
    "Discover where WorldLive gathers its news. We aggregate headlines from trusted data providers and link back to leading news publishers around the world for full transparency.",
  alternates: { canonical: "/sources" },
  openGraph: {
    title: "News Sources & Backlinks | WorldLive",
    description:
      "Discover where WorldLive gathers its news from trusted data providers and leading publishers worldwide.",
    url: `${SITE_URL}/sources`,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "News Sources & Backlinks | WorldLive",
    description:
      "Discover where WorldLive gathers its news from trusted data providers and leading publishers worldwide.",
  },
};

const dataProviders = [
  {
    name: "NewsAPI",
    url: "https://newsapi.org",
    description:
      "Aggregated headlines from 150,000+ news sources worldwide, powering our global breaking news coverage.",
  },
  {
    name: "GNews",
    url: "https://gnews.io",
    description:
      "Real-time headlines and search across 50,000+ sources in 80+ countries, keeping our feed fresh.",
  },
  {
    name: "MediaStack",
    url: "https://mediastack.com",
    description:
      "Live global news API with data from 7,500+ sources, used for our business and technology coverage.",
  },
  {
    name: "World News API",
    url: "https://worldnewsapi.com",
    description:
      "Structured news data covering politics, sports, science, and more from hundreds of trusted outlets.",
  },
  {
    name: "NewsData.io",
    url: "https://newsdata.io",
    description:
      "Real-time news aggregation from 60+ countries with topic and country filtering for our regional feeds.",
  },
  {
    name: "NewsAPI.ai",
    url: "https://newsapi.ai",
    description:
      "AI-curated news intelligence and analysis, helping us surface trending and verified stories.",
  },
];

const globalPublishers = [
  { name: "BBC News", url: "https://www.bbc.com/news", country: "UK" },
  { name: "CNN", url: "https://www.cnn.com", country: "USA" },
  { name: "Reuters", url: "https://www.reuters.com", country: "Global" },
  { name: "The Guardian", url: "https://www.theguardian.com", country: "UK" },
  { name: "Al Jazeera", url: "https://www.aljazeera.com", country: "Qatar" },
  { name: "Associated Press", url: "https://apnews.com", country: "USA" },
  { name: "The New York Times", url: "https://www.nytimes.com", country: "USA" },
  { name: "The Washington Post", url: "https://www.washingtonpost.com", country: "USA" },
  { name: "Bloomberg", url: "https://www.bloomberg.com", country: "Global" },
  { name: "Forbes", url: "https://www.forbes.com", country: "USA" },
  { name: "Nikkei", url: "https://asia.nikkei.com", country: "Japan" },
  { name: "South China Morning Post", url: "https://www.scmp.com", country: "China" },
  { name: "The Times of India", url: "https://timesofindia.indiatimes.com", country: "India" },
  { name: "Dawn", url: "https://www.dawn.com", country: "Pakistan" },
  { name: "Arab News", url: "https://www.arabnews.com", country: "Saudi Arabia" },
  { name: "Nigerian Tribune", url: "https://tribuneonlineng.com", country: "Nigeria" },
  { name: "Ahram Online", url: "https://english.ahram.org.eg", country: "Egypt" },
  { name: "Anadolu Agency", url: "https://www.aa.com.tr/en", country: "Turkey" },
  { name: "TASS", url: "https://tass.com", country: "Russia" },
  { name: "Deutsche Welle", url: "https://www.dw.com", country: "Germany" },
];

export default function SourcesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <BreakingNewsBanner />
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "News Sources" }]} />
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold mb-4">
            <Link2 className="w-3.5 h-3.5" />
            SOURCES & BACKLINKS
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Where our news comes from
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
            WorldLive aggregates headlines from trusted data providers and always
            links back to the original publisher. We never rewrite or fabricate
            content — every article carries a link to its source so you can
            verify the reporting yourself.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-6">
            <Globe className="w-5 h-5 text-blue-600" />
            Data Providers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dataProviders.map((provider) => (
              <a
                key={provider.name}
                href={provider.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-5 hover:shadow-lg dark:hover:shadow-gray-900/50 hover:border-blue-400 dark:hover:border-blue-600 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                    {provider.name}
                  </h3>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {provider.description}
                </p>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
            <Newspaper className="w-5 h-5 text-blue-600" />
            Featured Publishers
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-2xl">
            Stories on WorldLive regularly come from these leading publishers,
            among thousands of others indexed by our data providers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {globalPublishers.map((publisher) => (
              <a
                key={publisher.name}
                href={publisher.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group flex items-center justify-between bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 px-4 py-3 hover:border-blue-400 dark:hover:border-blue-600 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {publisher.name}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400">
                    {publisher.country}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </a>
            ))}
          </div>
        </section>

        <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold mb-3">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            Our commitment to transparency
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Every article on WorldLive includes a &quot;Read Full Story&quot;
            link to its original publisher, using <code>rel=&quot;nofollow&quot;</code>{" "}
            outbound links. We believe honest attribution strengthens trust and
            rewards quality journalism. If you are a publisher and would like to
            be added or removed from this page, please{" "}
            <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
              contact us
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
