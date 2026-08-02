"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Article, Bookmark } from "@/types/news";

interface BookmarksContextType {
  bookmarks: Bookmark[];
  addBookmark: (article: Article, folder?: string, tags?: string[]) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (articleId: string) => boolean;
  getBookmarkFolders: () => string[];
  getBookmarksByFolder: (folder: string) => Bookmark[];
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;
}

const BookmarksContext = createContext<BookmarksContextType>({
  bookmarks: [],
  addBookmark: () => {},
  removeBookmark: () => {},
  isBookmarked: () => false,
  getBookmarkFolders: () => [],
  getBookmarksByFolder: () => [],
  updateBookmark: () => {},
});

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("bookmarks");
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch {
        setBookmarks([]);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }
  }, [bookmarks, mounted]);

  const addBookmark = (article: Article, folder: string = "General", tags: string[] = []) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.article.id === article.id)) return prev;
      const newBookmark: Bookmark = {
        id: `bm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        article,
        folder,
        savedAt: new Date().toISOString(),
        tags,
      };
      return [newBookmark, ...prev];
    });
  };

  const removeBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const isBookmarked = (articleId: string) => {
    return bookmarks.some((b) => b.article.id === articleId);
  };

  const getBookmarkFolders = () => {
    const folders = new Set(bookmarks.map((b) => b.folder));
    return Array.from(folders);
  };

  const getBookmarksByFolder = (folder: string) => {
    if (folder === "All") return bookmarks;
    return bookmarks.filter((b) => b.folder === folder);
  };

  const updateBookmark = (id: string, updates: Partial<Bookmark>) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        getBookmarkFolders,
        getBookmarksByFolder,
        updateBookmark,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  return useContext(BookmarksContext);
}
