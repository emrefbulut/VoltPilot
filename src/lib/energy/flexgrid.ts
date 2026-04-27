export type FlexgridSiteType = "apartment" | "workshop" | "cafe" | "lab";
export type FlexgridStrategy = "baseline" | "tou" | "orchestrated";
export type FlexgridBatteryMode = "none" | "small" | "medium";

export type FlexgridSiteProfile = {
  label: string;
  baseLoadKw: number;
  dailyKwh: number;
  demandResponseFit: number;
  peakHours: [number, number];
  hourlyShape: number[];
};

export const flexgridSiteProfiles: Record<FlexgridSiteType, FlexgridSiteProfile> = {
  apartment: {
    label: "Apartman / site blogu",
    baseLoadKw: 11,
    dailyKwh: 208,
    demandResponseFit: 62,
    peakHours: [18, 23],
    hourlyShape: [0.48, 0.46, 0.45, 0.45, 0.47, 0.5, 0.58, 0.66, 0.71, 0.73, 0.75, 0.77, 0.79, 0.81, 0.84, 0.89, 0.97, 1.04, 1.18, 1.28, 1.34, 1.27, 1.05, 0.76]
  },
  workshop: {
    label: "Atolye / kucuk uretim",
    baseLoadKw: 18,
    dailyKwh: 312,
    demandResponseFit: 78,
    peakHours: [9, 17],
    hourlyShape: [0.36, 0.34, 0.33, 0.33, 0.34, 0.39, 0.64, 0.9, 1.14, 1.2, 1.22, 1.24, 1.2, 1.19, 1.21, 1.18, 1.11, 0.88, 0.66, 0.56, 0.5, 0.45, 0.4, 0.37]
  },
  cafe: {
    label: "Kafe / restoran",
    baseLoadKw: 14,
    dailyKwh: 256,
    demandResponseFit: 69,
    peakHours: [12, 22],
    hourlyShape: [0.37, 0.35, 0.34, 0.33, 0.35, 0.42, 0.55, 0.68, 0.78, 0.86, 0.95, 1.05, 1.14, 1.08, 1.02, 0.98, 1.03, 1.16, 1.28, 1.36, 1.32, 1.18, 0.86, 0.58]
  },
  lab: {
    label: "Universite laboratuvari",
    baseLoadKw: 16,
    dailyKwh: 288,
    demandResponseFit: 73,
    peakHours: [10, 18],
    hourlyShape: [0.34, 0.33, 0.32, 0.32, 0.33, 0.37, 0.56, 0.84, 1.02, 1.14, 1.21, 1.22, 1.18, 1.16, 1.17, 1.12, 1.07, 0.94, 0.72, 0.6, 0.53, 0.47, 0.41, 0.36]
  }
};

export const flexgridStrategyOptions: Array<{
  id: FlexgridStrategy;
  label: string;
  description: string;
}> = [
  {
    id: "baseline",
    label: "Kontrolsuz",
    description: "Yukler agirlikla ayni saate yigiliyor."
  },
  {
    id: "tou",
    label: "TOU odakli",
    description: "Zaman tarifesine gore kaydirma var ama koordinasyon zayif."
  },
  {
    id: "orchestrated",
    label: "Orkestre",
    description: "EV, klima ve batarya birlikte yonetiliyor."
  }
];

export const flexgridBatteryOptions: Array<{
  id: FlexgridBatteryMode;
  label: string;
}> = [
  { id: "none", label: "Batarya yok" },
  { id: "small", label: "Kucuk batarya" },
  { id: "medium", label: "Orta batarya" }
];

export type FlexgridScenarioPoint = {
  hour: string;
  totalLoadKw: number;
  flexibleLoadKw: number;
  baselineBandKw: number;
};

export type FlexgridScenarioMetrics = {
  peakKw: number;
  monthlyCostTl: number;
  peakReductionPct: number;
  shiftedEnergyPct: number;
  readinessScore: number;
  transformerStress: number;
};

export type FlexgridScenario = {
  chart: FlexgridScenarioPoint[];
  metrics: FlexgridScenarioMetrics;
};

export const defaultFlexgridScenario = {
  siteType: "workshop",
  strategy: "orchestrated",
  batteryMode: "small",
  evCount: 4
} as const satisfies {
  siteType: FlexgridSiteType;
  strategy: FlexgridStrategy;
  batteryMode: FlexgridBatteryMode;
  evCount: number;
};

function round(value: number) {
  return Math.round(value * 10) / 10;
}

export function isFlexgridSiteType(value: string | null): value is FlexgridSiteType {
  return value === "apartment" || value === "workshop" || value === "cafe" || value === "lab";
}

export function isFlexgridStrategy(value: string | null): value is FlexgridStrategy {
  return value === "baseline" || value === "tou" || value === "orchestrated";
}

export function isFlexgridBatteryMode(value: string | null): value is FlexgridBatteryMode {
  return value === "none" || value === "small" || value === "medium";
}

export function clampFlexgridEvCount(value: number) {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return defaultFlexgridScenario.evCount;
  }

  return Math.min(10, Math.max(0, Math.round(value)));
}

export function buildFlexgridScenario(
  siteType: FlexgridSiteType,
  strategy: FlexgridStrategy,
  batteryMode: FlexgridBatteryMode,
  evCount: number
): FlexgridScenario {
  const profile = flexgridSiteProfiles[siteType];
  const batterySupport = batteryMode === "none" ? 0 : batteryMode === "small" ? 1.6 : 3.2;
  const offPeakShift = strategy === "baseline" ? 0 : strategy === "tou" ? 0.1 : 0.22;
  const smartCoolingRelief = strategy === "baseline" ? 0 : strategy === "tou" ? 0.06 : 0.14;
  const coordinationBonus = strategy === "orchestrated" ? 0.16 : strategy === "tou" ? 0.08 : 0;
  const evLoadPerVehicle = strategy === "baseline" ? 4.2 : strategy === "tou" ? 3.4 : 2.8;

  const hourlyLoad = profile.hourlyShape.map((shape, hour) => {
    const baseKw = profile.baseLoadKw * shape;
    const inPeakWindow = hour >= profile.peakHours[0] && hour <= profile.peakHours[1];
    const nightWindow = hour <= 6 || hour >= 22;
    const climateAdjustment = inPeakWindow ? 1 - smartCoolingRelief : 1;

    let evKw = 0;

    if (strategy === "baseline") {
      evKw = inPeakWindow ? evCount * evLoadPerVehicle : evCount * 0.35;
    } else if (strategy === "tou") {
      evKw = nightWindow ? evCount * evLoadPerVehicle : inPeakWindow ? evCount * 1.2 : evCount * 0.5;
    } else {
      evKw = nightWindow ? evCount * evLoadPerVehicle : inPeakWindow ? evCount * 0.7 : evCount * 0.55;
    }

    const batteryRelief = inPeakWindow ? batterySupport : 0;
    const loadKw = Math.max(baseKw * climateAdjustment + evKw - batteryRelief, profile.baseLoadKw * 0.25);

    return {
      hour: `${hour.toString().padStart(2, "0")}:00`,
      totalLoadKw: round(loadKw),
      flexibleLoadKw: round(Math.max(loadKw * (0.22 + offPeakShift + coordinationBonus), 0)),
      baselineBandKw: round(baseKw + evCount * 4.2)
    };
  });

  const peakKw = Math.max(...hourlyLoad.map((item) => item.totalLoadKw));
  const baselinePeakKw = Math.max(...hourlyLoad.map((item) => item.baselineBandKw));
  const peakReductionPct = Math.max(0, ((baselinePeakKw - peakKw) / baselinePeakKw) * 100);
  const shiftedEnergyPct = (offPeakShift + coordinationBonus) * 100 + (batterySupport > 0 ? 6 : 0);
  const monthlyCostTl =
    profile.dailyKwh * 30 * (strategy === "baseline" ? 6.4 : strategy === "tou" ? 5.8 : 5.2) +
    evCount * 620 -
    batterySupport * 180;
  const readinessScore = Math.min(
    98,
    Math.round(
      profile.demandResponseFit +
        evCount * 1.8 +
        (strategy === "orchestrated" ? 14 : strategy === "tou" ? 7 : 0) +
        (batterySupport > 0 ? 5 : 0)
    )
  );
  const transformerStress = Math.max(
    18,
    Math.round((peakKw / (profile.baseLoadKw * 1.5 + evCount * 2.4)) * 100)
  );

  return {
    chart: hourlyLoad,
    metrics: {
      peakKw: round(peakKw),
      monthlyCostTl: Math.round(monthlyCostTl),
      peakReductionPct: Math.round(peakReductionPct),
      shiftedEnergyPct: Math.round(shiftedEnergyPct),
      readinessScore,
      transformerStress
    }
  };
}
