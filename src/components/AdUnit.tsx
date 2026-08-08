"use client";

import { useEffect, useRef } from "react";

interface AdUnitProps {
  slot: string;
  format?: "auto" | "horizontal" | "rectangle" | "vertical" | "fluid" | "autorelaxed";
  className?: string;
  layout?: string;
  layoutKey?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const CLIENT_ID = "ca-pub-1366863868438764";

const FORMAT_SIZES: Record<NonNullable<AdUnitProps["format"]>, React.CSSProperties> = {
  auto: { display: "block", width: "100%", minHeight: 90 },
  horizontal: { display: "block", width: "100%", minHeight: 90 },
  rectangle: { display: "block", width: "100%", minHeight: 250 },
  vertical: { display: "block", width: "100%", minHeight: 600 },
  fluid: { display: "block", width: "100%" },
  autorelaxed: { display: "block", width: "100%", minHeight: 250 },
};

export default function AdUnit({ slot, format = "auto", className = "", layout, layoutKey, style }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;

    const pushAd = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // Silently fail
      }
    };

    const attempt = (attempts: number) => {
      if (typeof window !== "undefined") {
        if (window.adsbygoogle) {
          pushAd();
          return;
        }
        if (attempts < 50) {
          setTimeout(() => attempt(attempts + 1), 200);
        }
      }
    };

    attempt(0);
  }, []);

  return (
    <div className={`ad-container overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          ...FORMAT_SIZES[format],
          ...style,
        }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={format === "autorelaxed" || format === "fluid" ? undefined : "true"}
        {...(layout ? { "data-ad-layout": layout } : {})}
        {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
      />
    </div>
  );
}
