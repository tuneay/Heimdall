# Heimdall — Mimari

Bu belge sistemin **neden** böyle kurulduğunu anlatır. Tekil teknoloji kararları için
[adr/](adr/) klasörüne bakın. Yol haritası: [ROADMAP.md](ROADMAP.md).

---

## 1. Yön veren ilkeler

Bunlar sonradan değiştirilmesi pahalı olan, baştan doğru kurulan prensiplerdir.

### 1.1 Point-in-time doğruluk (lookahead-bias yasağı)
Finansal ML'in 1 numaralı ölüm sebebi gelecekten geçmişe bilgi sızmasıdır. Her veri
noktası iki zaman taşır: **olay zamanı** (`event_time`) ve **bilgi zamanı**
(`knowledge_time` / `as_of` — biz o veriyi ne zaman öğrendik). Backtest ve eğitim
*yalnızca* `knowledge_time ≤ t` olan veriyi görür. Finansal tablolar yayınlanma
tarihiyle, haberler yayımlanma anıyla damgalanır. Bu, veri modeline gömülüdür.

### 1.2 Contracts-first
Tek doğruluk kaynağı `packages/contracts-py` (Pydantic v2). API'nin ürettiği OpenAPI
şemasından TypeScript tipleri türetilir; `packages/contracts-ts` bunu frontend'e taşır.
Python ile web arasında tip uçurumu olmaz. Bkz. [ADR-0005](adr/0005-contracts-first.md).

### 1.3 Modüler monolit → servisler
Başlangıçta az sayıda deploy edilebilir birim (operasyon sadeliği), ama **servis
sınırları net**. Bir parça darboğaz olunca ayrı servise — gerekirse Rust'a — çıkarılır.
Bkz. [ADR-0002](adr/0002-tech-stack.md).

### 1.4 Multi-tenant seam baştan
Her domain tablosunda `tenant_id`; her sorgu kapsamlı. Şimdi tek kullanıcı; ileride
Postgres Row-Level Security ile SaaS'a açmak şema göçü gerektirmez.

### 1.5 Gözlemlenebilirlik 1. günden
OpenTelemetry her serviste (trace + metrik + log). "Neden bu tahmin?" ve "veri neden
geç geldi?" sorularının izi en baştan tutulur. Grafana + Prometheus + Loki + Tempo.

### 1.6 UI kalite çıtası 1. günden
Walking skeleton bile premium design-system kabuğunda render edilir. Apple-tarzı
tipografi, smooth motion, ucuz efekt yok. "Sonra güzelleştiririz" yaklaşımı yok.

---

## 2. Katmanlar

```
┌──────────────────────────────────────────────────────────────┐
│  ORKESTRASYON: Dagster (asset/lineage)                        │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ 1 Veri Kaynakları   BIST·KAP·TCMB·Haber·Sosyal           │ │
│ │ 2 İngest            konnektör·backfill·mutabakat·kalite   │ │
│ │ 3 Depolama          Postgres+Timescale·pgvector·MinIO·DuckDB │
│ │ 4 Özellik & NLP     indikatör·BERTurk·embedding·olay      │ │
│ │ 5 Tahmin Motoru     GBDT·DL·foundation-TS·korelasyon      │ │
│ │ 6 Strateji·Sinyal·Backtest   vectorbt·Nautilus·çok-ufuk   │ │
│ │ 7 API               FastAPI·OpenAPI→TS·WS/SSE·auth-seam   │ │
│ │ 8 Premium Web UI    Next.js·TradingView·Motion·Lenis      │ │
│ └──────────────────────────────────────────────────────────┘ │
│  GÖZLEMLENEBİLİRLİK: OTel→Grafana   ·   MLOps: MLflow/Feast    │
└──────────────────────────────────────────────────────────────┘
```

| # | Katman | Sorumluluk | Anahtar teknolojiler |
|---|--------|------------|----------------------|
| 1 | Veri Kaynakları | Ham sinyal: fiyat, finansal, ifşa, haber, sosyal | yfinance, KAP, TCMB-EVDS, GDELT, PRAW, Telethon |
| 2 | İngest | Konnektör, backfill, çok-kaynak mutabakatı, veri kalitesi | Dagster, httpx, Pandera |
| 3 | Depolama | Zaman-serisi + ilişkisel + vektör + nesne + OLAP | Postgres/Timescale, pgvector, MinIO, DuckDB |
| 4 | Özellik & NLP | İndikatörler, Türkçe sentiment, embedding, olay çıkarımı | pandas/polars, BERTurk, sentence-transformers, Claude API |
| 5 | Tahmin Motoru | Tablo + derin öğrenme + foundation TS + korelasyon | LightGBM, PyTorch, Nixtla/Darts, Chronos |
| 6 | Strateji/Backtest | Sinyal üretimi, portföy, risk, walk-forward | vectorbt, NautilusTrader |
| 7 | API | Tip-güvenli servis, realtime, auth seam | FastAPI, Pydantic v2, WebSocket/SSE |
| 8 | Web UI | Premium dashboard, grafik, araştırma | Next.js, Tailwind, Motion, TradingView |

Cross-cutting: **Orkestrasyon** (Dagster), **Gözlemlenebilirlik** (OTel/Grafana),
**MLOps** (MLflow/Feast), **Güven & İtibar skorlama** (sinyal ağırlıklandırma).

---

## 3. Veri akışı (Faz 1 walking skeleton)

```
Dagster asset (yfinance, THYAO.IS, günlük)
   └─→ Pandera ile doğrula → OHLCVBar kontratı
        └─→ Postgres/Timescale (ohlcv_bar hypertable, as_of damgalı)
             └─→ FastAPI  GET /instruments/{symbol}/ohlcv
                  └─→ Next.js  TradingView Lightweight Chart (premium kabuk)
```

---

## 4. Depolama modeli (özet)

- **Postgres + TimescaleDB**: ilişkisel (instrument, exchange, source, tenant/user) +
  zaman-serisi hypertable (`ohlcv_bar`, ileride ticks/features). Tek sistem = sade ops.
- **pgvector**: haber/ifşa embedding'leri, semantik arama.
- **MinIO** (S3): ham veri gölü (parquet), model artefaktları, doküman blob'ları.
- **DuckDB**: parquet üzerinde gömülü OLAP — araştırma/backtest sorguları.
- **Redis**: cache, rate-limit, hafif kuyruk. *(Hacim artınca → Redpanda/NATS olay omurgası.)*

Migration'lar Alembic ile (`services/api`). Şema versiyonlu ve point-in-time alanlı.

---

## 5. Geliştirme ortamı

Monorepo iki araç zinciri barındırır; her biri bağımsız çalışır.

| Yığın | Yönetim | Çalıştırma |
|-------|---------|-----------|
| TypeScript (`apps/*`, `packages/*-ts`) | pnpm workspaces (corepack) | `pnpm --filter @heimdall/web dev` |
| Python (`services/*`, `pipelines`, `packages/*-py`, `ml`) | uv workspace | `uv run ...` |
| Altyapı | docker-compose | `docker compose -f infra/docker-compose.yml up -d` |

> **moon** (polyglot orkestratör) opsiyonel olarak `.moon/` altında yapılandırılmıştır;
> kurulduğunda `moon run :dev` tüm yığını tek komutta sürer. Kurulu değilken pnpm/uv
> komutları doğrudan kullanılır. Bkz. [ADR-0003](adr/0003-monorepo-and-tooling.md).

### Neyin ne zaman çalıştığı (Faz 1)

| Bileşen | Gereken | Faz 1'de |
|---------|---------|----------|
| `apps/web` | Node 20+ | ✅ mock veriyle çalışır |
| `packages/contracts-ts` | Node | ✅ |
| `services/api`, `pipelines` | Python 3.12 + uv | ⏳ dosya hazır, runtime kurulunca koşar |
| `infra` (DB, MLflow, Grafana…) | Docker | ⏳ dosya hazır, Docker kurulunca koşar |

---

## 6. Güvenlik & uyumluluk

- Sırlar `.env`'de (commit edilmez); ileride SOPS+age → Vault.
- Veri kaynağı ToS/rate-limit kayıtları: [DATA_SOURCES.md](DATA_SOURCES.md). Scraping
  yerine resmî API tercih edilir; rate-limit ve robots.txt'e uyulur.
- Gerçek-zamanlı BIST verisi ileride ücretli vendor/aracı feed gerektirir; Faz 1
  ücretsiz/gecikmeli kaynaklarla yürür.

---

## 7. AI entegrasyonu

LLM/agent katmanı sisteme baştan tasarımla örülüdür (NLP çıkarımı, araştırma copilot'u,
açıklanabilirlik). Ayrı belge: [ai-strategy.md](ai-strategy.md),
[ADR-0006](adr/0006-ai-integration-strategy.md).
