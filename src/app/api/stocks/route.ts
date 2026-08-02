import { NextRequest, NextResponse } from "next/server";
import { STOCK_SYMBOLS } from "@/lib/free-services";
import { fetchWithTimeout } from "@/lib/api-utils";

interface StockItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  history: number[];
}

const FALLBACK_STOCKS: Record<string, StockItem[]> = {
  us: [
    { symbol: "AAPL", name: "Apple Inc.", price: 178.52, change: 2.34, changePercent: 1.33, history: [] },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 141.80, change: -1.23, changePercent: -0.86, history: [] },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 378.91, change: 4.56, changePercent: 1.22, history: [] },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.25, change: -0.89, changePercent: -0.50, history: [] },
    { symbol: "NVDA", name: "NVIDIA Corp.", price: 875.28, change: 12.45, changePercent: 1.44, history: [] },
    { symbol: "TSLA", name: "Tesla Inc.", price: 248.42, change: -3.21, changePercent: -1.28, history: [] },
    { symbol: "META", name: "Meta Platforms", price: 505.75, change: 8.92, changePercent: 1.80, history: [] },
    { symbol: "JPM", name: "JPMorgan Chase", price: 198.47, change: 1.23, changePercent: 0.62, history: [] },
  ],
  gb: [
    { symbol: "SHEL", name: "Shell plc", price: 28.45, change: 0.34, changePercent: 1.21, history: [] },
    { symbol: "AZN", name: "AstraZeneca", price: 104.23, change: -0.56, changePercent: -0.53, history: [] },
    { symbol: "HSBA", name: "HSBC Holdings", price: 6.78, change: 0.12, changePercent: 1.80, history: [] },
    { symbol: "BP", name: "BP plc", price: 5.42, change: -0.08, changePercent: -1.45, history: [] },
    { symbol: "GSK", name: "GSK plc", price: 18.92, change: 0.23, changePercent: 1.23, history: [] },
  ],
  in: [
    { symbol: "RELIANCE", name: "Reliance Industries", price: 2945.60, change: 45.30, changePercent: 1.56, history: [] },
    { symbol: "TCS", name: "Tata Consultancy", price: 3856.75, change: -23.40, changePercent: -0.60, history: [] },
    { symbol: "HDFCBANK", name: "HDFC Bank", price: 1678.30, change: 12.80, changePercent: 0.77, history: [] },
    { symbol: "INFY", name: "Infosys Ltd.", price: 1587.45, change: -8.90, changePercent: -0.56, history: [] },
    { symbol: "ICICIBANK", name: "ICICI Bank", price: 1123.80, change: 15.60, changePercent: 1.41, history: [] },
  ],
};

function generateHistory(basePrice: number): number[] {
  const history: number[] = [];
  let price = basePrice * 0.95;
  for (let i = 0; i < 30; i++) {
    price += (Math.random() - 0.48) * (basePrice * 0.02);
    history.push(Math.round(price * 100) / 100);
  }
  return history;
}

async function fetchAlphaVantage(symbol: string): Promise<{ price: number; change: number; changePercent: number } | null> {
  const key = process.env.ALPHA_VANTAGE_KEY;
  if (!key) return null;
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${key}`;
    const res = await fetchWithTimeout(url, { next: { revalidate: 3600 }, timeout: 8000 });
    if (!res.ok) return null;
    const data = await res.json();
    const quote = data["Global Quote"];
    if (!quote || !quote["05. price"]) return null;
    return {
      price: parseFloat(quote["05. price"]),
      change: parseFloat(quote["09. change"]),
      changePercent: parseFloat(quote["10. change percent"]?.replace("%", "") || "0"),
    };
  } catch {
    return null;
  }
}

async function fetchTwelveData(symbol: string): Promise<{ price: number; change: number; changePercent: number } | null> {
  const key = process.env.TWELVE_DATA_KEY;
  if (!key) return null;
  try {
    const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${key}`;
    const res = await fetchWithTimeout(url, { next: { revalidate: 3600 }, timeout: 8000 });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.close) return null;
    return {
      price: parseFloat(data.close),
      change: parseFloat(data.change || "0"),
      changePercent: parseFloat(data.percent_change || "0"),
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const country = searchParams.get("country") || "us";

  const symbols = STOCK_SYMBOLS[country];
  const fallbackStocks = FALLBACK_STOCKS[country] || FALLBACK_STOCKS["us"];

  if (symbols) {
    const liveStocks = await Promise.all(
      symbols.map(async (s) => {
        const live = await fetchAlphaVantage(s.symbol) || await fetchTwelveData(s.symbol);
        if (live) {
          return { ...s, ...live, history: generateHistory(live.price) };
        }
        const fb = fallbackStocks.find((f) => f.symbol === s.symbol);
        return { ...s, price: fb?.price || 100, change: fb?.change || 0, changePercent: fb?.changePercent || 0, history: generateHistory(fb?.price || 100) };
      })
    );

    const gainers = [...liveStocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
    const losers = [...liveStocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);

    return NextResponse.json({
      stocks: liveStocks,
      gainers,
      losers,
      lastUpdated: new Date().toISOString(),
      source: process.env.ALPHA_VANTAGE_KEY ? "alphavantage" : process.env.TWELVE_DATA_KEY ? "twelvedata" : "fallback",
    });
  }

  const enriched = fallbackStocks.map((s) => ({
    ...s,
    history: s.history.length > 0 ? s.history : generateHistory(s.price),
  }));

  const gainers = [...enriched].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const losers = [...enriched].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);

  return NextResponse.json({
    stocks: enriched,
    gainers,
    losers,
    lastUpdated: new Date().toISOString(),
    source: "fallback",
  });
}
