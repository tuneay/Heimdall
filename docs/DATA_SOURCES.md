# Heimdall — Veri Kaynakları Defteri

Her kaynağın **ne verdiği**, **nasıl erişildiği**, **maliyeti** ve **yasal/ToS notu**.
Yeni kaynak eklerken bu tabloyu güncelle. İlke: **resmî API > scraping**; rate-limit ve
robots.txt'e uyulur; ToS şüpheliyse kullanılmaz.

> Lejant — Erişim: 🟢 resmî API · 🟡 scrape/RSS · 🔵 ticari vendor · ⚪ topluluk wrapper

## Piyasa verisi (fiyat)

| Kaynak | Verir | Erişim | Maliyet | Faz | Not |
|--------|-------|:---:|---|:---:|-----|
| yfinance (`.IS`) | EOD/geçmiş OHLCV | ⚪ | Ücretsiz | 1–2 | Gecikmeli; rate-limit; resmî değil |
| İş Yatırım | Geçmiş + finansal | 🟡 | Ücretsiz | 2–3 | ToS'a dikkat |
| TradingView (tvdatafeed) | Geniş kapsam | ⚪ | Ücretsiz | 2 | Resmî olmayan API |
| Matriks / Foreks | Gerçek-zamanlı BIST | 🔵 | **Ücretli** | 14+ | Profesyonel feed |
| Algolab (Deniz Yatırım) | Gerçek-zamanlı + emir | 🟢/⚪ | Hesap | 14/18 | Aracı API; otomatik işlem |

## Temel analiz & makro

| Kaynak | Verir | Erişim | Maliyet | Faz | Not |
|--------|-------|:---:|---|:---:|-----|
| **KAP** (kap.org.tr) | İfşalar, finansallar, **insider işlem**, maddi olaylar | 🟡/🟢 | Ücretsiz | 3–4 | Türkiye'nin EDGAR'ı — kritik |
| **TCMB EVDS** | Faiz, kur, enflasyon (makro) | 🟢 | Ücretsiz (anahtar) | 3 | `evds2.tcmb.gov.tr` |
| Fintables / Finnet | Ayrıştırılmış tablolar, oranlar | 🔵 | Ücretli | 3 | Hızlandırıcı |
| Resmî Gazete | Regülatif/hukuki olay | 🟡 | Ücretsiz | 4 | |

## Haber

| Kaynak | Verir | Erişim | Maliyet | Faz | Not |
|--------|-------|:---:|---|:---:|-----|
| GDELT | Küresel haber/olay veritabanı | 🟢 | Ücretsiz | 5 | Olay tetikleyici |
| BloombergHT, Foreks, Dünya, Investing TR | Türkçe finans haberi | 🟡 | Ücretsiz | 5 | RSS + scrape |
| Finnhub / Marketaux | Haber + sentiment | 🟢 | Freemium | 5 | API kotası |

## Sosyal & algı

| Kaynak | Verir | Erişim | Maliyet | Faz | Not |
|--------|-------|:---:|---|:---:|-----|
| X / Twitter | Türkçe fintwit | 🟢 | **Ücretli/kısıtlı** | 6 | Resmî API tier; ToS |
| Reddit (PRAW) | r/borsa, r/stocks | 🟢 | Ücretsiz | 6 | API kuralları |
| Telegram (Telethon) | Trading kanalları | 🟢 | Ücretsiz | 6 | Yalnız public; ToS |
| Ekşi Sözlük | Türkçe algı | 🟡 | Ücretsiz | 6 | ToS hassas |
| YouTube | Finans kanalı transkript | 🟢 | Freemium | 6 | Data API kotası |
| Google Trends (pytrends) | Arama ilgisi | ⚪ | Ücretsiz | 6 | Resmî olmayan |

## Hızlandırıcı / referans projeler

| Proje | Kullanım |
|-------|----------|
| [OpenBB Platform](https://github.com/OpenBB-finance/OpenBB) | Veri agregasyon katmanı — referans + kısmi entegrasyon |
| [Microsoft Qlib](https://github.com/microsoft/qlib) | AI-kantitatif pipeline — referans mimari |
| [awesome-quant](https://github.com/wilsonfreitas/awesome-quant) | Kütüphane keşfi |

---

**Maliyet gerçeği:** Ücretsiz katman → gün-sonu/gecikmeli + scrape (araştırma/backtest
için yeterli). Gerçek-zamanlı BIST → ücretli vendor veya aracı feed (Faz 14+).

**Uyumluluk:** Bu defterdeki her satır, kullanılmadan önce güncel ToS açısından
gözden geçirilir. Şüpheli/yasak kaynak Heimdall'a girmez.
