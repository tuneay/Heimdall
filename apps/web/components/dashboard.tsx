"use client";

import { motion } from "framer-motion";
import type { Series } from "@/lib/api";
import { PriceChart } from "./price-chart";
import { Card } from "./ui/card";
import { Stat } from "./ui/stat";

const tl = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const intFmt = new Intl.NumberFormat("tr-TR");

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const futurePanels = [
  { t: "Sinyaller", d: "Çok-ufuk tahmin & sinyal füzyonu", p: "Faz 12" },
  { t: "Algı & Haber", d: "KAP, haber ve sosyal sentiment", p: "Faz 4–6" },
  { t: "Strateji", d: "Backtest & walk-forward değerlendirme", p: "Faz 13" },
];

export function Dashboard({ series }: { series: Series }) {
  const bars = series.bars;
  const last = bars.at(-1);
  const prev = bars.at(-2) ?? last;
  if (!last || !prev) {
    return <p className="py-12 text-secondary">Veri bulunamadı.</p>;
  }

  const change = last.close - prev.close;
  const pct = prev.close ? (change / prev.close) * 100 : 0;
  const up = change >= 0;
  const hi = Math.max(...bars.map((b) => b.high));
  const lo = Math.min(...bars.map((b) => b.low));

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6"
    >
      <motion.div variants={item} className="flex items-end justify-between gap-4 pt-2">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tightest text-primary">
              {series.symbol}
            </h1>
            <span className="rounded-md border px-2 py-0.5 text-[11px] text-secondary">
              XIST · Günlük
            </span>
          </div>
          <p className="mt-1 text-sm text-secondary">Türk Hava Yolları A.O.</p>
        </div>
        <div className="text-right">
          <div className="tabular text-3xl font-semibold tracking-tight text-primary">
            ₺{tl.format(last.close)}
          </div>
          <div className={`tabular text-sm font-medium ${up ? "text-up" : "text-down"}`}>
            {up ? "▲" : "▼"} {tl.format(Math.abs(change))} ({pct.toFixed(2)}%)
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Son Fiyat" value={`₺${tl.format(last.close)}`} />
        <Stat
          label="Günlük Değişim"
          value={`${pct.toFixed(2)}%`}
          sub={`${up ? "+" : "−"}₺${tl.format(Math.abs(change))}`}
          tone={up ? "up" : "down"}
        />
        <Stat label="Dönem Aralığı" value={`₺${tl.format(lo)}`} sub={`— ₺${tl.format(hi)}`} />
        <Stat label="Hacim" value={intFmt.format(last.volume)} sub="adet" />
      </motion.div>

      <motion.div variants={item}>
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-secondary">Fiyat Grafiği</h2>
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
              style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
            >
              {series.source === "mock" ? "demo veri" : "canlı API"}
            </span>
          </div>
          <PriceChart bars={bars} />
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-3">
        {futurePanels.map((c) => (
          <Card key={c.t} className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-primary">{c.t}</h3>
              <span className="rounded-full border px-2 py-0.5 text-[10px] text-tertiary">
                {c.p}
              </span>
            </div>
            <p className="mt-2 text-sm text-secondary">{c.d}</p>
            <p className="mt-3 text-[11px] uppercase tracking-wide text-tertiary">Yakında</p>
          </Card>
        ))}
      </motion.div>
    </motion.div>
  );
}
