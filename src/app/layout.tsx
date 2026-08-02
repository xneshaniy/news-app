import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FavoritesProvider } from "@/components/FavoritesProvider";
import { CountryProvider } from "@/components/CountryProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { BookmarksProvider } from "@/components/BookmarksProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { ReadingHistoryProvider } from "@/components/ReadingHistoryProvider";
import Footer from "@/components/Footer";

const PWAInstall = dynamic(() => import("@/components/PWAInstall"));
const NewsletterPopup = dynamic(() => import("@/components/NewsletterPopup"));

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "WorldLive - World News from Every Country",
    template: "%s | WorldLive",
  },
  description:
    "Stay informed with breaking news, politics, business, technology, sports, entertainment, health, and science from around the world. AI-powered news from 5+ sources.",
  keywords: [
    "news", "world news", "breaking news", "politics", "technology",
    "sports", "entertainment", "business", "health", "science",
    "global news", "international news", "live news",
  ],
  authors: [{ name: "WorldLive" }],
  creator: "WorldLive",
  publisher: "WorldLive",
  metadataBase: new URL("https://worldlive.dpdns.org"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://worldlive.dpdns.org",
    siteName: "WorldLive",
    title: "WorldLive - World News from Every Country",
    description:
      "Stay informed with breaking news, politics, business, technology, sports, entertainment, health, and science from around the world.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
            alt: "WorldLive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WorldLive - World News from Every Country",
    description:
      "Stay informed with breaking news from around the world.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsMediaOrganization",
              name: "WorldLive",
              url: "https://worldlive.dpdns.org",
              logo: "https://worldlive.dpdns.org/logo.png",
              description: "World news from every country, powered by AI.",
            }),
          }}
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="WorldLive" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-V7YKDMEGQW" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-V7YKDMEGQW');
            `,
          }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1366863868438764"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) { console.log('SW registered:', registration.scope); },
                    function(err) { console.log('SW registration failed:', err); }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <FavoritesProvider>
              <CountryProvider>
                <LanguageProvider>
                  <BookmarksProvider>
                    <ReadingHistoryProvider>
                      {children}
                      <Footer />
                      <PWAInstall />
                      <NewsletterPopup />
                    </ReadingHistoryProvider>
                  </BookmarksProvider>
                </LanguageProvider>
              </CountryProvider>
            </FavoritesProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
