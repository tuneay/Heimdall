import { z } from "zod";

/**
 * Bu dosya, packages/contracts-py (Pydantic, kanonik) şeklini yansıtır.
 * İleride API'nin OpenAPI çıktısından otomatik üretilecek (ADR-0005).
 */

export const AssetClass = z.enum(["equity", "index", "etf", "fx", "crypto"]);
export type AssetClass = z.infer<typeof AssetClass>;

export const BarInterval = z.enum(["1m", "5m", "15m", "1h", "1d", "1w"]);
export type BarInterval = z.infer<typeof BarInterval>;

export const DataSourceKind = z.enum([
  "market",
  "fundamental",
  "filing",
  "news",
  "social",
  "macro",
]);
export type DataSourceKind = z.infer<typeof DataSourceKind>;

/** Point-in-time alanları — her zaman-damgalı kayıtta bulunur. */
export const PITFields = z.object({
  /** Olayın gerçekleştiği zaman (ISO 8601). */
  event_time: z.string().datetime({ offset: true }),
  /** As-of: kaydın ilk bilinebildiği an (ISO 8601). */
  knowledge_time: z.string().datetime({ offset: true }),
});
