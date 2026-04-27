# FlexGrid-TR Yol Haritasi

FlexGrid-TR, elektrik-elektronik muhendisligi ogrencisi icin enerji esnekligi, akilli sarj ve talep tarafi katilimini tek urunde gosteren acik kaynak bir MVP olarak tasarlanir.

## Net yollar

### 1. Donanimsiz MVP

- Baslangic icin en mantikli yol budur.
- Simule tuketim profilleri, EV sarj senaryolari, pik azaltma mantigi ve dashboard birlikte calisir.
- Amac: hizli sekilde GitHub'a konabilir, anlatilabilir ve buyutulebilir urun iskeleti cikarmak.

### 2. Az butceli hibrit prototip

- Donanimsiz MVP cope atilmaz; ustune tek nokta gercek veri akisi eklenir.
- ESP32, izole enerji olcum modulu veya API'li akilli priz kullanilabilir.
- Amac: demonstrasyonda fiziksel katman da gostermek.

## MVP hedefleri

- 24 saatlik yuk profili simule etmek
- EV sarj stratejileri arasinda karsilastirma yapmak
- Pik yuk, maliyet ve esnek yuk etkisini hesaplamak
- Talep tarafi katilimi uygunluk skoru uretmek
- README, demo videosu ve mimari anlatim ile CV degerini yuksek tutmak

## Onerilen repo duzeni

- `app/page.tsx`
- `components/energy`
- `src/content/flexgrid-copy.ts`
- `src/lib/energy/flexgrid.ts`
- `app/api/scenario/route.ts`
- `docs/FLEXGRID_TR_ROADMAP.md`
- `docs/FLEXGRID_TR_ARCHITECTURE.md`

## 4 haftalik teslim mantigi

### Hafta 1

- Veri modeli
- Tesis profilleri
- Yuk tipleri
- Baslangic tasarimi

### Hafta 2

- Interaktif simulator
- Grafikler
- KPI hesaplari
- Strateji karsilastirmalari

### Hafta 3

- README gelistirme
- Mimari cizim
- Demo senaryolari
- Teknik aciklama

### Hafta 4

- Opsiyonel ESP32 veri katmani
- MQTT veya HTTP ingestion
- Alarm mantigi
- Gercek veri ile simulator karsilastirmasi

## Kisa CV cumlesi

Built an open-source energy flexibility MVP for Turkish buildings and small facilities, combining simulated load forecasting, smart EV charging scenarios, peak reduction analytics, and an extensible path toward real telemetry with low-cost hardware.

## GitHub push oncesi kontrol listesi

- Landing ekranindan `/` rotasini ac
- Farkli tesis tipleri ve EV sayilarini dene
- CSV export'u indirip ciktinin grafiklerle tutarli oldugunu kontrol et
- Mimari notlarini ve yol haritasini repo icinde gorunur tut
- Demo videosunda once problemi, sonra simulator etkisini, en sonda hibrit yolunu anlat

