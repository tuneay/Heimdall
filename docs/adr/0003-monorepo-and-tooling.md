# ADR-0003: Monorepo ve araç zinciri

- **Durum:** Kabul edildi
- **Tarih:** 2026-06-20

## Bağlam
Polyglot (Python + TS, ileride Rust) tek repo. Paylaşılan kontratlar, atomik değişiklik
ve tutarlı CI isteniyor. Orkestratör olarak **moon** önerilmişti; ancak moon ayrı kurulum
gerektiriyor ve geliştirme makinesinde henüz yok.

## Karar
**Monorepo**, iki yerel araç zinciriyle — her biri bağımsız çalışır:
- **TypeScript:** pnpm workspaces (corepack ile, ek kurulum yok).
- **Python:** uv workspace.
- **moon** opsiyonel orkestratör olarak `.moon/` altında yapılandırılır; kurulduğunda
  `moon run :dev` tüm yığını tek komutta sürer. Kurulu değilken pnpm/uv doğrudan kullanılır.

> Pragmatik gerekçe: Faz 1'in *çalışır* olması, sıfır-kurulum yolunu (pnpm/uv) birincil
> yapar; moon "üstüne eklenir", zorunlu kılınmaz. Karar geri alınabilir.

## Sonuçlar
- (+) `pnpm install` ile web hemen çalışır; ekstra araç şartı yok.
- (+) moon ileride sıfır yeniden-yapılandırmayla devreye girer.
- (−) moon kurulana dek cross-language tek-komut orkestrasyonu yok (npm script + uv ile telafi).
