# heimdall-api

FastAPI servis katmanı — web arayüzünü ve ileride tahmin/sinyal tüketicilerini besler.

## Çalıştırma (Python 3.12 + uv + Postgres gerekir)

```bash
# repo kökünden
docker compose -f infra/docker-compose.yml up -d postgres   # şema otomatik kurulur
uv sync
uv run --package heimdall-api uvicorn heimdall_api.main:app --reload --port 8000
```

## Uçlar (Faz 1)

| Metot | Yol | Açıklama |
|------|-----|----------|
| GET | `/health` | Servis sağlığı |
| GET | `/health/db` | Postgres bağlantısı |
| GET | `/instruments` | Aktif enstrümanlar |
| GET | `/instruments/{symbol}/ohlcv?interval=1d` | OHLCV serisi |
| GET | `/docs` | OpenAPI (Swagger) |

> Yanıt şekilleri `heimdall_contracts` (Pydantic) ile garanti edilir; aynı şema
> `packages/contracts-ts` üzerinden web'e taşınır (ADR-0005).

## Notlar
- Postgres ayakta değilse veri uçları `503` döner (sessiz mock yok — API dürüst kalır;
  demo gösterimi web tarafının mock fallback'i ile yapılır).
- OpenTelemetry, `OTEL_EXPORTER_OTLP_ENDPOINT` tanımlıysa devreye girer.
