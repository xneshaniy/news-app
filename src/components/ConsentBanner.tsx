"use client";

import { useState } from "react";
import { X, Shield } from "lucide-react";
import { useConsent } from "./ConsentProvider";
import { DEFAULT_DENIED } from "@/lib/consent";

const PURPOSE_LABELS: Record<keyof typeof DEFAULT_DENIED, string> = {
  ad_storage: "Ads & ad measurement",
  ad_user_data: "Ad user data (for personalized ads)",
  ad_personalization: "Ad personalization",
  analytics_storage: "Analytics & site improvement",
};

const PURPOSE_DESCRIPTIONS: Record<keyof typeof DEFAULT_DENIED, string> = {
  ad_storage: "Store and access information on your device for advertising purposes.",
  ad_user_data: "Use your data to deliver personalized advertising.",
  ad_personalization: "Show ads tailored to your interests and behavior.",
  analytics_storage: "Help us understand how visitors interact with our site.",
};

export default function ConsentBanner() {
  const { consentState, bannerVisible, setConsent } = useConsent();
  const [showManage, setShowManage] = useState(false);
  const [managePurposes, setManagePurposes] = useState<typeof DEFAULT_DENIED>(DEFAULT_DENIED);

  if (!bannerVisible || consentState) return null;

  const handleManageSave = () => {
    setConsent("managed", managePurposes);
  };

  const togglePurpose = (key: keyof typeof DEFAULT_DENIED) => {
    setManagePurposes((prev) => ({
      ...prev,
      [key]: prev[key] === "granted" ? "denied" : "granted",
    }));
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] animate-slide-up"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {!showManage ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  We value your privacy
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
                  We use cookies to personalize content and ads, provide social media features, and analyze our traffic. We also share information about your use of our site with our advertising and analytics partners.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() => setConsent("rejected")}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
              >
                Do not consent
              </button>
              <button
                onClick={() => setShowManage(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
              >
                Manage options
              </button>
              <button
                onClick={() => setConsent("accepted")}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Consent
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Manage consent options
              </h3>
              <button
                onClick={() => setShowManage(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close manage options"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Toggle each purpose on or off. Your choices will be saved and you can change them anytime.
            </p>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {(Object.keys(DEFAULT_DENIED) as Array<keyof typeof DEFAULT_DENIED>).map((key) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {PURPOSE_LABELS[key]}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {PURPOSE_DESCRIPTIONS[key]}
                    </p>
                  </div>
                  <button
                    onClick={() => togglePurpose(key)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors ${
                      managePurposes[key] === "granted"
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 border-transparent"
                        : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    }`}
                    role="switch"
                    aria-checked={managePurposes[key] === "granted"}
                    aria-label={PURPOSE_LABELS[key]}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        managePurposes[key] === "granted" ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setShowManage(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleManageSave}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:opacity-90 transition-opacity"
              >
                Save preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}