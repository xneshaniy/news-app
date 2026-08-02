"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { Article } from "@/types/news";

interface ReadArticle {
  article: Article;
  readAt: string;
  readDuration: number;
}

interface ReadingHistoryContextType {
  history: ReadArticle[];
  addToHistory: (article: Article) => void;
  clearHistory: () => void;
  isRead: (id: string) => boolean;
}

const ReadingHistoryContext = createContext<ReadingHistoryContextType | undefined>(undefined);

export function ReadingHistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<ReadArticle[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("reading-history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("reading-history", JSON.stringify(history.slice(0, 200)));
  }, [history]);

  const addToHistory = (article: Article) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.article.id !== article.id);
      return [{ article, readAt: new Date().toISOString(), readDuration: 0 }, ...filtered].slice(0, 200);
    });
  };

  const clearHistory = () => setHistory([]);

  const isRead = (id: string) => history.some((h) => h.article.id === id);

  return (
    <ReadingHistoryContext.Provider value={{ history, addToHistory, clearHistory, isRead }}>
      {children}
    </ReadingHistoryContext.Provider>
  );
}

export function useReadingHistory() {
  const context = useContext(ReadingHistoryContext);
  if (!context) throw new Error("useReadingHistory must be used within ReadingHistoryProvider");
  return context;
}
