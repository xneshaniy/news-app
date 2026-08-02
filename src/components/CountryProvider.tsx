"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface CountryContextType {
  country: string;
  setCountry: (code: string) => void;
}

const CountryContext = createContext<CountryContextType>({
  country: "us",
  setCountry: () => {},
});

export function CountryProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState("us");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("country");
    if (saved) setCountryState(saved);
  }, []);

  const setCountry = (code: string) => {
    setCountryState(code);
    localStorage.setItem("country", code);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <CountryContext.Provider value={{ country, setCountry }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  return useContext(CountryContext);
}
