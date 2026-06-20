# ADR-0006: AI/LLM entegrasyon stratejisi

- **Durum:** Kabul edildi
- **Tarih:** 2026-06-20

## Bağlam
İki ayrı "AI" var: (1) sayısal **tahmin zekâsı** (ML/DL çekirdeği) ve (2) **dil/agent
zekâsı** (LLM katmanı). İkisi karıştırılırsa hem mimari hem güvenlik bulanıklaşır.
Ayrıntılı strateji: [../ai-strategy.md](../ai-strategy.md).

## Karar
LLM katmanı baştan tasarıma örülür, izole **`services/ai`** olarak canlandırılır (Faz 4+):
- **Roller:** metinden yapısal çıkarım (olay/varlık/sentiment), araştırma copilot'u
  (NL→tool-use), açıklanabilirlik anlatısı, ileride otonom araştırma agent'ları.
- **Birincil model:** Claude (Opus/Sonnet) — Türkçe + yapısal çıktı. Toplu/ucuz işler
  yerel modeller (Qwen/Llama) ve BERTurk.
- **Guardrail'ler (değişmez):**
  1. Asla otonom işlem yok — karar insanda.
  2. Topraklama zorunlu — yanıtlar gerçek veriye dayanır, kaynak gösterir.
  3. Şema zorlaması — LLM çıktısı doğrulanabilir yapı döner.
  4. Point-in-time — LLM çıkarımları da `knowledge_time` damgalanır.
  5. Maliyet/gizlilik izlenir; her çağrı gözlemlenebilir.

## Sonuçlar
- (+) "Tahmin zekâsı" ile "dil zekâsı" net ayrılır; güvenlik sınırları belirgin.
- (+) Kontratlar LLM çıktı tiplerine baştan hazır.
- (−) Maliyet ve gecikme yönetimi gerektirir; izleme şart.
- (−) Halüsinasyon riski → grounding + şema zorlamasıyla sınırlanır, sıfırlanmaz.
