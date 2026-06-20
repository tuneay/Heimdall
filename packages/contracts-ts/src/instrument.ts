import { z } from "zod";
import { AssetClass } from "./common";

export const Exchange = z.object({
  code: z.string(),
  name: z.string(),
  mic: z.string().nullable().optional(),
  timezone: z.string().default("Europe/Istanbul"),
});
export type Exchange = z.infer<typeof Exchange>;

export const Instrument = z.object({
  tenant_id: z.string().default("default"),
  symbol: z.string(),
  exchange_code: z.string().default("XIST"),
  name: z.string(),
  asset_class: AssetClass.default("equity"),
  currency: z.string().default("TRY"),
  yfinance_ticker: z.string().nullable().optional(),
  isin: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});
export type Instrument = z.infer<typeof Instrument>;
