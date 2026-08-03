"use client";

import Header from "@/components/Header";
import { useState } from "react";
import { Podcast } from "@/types/news";
import { Play, Clock, ChevronDown, ChevronUp } from "lucide-react";

const PODCASTS: Podcast[] = [
  {
    id: "daily",
    title: "The Daily",
    description: "This is what the news should sound like. The biggest stories of our time, told by the best journalists in the world.",
    image: "📰",
    category: "News",
    episodes: [
      { id: "d1", title: "The State of the Economy", description: "A deep dive into the current economic landscape", duration: "28 min", date: "Today", audioUrl: "#" },
      { id: "d2", title: "Climate Summit Highlights", description: "Key takeaways from the international climate summit", duration: "32 min", date: "Yesterday", audioUrl: "#" },
      { id: "d3", title: "Tech Industry Shifts", description: "How major tech companies are pivoting their strategies", duration: "25 min", date: "2 days ago", audioUrl: "#" },
    ],
  },
  {
    id: "upfirst",
    title: "Up First",
    description: "News you need to start your day. The biggest stories you need to know, and why they matter.",
    image: "🌅",
    category: "News",
    episodes: [
      { id: "u1", title: "Morning Briefing: Top Stories", description: "The most important news stories to start your day", duration: "12 min", date: "Today", audioUrl: "#" },
      { id: "u2", title: "Weekend Edition", description: "A roundup of the week's most significant events", duration: "15 min", date: "Yesterday", audioUrl: "#" },
    ],
  },
  {
    id: "globalnews",
    title: "Global News Podcast",
    description: "The latest global news from the BBC, with reports from correspondents around the world.",
    image: "🌍",
    category: "International",
    episodes: [
      { id: "g1", title: "Middle East Updates", description: "The latest developments in the Middle East", duration: "22 min", date: "Today", audioUrl: "#" },
      { id: "g2", title: "Asia Pacific Report", description: "Key stories from the Asia Pacific region", duration: "18 min", date: "Yesterday", audioUrl: "#" },
      { id: "g3", title: "European Affairs", description: "Major political and economic updates from Europe", duration: "20 min", date: "2 days ago", audioUrl: "#" },
    ],
  },
  {
    id: "techmeme",
    title: "Techmeme Ride Home",
    description: "A daily podcast about the technology news, hosted by Brian McCullough.",
    image: "💻",
    category: "Technology",
    episodes: [
      { id: "t1", title: "AI Revolution Continues", description: "The latest breakthroughs in artificial intelligence", duration: "35 min", date: "Today", audioUrl: "#" },
      { id: "t2", title: "Startup Funding Update", description: "Who's getting funded and who's not in the tech world", duration: "28 min", date: "Yesterday", audioUrl: "#" },
    ],
  },
  {
    id: "marketwatch",
    title: "Market Watch Daily",
    description: "Your daily dose of market analysis, investment tips, and financial news.",
    image: "📈",
    category: "Business",
    episodes: [
      { id: "m1", title: "Stock Market Analysis", description: "Today's market movements and what they mean", duration: "20 min", date: "Today", audioUrl: "#" },
      { id: "m2", title: "Crypto Market Update", description: "Bitcoin, Ethereum, and the broader crypto market", duration: "15 min", date: "Today", audioUrl: "#" },
    ],
  },
  {
    id: "sciencefriday",
    title: "Science Friday",
    description: "Science is changing the world. Science Friday is your source for entertaining and educational stories about science.",
    image: "🔬",
    category: "Science",
    episodes: [
      { id: "s1", title: "Space Exploration Update", description: "The latest from NASA, SpaceX, and beyond", duration: "45 min", date: "This week", audioUrl: "#" },
      { id: "s2", title: "Medical Breakthroughs", description: "New discoveries in medicine and health research", duration: "38 min", date: "Last week", audioUrl: "#" },
    ],
  },
];

const CATEGORIES = ["All", "News", "International", "Technology", "Business", "Science"];

export default function PodcastsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedPodcast, setExpandedPodcast] = useState<string | null>(null);
  const [playingEpisode, setPlayingEpisode] = useState<string | null>(null);

  const filteredPodcasts =
    selectedCategory === "All"
      ? PODCASTS
      : PODCASTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">News Podcasts</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Listen to the latest news podcasts from around the world
          </p>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredPodcasts.map((podcast) => (
            <div
              key={podcast.id}
              className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedPodcast(
                    expandedPodcast === podcast.id ? null : podcast.id
                  )
                }
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-3xl shrink-0">
                  {podcast.image}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg">{podcast.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                    {podcast.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {podcast.episodes.length} episodes • {podcast.category}
                  </p>
                </div>
                {expandedPodcast === podcast.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                )}
              </button>

              {expandedPodcast === podcast.id && (
                <div className="border-t border-gray-100 dark:border-gray-700/50 divide-y divide-gray-100 dark:divide-gray-700/50">
                  {podcast.episodes.map((episode) => (
                    <div
                      key={episode.id}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingEpisode(
                            playingEpisode === episode.id ? null : episode.id
                          );
                        }}
                        className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <Play className="w-5 h-5 ml-0.5" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{episode.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {episode.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 shrink-0">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {episode.duration}
                        </span>
                        <span>{episode.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
