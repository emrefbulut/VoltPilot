export const flexgridCopy = {
  brand: {
    name: "FlexGrid-TR",
    label: "Hibrit hazır enerji esnekliği kokpiti",
    title: "EV şarjı, trafo yüklenmesi, sanal şebeke sinyali ve telemetri doğrulaması için hibrit hazır enerji kokpiti.",
    description:
      "FlexGrid-TR, Türkiye'deki binalar ve küçük tesisler için portfolyo seviyesinde bir mühendislik göstericisidir."
  },
  phases: [
    {
      week: "Faz 1",
      title: "Simülasyon motoru",
      description:
        "Tesis profilleri, EV talebi, tarife planları, batarya SoC, kVA yüklenmesi, akım tahmini ve dışa aktarılabilir senaryo verisi."
    },
    {
      week: "Faz 2",
      title: "Karar kokpiti",
      description:
        "Pik azaltımı, aylık tasarruf, karbon etkisi, trafo stresi, mühendislik güveni ve strateji önerileri."
    },
    {
      week: "Faz 3",
      title: "Telemetri doğrulama",
      description:
        "Sanal veya ölçülen örnekler stateless POST API üzerinden simüle edilen profille karşılaştırılır."
    },
    {
      week: "Faz 4",
      title: "Sanal şebeke ve açık paket",
      description:
        "EPİAŞ/ENTSO-E/Electricity Maps/Ember uyum katmanı, README, mimari, telemetri, doğrulama notları, API örnekleri, MIT lisansı, testler ve CI."
    }
  ],
  stack: [
    "Next.js App Router",
    "TypeScript",
    "Tailwind CSS",
    "Recharts",
    "Vitest",
    "Senaryo simülasyon motoru",
    "Sanal şebeke sinyali API",
    "Telemetri karşılaştırma API",
    "CSV ve JSON dışa aktarım",
    "Opsiyonel ESP32 / MQTT / smart-plug telemetri"
  ]
} as const;
