"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useCountry } from "@/components/CountryProvider";
import { StockData } from "@/types/news";
import { COUNTRIES } from "@/lib/constants";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import Sparkline from "@/components/Sparkline";

export default function StocksPage() {
  const { country, setCountry } = useCountry();
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [gainers, setGainers] = useState<StockData[]>([]);
  const [losers, setLosers] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/stocks?country=${country}`)
      .then((res) => res.json())
      .then((data) => {
        setStocks(data.stocks || []);
        setGainers(data.gainers || []);
        setLosers(data.losers || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [country]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Stock Market</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Real-time stock prices and market data
            </p>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700/50 animate-pulse"
              >
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="h-14 bg-gray-100 dark:bg-gray-700 rounded mb-2" />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold">All Stocks</h2>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {stocks.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {stock.symbol.slice(0, 3)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold">{stock.symbol}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {stock.name}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Sparkline data={stock.history} width={100} height={32} />
                      </div>
                      <div className="ml-4 text-right">
                        <p className="font-semibold">
                          ${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <p
                          className={`text-sm font-medium flex items-center justify-end gap-1 ${
                            stock.changePercent >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {stock.changePercent >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {stock.changePercent >= 0 ? "+" : ""}
                          {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Top Gainers
                </h3>
                <div className="space-y-2">
                  {gainers.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-900/20"
                    >
                      <div>
                        <p className="font-semibold text-sm">{stock.symbol}</p>
                        <p className="text-xs text-gray-500">${stock.price.toFixed(2)}</p>
                      </div>
                      <span className="text-green-600 dark:text-green-400 text-sm font-semibold">
                        +{stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                  Top Losers
                </h3>
                <div className="space-y-2">
                  {losers.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-900/20"
                    >
                      <div>
                        <p className="font-semibold text-sm">{stock.symbol}</p>
                        <p className="text-xs text-gray-500">${stock.price.toFixed(2)}</p>
                      </div>
                      <span className="text-red-600 dark:text-red-400 text-sm font-semibold">
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
