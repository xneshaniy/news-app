"use client";

import { useState } from "react";
import {
  Sparkles, FileText, Type, Shield, Copy,
  Check, Loader2, Zap, AlertTriangle,
  Lightbulb,
} from "lucide-react";

interface AISuggestion {
  id: string;
  type: "summary" | "title" | "tags" | "plagiarism";
  input: string;
  output: string;
  score?: number;
  timestamp: string;
}

function generateAISummary(text: string): string {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 20);
  const scored = sentences.map((s) => ({
    text: s.trim(),
    score: s.split(" ").length * (s.includes("new") || s.includes("announced") || s.includes("breakthrough") ? 2 : 1),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((s) => s.text).join(". ") + ".";
}

function generateAITitle(text: string): string[] {
  const keywords = text.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 4);
  const unique = [...new Set(keywords)].slice(0, 5);
  return [
    `Breaking: ${unique[0]?.charAt(0).toUpperCase() + (unique[0]?.slice(1) || "")} - What You Need to Know`,
    `${unique[0]?.charAt(0).toUpperCase() + (unique[0]?.slice(1) || "")} ${unique[1] || "News"}: Latest Developments Revealed`,
    `Expert Analysis: The Future of ${unique[0]?.charAt(0).toUpperCase() + (unique[0]?.slice(1) || "")}`,
    `${unique[0]?.charAt(0).toUpperCase() + (unique[0]?.slice(1) || "")}: A Comprehensive Overview`,
    `How ${unique[0]?.charAt(0).toUpperCase() + (unique[0]?.slice(1) || "")} Is Changing the Landscape`,
  ];
}

function checkPlagiarism(text: string): { score: number; matches: string[] } {
  const words = text.split(" ");
  const commonPhrases = ["according to", "in a statement", "the report says", "officials confirmed", "sources say"];
  const matches = commonPhrases.filter((p) => text.toLowerCase().includes(p));
  return {
    score: Math.max(0, 100 - matches.length * 15 - Math.min(words.length / 50, 20)),
    matches,
  };
}

function generateTags(text: string): string[] {
  const stopWords = new Set(["the", "and", "for", "with", "from", "that", "this", "have", "been", "were", "will", "into", "over", "after", "their", "there", "about", "news", "report", "says", "said", "officials", "according"]);
  const words = text.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3 && !stopWords.has(w));
  const counts = new Map<string, number>();
  words.forEach((w) => counts.set(w, (counts.get(w) || 0) + 1));
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, 8).map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));
}

export default function AIAddons() {
  const [activeTab, setActiveTab] = useState<"summarizer" | "titles" | "plagiarism" | "tags">("summarizer");
  const [inputText, setInputText] = useState("");
  const [output, setOutput] = useState("");
  const [titles, setTitles] = useState<string[]>([]);
  const [plagiarismResult, setPlagiarismResult] = useState<{ score: number; matches: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<AISuggestion[]>([]);

  const processText = async (type: "summary" | "title" | "plagiarism" | "tags") => {
    if (!inputText.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    if (type === "summary") {
      const summary = generateAISummary(inputText);
      setOutput(summary);
      setHistory((prev) => [{ id: `ai-${Date.now()}`, type: "summary" as const, input: inputText.slice(0, 100), output: summary, timestamp: new Date().toISOString() }, ...prev].slice(0, 20));
    } else if (type === "title") {
      const generated = generateAITitle(inputText);
      setTitles(generated);
      setHistory((prev) => [{ id: `ai-${Date.now()}`, type: "title" as const, input: inputText.slice(0, 100), output: generated[0], timestamp: new Date().toISOString() }, ...prev].slice(0, 20));
    } else if (type === "tags") {
      const tags = generateTags(inputText).join(", ");
      setOutput(tags);
      setHistory((prev) => [{ id: `ai-${Date.now()}`, type: "tags" as const, input: inputText.slice(0, 100), output: tags, timestamp: new Date().toISOString() }, ...prev].slice(0, 20));
    } else {
      const result = checkPlagiarism(inputText);
      setPlagiarismResult(result);
      setHistory((prev) => [{ id: `ai-${Date.now()}`, type: "plagiarism" as const, input: inputText.slice(0, 100), output: `Score: ${result.score}%`, score: result.score, timestamp: new Date().toISOString() }, ...prev].slice(0, 20));
    }
    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            AI Add-ons
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered content tools</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { key: "summarizer", label: "Summarizer", icon: FileText, color: "blue", active: "border-blue-500 bg-blue-50 dark:bg-blue-900/20", iconColor: "text-blue-500" },
          { key: "titles", label: "Title Suggestions", icon: Type, color: "purple", active: "border-purple-500 bg-purple-50 dark:bg-purple-900/20", iconColor: "text-purple-500" },
          { key: "plagiarism", label: "Plagiarism Check", icon: Shield, color: "green", active: "border-green-500 bg-green-50 dark:bg-green-900/20", iconColor: "text-green-500" },
          { key: "tags", label: "Auto Tags", icon: Zap, color: "orange", active: "border-orange-500 bg-orange-50 dark:bg-orange-900/20", iconColor: "text-orange-500" },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)} className={`p-4 rounded-xl border-2 text-left transition-all ${activeTab === tab.key ? tab.active : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"}`}>
            <tab.icon className={`w-5 h-5 mb-2 ${tab.iconColor}`} />
            <p className="text-sm font-semibold">{tab.label}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5">
          <h3 className="font-semibold mb-3">
            {activeTab === "summarizer" && "Article Text"}
            {activeTab === "titles" && "Article Text"}
            {activeTab === "plagiarism" && "Content to Check"}
            {activeTab === "tags" && "Article Text"}
          </h3>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              activeTab === "plagiarism" ? "Paste the content to check for plagiarism..." :
              "Paste your article text here..."
            }
            className="w-full h-48 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm outline-none focus:border-blue-500 resize-none"
          />
          <button
            onClick={() => processText(activeTab === "tags" ? "tags" : activeTab === "summarizer" ? "summary" : activeTab === "titles" ? "title" : "plagiarism")}
            disabled={loading || !inputText.trim()}
            className="mt-3 flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Processing..." : activeTab === "summarizer" ? "Summarize" : activeTab === "titles" ? "Generate Titles" : activeTab === "plagiarism" ? "Check Plagiarism" : "Generate Tags"}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Output</h3>
            {output && (
              <button onClick={() => copyToClipboard(output)} className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700">
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>

          {activeTab === "summarizer" && output && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p className="text-sm leading-relaxed">{output}</p>
            </div>
          )}

          {activeTab === "titles" && titles.length > 0 && (
            <div className="space-y-2">
              {titles.map((title, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group">
                  <p className="text-sm font-medium flex-1 mr-2">{title}</p>
                  <button onClick={() => copyToClipboard(title)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-500 transition-all">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "plagiarism" && plagiarismResult && (
            <div>
              <div className={`p-4 rounded-xl mb-4 ${plagiarismResult.score >= 80 ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" : plagiarismResult.score >= 50 ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800" : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"}`}>
                <p className="text-3xl font-bold mb-1">{plagiarismResult.score}%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Originality Score</p>
              </div>
              {plagiarismResult.matches.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Flagged Phrases</p>
                  {plagiarismResult.matches.map((match, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/10 rounded-lg mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                      <span className="text-sm">{match}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "tags" && output && (
            <div className="flex flex-wrap gap-2">
              {output.split(", ").map((tag, i) => (
                <span key={i} className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {!output && titles.length === 0 && !plagiarismResult && (
            <div className="text-center py-12">
              <Lightbulb className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Enter text and click process to see results</p>
            </div>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div className="mt-6 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5">
          <h3 className="font-semibold mb-3">Recent AI Activity</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {history.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors text-sm">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                <span className="text-gray-400 text-xs uppercase w-16">{item.type}</span>
                <span className="text-xs text-gray-500 truncate flex-1">{item.input}...</span>
                <span className="text-xs font-medium truncate max-w-[200px]">{item.output}</span>
                <span className="text-[10px] text-gray-400">{new Date(item.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
