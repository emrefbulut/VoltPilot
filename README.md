# FlexGrid-TR

EV şarjı, esnek bina yükleri, trafo yüklenmesi, sanal şebeke sinyali ve telemetri doğrulaması için hibrit hazır enerji esnekliği kokpiti.

FlexGrid-TR, elektrik-elektronik mühendisliği portfolyosu için geliştirilmiş yazılım öncelikli bir mühendislik projesidir. Fiziksel donanım gerektirmeden küçük tesis senaryolarını modeller, esnek yük orkestrasyonunu simüle eder, trafo yüklenmesini tahmin eder, stratejileri karşılaştırır ve sanal/ölçülen telemetri örneklerini simülasyonla doğrular.

## Neden önemli?

EV şarjı, iklimlendirme yükleri ve küçük ölçekli depolama sistemleri yerel şebeke esnekliğini daha değerli hale getiriyor. Küçük tesislerin çoğunda trafo stresini, esnek yük potansiyelini ve kontrol stratejisinin ekonomik etkisini hızlıca görebilecek pratik bir araç yok.

FlexGrid-TR bu boşluğu yazılım tabanlı olarak gösterir. Bugün donanım almadan çalışır; ileride ESP32, MQTT veya smart-plug verisi geldiğinde aynı API sözleşmesiyle ölçülen-simüle karşılaştırmasına geçebilir.

## Tamamlanan özellikler

- Türkçe dashboard ve operatör kokpiti
- Apartman, KOBİ atölyesi, kafe/restoran ve elektronik laboratuvarı tesis profilleri
- EV eş zamanlılığı, tarife planı, kontrol stratejisi, batarya ve hazır senaryo kontrolleri
- URL ile paylaşılabilir senaryolar ve localStorage içinde kayıtlı senaryolar
- Kontrolsüz baz durum, sanal telemetri ve trafo sınırıyla 24 saatlik yük grafiği
- kW, kVA, akım, güç faktörü, aşım saati, batarya SoC, maliyet, karbon ve mühendislik güven KPI'ları
- Kontrolsüz, tarife duyarlı ve orkestre strateji karşılaştırması
- `/api/grid-signal` sanal şebeke sinyali API'si
- EPİAŞ, ENTSO-E, Electricity Maps ve Ember için anahtar hazır/fallback veri mimarisi
- `/api/scenario` JSON ve CSV dışa aktarım
- `/api/telemetry` ölçülen-simüle karşılaştırma API'si
- Vitest kapsamı: simülasyon motoru, telemetri, CSV, grid signal ve API davranışı
- GitHub Actions CI: test, typecheck, lint ve build

## Sanal veri yaklaşımı

Fiziksel ölçüm için erken davranmak yerine proje önce “sanal ama gerçek kaynaklara hazır” çalışır:

- EPİAŞ Şeffaflık Platformu Türkiye için resmi piyasa, üretim, tüketim ve iletim veri uyum katmanı olarak modellenir.
- ENTSO-E Avrupa şeffaflık verileri için alternatif adaptör olarak tutulur.
- Electricity Maps karbon yoğunluğu, elektrik karışımı, yük ve fiyat sinyalleri için opsiyonel adaptördür.
- Ember aylık/yıllık talep, üretim, emisyon ve karbon yoğunluğu verisi için opsiyonel adaptördür.
- API anahtarı yoksa uygulama deterministik 24 saatlik Türkiye demo sinyali üretir; demo kırılmaz, testler internete bağlı değildir.

Kaynaklar: [EPİAŞ teknik dokümantasyon](https://seffaflik-prp.epias.com.tr/electricity-service/technical/tr/index.html), [ENTSO-E Transparency Platform](https://transparency.entsoe.eu/), [Electricity Maps API](https://portal.electricitymaps.com/docs/api), [Ember API](https://ember-energy.org/data/api/).

## Teknoloji yığını

- Next.js App Router
- TypeScript
- Tailwind CSS
- Recharts
- Vitest
- Senaryo simülasyon motoru
- Sanal şebeke sinyali API'si
- Stateless telemetri karşılaştırma API'si
- CSV ve JSON dışa aktarım

## Hızlı başlangıç

```bash
pnpm install
pnpm dev
```

Sonra `http://localhost:3000` adresini aç.

## Kalite komutları

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm check
```

## API örnekleri

Senaryo JSON:

```text
/api/scenario?siteType=workshop&strategy=orchestrated&batteryMode=small&tariffPlan=tou&evCount=4
```

Grid sinyalli senaryo JSON:

```text
/api/scenario?siteType=workshop&strategy=orchestrated&batteryMode=small&tariffPlan=tou&evCount=4&gridProvider=epias&gridDate=2026-05-06
```

Senaryo CSV:

```text
/api/scenario?siteType=workshop&strategy=orchestrated&batteryMode=small&tariffPlan=tou&evCount=4&format=csv
```

Sanal şebeke sinyali:

```text
/api/grid-signal?provider=demo&date=2026-05-06
```

Telemetri karşılaştırması:

```bash
curl -X POST http://localhost:3000/api/telemetry \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "mock",
    "scenario": {
      "siteType": "workshop",
      "strategy": "orchestrated",
      "batteryMode": "small",
      "tariffPlan": "tou",
      "evCount": 4
    }
  }'
```

## Ortam değişkenleri

Uygulama bu değişkenler olmadan da çalışır. Değerler eklenirse canlı veri adaptörleri aynı API sözleşmesi içinde genişletilebilir.

```env
EPIAS_TGT=
ENTSOE_TOKEN=
ELECTRICITY_MAPS_TOKEN=
EMBER_API_KEY=
```

## Repo yapısı

- `app/api/scenario/route.ts` - senaryo JSON/CSV dışa aktarım
- `app/api/grid-signal/route.ts` - sanal/resmi veri uyumlu şebeke sinyali
- `app/api/telemetry/route.ts` - telemetri doğrulama ve karşılaştırma
- `components/energy` - kokpit UI ve dashboard panelleri
- `src/lib/energy/flexgrid.ts` - simülasyon motoru
- `src/lib/energy/grid-signal.ts` - sanal şebeke sinyali çekirdeği
- `src/lib/energy/telemetry.ts` - ölçülen-simüle karşılaştırma çekirdeği
- `tests` - model, telemetri, CSV, grid signal ve API testleri
- `docs` - mimari, telemetri, doğrulama, API, sanal veri ve yol haritası notları

## GitHub açıklaması

Türkçe enerji esnekliği kokpiti: EV şarjı, trafo yüklenmesi, sanal şebeke sinyali, talep yanıtı ve telemetri doğrulaması.

## Önerilen topic'ler

`nextjs`, `typescript`, `energy`, `smart-grid`, `demand-response`, `ev-charging`, `power-systems`, `telemetry`, `recharts`, `turkey`

## Lisans

MIT. Copyright (c) 2026 Emre Bulut.
