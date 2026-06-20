# CLAUDE.md — Heimdall

Bu dosya, bu repoda çalışan Claude (ve insan katkıcılar) için kalıcı bağlamdır.

## Proje özeti
Heimdall, Borsa İstanbul için çok-kaynaklı **tahmin + sinyal + araştırma + strateji**
platformu. Polyglot monorepo (Python + TypeScript), premium web UI. Şu an **Faz 1**
(temel & mimari / walking skeleton). Tam plan: [docs/ROADMAP.md](docs/ROADMAP.md).

## Mutlak ilkeler (ihlal etme)
1. **Point-in-time doğruluk.** Geçmişe gelecekten bilgi sızdırma. Her veri `event_time`
   + `knowledge_time`/`as_of` taşır; backtest/eğitim yalnız `knowledge_time ≤ t` görür.
2. **Contracts-first.** Tek kaynak `packages/contracts-py` (Pydantic). TS tipleri türetilir.
3. **Multi-tenant seam.** Domain tablolarında `tenant_id`; sorgular kapsamlı.
4. **Gözlemlenebilirlik.** Yeni servis → OTel trace/metrik/log bağlı gelir.
5. **UI kalite çıtası.** Premium design-system kabuğu dışında UI yok; ucuz efekt yok.
6. **AI guardrail'leri.** LLM asla otonom işlem yapmaz; çıktı topraklı + şemaya bağlı.
   Bkz. [docs/adr/0006-ai-integration-strategy.md](docs/adr/0006-ai-integration-strategy.md).

## Yığın ve komutlar
- **TS:** pnpm workspaces (corepack). `pnpm --filter @heimdall/web dev`
- **Python:** uv workspace. `uv run --package heimdall-api uvicorn heimdall_api.main:app --reload`
- **Pipeline:** `uv run --package heimdall-pipelines dagster dev`
- **Infra:** `docker compose -f infra/docker-compose.yml up -d`
- moon (opsiyonel): `.moon/` yapılandırılmış; kurulduğunda `moon run :dev`.

## Çalışma ortamı (durum: 2026-06-20)
Kurulu: **Node 24, git, Python 3.12.10, uv 0.11.21.** Kurulu değil: **Docker** (WSL2 +
yeniden başlatma gerekir — kullanıcı kuracak). `corepack enable` ve global `pnpm` shim'i
admin gerektirdi → `corepack pnpm ...` formu kullanılıyor.

> **Her yeni oturumda araç zincirini yeniden doğrula** (`python --version`, `uv --version`,
> `docker info`) — varsayma. PATH değişiklikleri terminal yeniden başlayınca yansır.

### Komut ipuçları (Windows)
- **Workspace üyelerini kurmak için daima** `uv sync --all-packages` (düz `uv sync` kökte
  üyeleri kurmaz, sadece dev grubunu kurar).
- **Kontrol/test çalıştırırken venv binary'lerini doğrudan çağır:**
  `.venv\Scripts\python.exe`, `.venv\Scripts\ruff.exe`, `.venv\Scripts\pytest.exe`.
  Sebep: `uv run ...` ortamı kök projeye göre yeniden sync'ler ve workspace üyelerini
  (heimdall-api/pipelines) geçici olarak kaldırabilir.
- `python` hâlâ MS Store stub'ına çözülüyorsa: `py -3.12` kullan ya da Ayarlar → Uygulama
  yürütme diğer adları → python.exe/python3.exe'yi kapat.

### Tuzaklar (öğrenildi)
- **Dagster asset modüllerinde `from __future__ import annotations` KULLANMA** — Dagster
  `context` tipini runtime'da inceler, stringleşmiş anotasyon kontrolü bozar
  (`DagsterInvalidDefinitionError`). Bkz. `pipelines/.../assets/market_data.py`.
- ruff Türkçe için `RUF001-003` kapalı; FastAPI için `B008` muaf (kök `pyproject.toml`).

### Doğrulanmış durum (Faz 1)
- ✅ Web: `next build` + tip kontrolü geçti. ✅ Python: ruff temiz, pytest 4/4, API +
  Dagster pipeline + kontratlar import oluyor.
- ⏳ DB'ye bağlı uçtan uca akış (pipeline→Timescale→API→web) **Docker kurulunca** doğrulanacak.
- Python/Docker gerektiren bir şeyi koşturmadan "doğrulandı" deme — koşturulamıyorsa söyle.

## Karar verirken
- Büyük/geri-alması pahalı karar → `docs/adr/` altına yeni ADR.
- Yeni veri kaynağı → önce `docs/DATA_SOURCES.md`'e ToS/rate-limit kaydı; resmî API tercih.
- Commit mesajları: conventional commits (`feat:`, `fix:`, `docs:`, `chore:`…).
