"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Article } from "@/types/news";

interface FavoritesContextType {
  favorites: Article[];
  addFavorite: (article: Article) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Article[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites, mounted]);

  const addFavorite = (article: Article) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === article.id)) return prev;
      return [article, ...prev];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some((f) => f.id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
