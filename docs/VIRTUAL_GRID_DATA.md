# Sanal Şebeke Verisi Rehberi

Bu proje fiziksel donanım olmadan gerçek uygulama hissi vermek için “sanal ama resmi veri kaynaklarına hazır” bir yol izler.

## Neden sanal başlıyoruz?

Fiziksel ölçüm ilk aşamada maliyet, güvenlik, kalibrasyon ve saha erişimi ister. Portfolyo projesi için önce yazılım kanıtını tamamlamak daha doğru yoldur:

- Simülasyon motoru deterministik çalışır.
- Testler internete veya API anahtarına bağlı kalmaz.
- UI, API ve dokümantasyon gerçek veri sözleşmesine göre tasarlanır.
- Donanım geldiğinde sadece veri adaptörü değiştirilir, ürün hikayesi değişmez.

## Sağlayıcı modeli

`/api/grid-signal` endpoint'i şu sağlayıcıları kabul eder:

- `demo`: Anahtarsız, deterministik 24 saatlik Türkiye şebeke sinyali.
- `epias`: EPİAŞ Şeffaflık Platformu için resmi Türkiye veri uyum katmanı.
- `entsoe`: ENTSO-E Transparency Platform için Avrupa veri uyum katmanı.
- `electricity-maps`: Karbon yoğunluğu, elektrik karışımı, yük ve fiyat sinyali uyum katmanı.
- `ember`: Aylık/yıllık ülke bazlı talep, üretim, emisyon ve karbon yoğunluğu uyum katmanı.

Canlı kimlik bilgileri yoksa `epias`, `entsoe`, `electricity-maps` ve `ember` seçenekleri aynı şema ile sanal yedek veri döndürür. Bu bilinçli bir tasarımdır: demo her zaman çalışır, entegrasyon yolu açık kalır.

## API örneği

```text
GET /api/grid-signal?provider=epias&date=2026-05-06
```

Özet çıktı alanları:

- `provider`: Seçilen sağlayıcı.
- `status`: `demo`, `live` veya `fallback`.
- `points`: 24 saatlik yük, fiyat, yenilenebilir pay, karbon yoğunluğu ve risk sinyali.
- `summary`: Pik yük, pik saat, ortalama fiyat, ortalama karbon yoğunluğu ve dağıtım önerisi.
- `integrationNotes`: Canlı entegrasyona geçiş notları.

## Resmi/kurumsal kaynaklar

- EPİAŞ Şeffaflık Platformu teknik dokümantasyonu, Türkiye elektrik verileri için REST servislerini ve servis başlıklarını listeler: https://seffaflik-prp.epias.com.tr/electricity-service/technical/tr/index.html
- ENTSO-E Transparency Platform, Avrupa elektrik piyasası ve sistem şeffaflık verileri için merkezi platformdur: https://transparency.entsoe.eu/
- Electricity Maps API; karbon yoğunluğu, elektrik karışımı, yenilenebilir pay, yük ve fiyat sinyallerini kapsayan ticari/opsiyonel API sunar: https://portal.electricitymaps.com/docs/api
- Ember API; açık elektrik verileri, talep, üretim, emisyon ve karbon yoğunluğu veri setleri için kullanılabilir: https://ember-energy.org/data/api/

## Sınırlamalar

Bu veriler bina sayacı seviyesi ölçüm değildir. Ulusal, bölgesel veya piyasa seviyesi sinyal sağlar. FlexGrid-TR bu sinyali bina/tesis simülasyonuna bağlayarak şu soruya cevap verir:

“Bugün donanım yokken hangi saatler riskli, hangi kontrol stratejisi daha güvenli, hangi senaryo ileride ölçümle doğrulanmaya değer?”

## Donanıma geçiş yolu

1. Sanal demo sinyaliyle UI, API ve testleri tamamla.
2. EPİAŞ/ENTSO-E/Electricity Maps/Ember adaptörlerinden birini canlı veriyle doldur.
3. Smart-plug veya ESP32 ölçümünü `/api/telemetry` sözleşmesine bağla.
4. Ölçülen ve simüle edilen farkları MAE, pik hata, enerji farkı ve güven skoru ile takip et.
5. Model varsayımlarını gerçek ölçüme göre kalibre et.
