import { NextResponse } from "next/server";
import { COINGECKO_IDS } from "@/lib/free-services";
import { fetchWithTimeout } from "@/lib/api-utils";

interface CryptoItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  marketCap: number;
  volume24h: number;
  sparkline: number[];
  image: string;
}

const FALLBACK_DATA: CryptoItem[] = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 67245.82, change24h: 1245.30, changePercent24h: 1.89, marketCap: 1320000000000, volume24h: 28500000000, sparkline: [], image: "" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 3456.78, change24h: -45.20, changePercent24h: -1.29, marketCap: 415000000000, volume24h: 15200000000, sparkline: [], image: "" },
  { id: "tether", symbol: "USDT", name: "Tether", price: 1.00, change24h: 0.001, changePercent24h: 0.10, marketCap: 110000000000, volume24h: 52000000000, sparkline: [], image: "" },
  { id: "binancecoin", symbol: "BNB", name: "BNB", price: 598.45, change24h: 12.30, changePercent24h: 2.10, marketCap: 89000000000, volume24h: 1800000000, sparkline: [], image: "" },
  { id: "solana", symbol: "SOL", name: "Solana", price: 172.34, change24h: 8.56, changePercent24h: 5.24, marketCap: 76000000000, volume24h: 3200000000, sparkline: [], image: "" },
  { id: "ripple", symbol: "XRP", name: "XRP", price: 0.62, change24h: -0.03, changePercent24h: -4.62, marketCap: 34000000000, volume24h: 1500000000, sparkline: [], image: "" },
  { id: "usd-coin", symbol: "USDC", name: "USD Coin", price: 1.00, change24h: 0.0005, changePercent24h: 0.05, marketCap: 32000000000, volume24h: 8500000000, sparkline: [], image: "" },
  { id: "cardano", symbol: "ADA", name: "Cardano", price: 0.58, change24h: 0.04, changePercent24h: 7.41, marketCap: 20500000000, volume24h: 920000000, sparkline: [], image: "" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", price: 0.15, change24h: -0.008, changePercent24h: -5.06, marketCap: 21000000000, volume24h: 1100000000, sparkline: [], image: "" },
  { id: "polkadot", symbol: "DOT", name: "Polkadot", price: 8.45, change24h: 0.67, changePercent24h: 8.61, marketCap: 11500000000, volume24h: 520000000, sparkline: [], image: "" },
];

function generateSparkline(basePrice: number): number[] {
  const points: number[] = [];
  let price = basePrice * 0.95;
  for (let i = 0; i < 24; i++) {
    price += (Math.random() - 0.48) * (basePrice * 0.015);
    points.push(Math.round(price * 100) / 100);
  }
  return points;
}

async function fetchCoinGecko(): Promise<CryptoItem[] | null> {
  try {
    const ids = COINGECKO_IDS.join(",");
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`;
    const res = await fetchWithTimeout(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
      timeout: 8000,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.map((coin: Record<string, unknown>) => ({
      id: coin.id as string,
      symbol: (coin.symbol as string).toUpperCase(),
      name: coin.name as string,
      price: coin.current_price as number,
      change24h: coin.price_change_24h as number,
      changePercent24h: coin.price_change_percentage_24h as number,
      marketCap: coin.market_cap as number,
      volume24h: coin.total_volume as number,
      sparkline: (coin.sparkline_in_7d as { price: number[] })?.price?.slice(-24) || [],
      image: coin.image as string,
    }));
  } catch {
    return null;
  }
}

export async function GET() {
  const liveData = await fetchCoinGecko();

  const cryptos = liveData || FALLBACK_DATA.map((c) => ({
    ...c,
    sparkline: generateSparkline(c.price),
    image: `https://assets.coingecko.com/coins/images/1/small/${c.id}.png`,
  }));

  const enriched = cryptos.map((c) => ({
    ...c,
    sparkline: c.sparkline.length > 0 ? c.sparkline : generateSparkline(c.price),
    price: Math.round(c.price * 100) / 100,
    marketCap: Math.round(c.marketCap),
    volume24h: Math.round(c.volume24h),
  }));

  const topGainers = [...enriched].sort((a, b) => b.changePercent24h - a.changePercent24h).slice(0, 5);
  const topLosers = [...enriched].sort((a, b) => a.changePercent24h - b.changePercent24h).slice(0, 5);

  return NextResponse.json({
    cryptos: enriched,
    topGainers,
    topLosers,
    totalMarketCap: enriched.reduce((sum, c) => sum + c.marketCap, 0),
    totalVolume: enriched.reduce((sum, c) => sum + c.volume24h, 0),
    lastUpdated: new Date().toISOString(),
    source: liveData ? "coingecko" : "fallback",
  });
}
