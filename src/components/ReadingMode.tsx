"use client";

import { useState, useEffect, useRef } from "react";
import { BookOpen, X, Minus, Plus, Type, Sun, Moon, AlignLeft } from "lucide-react";

interface ReadingModeProps {
  title: string;
  content: string;
  description?: string;
}

export default function ReadingMode({ title, content, description }: ReadingModeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [theme, setTheme] = useState<"light" | "sepia" | "dark">("light");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const themeStyles = {
    light: "bg-white text-gray-900",
    sepia: "bg-[#f4ecd8] text-[#5c4b37]",
    dark: "bg-gray-900 text-gray-100",
  };

  const fullText = `${title}\n\n${description || ""}\n\n${content}`;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
      >
        <BookOpen className="w-4 h-4" />
        Reading Mode
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold">Reading Mode</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setFontSize(Math.max(14, fontSize - 2))}
              className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Decrease font size"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm w-8 text-center">{fontSize}</span>
            <button
              onClick={() => setFontSize(Math.min(28, fontSize + 2))}
              className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Increase font size"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setLineHeight(Math.max(1.4, lineHeight - 0.2))}
              className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Decrease line height"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLineHeight(Math.min(2.4, lineHeight + 0.2))}
              className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Increase line height"
            >
              <Type className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(["light", "sepia", "dark"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`p-1.5 rounded ${
                  theme === t ? "bg-indigo-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                title={`${t} theme`}
              >
                {t === "light" && <Sun className="w-4 h-4" />}
                {t === "sepia" && <Type className="w-4 h-4" />}
                {t === "dark" && <Moon className="w-4 h-4" />}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto ${themeStyles[theme]}`}>
        <div
          ref={contentRef}
          className="max-w-2xl mx-auto px-6 py-12"
          style={{ fontSize: `${fontSize}px`, lineHeight }}
        >
          <h1 className="text-3xl font-bold mb-6 leading-tight">{title}</h1>
          {description && (
            <p className="text-lg opacity-80 mb-8 leading-relaxed border-l-4 border-indigo-500 pl-4">
              {description}
            </p>
          )}
          <div className="whitespace-pre-wrap leading-relaxed">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
