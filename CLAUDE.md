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

## Çalışma ortamı notu (önemli)
Geliştirme makinesinde şu an **Node + git var; Python/Docker/uv/pnpm henüz yok**.
- Web (`apps/web`) ve `contracts-ts` Node ile çalışır/doğrulanabilir.
- `services/api`, `pipelines`, `infra` dosya olarak hazırdır; runtime kurulunca koşar.
- Python/Docker gerektiren bir şeyi "doğrulandı" diye işaretleme — koşturulamıyorsa söyle.

## Karar verirken
- Büyük/geri-alması pahalı karar → `docs/adr/` altına yeni ADR.
- Yeni veri kaynağı → önce `docs/DATA_SOURCES.md`'e ToS/rate-limit kaydı; resmî API tercih.
- Commit mesajları: conventional commits (`feat:`, `fix:`, `docs:`, `chore:`…).
