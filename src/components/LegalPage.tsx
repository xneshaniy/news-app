import Header from "@/components/Header";
import BreakingNewsBanner from "@/components/BreakingNewsBanner";
import Breadcrumbs from "@/components/Breadcrumbs";

interface LegalSection {
  title: string;
  paragraphs: string[];
}

interface LegalPageProps {
  title: string;
  updated: string;
  sections: LegalSection[];
}

export default function LegalPage({ title, updated, sections }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <BreakingNewsBanner />
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: title }]} />
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {updated}
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {sections.map((section) => (
            <section key={section.title} className="mb-8">
              <h2 className="text-xl font-bold mb-3">{section.title}</h2>
              {section.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
