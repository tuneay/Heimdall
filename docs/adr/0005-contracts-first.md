# ADR-0005: Contracts-first (şema öncelikli) veri sözleşmeleri

- **Durum:** Kabul edildi
- **Tarih:** 2026-06-20

## Bağlam
Python (veri/ML/API) ile TypeScript (web) arasında veri tipleri sürekli tutarsızlaşır.
Manuel senkron hatalı ve kırılgan.

## Karar
**Tek doğruluk kaynağı `packages/contracts-py` (Pydantic v2).** Akış:
```
Pydantic modelleri → FastAPI OpenAPI şeması → openapi-typescript → contracts-ts
```
- Veri/ML/API tarafı doğrudan Pydantic kullanır.
- Web tarafı türetilmiş TS tiplerini + zod doğrulayıcılarını kullanır.
- Faz 1'de Python runtime yokken `contracts-ts` elle yazılır ama *aynı şekli* yansıtır;
  API ayağa kalkınca üretim otomatikleşir (CI'da drift kontrolü eklenecek).

Tüm modellerde **point-in-time** alanları (`event_time`, `knowledge_time`/`as_of`)
birinci sınıf vatandaştır.

## Sonuçlar
- (+) Tip uçurumu kapanır; kırılma derleme zamanında yakalanır.
- (+) Şema değişimi tek yerden yayılır.
- (−) Codegen adımı CI'a eklenmeli; aksi halde elle-yazılan TS drift edebilir
  (geçici Faz 1 durumu, bilinçli kabul).
