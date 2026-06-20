import { OHLCVSeries } from "@heimdall/contracts";
import { generateMockSeries, type ChartBar } from "./mock-data";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export type Series = {
  symbol: string;
  bars: ChartBar[];
  source: "api" | "mock";
};

/**
 * Bir sembolün günlük OHLCV serisini getirir. API erişilemezse (Faz 1'de henüz
 * ayakta değil) sessizce mock veriye düşer — kontrat aynı kalır.
 */
export async function getSeries(symbol: string): Promise<Series> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 1500);
    const res = await fetch(`${API_BASE}/instruments/${symbol}/ohlcv?interval=1d`, {
      signal: ctrl.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`API ${res.status}`);

    const parsed = OHLCVSeries.parse(await res.json());
    const bars: ChartBar[] = parsed.bars.map((b) => ({
      time: b.event_time.slice(0, 10),
      open: b.open,
      high: b.high,
      low: b.low,
      close: b.close,
      volume: b.volume,
    }));
    return { symbol, bars, source: "api" };
  } catch {
    return { symbol, bars: generateMockSeries(symbol), source: "mock" };
  }
}
