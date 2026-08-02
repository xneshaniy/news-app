import { Article } from "@/types/news";

interface UserProfile {
  readArticles: string[];
  favoriteArticles: string[];
  categoryPreferences: Record<string, number>;
  sourcePreferences: Record<string, number>;
  topicPreferences: Record<string, number>;
}

function getUserProfile(): UserProfile {
  if (typeof window === "undefined") {
    return {
      readArticles: [],
      favoriteArticles: [],
      categoryPreferences: {},
      sourcePreferences: {},
      topicPreferences: {},
    };
  }

  const read = JSON.parse(localStorage.getItem("readArticles") || "[]");
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

  const categoryPrefs: Record<string, number> = {};
  const sourcePrefs: Record<string, number> = {};
  const topicPrefs: Record<string, number> = {};

  favorites.forEach((article: Article) => {
    if (article.category) {
      categoryPrefs[article.category] = (categoryPrefs[article.category] || 0) + 2;
    }
    if (article.source?.name) {
      sourcePrefs[article.source.name] = (sourcePrefs[article.source.name] || 0) + 2;
    }
    if (article.topics) {
      article.topics.forEach((topic) => {
        topicPrefs[topic] = (topicPrefs[topic] || 0) + 2;
      });
    }
  });

  read.forEach((id: string) => {
    const stored = localStorage.getItem(`article_${id}`);
    if (stored) {
      const article: Article = JSON.parse(stored);
      if (article.category) {
        categoryPrefs[article.category] = (categoryPrefs[article.category] || 0) + 1;
      }
      if (article.source?.name) {
        sourcePrefs[article.source.name] = (sourcePrefs[article.source.name] || 0) + 1;
      }
    }
  });

  return {
    readArticles: read,
    favoriteArticles: favorites.map((a: Article) => a.id),
    categoryPreferences: categoryPrefs,
    sourcePreferences: sourcePrefs,
    topicPreferences: topicPrefs,
  };
}

function calculateArticleScore(article: Article, profile: UserProfile): number {
  let score = 0;

  if (profile.readArticles.includes(article.id)) {
    return -1;
  }

  if (article.category && profile.categoryPreferences[article.category]) {
    score += profile.categoryPreferences[article.category] * 3;
  }

  if (article.source?.name && profile.sourcePreferences[article.source.name]) {
    score += profile.sourcePreferences[article.source.name] * 2;
  }

  if (article.topics) {
    article.topics.forEach((topic) => {
      if (profile.topicPreferences[topic]) {
        score += profile.topicPreferences[topic];
      }
    });
  }

  const hoursOld =
    (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
  if (hoursOld < 1) score += 10;
  else if (hoursOld < 6) score += 7;
  else if (hoursOld < 24) score += 4;
  else if (hoursOld < 72) score += 2;

  if (article.image) score += 1;

  return score;
}

export function getRecommendations(
  articles: Article[],
  maxResults: number = 10
): Article[] {
  const profile = getUserProfile();

  const hasHistory =
    profile.readArticles.length > 0 || profile.favoriteArticles.length > 0;

  if (!hasHistory) {
    return articles
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
      .slice(0, maxResults);
  }

  const scored = articles
    .map((article) => ({
      article,
      score: calculateArticleScore(article, profile),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, maxResults).map((item) => item.article);
}

export function trackArticleRead(article: Article): void {
  if (typeof window === "undefined") return;

  const read = JSON.parse(localStorage.getItem("readArticles") || "[]");
  if (!read.includes(article.id)) {
    read.push(article.id);
    localStorage.setItem("readArticles", JSON.stringify(read.slice(-100)));
  }

  localStorage.setItem(
    `article_${article.id}`,
    JSON.stringify({
      id: article.id,
      category: article.category,
      source: article.source,
      topics: article.topics,
    })
  );
}

export function getTrendingTopics(): string[] {
  return [
    "AI",
    "Climate Change",
    "Elections",
    "Economy",
    "Space",
    "Health",
    "Technology",
    "Sports",
    "Entertainment",
    "World News",
  ];
}
