"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { CryptoData } from "@/types/news";
import Sparkline from "./Sparkline";

export default function CryptoWidget() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/crypto")
      .then((res) => res.json())
      .then((data) => {
        setCryptos((data.cryptos || []).slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || cryptos.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-gray-100 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50">
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
        Cryptocurrency
      </h3>
      <div className="space-y-2">
        {cryptos.map((crypto) => (
          <div
            key={crypto.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {crypto.symbol.slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{crypto.symbol}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {crypto.name}
                </p>
              </div>
            </div>
            <div className="ml-2">
              <Sparkline data={crypto.sparkline} width={50} height={20} />
            </div>
            <div className="ml-3 text-right">
              <p className="text-sm font-semibold">
                ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p
                className={`text-xs font-medium flex items-center justify-end gap-0.5 ${
                  crypto.changePercent24h >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {crypto.changePercent24h >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {crypto.changePercent24h >= 0 ? "+" : ""}
                {crypto.changePercent24h.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
