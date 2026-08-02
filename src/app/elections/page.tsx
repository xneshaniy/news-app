"use client";

import Header from "@/components/Header";
import { useState } from "react";
import { ElectionResult } from "@/types/news";
import { COUNTRIES } from "@/lib/constants";
import { Vote, Radio } from "lucide-react";

const ELECTION_DATA: ElectionResult[] = [
  {
    country: "us",
    year: 2024,
    title: "US Presidential Election 2024",
    lastUpdated: "2024-11-05T20:00:00Z",
    candidates: [
      { name: "Kamala Harris", party: "Democratic", votes: 74500000, percentage: 50.8, color: "#3b82f6" },
      { name: "Donald Trump", party: "Republican", votes: 72000000, percentage: 49.2, color: "#ef4444" },
    ],
  },
  {
    country: "gb",
    year: 2024,
    title: "UK General Election 2024",
    lastUpdated: "2024-07-04T22:00:00Z",
    candidates: [
      { name: "Keir Starmer", party: "Labour", votes: 9700000, percentage: 33.7, color: "#ef4444" },
      { name: "Rishi Sunak", party: "Conservative", votes: 6800000, percentage: 23.7, color: "#3b82f6" },
      { name: "Ed Davey", party: "Liberal Democrat", votes: 3500000, percentage: 12.2, color: "#fbbf24" },
      { name: "Nigel Farage", party: "Reform UK", votes: 4000000, percentage: 14.3, color: "#06b6d4" },
    ],
  },
  {
    country: "in",
    year: 2024,
    title: "Indian General Election 2024",
    lastUpdated: "2024-06-04T18:00:00Z",
    candidates: [
      { name: "Narendra Modi", party: "BJP (NDA)", votes: 235000000, percentage: 36.6, color: "#f97316" },
      { name: "Rahul Gandhi", party: "INC (INDIA)", votes: 135000000, percentage: 21.0, color: "#3b82f6" },
      { name: "Others", party: "Regional Parties", votes: 226000000, percentage: 42.4, color: "#6b7280" },
    ],
  },
  {
    country: "pk",
    year: 2024,
    title: "Pakistan General Election 2024",
    lastUpdated: "2024-02-08T18:00:00Z",
    candidates: [
      { name: "Independent (PTI)", party: "PTI-backed", votes: 23000000, percentage: 22.4, color: "#22c55e" },
      { name: "Shehbaz Sharif", party: "PML-N", votes: 20500000, percentage: 19.8, color: "#3b82f6" },
      { name: "Bilawal Bhutto", party: "PPP", votes: 15000000, percentage: 14.5, color: "#ef4444" },
    ],
  },
  {
    country: "fr",
    year: 2024,
    title: "French Legislative Election 2024",
    lastUpdated: "2024-07-07T20:00:00Z",
    candidates: [
      { name: "Left Alliance (NFP)", party: "Nouveau Front Populaire", votes: 9000000, percentage: 26.3, color: "#ef4444" },
      { name: "Ensemble", party: "Macron's Party", votes: 7000000, percentage: 20.4, color: "#fbbf24" },
      { name: "National Rally", party: "RN (Le Pen)", votes: 10500000, percentage: 30.6, color: "#3b82f6" },
    ],
  },
  {
    country: "de",
    year: 2025,
    title: "German Federal Election 2025",
    lastUpdated: "2025-02-23T18:00:00Z",
    candidates: [
      { name: "Friedrich Merz", party: "CDU/CSU", votes: 14000000, percentage: 28.5, color: "#3b82f6" },
      { name: "Olaf Scholz", party: "SPD", votes: 10500000, percentage: 21.4, color: "#ef4444" },
      { name: "Alice Weidel", party: "AfD", votes: 8000000, percentage: 16.3, color: "#06b6d4" },
    ],
  },
];

function formatVotes(votes: number): string {
  if (votes >= 1e9) return `${(votes / 1e9).toFixed(1)}B`;
  if (votes >= 1e6) return `${(votes / 1e6).toFixed(1)}M`;
  if (votes >= 1e3) return `${(votes / 1e3).toFixed(0)}K`;
  return votes.toLocaleString();
}

export default function ElectionsPage() {
  const [selectedCountry, setSelectedCountry] = useState("us");

  const election = ELECTION_DATA.find((e) => e.country === selectedCountry);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Election Results</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Latest election results from around the world
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Vote className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm"
            >
              {COUNTRIES.filter((c) =>
                ELECTION_DATA.some((e) => e.country === c.code)
              ).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {election ? (
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{election.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Last updated: {new Date(election.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-semibold">
                  <Radio className="w-4 h-4 animate-pulse" />
                  LIVE
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {election.candidates
                  .sort((a, b) => b.votes - a.votes)
                  .map((candidate, index) => (
                    <div key={candidate.name}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-gray-300 dark:text-gray-600">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-semibold text-lg">{candidate.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {candidate.party}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold" style={{ color: candidate.color }}>
                            {candidate.percentage.toFixed(1)}%
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatVotes(candidate.votes)} votes
                          </p>
                        </div>
                      </div>
                      <div className="w-full h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${candidate.percentage}%`,
                            backgroundColor: candidate.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <Vote className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No election data available</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Select a country with recent election results
            </p>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ELECTION_DATA.filter((e) => e.country !== selectedCountry).map((e) => {
            const country = COUNTRIES.find((c) => c.code === e.country);
            return (
              <button
                key={e.country}
                onClick={() => setSelectedCountry(e.country)}
                className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4 text-left hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{country?.flag}</span>
                  <span className="font-semibold">{country?.name}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{e.title}</p>
                <div className="mt-3 flex gap-2">
                  {e.candidates.slice(0, 3).map((c) => (
                    <div
                      key={c.name}
                      className="flex-1 h-2 rounded-full"
                      style={{ backgroundColor: c.color, opacity: 0.7 }}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
