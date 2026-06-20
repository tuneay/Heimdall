# ADR-0002: Teknoloji yığını ve diller

- **Durum:** Kabul edildi
- **Tarih:** 2026-06-20

## Bağlam
Çok-kaynaklı veri toplama + ağır ML/DL + premium web arayüzü gereken bir sistem. Tek
dil hepsini en iyi yapamaz.

## Karar
**Polyglot, bilinçli iş bölümü:**
- **Python 3.12+** — veri ingest, ML/DL, NLP, backtest, pipeline. Ekosistem zorunluluğu.
- **TypeScript** — web UI + tip-güvenli API istemcisi.
- **SQL** — analitik dönüşümler (DuckDB/Postgres).
- **Rust** — *ileride*, kanıtlanmış darboğazlar (gerçek-zamanlı ingest, düşük-gecikme
  stream). NautilusTrader zaten Rust çekirdekli. Faz 1'de yazılmaz; mimari hazır tutulur.

Çekirdek kütüphaneler: PyTorch, LightGBM/XGBoost/CatBoost, Nixtla/Darts, Chronos/TimesFM;
FastAPI + Pydantic v2 + SQLAlchemy 2.0; Next.js + Tailwind + Motion + TradingView charts;
Dagster (orkestrasyon), MLflow (MLOps), OpenTelemetry + Grafana (gözlem).

## Sonuçlar
- (+) Her iş için en uygun araç; "en gelişmiş yapı" hedefi karşılanır.
- (+) Modüler monolit → servis sınırları net; Rust hot-path'e sonradan girer.
- (−) İki araç zinciri (uv + pnpm) bakım yükü; CI'da ikisi de koşar.
- (−) Polyglot işe alım/öğrenme eğrisi (kişisel projede kabul edilebilir).
