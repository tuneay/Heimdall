# infra — Yerel altyapı

Tek komutla Heimdall'ın bağımlı servisleri.

## Çekirdek

```bash
cp .env.example .env
docker compose -f infra/docker-compose.yml up -d
```

| Servis | Port | Not |
|--------|------|-----|
| Postgres + TimescaleDB + pgvector | 5432 | Şema ilk açılışta otomatik (`postgres/init/01-init.sql`) |
| Redis | 6379 | Cache / kuyruk |
| MinIO | 9000 (API) · 9001 (konsol) | S3-uyumlu veri gölü |
| MLflow | 5000 | Deney takibi + registry (sqlite + yerel artefakt) |

## Gözlemlenebilirlik (opsiyonel)

```bash
docker compose -f infra/docker-compose.yml --profile observability up -d
```

| Servis | Port | Not |
|--------|------|-----|
| OTel Collector | 4317 (gRPC) · 4318 (HTTP) | `OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317` |
| Tempo | 3200 | İzler (traces) |
| Prometheus | 9090 | Metrikler |
| Grafana | 3002 | Panolar (anonim admin) |

> Gözlemlenebilirlik profili **provisional**'dır (Faz 17'de sertleştirilir): pano
> provisioning, Loki log toplama ve alerting daha sonra eklenecek. API/pipeline'daki
> OTel SDK, endpoint tanımlı değilken no-op çalışır — çekirdek akış buna bağımlı değildir.

## Notlar
- Üretim sırrı yok; tüm parolalar dev içindir (`.env`). Sertleştirme Faz 17.
- `pgvector` ve `timescaledb`, `timescaledb-ha` imajında birlikte gelir.
