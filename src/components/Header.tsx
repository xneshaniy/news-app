"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Search,
  Moon,
  Sun,
  Globe,
  Heart,
  Menu,
  X,
  Zap,
  Landmark,
  Briefcase,
  Cpu,
  Trophy,
  Film,
  HeartPulse,
  FlaskConical,
  Tv,
  Headphones,
  Cloud,
  BarChart3,
  Vote,
  DollarSign,
  Languages,
  Bookmark,
  Shield,
  Rss,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useCountry } from "./CountryProvider";
import { useLanguage } from "./LanguageProvider";
import { COUNTRIES, CATEGORIES } from "@/lib/constants";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";
import VoiceSearch from "./VoiceSearch";
import UserMenu from "./UserMenu";
import PushNotifications from "./PushNotifications";
import { History } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  breaking: <Zap className="w-4 h-4" />,
  politics: <Landmark className="w-4 h-4" />,
  business: <Briefcase className="w-4 h-4" />,
  technology: <Cpu className="w-4 h-4" />,
  sports: <Trophy className="w-4 h-4" />,
  entertainment: <Film className="w-4 h-4" />,
  health: <HeartPulse className="w-4 h-4" />,
  science: <FlaskConical className="w-4 h-4" />,
};

const featureLinks = [
  { href: "/live-tv", icon: Tv, label: "Live TV" },
  { href: "/podcasts", icon: Headphones, label: "Podcasts" },
  { href: "/weather", icon: Cloud, label: "Weather" },
  { href: "/stocks", icon: BarChart3, label: "Stocks" },
  { href: "/elections", icon: Vote, label: "Elections" },
  { href: "/crypto", icon: DollarSign, label: "Crypto" },
  { href: "/rss", icon: Rss, label: "RSS" },
  { href: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
  { href: "/history", icon: History, label: "History" },
  { href: "/admin", icon: Shield, label: "Admin" },
];

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { country, setCountry } = useCountry();
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const currentCountry = COUNTRIES.find((c) => c.code === country);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              WorldLive
            </span>
          </Link>

          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-md mx-4"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t("search.placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search news"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-blue-500 rounded-full text-sm outline-none transition-colors"
              />
            </div>
            <VoiceSearch
              onResult={(q) => {
                setSearchQuery(q);
                window.location.href = `/search?q=${encodeURIComponent(q)}`;
              }}
            />
          </form>

          <div className="hidden md:flex items-center gap-1">
            <div className="relative">
              <button
                onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                aria-label="Select country"
                aria-expanded={countryDropdownOpen}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{currentCountry?.flag} {currentCountry?.name}</span>
              </button>
              {countryDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCountryDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 max-h-80 overflow-y-auto">
                    {COUNTRIES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCountry(c.code);
                          setCountryDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          country === c.code
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            : ""
                        }`}
                      >
                        <span className="text-lg">{c.flag}</span>
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                aria-label="Select language"
                aria-expanded={languageDropdownOpen}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Languages className="w-4 h-4" />
                <span className="hidden lg:inline">{SUPPORTED_LANGUAGES.find(l => l.code === language)?.nativeName}</span>
              </button>
              {languageDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLanguageDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 max-h-80 overflow-y-auto">
                    {SUPPORTED_LANGUAGES.slice(0, 20).map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setLanguageDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          language === l.code
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            : ""
                        }`}
                      >
                        <span>{l.nativeName}</span>
                        <span className="text-gray-400 text-xs">{l.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Link
              href="/favorites"
              aria-label="Favorites"
              className={`p-2 rounded-lg transition-colors ${
                pathname === "/favorites"
                  ? "bg-red-50 dark:bg-red-900/30 text-red-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Heart className="w-5 h-5" />
            </Link>

            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <PushNotifications />

            <UserMenu />
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <nav aria-label="News categories" className="hidden md:flex items-center gap-1 pb-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                pathname === `/category/${cat.slug}`
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              {categoryIcons[cat.slug]}
              {cat.name}
            </Link>
          ))}
          <span className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
          {featureLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                pathname === link.href
                  ? "bg-purple-600 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {mobileMenuOpen && (
        <nav aria-label="Mobile navigation" className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("search.placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search news"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm outline-none"
                />
              </div>
            </form>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {t("nav.language")}
              </p>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm"
              >
                {SUPPORTED_LANGUAGES.slice(0, 20).map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Country
              </p>
              <div className="grid grid-cols-4 gap-2">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCountry(c.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs ${
                      country === c.code
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <span className="text-lg">{c.flag}</span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Categories
              </p>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                      pathname === `/category/${cat.slug}`
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {categoryIcons[cat.slug]}
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Features
              </p>
              <div className="grid grid-cols-2 gap-2">
                {featureLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                      pathname === link.href
                        ? "bg-purple-600 text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Heart className="w-4 h-4" />
              {t("nav.favorites")}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
