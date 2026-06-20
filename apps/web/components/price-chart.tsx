"use client";

import {
  ColorType,
  createChart,
  type IChartApi,
  type Time,
} from "lightweight-charts";
import { useEffect, useRef } from "react";
import type { ChartBar } from "@/lib/mock-data";

export function PriceChart({ bars }: { bars: ChartBar[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chart: IChartApi = createChart(el, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#a2a8b4",
        fontFamily:
          "var(--font-sans), -apple-system, Segoe UI, system-ui, sans-serif",
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.04)" },
        horzLines: { color: "rgba(255,255,255,0.04)" },
      },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.08)" },
      timeScale: { borderColor: "rgba(255,255,255,0.08)", rightOffset: 6 },
      crosshair: { mode: 1 },
      autoSize: true,
    });

    const series = chart.addCandlestickSeries({
      upColor: "#1d9e75",
      downColor: "#e24b4a",
      borderUpColor: "#1d9e75",
      borderDownColor: "#e24b4a",
      wickUpColor: "#1d9e75",
      wickDownColor: "#e24b4a",
    });

    series.setData(
      bars.map((b) => ({
        time: b.time as Time,
        open: b.open,
        high: b.high,
        low: b.low,
        close: b.close,
      })),
    );
    chart.timeScale().fitContent();

    return () => chart.remove();
  }, [bars]);

  return <div ref={containerRef} className="h-[420px] w-full" />;
}
