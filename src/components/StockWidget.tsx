"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useCountry } from "./CountryProvider";
import { StockData } from "@/types/news";
import Sparkline from "./Sparkline";

export default function StockWidget() {
  const { country } = useCountry();
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/stocks?country=${country}`)
      .then((res) => res.json())
      .then((data) => {
        setStocks((data.gainers || []).slice(0, 4));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [country]);

  if (loading || stocks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50">
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
        Top Gainers
      </h3>
      <div className="space-y-2">
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{stock.symbol}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {stock.name}
              </p>
            </div>
            <div className="ml-2">
              <Sparkline data={stock.history} width={60} height={24} />
            </div>
            <div className="ml-3 text-right">
              <p className="text-sm font-semibold">
                ${stock.price.toLocaleString()}
              </p>
              <p
                className={`text-xs font-medium flex items-center justify-end gap-0.5 ${
                  stock.changePercent >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {stock.changePercent >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stock.changePercent >= 0 ? "+" : ""}
                {stock.changePercent.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
