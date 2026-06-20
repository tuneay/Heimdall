# ADR-0001: Mimari kararları kayıt altına al

- **Durum:** Kabul edildi
- **Tarih:** 2026-06-20

## Bağlam
Heimdall uzun soluklu, çok fazlı bir sistem. Kararların *neden* alındığı zamanla
unutulur; "şu teknoloji neden seçildi?" sorusu tekrar tekrar tartışılır.

## Karar
Önemli, geri alması pahalı kararları hafif **ADR** (Architecture Decision Record)
dosyalarıyla kayıt altına alırız. Her ADR: bağlam → karar → sonuçlar. Numaralı,
değişmez (yeni karar eskisini "supersede" eder, silmez).

## Sonuçlar
- (+) Kurumsal hafıza; yeni katılan (insan veya AI) hızla bağlam kazanır.
- (+) Tartışmalar bir kez yapılır, kayda geçer.
- (−) Küçük disiplin maliyeti — her büyük kararda bir dosya.
