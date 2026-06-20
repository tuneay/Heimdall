<div align="center">

# 🛡️ Heimdall

**"Her şeyi gören."** — Borsa İstanbul için çok-kaynaklı tahmin, sinyal, araştırma ve strateji platformu.

`monorepo` · `polyglot (Python + TypeScript)` · `point-in-time correct` · `premium web UI`

</div>

---

## Vizyon

Heimdall; geleneksel piyasa verisini, temel analizi, KAP ifşalarını/insider işlemleri, haber ve sosyal algı sinyallerini tek bir **füzyon tahmin motorunda** birleştiren kapsamlı bir borsa zekâ platformudur. Kısa ve uzun vadeli tahmin, sinyal üretimi, strateji geliştirme ve backtesting'i tek çatı altında, baştan sona premium bir arayüz üzerinden sunar.

> Yöntem: acele yok. Yüksek granülerlikte fazlara bölünmüş; her faz tek bir alanı kusursuzlaştırır. Bkz. [docs/ROADMAP.md](docs/ROADMAP.md).

## Durum: **Faz 1 — Temel & Mimari** 🚧

Bu repo şu an "walking skeleton" aşamasındadır: tek bir BIST hissesini tüm katmanlardan uçtan uca geçiren ince dilim + sağlam monorepo iskeleti. Model/strateji **yok**; üzerine her fazın eklenebileceği *temel* var.

| Çalışır durumda (Node) | İskele halinde (Python/Docker kurulunca) |
|---|---|
| `apps/web` — premium UI kabuğu + grafik | `services/api` — FastAPI |
| `packages/contracts-ts` — paylaşılan tipler | `pipelines` — Dagster (yfinance → BIST) |
| Monorepo + CI yapısı | `infra` — Postgres/Timescale, Redis, MinIO, MLflow, Grafana |

## Mimari (özet)

Sekiz katmanlı veri/ML platformu; Dagster orkestrasyonu, OpenTelemetry/Grafana gözlemlenebilirlik, MLflow MLOps cross-cutting. Tam açıklama: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

```
Veri Kaynakları → İngest → Depolama → Özellik & NLP → Tahmin Motoru
        → Strateji/Sinyal/Backtest → API → Premium Web UI
```

## Repo yapısı

```
apps/web              Next.js premium arayüz (App Router, Tailwind, Motion, TradingView charts)
services/api          FastAPI — veri/tahmin servis API'si (Pydantic v2, SQLAlchemy 2.0)
pipelines             Dagster — ingest + feature + training asset'leri
ml                    Model geliştirme alanı (Faz 9+)
packages/contracts-ts Paylaşılan TypeScript tipleri + zod şemaları (frontend)
packages/contracts-py Pydantic modelleri — veri/ML tarafının kanonik şeması
infra                 docker-compose yığını, init SQL, OTel collector
docs                  ROADMAP, ARCHITECTURE, ADR'ler, DATA_SOURCES, AI stratejisi
```

## Ön koşullar

| Araç | Sürüm | Şu an |
|---|---|---|
| Node.js | ≥ 20 (24 önerilir) | ✅ kurulu |
| pnpm | ≥ 9 (corepack ile) | `corepack enable` |
| Python | ≥ 3.12 | ⏳ kurulması gerekiyor |
| uv | en güncel | ⏳ ([astral.sh/uv](https://docs.astral.sh/uv/)) |
| Docker + Compose | en güncel | ⏳ infra için |

## Hızlı başlangıç

```bash
# 1) Web arayüzü (şu an çalışır — mock veriyle premium kabuk + grafik)
corepack enable
pnpm install
pnpm --filter @heimdall/web dev      # http://localhost:3000

# 2) Altyapı (Docker kurulduktan sonra)
cp .env.example .env
docker compose -f infra/docker-compose.yml up -d

# 3) API + pipeline (Python + uv kurulduktan sonra)
uv sync
uv run --package heimdall-api  uvicorn heimdall_api.main:app --reload   # :8000
uv run --package heimdall-pipelines  dagster dev                        # :3001
```

> Ayrıntılı kurulum ve "neyin ne zaman çalıştığı": [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#geliştirme-ortamı).

## Yol haritası

18 fazlık plan: [docs/ROADMAP.md](docs/ROADMAP.md). Sıradaki: **Faz 2 — Piyasa Verisi İngest**.

## Lisans

Proprietary — tüm hakları saklıdır. Bkz. [LICENSE](LICENSE).
