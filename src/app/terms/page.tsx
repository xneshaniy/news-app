import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://worldlive.dpdns.org";

export const metadata: Metadata = {
  title: "Terms & Conditions | WorldLive",
  description:
    "Read the WorldLive Terms & Conditions governing your use of our global news platform and services.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms & Conditions | WorldLive",
    description: "Terms governing your use of the WorldLive news platform.",
    url: `${SITE_URL}/terms`,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="August 1, 2026"
      sections={[
        {
          title: "1. Acceptance of Terms",
          paragraphs: [
            "By accessing or using WorldLive (\"the Service\"), operated at worldlive.dpdns.org, you agree to be bound by these Terms & Conditions (\"Terms\"). If you do not agree to these Terms, please do not use the Service.",
          ],
        },
        {
          title: "2. Description of Service",
          paragraphs: [
            "WorldLive is a news aggregation platform that collects and displays news articles, headlines, and media content from multiple third-party sources. The Service includes features such as live news feeds, weather, stocks, crypto prices, podcasts, live TV listings, AI-powered summaries and recommendations, and newsletters.",
          ],
        },
        {
          title: "3. Intellectual Property",
          paragraphs: [
            "The WorldLive name, logo, and original website content (including layout, design, and proprietary features) are owned by WorldLive and protected by applicable copyright and trademark laws.",
            "News articles and media displayed on the Service belong to their respective owners and original publishers. We do not claim ownership of third-party content and always link back to the original source.",
          ],
        },
        {
          title: "4. Use of the Service",
          paragraphs: [
            "You agree to use the Service only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the Service.",
            "You must not attempt to gain unauthorized access to any part of the Service, other users' accounts, or computer systems connected to the Service.",
            "You must not use the Service to upload or transmit malicious software, or to engage in any activity that disrupts or interferes with the Service.",
          ],
        },
        {
          title: "5. User Accounts and Content",
          paragraphs: [
            "Certain features may allow you to save favorites, bookmark articles, or subscribe to newsletters. You are responsible for maintaining the confidentiality of any account credentials and for all activity under your account.",
            "By submitting feedback, suggestions, or other content to us, you grant WorldLive a non-exclusive, worldwide, royalty-free license to use, reproduce, and modify such content for the purposes of operating and improving the Service.",
          ],
        },
        {
          title: "6. Third-Party Content and Links",
          paragraphs: [
            "The Service aggregates content from third-party news sources. We do not endorse, verify the accuracy of, or take responsibility for third-party content. Articles are provided for informational purposes only.",
            "The Service may contain links to external websites. We are not responsible for the content, policies, or practices of any third-party websites.",
          ],
        },
        {
          title: "7. Disclaimer of Warranties",
          paragraphs: [
            "The Service is provided on an \"as is\" and \"as available\" basis without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.",
            "We do not warrant that the Service will be uninterrupted, error-free, or free of harmful components, or that content displayed is accurate, complete, or current.",
          ],
        },
        {
          title: "8. Limitation of Liability",
          paragraphs: [
            "To the fullest extent permitted by law, WorldLive shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, arising out of or related to your use of the Service.",
            "Our total liability for any claim arising out of or related to the Service shall not exceed the amount you paid to us, if any, for use of the Service during the twelve (12) months preceding the claim.",
          ],
        },
        {
          title: "9. Changes to the Service and Terms",
          paragraphs: [
            "We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time without notice.",
            "We may revise these Terms at any time. The most current version will always be posted on this page. Your continued use of the Service after changes are posted constitutes acceptance of the revised Terms.",
          ],
        },
        {
          title: "10. Termination",
          paragraphs: [
            "We may terminate or suspend your access to the Service, without prior notice or liability, for any reason, including if you breach these Terms.",
          ],
        },
        {
          title: "11. Governing Law",
          paragraphs: [
            "These Terms shall be governed by and construed in accordance with the laws applicable to the Service operator's jurisdiction, without regard to conflict of law principles.",
          ],
        },
        {
          title: "12. Contact Information",
          paragraphs: [
            "For questions about these Terms, please contact us at: legal@worldlive.com.",
          ],
        },
      ]}
    />
  );
}
