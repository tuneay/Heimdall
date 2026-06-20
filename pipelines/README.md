# heimdall-pipelines

Dagster orkestrasyonu — ingest, feature ve (ileride) training asset'leri.

## Çalıştırma (Python 3.12 + uv + Postgres gerekir)

```bash
docker compose -f infra/docker-compose.yml up -d postgres
uv sync
uv run --package heimdall-pipelines dagster dev   # http://localhost:3000 (Dagster UI)
```

Dagster UI'da `thyao_daily_ohlcv` asset'ini **Materialize** et → yfinance'tan THYAO
günlük verisi çekilip Timescale'e yazılır. Ardından API `GET /instruments/THYAO/ohlcv`
veriyi döner ve web grafiği gerçek veriyle dolar.

## Faz 1 asset'i
- `thyao_daily_ohlcv` — tek hisse, günlük, point-in-time (`knowledge_time`) damgalı upsert.

## Sıradaki (Faz 2)
- BIST evreni (çoklu sembol), partitioned/incremental asset'ler, kurumsal aksiyonlar,
  çok-kaynak mutabakatı, Pandera ile veri-kalite kontrolleri, zamanlı (scheduled) job'lar.
