# FlexGrid-TR Proje Özeti

## Kısa tanım

FlexGrid-TR; elektrikli araç şarjı, esnek bina yükleri, batarya desteği ve trafo yüklenmesini birlikte analiz eden hibrit-hazır bir enerji esnekliği kokpitidir.

Proje fiziksel donanım olmadan çalışır. Buna rağmen ölçülen-simüle karşılaştırması için `POST /api/telemetry` uç noktası içerir; ileride ESP32, MQTT köprüsü veya akıllı priz verisi aynı sözleşmeye bağlanabilir.

## Problem

Küçük işletmeler, laboratuvarlar ve apartman blokları genellikle şu sorulara hızlı cevap veremez:

- Trafo hangi saatlerde zorlanıyor?
- EV şarjı pik yükü ne kadar artırıyor?
- Batarya veya yük kaydırma aylık maliyeti ne kadar azaltabilir?
- Simülasyon gerçek ölçümle ne kadar uyumlu?

## Çözüm

FlexGrid-TR bu soruları tek ekranda yanıtlar:

- 24 saatlik yük profili oluşturur.
- Kontrolsüz, tarife duyarlı ve orkestre stratejileri karşılaştırır.
- `kW`, `kVA`, tahmini akım, güç faktörü, batarya SoC ve overload saatlerini raporlar.
- Mock veya ölçülen telemetry verisini simülasyonla karşılaştırır.
- JSON ve CSV çıktısı üretir.

## CV cümlesi

FlexGrid-TR adlı hibrit-hazır enerji esnekliği kokpitini geliştirdim; EV şarj senaryoları, trafo yüklenmesi, batarya SoC modellemesi, talep tarafı yönetimi, telemetry doğrulaması, API çıktıları ve otomatik testleri tek bir Next.js/TypeScript projesinde birleştirdim.

## Sunumda vurgulanacak noktalar

- Elektrik-elektronik mühendisliğiyle doğrudan ilişkili metrikler kullanır: `kW`, `kVA`, akım, güç faktörü, trafo yüklenmesi.
- Sadece görsel dashboard değildir; test edilmiş simülasyon çekirdeği ve API katmanı vardır.
- Donanım almadan gösterilebilir, ama donanıma bağlanacak sınır önceden tasarlanmıştır.
- GitHub üzerinde çalıştırılabilir, okunabilir ve geliştirilebilir bir portfolyo projesidir.
