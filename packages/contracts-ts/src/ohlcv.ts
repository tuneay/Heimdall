import { z } from "zod";
import { BarInterval, PITFields } from "./common";

/**
 * OHLCV mumu. Fiyatlar API'de Decimal → JSON'da string gelebilir; z.coerce.number
 * ile güvenle sayıya çevrilir (grafik tüketimi için).
 */
export const OHLCVBar = PITFields.extend({
  tenant_id: z.string().default("default"),
  symbol: z.string(),
  exchange_code: z.string().default("XIST"),
  interval: BarInterval.default("1d"),
  open: z.coerce.number(),
  high: z.coerce.number(),
  low: z.coerce.number(),
  close: z.coerce.number(),
  volume: z.coerce.number(),
  adjusted_close: z.coerce.number().nullable().optional(),
  source: z.string(),
});
export type OHLCVBar = z.infer<typeof OHLCVBar>;

export const OHLCVSeries = z.object({
  symbol: z.string(),
  interval: BarInterval,
  bars: z.array(OHLCVBar),
});
export type OHLCVSeries = z.infer<typeof OHLCVSeries>;
