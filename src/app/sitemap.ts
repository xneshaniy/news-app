import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://worldlive.dpdns.org";

  const categories = [
    "breaking", "politics", "business", "technology",
    "sports", "entertainment", "health", "science",
  ];

  const countries = [
    "us", "gb", "in", "pk", "ca", "au", "de", "fr",
    "jp", "cn", "br", "za", "ae", "sa", "ng", "eg",
    "tr", "ru", "it", "es",
  ];

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "always" as const, priority: 1.0 },
    { url: `${baseUrl}/favorites`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}/bookmarks`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}/live-tv`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${baseUrl}/podcasts`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.7 },
    { url: `${baseUrl}/weather`, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 0.7 },
    { url: `${baseUrl}/stocks`, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 0.8 },
    { url: `${baseUrl}/crypto`, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 0.8 },
    { url: `${baseUrl}/elections`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.7 },
    { url: `${baseUrl}/recommendations`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.7 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "never" as const, priority: 0.3 },
  ];

  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...categoryPages];
}
