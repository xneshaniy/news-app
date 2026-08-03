import Link from "next/link";
import { Zap, Heart, Rss } from "lucide-react";

const footerCategories = [
  { name: "Breaking", href: "/category/breaking" },
  { name: "Politics", href: "/category/politics" },
  { name: "Technology", href: "/category/technology" },
  { name: "Sports", href: "/category/sports" },
  { name: "Business", href: "/category/business" },
  { name: "Health", href: "/category/health" },
  { name: "Science", href: "/category/science" },
  { name: "Entertainment", href: "/category/entertainment" },
];

const footerFeatures = [
  { name: "Live TV", href: "/live-tv" },
  { name: "Podcasts", href: "/podcasts" },
  { name: "Weather", href: "/weather" },
  { name: "Stocks", href: "/stocks" },
  { name: "Crypto", href: "/crypto" },
  { name: "Elections", href: "/elections" },
  { name: "Search", href: "/search" },
  { name: "RSS Feed", href: "/rss" },
];

const footerCompany = [
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "News Sources", href: "/sources" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Disclaimer", href: "/disclaimer" },
  { name: "Cookie Policy", href: "/cookies" },
];

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WorldLive
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              AI-powered world news from every country. Breaking headlines,
              markets, weather, and more — all in one place.
            </p>
            <a
              href="/rss"
              className="inline-flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg text-xs font-semibold hover:bg-orange-600 transition-colors"
            >
              <Rss className="w-3.5 h-3.5" />
              Subscribe via RSS
            </a>
          </div>

          <nav aria-label="Footer categories">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {footerCategories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer features">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Features
            </h3>
            <ul className="space-y-2.5">
              {footerFeatures.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer company links">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {footerCompany.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} WorldLive. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            Made with <Heart className="w-3 h-3 fill-red-500 text-red-500" /> for global news readers
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">
              Privacy
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">
              Terms
            </Link>
            <span>·</span>
            <Link href="/cookies" className="hover:text-blue-600 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
