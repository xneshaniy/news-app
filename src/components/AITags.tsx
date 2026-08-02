"use client";

import { useState, useEffect } from "react";
import { Tag, X } from "lucide-react";

interface AITagsProps {
  title: string;
  description?: string;
  content?: string;
  onTagsGenerated?: (tags: string[]) => void;
}

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "need", "dare", "ought",
  "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
  "as", "into", "through", "during", "before", "after", "above", "below",
  "between", "out", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "when", "where", "why", "how", "all", "both",
  "each", "few", "more", "most", "other", "some", "such", "no", "nor",
  "not", "only", "own", "same", "so", "than", "too", "very", "just",
  "don", "now", "said", "says", "also", "new", "one", "two", "first",
  "last", "long", "great", "little", "own", "people", "way", "time",
  "year", "man", "world", "life", "hand", "part", "place", "case",
]);

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  technology: ["ai", "artificial intelligence", "tech", "software", "hardware", "startup", "cyber", "robot", "digital", "blockchain", "quantum", "cloud", "data", "machine learning"],
  politics: ["election", "president", "government", "congress", "senate", "democrat", "republican", "vote", "policy", "legislation", "diplomat", "summit", "treaty"],
  business: ["market", "stock", "invest", "economy", "trade", "company", "revenue", "profit", "gdp", "inflation", "bank", "finance", "crypto"],
  sports: ["game", "match", "championship", "league", "team", "player", "score", "win", "cup", "tournament", "coach", "stadium", "olympics"],
  health: ["health", "medical", "doctor", "hospital", "virus", "vaccine", "treatment", "patient", "disease", "mental", "study", "research"],
  science: ["science", "research", "study", "discover", "space", "nasa", "climate", "environment", "physics", "chemistry", "biology"],
  entertainment: ["movie", "film", "music", "album", "concert", "celebrity", "hollywood", "netflix", "stream", "show", "series", "actor", "actress"],
};

export function generateAITags(title: string, description?: string, content?: string): string[] {
  const text = `${title} ${description || ""} ${content || ""}`.toLowerCase();
  const words = text.split(/[^a-zA-Z]+/).filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  const wordFreq: Record<string, number> = {};
  words.forEach((w) => { wordFreq[w] = (wordFreq[w] || 0) + 1; });

  const sorted = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);

  const tags: string[] = [];

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) {
      tags.push(category);
    }
  }

  for (const word of sorted) {
    if (tags.length >= 8) break;
    if (word.length >= 4 && !tags.includes(word)) {
      tags.push(word);
    }
  }

  if (title.length > 10) {
    const titleWords = title.split(/[^a-zA-Z]+/).filter((w) => w.length > 3 && !STOP_WORDS.has(w.toLowerCase()));
    for (const w of titleWords.slice(0, 3)) {
      if (!tags.includes(w.toLowerCase())) {
        tags.unshift(w.toLowerCase());
      }
    }
  }

  return tags.slice(0, 8);
}

export default function AITags({ title, description, content, onTagsGenerated }: AITagsProps) {
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (title) {
      const generated = generateAITags(title, description, content);
      setTags(generated);
      onTagsGenerated?.(generated);
    }
  }, [title, description, content]);

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tag className="w-4 h-4 text-gray-400" />
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium capitalize"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
