/**
 * Faz 1 için deterministik mock OHLCV üreteci. API ayağa kalkınca lib/api.ts gerçek
 * veriye geçer; bu yalnızca premium kabuğu canlı göstermek içindir.
 */

export type ChartBar = {
  time: string; // 'yyyy-mm-dd'
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const fmtDate = (d: Date) => d.toISOString().slice(0, 10);

export function generateMockSeries(symbol: string, days = 180, startPrice = 250): ChartBar[] {
  // Sembolden deterministik seed → her sembol stabil ama farklı seri üretir.
  let seed = 0;
  for (let i = 0; i < symbol.length; i++) seed = (seed * 31 + symbol.charCodeAt(i)) | 0;
  const rand = mulberry32(seed);

  // Hafta içi günleri 2026-06-20'den geriye doğru topla.
  const dates: Date[] = [];
  const cursor = new Date(Date.UTC(2026, 5, 20));
  while (dates.length < days) {
    const dow = cursor.getUTCDay();
    if (dow !== 0 && dow !== 6) dates.push(new Date(cursor));
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  dates.reverse();

  const bars: ChartBar[] = [];
  let price = startPrice;
  for (const date of dates) {
    const shock = (rand() - 0.5) * 2 * 0.018 + 0.0004; // hafif yukarı drift
    const open = price;
    const close = Math.max(1, open * (1 + shock));
    const high = Math.max(open, close) * (1 + rand() * 0.01);
    const low = Math.min(open, close) * (1 - rand() * 0.01);
    bars.push({
      time: fmtDate(date),
      open: round2(open),
      high: round2(high),
      low: round2(low),
      close: round2(close),
      volume: Math.round(2_000_000 + rand() * 8_000_000),
    });
    price = close;
  }
  return bars;
}
