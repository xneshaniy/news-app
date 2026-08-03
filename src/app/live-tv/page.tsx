"use client";

import Header from "@/components/Header";
import { useState } from "react";
import { LiveTVChannel } from "@/types/news";
import { Play, Tv } from "lucide-react";

const LIVE_TV_CHANNELS: LiveTVChannel[] = [
  {
    id: "cnn",
    name: "CNN",
    country: "us",
    streamUrl: "https://www.youtube.com/embed/JUF5bT1Smb4",
    logo: "CNN",
    category: "General",
  },
  {
    id: "bbc",
    name: "BBC News",
    country: "gb",
    streamUrl: "https://www.youtube.com/embed/1TtN1G1m1OQ",
    logo: "BBC",
    category: "General",
  },
  {
    id: "aljazeera",
    name: "Al Jazeera",
    country: "qa",
    streamUrl: "https://www.youtube.com/embed/gCNeDWCI0vo",
    logo: "AJ",
    category: "International",
  },
  {
    id: "ndtv",
    name: "NDTV",
    country: "in",
    streamUrl: "https://www.youtube.com/embed/0YFzEjtK1XY",
    logo: "NDTV",
    category: "General",
  },
  {
    id: "france24",
    name: "France 24",
    country: "fr",
    streamUrl: "https://www.youtube.com/embed/sparklE8R3jQ",
    logo: "F24",
    category: "International",
  },
  {
    id: "dw",
    name: "DW News",
    country: "de",
    streamUrl: "https://www.youtube.com/embed/pqabxBKzZ7o",
    logo: "DW",
    category: "International",
  },
  {
    id: "cgttn",
    name: "CGTN",
    country: "cn",
    streamUrl: "https://www.youtube.com/embed/F4r_T1MmNbI",
    logo: "CGTN",
    category: "International",
  },
  {
    id: "russia1",
    name: "RT News",
    country: "ru",
    streamUrl: "https://www.youtube.com/embed/oYTLs6091KI",
    logo: "RT",
    category: "International",
  },
  {
    id: "sky",
    name: "Sky News",
    country: "gb",
    streamUrl: "https://www.youtube.com/embed/9Auq9mAUxF4",
    logo: "SKY",
    category: "General",
  },
  {
    id: "fox",
    name: "Fox News",
    country: "us",
    streamUrl: "https://www.youtube.com/embed/WlMiLHesE0Y",
    logo: "FOX",
    category: "General",
  },
  {
    id: "bloomberg",
    name: "Bloomberg",
    country: "us",
    streamUrl: "https://www.youtube.com/embed/bGol88yRQkA",
    logo: "BBG",
    category: "Business",
  },
  {
    id: "cnbc",
    name: "CNBC",
    country: "us",
    streamUrl: "https://www.youtube.com/embed/D2i1nMW0yAM",
    logo: "CNBC",
    category: "Business",
  },
];

const CATEGORIES = ["All", "General", "International", "Business"];

export default function LiveTVPage() {
  const [selectedChannel, setSelectedChannel] = useState<LiveTVChannel>(
    LIVE_TV_CHANNELS[0]
  );
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredChannels =
    selectedCategory === "All"
      ? LIVE_TV_CHANNELS
      : LIVE_TV_CHANNELS.filter((c) => c.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Live TV News</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Watch live news broadcasts from around the world
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-black rounded-2xl overflow-hidden aspect-video">
              <iframe
                src={selectedChannel.streamUrl}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Tv className="w-5 h-5 text-red-500" />
                  {selectedChannel.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedChannel.category} • {selectedChannel.country.toUpperCase()}
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                LIVE
              </div>
            </div>
          </div>

          <div>
            <div className="flex gap-2 mb-4 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    selectedChannel.id === channel.id
                      ? "bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500"
                      : "bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 hover:border-blue-300"
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {channel.logo}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-sm">{channel.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {channel.category}
                    </p>
                  </div>
                  <Play className="w-5 h-5 text-gray-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
