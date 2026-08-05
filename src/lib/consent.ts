export interface ConsentPurposes {
  ad_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "granted" | "denied";
  analytics_storage: "granted" | "denied";
}

export type ConsentChoice = "accepted" | "rejected" | "managed" | "unknown";

export interface ConsentState {
  choice: ConsentChoice;
  purposes: ConsentPurposes;
  timestamp: number;
}

export const STORAGE_KEY = "worldlive_consent_v1";
export const GEO_COOKIE = "wl_geo";

export const EEA_REGIONS = [
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT",
  "LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE",
  "IS","LI","NO","GB","CH",
];

export const DEFAULT_DENIED: ConsentPurposes = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
};

export const ALL_GRANTED: ConsentPurposes = {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
};

export function isEeaCountry(country: string | null | undefined): boolean {
  return country ? EEA_REGIONS.includes(country.toUpperCase()) : false;
}

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (!parsed.purposes) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(state: ConsentState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
  }
}

export function readGeoCountry(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${GEO_COOKIE}=`))
      ?.split("=")[1] || null;
  } catch {
    return null;
  }
}

export function getConsentModeParams(purposes: ConsentPurposes) {
  return {
    ad_storage: purposes.ad_storage,
    ad_user_data: purposes.ad_user_data,
    ad_personalization: purposes.ad_personalization,
    analytics_storage: purposes.analytics_storage,
  };
}