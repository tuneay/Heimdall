# ADR-0004: Depolama — Postgres + TimescaleDB + pgvector

- **Durum:** Kabul edildi
- **Tarih:** 2026-06-20

## Bağlam
Sistem zaman-serisi (OHLCV, tick), ilişkisel (şirket, ticker, kullanıcı), vektör (haber
embedding) ve büyük analitik tarama (backtest) verisi tutar. Çok sayıda ayrı veritabanı
operasyon yükünü patlatır — özellikle "önce kişisel" ölçekte.

## Karar
- **PostgreSQL** tek ilişkisel çekirdek.
- **TimescaleDB** uzantısı → zaman-serisi hypertable'lar aynı DB içinde.
- **pgvector** uzantısı → embedding'ler aynı DB içinde (ayrı vektör DB'ye gerek yok).
- **MinIO** (S3) → ham veri gölü (parquet), model artefaktları, doküman blob'ları.
- **DuckDB** → parquet üzerinde gömülü OLAP; araştırma/backtest sorguları.
- **Redis** → cache/rate-limit/hafif kuyruk.

Ölçek büyürse: pgvector → Qdrant; Redis kuyruk → Redpanda/NATS. Sınırlar izole.

## Sonuçlar
- (+) Tek DB ile başla: minimum operasyon, point-in-time join'ler kolay.
- (+) Migrasyon yolu net (uzantı → ayrı servis) çünkü erişim soyutlanmış.
- (−) Tek Postgres örneği erken bir ölçek tavanı; ama o noktaya gelince ayrıştırılır.
