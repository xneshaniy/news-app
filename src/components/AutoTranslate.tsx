"use client";

import { useState } from "react";
import { Languages, Loader2 } from "lucide-react";
import { TRANSLATION_LANGUAGES } from "@/lib/constants";

interface AutoTranslateProps {
  text: string;
  onTranslated: (translated: string) => void;
}

export default function AutoTranslate({ text, onTranslated }: AutoTranslateProps) {
  const [targetLang, setTargetLang] = useState("es");
  const [translating, setTranslating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang }),
      });
      const data = await res.json();
      if (data.translatedText) {
        onTranslated(data.translatedText);
      }
    } catch {
      // Use fallback local translation marker
      onTranslated(`[${TRANSLATION_LANGUAGES[targetLang]}] ${text}`);
    } finally {
      setTranslating(false);
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors"
        >
          <Languages className="w-4 h-4" />
          {TRANSLATION_LANGUAGES[targetLang]}
        </button>

        {showDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
            <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 max-h-60 overflow-y-auto">
              {Object.entries(TRANSLATION_LANGUAGES).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => {
                    setTargetLang(code);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    targetLang === code
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-semibold"
                      : ""
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <button
        onClick={handleTranslate}
        disabled={translating}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
      >
        {translating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Languages className="w-4 h-4" />
        )}
        {translating ? "Translating..." : "Translate"}
      </button>
    </div>
  );
}
