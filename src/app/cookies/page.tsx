import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://worldlive.dpdns.org";

export const metadata: Metadata = {
  title: "Cookie Policy | WorldLive",
  description:
    "Learn how WorldLive uses cookies and similar technologies to enhance your browsing experience, analyze traffic, and serve personalized content and advertising.",
  alternates: { canonical: "/cookies" },
  openGraph: {
    title: "Cookie Policy | WorldLive",
    description: "How WorldLive uses cookies and similar technologies.",
    url: `${SITE_URL}/cookies`,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated="August 1, 2026"
      sections={[
        {
          title: "1. What Are Cookies",
          paragraphs: [
            "Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and provide information to website owners.",
          ],
        },
        {
          title: "2. How We Use Cookies",
          paragraphs: [
            "WorldLive uses cookies and similar technologies for several purposes, including:",
            "Essential cookies: Required for the website to function properly, such as remembering your language, country, and theme preferences, and keeping you logged into secure areas of the site.",
            "Analytics cookies: Help us understand how visitors use the Site by collecting anonymous information about pages visited, time on site, and referring sources. We use Google Analytics for this purpose.",
            "Advertising cookies: Used by third-party advertising partners (such as Google AdSense) to build a profile of your interests and show you relevant advertisements on our Site and other websites.",
            "Preference cookies: Remember choices you make, such as your preferred language and country, so you don't have to set them each time you visit.",
          ],
        },
        {
          title: "3. Cookies We Use",
          paragraphs: [
            "We may use both session cookies (which expire when you close your browser) and persistent cookies (which remain on your device for a set period).",
            "Specific cookies include: preference cookies for theme/language/country selection, newsletter subscription status, PWA installation status, and analytics/advertising cookies set by Google Analytics and Google AdSense.",
          ],
        },
        {
          title: "4. Third-Party Cookies",
          paragraphs: [
            "In addition to our own cookies, third-party partners may set cookies on your device when you use our Site. These include:",
            "Google Analytics (analytics): https://policies.google.com/privacy",
            "Google AdSense (advertising): https://policies.google.com/privacy",
            "These third parties have their own privacy policies and may use cookies for their own purposes. We have no control over these cookies.",
          ],
        },
        {
          title: "5. Managing Cookies",
          paragraphs: [
            "You can control and manage cookies in several ways:",
            "Browser settings: Most browsers allow you to block or delete cookies, and to set preferences for specific websites. Refer to your browser's help documentation for instructions.",
            "Opt-out of personalized ads: Visit Google Ads Settings (https://adssettings.google.com) or the Network Advertising Initiative opt-out page (https://www.networkadvertising.org/managing/opt_out.asp).",
            "Opt-out of analytics: You can install the Google Analytics Opt-out Browser Add-on at https://tools.google.com/dlpage/gaoptout.",
            "Please note that blocking or deleting cookies may affect the functionality of the Site, such as remembering your preferences.",
          ],
        },
        {
          title: "6. Local Storage",
          paragraphs: [
            "In addition to cookies, we may use browser local storage to store certain preferences and data (such as saved articles, favorites, and newsletter subscriptions) on your device. Local storage is similar to cookies but can store larger amounts of data.",
            "You can clear local storage through your browser settings at any time.",
          ],
        },
        {
          title: "7. Changes to This Policy",
          paragraphs: [
            "We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated \"Last updated\" date. We encourage you to review this policy periodically.",
          ],
        },
        {
          title: "8. Contact Us",
          paragraphs: [
            "If you have any questions about our use of cookies, please contact us at: privacy@worldlive.com.",
          ],
        },
      ]}
    />
  );
}
