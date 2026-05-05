export type FlexgridGridProvider = "demo" | "epias" | "entsoe" | "electricity-maps" | "ember";
export type FlexgridDemandRisk = "low" | "medium" | "high";
export type FlexgridGridSignalStatus = "demo" | "live" | "fallback";

export type FlexgridGridSignalInput = {
  provider?: string | null;
  date?: string | null;
};

export type FlexgridGridSignalPoint = {
  hour: string;
  hourIndex: number;
  marketPriceTlMwh: number;
  loadMw: number;
  renewableSharePct: number;
  carbonIntensityGco2Kwh: number;
  demandRisk: FlexgridDemandRisk;
};

export type FlexgridGridSignalSummary = {
  averagePriceTlMwh: number;
  peakLoadMw: number;
  peakHour: string;
  renewableSharePct: number;
  carbonIntensityGco2Kwh: number;
  highRiskHours: number;
  dispatchAdvice: string;
};

export type FlexgridGridSignal = {
  provider: FlexgridGridProvider;
  sourceLabel: string;
  date: string;
  status: FlexgridGridSignalStatus;
  updatedAt: string;
  points: FlexgridGridSignalPoint[];
  summary: FlexgridGridSignalSummary;
  integrationNotes: string[];
};

export const flexgridGridProviders: Array<{
  id: FlexgridGridProvider;
  label: string;
  description: string;
  sourceUrl: string;
  requiresCredential: boolean;
}> = [
  {
    id: "demo",
    label: "Sanal Demo",
    description: "Anahtarsız, deterministik 24 saatlik Türkiye şebeke sinyali.",
    sourceUrl: "local://flexgrid-tr/demo-grid-signal",
    requiresCredential: false
  },
  {
    id: "epias",
    label: "EPİAŞ Şeffaflık",
    description: "Türkiye piyasa, üretim, tüketim ve iletim verileri için resmi uyum katmanı.",
    sourceUrl: "https://seffaflik-prp.epias.com.tr/electricity-service/technical/tr/index.html",
    requiresCredential: true
  },
  {
    id: "entsoe",
    label: "ENTSO-E",
    description: "Avrupa şeffaflık platformu; yük, üretim ve fiyat verisi adaptörü.",
    sourceUrl: "https://transparency.entsoe.eu/",
    requiresCredential: true
  },
  {
    id: "electricity-maps",
    label: "Electricity Maps",
    description: "Karbon yoğunluğu, üretim karışımı, yük ve fiyat sinyali adaptörü.",
    sourceUrl: "https://portal.electricitymaps.com/docs/api",
    requiresCredential: true
  },
  {
    id: "ember",
    label: "Ember",
    description: "Aylık/yıllık ülke bazlı talep, üretim, emisyon ve karbon yoğunluğu verisi adaptörü.",
    sourceUrl: "https://ember-energy.org/data/api/",
    requiresCredential: true
  }
];

function round(value: number, precision = 1) {
  const factor = 10 ** precision;

  return Math.round(value * factor) / factor;
}

function average(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / Math.max(values.length, 1);
}

function isIsoDate(value: string | null | undefined): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export const isFlexgridGridDate = isIsoDate;

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function daySeed(date: string) {
  return [...date].reduce((total, char) => total + char.charCodeAt(0), 0);
}

export function isFlexgridGridProvider(value: string | null | undefined): value is FlexgridGridProvider {
  return value === "demo" || value === "epias" || value === "entsoe" || value === "electricity-maps" || value === "ember";
}

export function normalizeGridSignalInput(input: FlexgridGridSignalInput = {}) {
  return {
    provider: isFlexgridGridProvider(input.provider) ? input.provider : "demo",
    date: isIsoDate(input.date) ? input.date : todayIsoDate()
  };
}

function sourceLabelForProvider(provider: FlexgridGridProvider) {
  return flexgridGridProviders.find((item) => item.id === provider)?.label ?? "Sanal Demo";
}

function statusForProvider(provider: FlexgridGridProvider): FlexgridGridSignalStatus {
  return provider === "demo" ? "demo" : "fallback";
}

function demandRisk(loadMw: number, priceTlMwh: number, carbonIntensity: number): FlexgridDemandRisk {
  if (loadMw >= 47_500 || priceTlMwh >= 2_600 || carbonIntensity >= 540) {
    return "high";
  }

  if (loadMw >= 42_500 || priceTlMwh >= 2_150 || carbonIntensity >= 470) {
    return "medium";
  }

  return "low";
}

function providerOffset(provider: FlexgridGridProvider) {
  const offsets: Record<FlexgridGridProvider, number> = {
    demo: 0,
    epias: 18,
    entsoe: -12,
    "electricity-maps": -28,
    ember: 8
  };

  return offsets[provider];
}

export function buildDemoGridSignal(input: FlexgridGridSignalInput = {}): FlexgridGridSignal {
  const { provider, date } = normalizeGridSignalInput(input);
  const seed = daySeed(date) + providerOffset(provider);
  const weekdayFactor = [0.94, 1, 1.02, 1.03, 1.04, 1.01, 0.96][new Date(`${date}T00:00:00.000Z`).getUTCDay()] ?? 1;
  const seasonalFactor = 1 + (Math.sin(((new Date(`${date}T00:00:00.000Z`).getUTCMonth() + 1) / 12) * Math.PI * 2) * 0.08);
  const points = Array.from({ length: 24 }, (_, hour): FlexgridGridSignalPoint => {
    const morningRamp = Math.exp(-((hour - 9) ** 2) / 18) * 3_800;
    const eveningPeak = Math.exp(-((hour - 20) ** 2) / 10) * 7_100;
    const nightDip = hour <= 5 ? -3_100 : 0;
    const solarRelief = hour >= 11 && hour <= 15 ? -1_400 : 0;
    const deterministicNoise = Math.sin((hour + seed) * 1.7) * 420;
    const loadMw = Math.max(29_500, (38_400 + morningRamp + eveningPeak + nightDip + solarRelief + deterministicNoise) * weekdayFactor * seasonalFactor);
    const solarShare = hour >= 8 && hour <= 17 ? Math.sin(((hour - 8) / 9) * Math.PI) * 14 : 0;
    const windSwing = 8 + Math.sin((hour + seed) / 3) * 4;
    const hydroBase = 17 + Math.cos((hour + seed) / 8) * 2;
    const renewableSharePct = Math.max(22, Math.min(58, hydroBase + windSwing + solarShare));
    const carbonIntensityGco2Kwh = Math.max(310, 590 - renewableSharePct * 3.9 + (hour >= 18 && hour <= 22 ? 55 : 0));
    const marketPriceTlMwh = Math.max(
      1_250,
      1_520 + (loadMw - 34_000) * 0.058 + (carbonIntensityGco2Kwh - 380) * 1.7 + (hour >= 18 && hour <= 22 ? 240 : 0)
    );

    return {
      hour: `${hour.toString().padStart(2, "0")}:00`,
      hourIndex: hour,
      marketPriceTlMwh: round(marketPriceTlMwh, 0),
      loadMw: round(loadMw, 0),
      renewableSharePct: round(renewableSharePct, 0),
      carbonIntensityGco2Kwh: round(carbonIntensityGco2Kwh, 0),
      demandRisk: demandRisk(loadMw, marketPriceTlMwh, carbonIntensityGco2Kwh)
    };
  });
  const peakPoint = points.reduce((peak, point) => (point.loadMw > peak.loadMw ? point : peak), points[0]!);
  const highRiskHours = points.filter((point) => point.demandRisk === "high").length;

  return {
    provider,
    sourceLabel: sourceLabelForProvider(provider),
    date,
    status: statusForProvider(provider),
    updatedAt: new Date(`${date}T12:00:00.000Z`).toISOString(),
    points,
    summary: {
      averagePriceTlMwh: round(average(points.map((point) => point.marketPriceTlMwh)), 0),
      peakLoadMw: peakPoint.loadMw,
      peakHour: peakPoint.hour,
      renewableSharePct: round(average(points.map((point) => point.renewableSharePct)), 0),
      carbonIntensityGco2Kwh: round(average(points.map((point) => point.carbonIntensityGco2Kwh)), 0),
      highRiskHours,
      dispatchAdvice:
        highRiskHours > 0
          ? "EV şarjını ve batarya deşarjını yüksek risk saatlerine göre yeniden planla."
          : "Şebeke riski düşük; esnek yükleri düşük fiyat ve düşük karbon saatlerine taşı."
    },
    integrationNotes:
      provider === "demo"
        ? ["Bu veri deterministik sanal modeldir; fiziksel donanım veya API anahtarı gerektirmez."]
        : [
            `${sourceLabelForProvider(provider)} seçildi; API kimliği tanımlanana kadar aynı veri şemasıyla sanal yedek veri kullanılır.`,
            "Canlı entegrasyon eklendiğinde endpoint sözleşmesi değişmeden kalır."
          ]
  };
}
