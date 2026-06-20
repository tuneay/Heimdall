# ml — Model geliştirme alanı

Faz 9+ burada canlanır. Şimdilik yer tutucu.

- **Faz 9** — Baseline modeller (LightGBM/XGBoost), purged/embargoed time-series CV,
  metrik çerçevesi, MLflow ile deney takibi.
- **Faz 10** — Derin öğrenme & zaman-serisi (PatchTST/TFT/NHITS), foundation modeller
  (Chronos/TimesFM), çok-modlu füzyon (fiyat + metin + olay).
- **Faz 11** — Korelasyon, rejim tespiti, lead-lag/nedensellik, graf modelleri.

Deney takibi/registry: MLflow (`infra/docker-compose.yml`). Özellikler: Feature Store
(Feast, Faz 8). Eğitim verisi point-in-time doğru olmalı (lookahead-bias yok).
