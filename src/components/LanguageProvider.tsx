"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { getTranslation, SUPPORTED_LANGUAGES } from "@/lib/languages";

interface LanguageContextType {
  language: string;
  setLanguage: (code: string) => void;
  t: (key: string) => string;
  languageName: string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => getTranslation("en", key),
  languageName: "English",
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("language");
    if (saved && saved !== "en") setLanguageState(saved);
  }, []);

  const setLanguage = useCallback((code: string) => {
    setLanguageState(code);
    localStorage.setItem("language", code);
  }, []);

  const t = useCallback((key: string) => getTranslation(language, key), [language]);

  const languageName =
    SUPPORTED_LANGUAGES.find((l) => l.code === language)?.name || "English";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageName }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
