"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { readConsent, writeConsent, getConsentModeParams, readGeoCountry, isEeaCountry, DEFAULT_DENIED, ALL_GRANTED, ConsentState, ConsentPurposes } from "@/lib/consent";

interface ConsentContextType {
  consentState: ConsentState | null;
  bannerVisible: boolean;
  setConsent: (choice: "accepted" | "rejected" | "managed", purposes?: ConsentPurposes) => void;
  showBanner: () => void;
  hideBanner: () => void;
}

const defaultContext: ConsentContextType = {
  consentState: null,
  bannerVisible: false,
  setConsent: () => {},
  showBanner: () => {},
  hideBanner: () => {},
};

const ConsentContext = createContext<ConsentContextType>(defaultContext);

export function useConsent() {
  return useContext(ConsentContext);
}

function applyConsentToGtag(purposes: ConsentPurposes) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("consent", "update", getConsentModeParams(purposes));
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consentState, setConsentState] = useState<ConsentState | null>(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    const geoCountry = readGeoCountry();
    const isEea = isEeaCountry(geoCountry);

    if (stored) {
      setConsentState(stored);
      applyConsentToGtag(stored.purposes);
    } else if (isEea || geoCountry === null) {
      setBannerVisible(true);
    }

    setInitialized(true);
  }, []);

  const setConsent = (choice: "accepted" | "rejected" | "managed", purposes?: ConsentPurposes) => {
    let finalPurposes: ConsentPurposes;
    if (purposes) {
      finalPurposes = purposes;
    } else if (choice === "accepted") {
      finalPurposes = ALL_GRANTED;
    } else {
      finalPurposes = DEFAULT_DENIED;
    }

    const newState: ConsentState = {
      choice,
      purposes: finalPurposes,
      timestamp: Date.now(),
    };

    setConsentState(newState);
    writeConsent(newState);
    applyConsentToGtag(finalPurposes);
    setBannerVisible(false);
  };

  const showBanner = () => setBannerVisible(true);
  const hideBanner = () => setBannerVisible(false);

  if (!initialized) {
    return <>{children}</>;
  }

  return (
    <ConsentContext.Provider value={{ consentState, bannerVisible, setConsent, showBanner, hideBanner }}>
      {children}
    </ConsentContext.Provider>
  );
}