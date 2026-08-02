import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://worldlive.dpdns.org";

export const metadata: Metadata = {
  title: {
    default: "WorldLive - World News from Every Country",
    template: "%s | WorldLive",
  },
  description:
    "Stay informed with breaking news, politics, business, technology, sports, entertainment, health, and science from around the world. AI-powered news from 6+ sources.",
  keywords: [
    "news", "world news", "breaking news", "politics", "technology",
    "sports", "entertainment", "business", "health", "science",
    "global news", "international news", "live news",
  ],
  authors: [{ name: "WorldLive" }],
  creator: "WorldLive",
  publisher: "WorldLive",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
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

export default function SEOLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsMediaOrganization",
            name: "WorldLive",
            url: SITE_URL,
            logo: `${SITE_URL}/logo.png`,
            description: "World news from every country, powered by AI.",
            sameAs: [
              "https://twitter.com/worldlive",
              "https://facebook.com/worldlive",
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
