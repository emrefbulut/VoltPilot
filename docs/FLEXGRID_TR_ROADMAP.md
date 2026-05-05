# FlexGrid-TR Yol Haritası

## Mevcut sürüm

Mevcut sürüm yazılım öncelikli, hibrit hazır bir proje olarak tamamlandı:

- Türkçe interaktif operatör kokpiti
- Yeniden kullanılabilir simülasyon motoru
- Trafo kVA ve akım tahminleri
- Batarya SoC ve çevrim verimi varsayımları
- LocalStorage kayıtlı senaryolar
- Paylaşılabilir senaryo URL'leri
- Sanal telemetri overlay'i
- `/api/grid-signal` sanal/resmi veri uyumlu şebeke sinyali
- EPİAŞ, ENTSO-E, Electricity Maps ve Ember için sağlayıcı modeli
- `/api/telemetry` ölçülen-simüle karşılaştırması
- JSON ve CSV dışa aktarım
- Otomatik testler ve CI

## v1.1 yazılım kanıtı

- README ekran görüntüsü veya kısa GIF eklemek
- Seçili senaryo için indirilebilir mühendislik raporu metni üretmek
- Telemetri örneklerini CSV'den içeri alma
- `/api/grid-signal` sağlayıcı adaptörlerini canlı API anahtarlarıyla doldurmak
- Grid sinyalini maliyet/karbon optimizasyonuna daha güçlü bağlamak

## v2 canlı veri ve opsiyonel donanım

- EPİAŞ canlı veri adaptörü
- Electricity Maps karbon yoğunluğu adaptörü
- ESP32 HTTP örnek gönderici
- MQTT köprüsü örneği
- Birkaç günlük ölçülen/simüle profil karşılaştırması
- Trafo stresi ve kritik tarife saatleri için uyarı

## v3 optimizasyon derinliği

- Kalkış saatine göre EV oturum önceliklendirmesi
- Batarya SoC optimizasyonunu çok güne yaymak
- Hafif veritabanı ile senaryo ve telemetri geçmişi
- Aylık mühendislik raporu dışa aktarımı
- Basit anomali tespiti

## CV cümlesi

FlexGrid-TR adlı hibrit-hazır enerji esnekliği kokpitini geliştirdim; EV şarj senaryoları, trafo yüklenmesi, batarya SoC modellemesi, sanal şebeke sinyali, talep tarafı yönetimi, telemetri doğrulaması, API çıktıları ve otomatik testleri tek bir Next.js/TypeScript projesinde birleştirdim.
