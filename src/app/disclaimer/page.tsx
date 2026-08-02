import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://worldlive.dpdns.org";

export const metadata: Metadata = {
  title: "Disclaimer | WorldLive",
  description:
    "Read the WorldLive disclaimer regarding the accuracy, completeness, and reliability of news content and information displayed on our platform.",
  alternates: { canonical: "/disclaimer" },
  openGraph: {
    title: "Disclaimer | WorldLive",
    description: "Disclaimer regarding news content and information on WorldLive.",
    url: `${SITE_URL}/disclaimer`,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      updated="August 1, 2026"
      sections={[
        {
          title: "1. General Information",
          paragraphs: [
            "The content displayed on WorldLive is provided for general information and educational purposes only. While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the Service.",
          ],
        },
        {
          title: "2. News Content",
          paragraphs: [
            "WorldLive aggregates news articles from multiple third-party sources. We do not produce or author the majority of the news content displayed. The opinions, views, and statements expressed in articles belong solely to their original authors and publishers and do not necessarily reflect the views of WorldLive.",
            "News is reported by external organizations and can be subject to errors, omissions, or bias. We encourage readers to consult the original source article for complete context and to cross-reference information from multiple sources.",
          ],
        },
        {
          title: "3. AI-Generated Features",
          paragraphs: [
            "Some features of the Service, including article summaries, recommendations, and tags, are generated using artificial intelligence tools. AI-generated content may contain inaccuracies, errors, or omissions. AI summaries are provided as convenience features and are not a substitute for reading the original article.",
            "AI-generated content is intended to assist comprehension and is provided on an \"as is\" basis without warranties of accuracy or completeness.",
          ],
        },
        {
          title: "4. Financial and Market Data",
          paragraphs: [
            "Stock prices, cryptocurrency prices, and other financial data displayed on the Service are provided for informational purposes only and are not intended as investment, financial, legal, tax, or other professional advice. Market data may be delayed and may contain errors.",
            "You should not make investment decisions based solely on information displayed on the Service. Always conduct your own research and consult a qualified professional before making financial decisions.",
          ],
        },
        {
          title: "5. Weather Information",
          paragraphs: [
            "Weather data is provided by third-party providers and is subject to change. We do not guarantee the accuracy of weather forecasts and recommend checking official weather sources for critical decisions.",
          ],
        },
        {
          title: "6. Reliance on Information",
          paragraphs: [
            "Any reliance you place on information found on the Service is strictly at your own risk. WorldLive shall not be liable for any losses or damages arising from the use of information displayed on the Service.",
          ],
        },
        {
          title: "7. External Links",
          paragraphs: [
            "The Service may contain links to external websites that are not provided or maintained by us. We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.",
          ],
        },
        {
          title: "8. No Professional Advice",
          paragraphs: [
            "Nothing on the Service constitutes professional advice (medical, legal, financial, or otherwise). Content is provided for informational purposes only and should not be used as a substitute for professional advice.",
          ],
        },
        {
          title: "9. Errors and Omissions",
          paragraphs: [
            "While we make reasonable efforts to ensure the accuracy of content, errors and omissions may occur. If you identify an error in any article, please contact us at corrections@worldlive.com so we can review and correct it.",
          ],
        },
      ]}
    />
  );
}
