import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://worldlive.dpdns.org";

export const metadata: Metadata = {
  title: "Privacy Policy | WorldLive",
  description:
    "Read the WorldLive Privacy Policy to understand how we collect, use, and protect your personal information when you use our news platform.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | WorldLive",
    description:
      "Learn how WorldLive collects, uses, and protects your personal information.",
    url: `${SITE_URL}/privacy`,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="August 1, 2026"
      sections={[
        {
          title: "1. Introduction",
          paragraphs: [
            "Welcome to WorldLive (\"we\", \"our\", \"us\"). We are committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at worldlive.dpdns.org (the \"Site\").",
            "By accessing or using the Site, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree, please do not use the Site.",
          ],
        },
        {
          title: "2. Information We Collect",
          paragraphs: [
            "Personal Information: When you subscribe to our newsletter, contact us, or use certain features, we may collect your name, email address, and any other information you voluntarily provide.",
            "Usage Data: We automatically collect information about how you interact with the Site, including your IP address, browser type, device information, pages visited, time spent, and referring URLs.",
            "Cookies and Tracking: We use cookies and similar technologies to enhance your experience, analyze traffic, and serve personalized content and advertising.",
          ],
        },
        {
          title: "3. How We Use Your Information",
          paragraphs: [
            "To provide and maintain our news service, including delivering news content, recommendations, and newsletters you request.",
            "To personalize your experience by tailoring content and suggestions to your interests and language preferences.",
            "To analyze usage patterns and improve our website, content, and features.",
            "To serve relevant advertising through third-party providers such as Google AdSense.",
            "To respond to your inquiries, feedback, and support requests.",
            "To monitor for security threats, prevent fraud, and enforce our Terms of Service.",
          ],
        },
        {
          title: "4. Cookies and Advertising",
          paragraphs: [
            "We use cookies to remember your preferences (such as language, country, and theme) and to understand how visitors use the Site.",
            "We partner with third-party advertising networks, including Google AdSense, to display ads. These partners may use cookies to serve ads based on your prior visits to our Site or other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visits to our Site and/or other sites on the Internet.",
            "You may opt out of personalized advertising by visiting Google Ads Settings (https://adssettings.google.com) or the Network Advertising Initiative opt-out page (https://www.networkadvertising.org/managing/opt_out.asp).",
          ],
        },
        {
          title: "5. Analytics",
          paragraphs: [
            "We use Google Analytics to understand how visitors use our Site. Google Analytics collects information such as your IP address, browser type, device, pages visited, and time on site. This data helps us improve content and user experience.",
            "You can learn about Google's privacy practices and opt out of Google Analytics at https://policies.google.com/privacy and https://tools.google.com/dlpage/gaoptout.",
          ],
        },
        {
          title: "6. Third-Party Services",
          paragraphs: [
            "Our news content is aggregated from third-party news sources. When you click a link to an external article, you will be subject to that website's own privacy policy and terms.",
            "We use third-party service providers for email delivery (Resend), AI services (OpenRouter), weather data (Open-Meteo), and market data. These providers process data only to the extent necessary to provide their services.",
          ],
        },
        {
          title: "7. Data Retention",
          paragraphs: [
            "We retain personal information only for as long as necessary to fulfill the purposes described in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce agreements.",
            "Newsletter subscriptions are stored until you unsubscribe. You may unsubscribe at any time using the link provided in our emails.",
          ],
        },
        {
          title: "8. Your Rights",
          paragraphs: [
            "Depending on your location, you may have rights regarding your personal data, including the right to access, correct, delete, or restrict processing of your data, and the right to data portability.",
            "To exercise any of these rights, please contact us at the address provided below. We will respond within a reasonable timeframe as required by applicable law.",
          ],
        },
        {
          title: "9. Children's Privacy",
          paragraphs: [
            "The Site is not directed to children under the age of 13, and we do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us, and we will take steps to remove such information.",
          ],
        },
        {
          title: "10. Changes to This Policy",
          paragraphs: [
            "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the \"Last updated\" date. You are advised to review this policy periodically.",
          ],
        },
        {
          title: "11. Contact Us",
          paragraphs: [
            "If you have any questions about this Privacy Policy, please contact us at: privacy@worldlive.com.",
          ],
        },
      ]}
    />
  );
}
