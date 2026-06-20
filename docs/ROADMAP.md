# Heimdall — Yol Haritası

Yüksek granülerlikte, fazlara bölünmüş plan. Her faz tek bir alanı kusursuzlaştırır;
bir sonrakine sağlam bir zemin bırakır. Arayüz (UI) yalnızca bir faz değildir — **her
fazda artımlı** gelişir ("platform baştan sona arayüz üzerinde ilerler").

İlkeler her fazda geçerlidir: **point-in-time doğruluk**, **contracts-first**,
**gözlemlenebilirlik**, **leakage-safe** veri akışı. Bkz. [ARCHITECTURE.md](ARCHITECTURE.md).

| # | Faz | Ana çıktı | Durum |
|---|-----|-----------|:---:|
| **1** | **Temel & Mimari** | Monorepo, yığın, veri kontratları, infra iskeleti, walking skeleton | 🚧 |
| 2 | Piyasa Verisi İngest | Sağlam BIST OHLCV/intraday, kurumsal aksiyonlar, çok-kaynak mutabakatı, backfill | ⬜ |
| 3 | Temel Analiz | KAP/EVDS finansalları, oranlar, makro, temel özellik seti | ⬜ |
| 4 | Olay & İfşa Motoru | KAP → yapısal olaylar, insider işlemler, olay taksonomisi & tetikleyiciler | ⬜ |
| 5 | Haber + Türkçe NLP | Haber ingest, dedup, sentiment, varlık bağlama, vektör arama | ⬜ |
| 6 | Sosyal & Algı | X / Reddit / Telegram / Ekşi / YouTube / Trends, bot tespiti | ⬜ |
| 7 | Güven & İtibar Skorları | Kaynak/yazar kredibilitesi, sinyal ağırlıklandırma | ⬜ |
| 8 | Feature Store & Mühendisliği | Feast, sızıntısız özellik üretimi, point-in-time join'ler | ⬜ |
| 9 | Tahmin: Baseline Modeller | GBDT + purged/embargoed CV, MLflow, metrik çerçevesi | ⬜ |
| 10 | Derin Öğrenme & Zaman Serisi | PatchTST/TFT/NHITS, olasılıksal, **çok-modlu füzyon** (fiyat+metin+olay) | ⬜ |
| 11 | Korelasyon & Rejim | Çapraz-varlık, rejim tespiti, lead-lag/nedensellik, graf modeller | ⬜ |
| 12 | Strateji & Sinyal Motoru | Çok-ufuk sinyaller, portföy kurma, risk yönetimi | ⬜ |
| 13 | Backtesting & Değerlendirme | vectorbt + NautilusTrader, walk-forward, işlem maliyeti, overfit kontrolü | ⬜ |
| 14 | Inference & Serving | Gerçek-zamanlı tahmin/sinyal servisi, uyarılar | ⬜ |
| 15 | Arayüz Platformu | Tam Apple-tarzı dashboard, araştırma çalışma alanı | ⬜ |
| 16 | Açıklanabilirlik & Araştırma | SHAP/attention görselleştirme, hipotez testi UI | ⬜ |
| 17 | Çok-kullanıcı & Üretim | Auth, Postgres RLS, K8s, IaC, güvenlik sertleştirme | ⬜ |
| 18 | *(opsiyonel)* Otomatik İşlem | Aracı entegrasyonu (Algolab/İş), OMS, risk limitleri, paper→canlı | ⬜ |

---

## Faz 1 — Temel & Mimari (bu faz)

**Amaç:** Tek bir BIST hissesini (THYAO.IS) tüm katmanlardan uçtan uca geçiren,
kusursuz kurulmuş bir "walking skeleton" + üzerine her fazın eklenebileceği iskele.

### Teslimatlar ve durum

- [x] Monorepo iskeleti (pnpm workspaces + Python uv workspace; moon opsiyonel)
- [x] Repo hijyeni: `.gitignore`, `.gitattributes`, `.editorconfig`, `.env.example`, LICENSE
- [x] Dokümanlar: README, ROADMAP, ARCHITECTURE, ADR'ler, DATA_SOURCES, AI stratejisi
- [x] Çekirdek veri kontratları: `contracts-py` (Pydantic, kanonik) + `contracts-ts` (zod/TS)
- [x] `apps/web`: premium design-system kabuğu + TradingView Lightweight Chart (mock veri)
- [x] `services/api`: FastAPI (health / instruments / ohlcv) iskeleti
- [x] `pipelines`: Dagster — yfinance → THYAO.IS günlük OHLCV asset'i
- [x] `infra/docker-compose.yml`: Postgres+Timescale+pgvector, Redis, MinIO, MLflow, Grafana stack, OTel collector
- [x] CI: GitHub Actions (TS lint/build + Python lint/type-check)
- [ ] **Doğrulama (kullanıcı makinesinde):** Python 3.12 + uv + Docker kurulup uçtan uca akışın canlı koşturulması

### "Tamam" tanımı (Definition of Done)

`docker compose up` → `dagster dev` ile THYAO.IS günlük verisi Timescale'e yazılır →
`GET /instruments/THYAO/ohlcv` veriyi döner → web arayüzü mum grafiğini premium
kabukta render eder. Tüm servisler OTel izlerini Grafana'ya akıtır.
