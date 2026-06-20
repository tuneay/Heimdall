# Heimdall — AI Entegrasyon Stratejisi

> "İleride AI'lar entegre olacak değil mi?" — Evet. Ama Heimdall'da iki ayrı "AI"
> kavramını net ayırmak gerekir. Bu belge ikisini ve nasıl örüleceklerini anlatır.

## İki tür "AI"

1. **Tahmin zekâsı (ML/DL çekirdeği)** — Asıl tahmin motoru. GBDT, derin öğrenme,
   zaman-serisi foundation modelleri, korelasyon/rejim. Bu "akıllı" kısım sayısaldır
   ve fiyat hareketini tahmin eder. (Katman 5; Faz 9–11.)

2. **Dil/agent zekâsı (LLM katmanı)** — Doğal dili anlayan, metinden yapı çıkaran,
   araştırma yapan, açıklayan kısım. Aşağıdaki rolleri üstlenir. Heimdall'a **baştan
   tasarımla** örülür; tek tek fazlarda canlanır.

---

## LLM katmanının rolleri

### A. Anlama & çıkarım (Faz 4–6) — *en kritik*
Türkçe haber, KAP ifşası, forum ve sosyal metinden **yapısal sinyal** çıkarmak:
- Olay çıkarımı: "X şirketi Y'yi satın aldı", "CEO istifa etti", "temettü kesildi" →
  yapısal olay + etki yönü + ilgili ticker(lar).
- Varlık & ilişki çıkarımı: kim, kimi, ne kadar, ne zaman.
- Nüanslı sentiment: alaycılık, koşullu ifade, Türkçe deyim — klasik sözlük yetmez.
- Özetleme: uzun ifşa/bilanço metnini özellik vektörüne indirgeme.

> Burada **Claude API** (Opus/Sonnet) Türkçe'de güçlü ve **yapısal çıktı** (JSON şema)
> verdiği için birincil. Toplu/ucuz işler için yerel modeller (Qwen/Llama) ikincil yol.

### B. Araştırma copilot'u (Faz 15–16)
Platform içi doğal dil arayüzü:
- "Son 3 ayda KAP'ta insider alımı artan ve sosyal sentiment'i pozitif bankaları göster."
- Doğal dil → platform sorgusu (tool-use ile API/DuckDB üzerinde, **uydurmadan**).
- Hipotez üretimi ve eleştirisi: "Bu strateji neden overfit olabilir?"

### C. Açıklanabilirlik anlatısı (Faz 16)
SHAP/attention çıktısını insan diline çeviren katman: "Bu yükseliş tahmininin %40'ı
artan insider alımı + pozitif haber akışından geliyor." Sayısal XAI → okunur gerekçe.

### D. Otonom araştırma agent'ları (Faz 16+) — *ileri*
Çok-agent kurgu (insan gözetiminde):
- **Veri İzcisi**: yeni kaynak/kanal keşfeder, kalite değerlendirir.
- **Analist**: anomali/olay tespit edip rapor üretir.
- **Strateji Eleştirmeni**: önerilen stratejiyi sağlamlık/sızıntı açısından sınar.

---

## Mimari yerleşim

```
Metin kaynakları ─→ [LLM Çıkarım Servisi] ─→ yapısal olay/sentiment ─→ Feature Store
                          │ (Claude API + yerel modeller, embedding)
Kullanıcı (NL) ──────────→ [Research Copilot] ──tool-use──→ API / DuckDB / pgvector
Model çıktısı ───────────→ [XAI Anlatıcı] ─→ okunur gerekçe ─→ Web UI
```

- Ayrı, izole bir **`services/ai`** (veya `services/nlp`) olarak; rate-limit, cache,
  maliyet izleme ve **prompt/yanıt loglama** (gözlemlenebilirlik) ile.
- Tüm LLM çağrıları **şemaya bağlı** (Pydantic/JSON Schema) — serbest metin değil,
  doğrulanabilir yapı döner.

## Sağlamlık ilkeleri (guardrail'ler)

1. **Asla otonom işlem yok.** LLM/agent emir gönderemez; en fazla sinyal/öneri üretir,
   kararı insan verir (Faz 18 dahil — emir insan onayından geçer).
2. **Topraklama (grounding).** Copilot yanıtları gerçek veriye dayanır ve kaynağı
   gösterir; "uydurma" rakam üretemez (retrieval + tool-use zorunlu).
3. **Şema zorlaması.** Çıkarım çıktısı doğrulanır; doğrulanamayan düşülür/işaretlenir.
4. **Point-in-time uyumu.** LLM çıkarımları da `knowledge_time` damgalanır — geçmiş
   backtest'e gelecekteki bir model yorumu sızmaz.
5. **Maliyet & gizlilik.** Toplu işler yerel modele; hassas işler denetlenir; her
   çağrı maliyeti ve gecikmesi izlenir.

## Model seçimi

| İhtiyaç | Birincil | İkincil |
|---------|----------|---------|
| Türkçe çıkarım / reasoning / yapısal çıktı | Claude Opus/Sonnet (`claude-opus-4-8` / `claude-sonnet-4-6`) | Qwen2.5, Llama (yerel) |
| Toplu sentiment (yüksek hacim) | BERTurk / fine-tune | Claude Haiku |
| Embedding / semantik arama | BGE-M3 / multilingual-e5 | sentence-transformers |

## Faz 1'deki yeri

Faz 1'de LLM **kodu yok**; ama:
- `.env.example` içinde `ANTHROPIC_API_KEY` ayrılmıştır.
- Kontratlar, ileride `Event`, `SentimentScore`, `ExtractedEntity` gibi LLM çıktısı
  tiplerini taşıyacak şekilde genişlemeye hazır tasarlanır.
- `services/ai` için yer ayrılmıştır (Faz 4'te doldurulur).

İlgili karar kaydı: [adr/0006-ai-integration-strategy.md](adr/0006-ai-integration-strategy.md).
