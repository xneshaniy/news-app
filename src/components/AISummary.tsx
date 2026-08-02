"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { generateAISummary } from "@/lib/constants";

interface AISummaryProps {
  content: string;
  description?: string;
}

export default function AISummary({ content, description }: AISummaryProps) {
  const [expanded, setExpanded] = useState(false);
  const fullSummary = generateAISummary(content || description || "");
  const shortSummary = generateAISummary((content || description || "").substring(0, 500));

  if (!content && !description) return null;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4 mb-6 border border-purple-200/50 dark:border-purple-800/30">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
          AI Summary
        </span>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {expanded ? fullSummary : shortSummary}
      </p>
      {fullSummary !== shortSummary && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 mt-2 text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3 h-3" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              Read full summary
            </>
          )}
        </button>
      )}
    </div>
  );
}
