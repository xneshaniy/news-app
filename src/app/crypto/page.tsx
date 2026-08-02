"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { CryptoData } from "@/types/news";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import Sparkline from "@/components/Sparkline";

export default function CryptoPage() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [topGainers, setTopGainers] = useState<CryptoData[]>([]);
  const [topLosers, setTopLosers] = useState<CryptoData[]>([]);
  const [totalMarketCap, setTotalMarketCap] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/crypto")
      .then((res) => res.json())
      .then((data) => {
        setCryptos(data.cryptos || []);
        setTopGainers(data.topGainers || []);
        setTopLosers(data.topLosers || []);
        setTotalMarketCap(data.totalMarketCap || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Cryptocurrency</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Live cryptocurrency prices and market data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
            <DollarSign className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-sm opacity-80">Total Market Cap</p>
            <p className="text-2xl font-bold">
              ${(totalMarketCap / 1e12).toFixed(2)}T
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white">
            <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-sm opacity-80">Top Gainer</p>
            <p className="text-2xl font-bold">
              {topGainers[0]?.symbol} +{topGainers[0]?.changePercent24h.toFixed(2)}%
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 text-white">
            <TrendingDown className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-sm opacity-80">Top Loser</p>
            <p className="text-2xl font-bold">
              {topLosers[0]?.symbol} {topLosers[0]?.changePercent24h.toFixed(2)}%
            </p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded mb-3" />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                All Cryptocurrencies
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700/50 text-sm text-gray-500 dark:text-gray-400">
                    <th className="text-left p-4 font-medium">#</th>
                    <th className="text-left p-4 font-medium">Coin</th>
                    <th className="text-right p-4 font-medium">Price</th>
                    <th className="text-right p-4 font-medium">24h Change</th>
                    <th className="text-right p-4 font-medium hidden sm:table-cell">Market Cap</th>
                    <th className="text-right p-4 font-medium hidden md:table-cell">Volume (24h)</th>
                    <th className="text-right p-4 font-medium hidden lg:table-cell">Last 24h</th>
                  </tr>
                </thead>
                <tbody>
                  {cryptos.map((crypto, index) => (
                    <tr
                      key={crypto.id}
                      className="border-b border-gray-50 dark:border-gray-700/30 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="p-4 text-gray-500">{index + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {crypto.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold">{crypto.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {crypto.symbol}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-semibold">
                        ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold ${
                            crypto.changePercent24h >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {crypto.changePercent24h >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {crypto.changePercent24h >= 0 ? "+" : ""}
                          {crypto.changePercent24h.toFixed(2)}%
                        </span>
                      </td>
                      <td className="p-4 text-right text-sm text-gray-600 dark:text-gray-300 hidden sm:table-cell">
                        ${(crypto.marketCap / 1e9).toFixed(1)}B
                      </td>
                      <td className="p-4 text-right text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">
                        ${(crypto.volume24h / 1e9).toFixed(2)}B
                      </td>
                      <td className="p-4 text-right hidden lg:table-cell">
                        <Sparkline data={crypto.sparkline} width={80} height={28} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
