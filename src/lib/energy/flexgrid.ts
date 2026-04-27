export type FlexgridSiteType = "apartment" | "workshop" | "cafe" | "lab";
export type FlexgridStrategy = "baseline" | "tou" | "orchestrated";
export type FlexgridBatteryMode = "none" | "small" | "medium";
export type FlexgridTariffPlan = "flat" | "tou" | "critical";
export type RecommendationPriority = "high" | "medium" | "low";

export type FlexgridSiteProfile = {
  label: string;
  shortLabel: string;
  baseLoadKw: number;
  dailyKwh: number;
  transformerLimitKw: number;
  demandResponseFit: number;
  shiftableShare: number;
  carbonIntensityKgPerKwh: number;
  peakHours: [number, number];
  hourlyShape: number[];
};

export type FlexgridScenarioInput = {
  siteType: FlexgridSiteType;
  strategy: FlexgridStrategy;
  batteryMode: FlexgridBatteryMode;
  tariffPlan: FlexgridTariffPlan;
  evCount: number;
};

export type FlexgridScenarioPoint = {
  hour: string;
  hourIndex: number;
  totalLoadKw: number;
  baselineLoadKw: number;
  buildingLoadKw: number;
  evLoadKw: number;
  thermalLoadKw: number;
  batteryKw: number;
  flexibleLoadKw: number;
  transformerLimitKw: number;
  tariffTlPerKwh: number;
  carbonKg: number;
};

export type FlexgridScenarioMetrics = {
  peakKw: number;
  baselinePeakKw: number;
  peakReductionPct: number;
  dailyEnergyKwh: number;
  baselineDailyEnergyKwh: number;
  monthlyCostTl: number;
  baselineMonthlyCostTl: number;
  monthlySavingsTl: number;
  carbonKgDaily: number;
  carbonReductionPct: number;
  readinessScore: number;
  transformerStress: number;
  shiftedEnergyPct: number;
  batteryDischargeKwh: number;
  evEnergyKwh: number;
};

export type FlexgridAssetContribution = {
  id: string;
  label: string;
  valueKw: number;
  sharePct: number;
  status: "fixed" | "flexible" | "support";
};

export type FlexgridRecommendation = {
  priority: RecommendationPriority;
  title: string;
  detail: string;
};

export type FlexgridComparison = {
  strategy: FlexgridStrategy;
  label: string;
  peakKw: number;
  monthlyCostTl: number;
  monthlySavingsTl: number;
  readinessScore: number;
};

export type FlexgridScenario = {
  input: FlexgridScenarioInput;
  site: FlexgridSiteProfile;
  chart: FlexgridScenarioPoint[];
  metrics: FlexgridScenarioMetrics;
  assets: FlexgridAssetContribution[];
  recommendations: FlexgridRecommendation[];
  comparison: FlexgridComparison[];
  summary: string;
};

export const flexgridSiteProfiles: Record<FlexgridSiteType, FlexgridSiteProfile> = {
  apartment: {
    label: "Apartment block",
    shortLabel: "Apartment",
    baseLoadKw: 11,
    dailyKwh: 208,
    transformerLimitKw: 42,
    demandResponseFit: 62,
    shiftableShare: 0.24,
    carbonIntensityKgPerKwh: 0.43,
    peakHours: [18, 23],
    hourlyShape: [0.48, 0.46, 0.45, 0.45, 0.47, 0.5, 0.58, 0.66, 0.71, 0.73, 0.75, 0.77, 0.79, 0.81, 0.84, 0.89, 0.97, 1.04, 1.18, 1.28, 1.34, 1.27, 1.05, 0.76]
  },
  workshop: {
    label: "Small manufacturing workshop",
    shortLabel: "Workshop",
    baseLoadKw: 18,
    dailyKwh: 312,
    transformerLimitKw: 58,
    demandResponseFit: 78,
    shiftableShare: 0.33,
    carbonIntensityKgPerKwh: 0.45,
    peakHours: [9, 17],
    hourlyShape: [0.36, 0.34, 0.33, 0.33, 0.34, 0.39, 0.64, 0.9, 1.14, 1.2, 1.22, 1.24, 1.2, 1.19, 1.21, 1.18, 1.11, 0.88, 0.66, 0.56, 0.5, 0.45, 0.4, 0.37]
  },
  cafe: {
    label: "Cafe and restaurant",
    shortLabel: "Cafe",
    baseLoadKw: 14,
    dailyKwh: 256,
    transformerLimitKw: 46,
    demandResponseFit: 69,
    shiftableShare: 0.27,
    carbonIntensityKgPerKwh: 0.44,
    peakHours: [12, 22],
    hourlyShape: [0.37, 0.35, 0.34, 0.33, 0.35, 0.42, 0.55, 0.68, 0.78, 0.86, 0.95, 1.05, 1.14, 1.08, 1.02, 0.98, 1.03, 1.16, 1.28, 1.36, 1.32, 1.18, 0.86, 0.58]
  },
  lab: {
    label: "University electronics lab",
    shortLabel: "Lab",
    baseLoadKw: 16,
    dailyKwh: 288,
    transformerLimitKw: 52,
    demandResponseFit: 73,
    shiftableShare: 0.3,
    carbonIntensityKgPerKwh: 0.42,
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
    label: "Uncontrolled",
    description: "Loads follow natural behavior with no coordination."
  },
  {
    id: "tou",
    label: "Tariff aware",
    description: "EV charging and flexible loads move toward lower-cost hours."
  },
  {
    id: "orchestrated",
    label: "Orchestrated",
    description: "EV charging, flexible loads, and storage act as one portfolio."
  }
];

export const flexgridBatteryOptions: Array<{
  id: FlexgridBatteryMode;
  label: string;
  capacityKwh: number;
}> = [
  { id: "none", label: "No battery", capacityKwh: 0 },
  { id: "small", label: "Small battery", capacityKwh: 12 },
  { id: "medium", label: "Medium battery", capacityKwh: 28 }
];

export const flexgridTariffOptions: Array<{
  id: FlexgridTariffPlan;
  label: string;
  description: string;
}> = [
  {
    id: "flat",
    label: "Flat tariff",
    description: "Single energy price across the day."
  },
  {
    id: "tou",
    label: "Time-of-use",
    description: "Higher cost in daytime and evening peaks."
  },
  {
    id: "critical",
    label: "Critical peak",
    description: "Strong penalty during the local peak window."
  }
];

export const defaultFlexgridScenario: FlexgridScenarioInput = {
  siteType: "workshop",
  strategy: "orchestrated",
  batteryMode: "small",
  tariffPlan: "tou",
  evCount: 4
};

function round(value: number, precision = 1) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function isPeakHour(hour: number, peakHours: [number, number]) {
  return hour >= peakHours[0] && hour <= peakHours[1];
}

function tariffForHour(hour: number, plan: FlexgridTariffPlan, peakHours: [number, number]) {
  if (plan === "flat") {
    return 5.9;
  }

  if (plan === "critical" && isPeakHour(hour, peakHours)) {
    return 9.8;
  }

  if (plan === "tou") {
    if (hour >= 17 && hour <= 22) {
      return 8.1;
    }

    if (hour >= 7 && hour <= 16) {
      return 6.2;
    }
  }

  return hour <= 6 || hour >= 23 ? 4.2 : 5.7;
}

function carbonIntensityForHour(hour: number, baseIntensity: number) {
  if (hour >= 18 && hour <= 23) {
    return baseIntensity + 0.08;
  }

  if (hour >= 10 && hour <= 15) {
    return Math.max(0.28, baseIntensity - 0.07);
  }

  return baseIntensity;
}

function batteryCapacity(mode: FlexgridBatteryMode) {
  return flexgridBatteryOptions.find((option) => option.id === mode)?.capacityKwh ?? 0;
}

function buildChart(input: FlexgridScenarioInput, strategyOverride?: FlexgridStrategy) {
  const strategy = strategyOverride ?? input.strategy;
  const profile = flexgridSiteProfiles[input.siteType];
  const capacityKwh = batteryCapacity(input.batteryMode);
  const batteryPeakSupportKw = input.batteryMode === "none" ? 0 : input.batteryMode === "small" ? 2.4 : 5.2;
  const flexibleBoost = strategy === "baseline" ? 0 : strategy === "tou" ? 0.12 : 0.24;
  const thermalRelief = strategy === "baseline" ? 0 : strategy === "tou" ? 0.08 : 0.16;
  const coordinationRelief = strategy === "orchestrated" ? 0.14 : strategy === "tou" ? 0.06 : 0;

  return profile.hourlyShape.map((shape, hour) => {
    const peak = isPeakHour(hour, profile.peakHours);
    const night = hour <= 6 || hour >= 23;
    const solarWindow = hour >= 10 && hour <= 15;
    const tariffTlPerKwh = tariffForHour(hour, input.tariffPlan, profile.peakHours);
    const buildingLoadKw = profile.baseLoadKw * shape;
    const baselineThermalKw = buildingLoadKw * (peak ? 0.2 : 0.12);
    const thermalLoadKw = baselineThermalKw * (peak ? 1 - thermalRelief : 1);
    const baselineEvKw = peak ? input.evCount * 4.3 : input.evCount * 0.35;

    let evLoadKw = baselineEvKw;
    if (strategy === "tou") {
      evLoadKw = night ? input.evCount * 3.5 : peak ? input.evCount * 1.15 : input.evCount * 0.7;
    }

    if (strategy === "orchestrated") {
      evLoadKw = night || solarWindow ? input.evCount * 2.8 : peak ? input.evCount * 0.65 : input.evCount * 0.85;
    }

    const batteryKw = peak && capacityKwh > 0 ? batteryPeakSupportKw : solarWindow && capacityKwh > 0 ? -1.1 : 0;
    const totalLoadKw = Math.max(buildingLoadKw + thermalLoadKw + evLoadKw - Math.max(0, batteryKw), profile.baseLoadKw * 0.22);
    const baselineLoadKw = buildingLoadKw + baselineThermalKw + baselineEvKw;
    const flexibleLoadKw = Math.max(totalLoadKw * (profile.shiftableShare + flexibleBoost + coordinationRelief), 0);
    const carbonKg = totalLoadKw * carbonIntensityForHour(hour, profile.carbonIntensityKgPerKwh);

    return {
      hour: `${hour.toString().padStart(2, "0")}:00`,
      hourIndex: hour,
      totalLoadKw: round(totalLoadKw),
      baselineLoadKw: round(baselineLoadKw),
      buildingLoadKw: round(buildingLoadKw),
      evLoadKw: round(evLoadKw),
      thermalLoadKw: round(thermalLoadKw),
      batteryKw: round(batteryKw),
      flexibleLoadKw: round(flexibleLoadKw),
      transformerLimitKw: profile.transformerLimitKw,
      tariffTlPerKwh: round(tariffTlPerKwh, 2),
      carbonKg: round(carbonKg, 2)
    };
  });
}

function buildMetrics(input: FlexgridScenarioInput, chart: FlexgridScenarioPoint[]): FlexgridScenarioMetrics {
  const profile = flexgridSiteProfiles[input.siteType];
  const totalEnergy = sum(chart.map((point) => point.totalLoadKw));
  const baselineEnergy = sum(chart.map((point) => point.baselineLoadKw));
  const monthlyCost = sum(chart.map((point) => point.totalLoadKw * point.tariffTlPerKwh)) * 30;
  const baselineMonthlyCost = sum(chart.map((point) => point.baselineLoadKw * point.tariffTlPerKwh)) * 30;
  const peakKw = Math.max(...chart.map((point) => point.totalLoadKw));
  const baselinePeakKw = Math.max(...chart.map((point) => point.baselineLoadKw));
  const batteryDischargeKwh = sum(chart.map((point) => Math.max(0, point.batteryKw)));
  const evEnergyKwh = sum(chart.map((point) => point.evLoadKw));
  const carbonKgDaily = sum(chart.map((point) => point.carbonKg));
  const baselineCarbonKgDaily = sum(
    chart.map((point) => point.baselineLoadKw * carbonIntensityForHour(point.hourIndex, profile.carbonIntensityKgPerKwh))
  );
  const transformerStress = (peakKw / profile.transformerLimitKw) * 100;
  const shiftedEnergyPct = (sum(chart.map((point) => point.flexibleLoadKw)) / Math.max(totalEnergy, 1)) * 100;
  const strategyBonus = input.strategy === "orchestrated" ? 12 : input.strategy === "tou" ? 6 : 0;
  const batteryBonus = input.batteryMode === "none" ? 0 : input.batteryMode === "small" ? 4 : 7;
  const stressPenalty = transformerStress > 90 ? 8 : transformerStress > 75 ? 4 : 0;

  return {
    peakKw: round(peakKw),
    baselinePeakKw: round(baselinePeakKw),
    peakReductionPct: round(Math.max(0, ((baselinePeakKw - peakKw) / Math.max(baselinePeakKw, 1)) * 100), 0),
    dailyEnergyKwh: round(totalEnergy),
    baselineDailyEnergyKwh: round(baselineEnergy),
    monthlyCostTl: Math.round(monthlyCost),
    baselineMonthlyCostTl: Math.round(baselineMonthlyCost),
    monthlySavingsTl: Math.max(0, Math.round(baselineMonthlyCost - monthlyCost)),
    carbonKgDaily: round(carbonKgDaily),
    carbonReductionPct: round(Math.max(0, ((baselineCarbonKgDaily - carbonKgDaily) / Math.max(baselineCarbonKgDaily, 1)) * 100), 0),
    readinessScore: Math.min(98, Math.max(25, Math.round(profile.demandResponseFit + input.evCount * 1.3 + strategyBonus + batteryBonus - stressPenalty))),
    transformerStress: Math.round(transformerStress),
    shiftedEnergyPct: Math.round(shiftedEnergyPct),
    batteryDischargeKwh: round(batteryDischargeKwh),
    evEnergyKwh: round(evEnergyKwh)
  };
}

function buildAssets(chart: FlexgridScenarioPoint[]): FlexgridAssetContribution[] {
  const peakPoint = chart.reduce((currentPeak, point) => (point.totalLoadKw > currentPeak.totalLoadKw ? point : currentPeak), chart[0]!);
  const total = Math.max(peakPoint.totalLoadKw, 1);

  return [
    {
      id: "building",
      label: "Building base",
      valueKw: peakPoint.buildingLoadKw,
      sharePct: Math.round((peakPoint.buildingLoadKw / total) * 100),
      status: "fixed"
    },
    {
      id: "thermal",
      label: "Thermal load",
      valueKw: peakPoint.thermalLoadKw,
      sharePct: Math.round((peakPoint.thermalLoadKw / total) * 100),
      status: "flexible"
    },
    {
      id: "ev",
      label: "EV charging",
      valueKw: peakPoint.evLoadKw,
      sharePct: Math.round((peakPoint.evLoadKw / total) * 100),
      status: "flexible"
    },
    {
      id: "battery",
      label: "Storage support",
      valueKw: peakPoint.batteryKw,
      sharePct: Math.round((Math.max(0, peakPoint.batteryKw) / total) * 100),
      status: "support"
    }
  ];
}

function buildRecommendations(metrics: FlexgridScenarioMetrics, input: FlexgridScenarioInput): FlexgridRecommendation[] {
  const recommendations: FlexgridRecommendation[] = [];

  if (metrics.transformerStress >= 85) {
    recommendations.push({
      priority: "high",
      title: "Protect the local transformer first",
      detail: "Peak stress is high. Keep EV charging below the local peak window and reserve battery discharge for the top two hours."
    });
  }

  if (metrics.monthlySavingsTl >= 3000) {
    recommendations.push({
      priority: "medium",
      title: "Turn this scenario into a demand-response playbook",
      detail: "The current strategy produces visible monthly savings, so the next version should store events and compare planned vs actual reduction."
    });
  }

  if (input.batteryMode === "none") {
    recommendations.push({
      priority: "medium",
      title: "Model a small storage option",
      detail: "A small battery is enough to demonstrate peak shaving without making the project hardware-heavy."
    });
  }

  if (input.evCount >= 6) {
    recommendations.push({
      priority: "low",
      title: "Add EV session prioritization",
      detail: "With more concurrent EVs, the next step is assigning charging priority by departure time and minimum required energy."
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      priority: "low",
      title: "Ready for telemetry",
      detail: "The scenario is stable enough for an ESP32 or smart-plug feed to replace one simulated channel."
    });
  }

  return recommendations.slice(0, 3);
}

function buildComparison(input: FlexgridScenarioInput): FlexgridComparison[] {
  return flexgridStrategyOptions.map((option) => {
    const chart = buildChart(input, option.id);
    const metrics = buildMetrics({ ...input, strategy: option.id }, chart);

    return {
      strategy: option.id,
      label: option.label,
      peakKw: metrics.peakKw,
      monthlyCostTl: metrics.monthlyCostTl,
      monthlySavingsTl: metrics.monthlySavingsTl,
      readinessScore: metrics.readinessScore
    };
  });
}

function buildSummary(site: FlexgridSiteProfile, metrics: FlexgridScenarioMetrics) {
  return `${site.label} can reduce peak demand by ${metrics.peakReductionPct}% and save about ${metrics.monthlySavingsTl.toLocaleString("tr-TR")} TL/month under this scenario.`;
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

export function isFlexgridTariffPlan(value: string | null): value is FlexgridTariffPlan {
  return value === "flat" || value === "tou" || value === "critical";
}

export function clampFlexgridEvCount(value: number) {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return defaultFlexgridScenario.evCount;
  }

  return Math.min(12, Math.max(0, Math.round(value)));
}

export function buildFlexgridScenario(input: FlexgridScenarioInput): FlexgridScenario;
export function buildFlexgridScenario(
  siteType: FlexgridSiteType,
  strategy: FlexgridStrategy,
  batteryMode: FlexgridBatteryMode,
  evCount: number,
  tariffPlan?: FlexgridTariffPlan
): FlexgridScenario;
export function buildFlexgridScenario(
  inputOrSiteType: FlexgridScenarioInput | FlexgridSiteType,
  strategy?: FlexgridStrategy,
  batteryMode?: FlexgridBatteryMode,
  evCount?: number,
  tariffPlan: FlexgridTariffPlan = defaultFlexgridScenario.tariffPlan
): FlexgridScenario {
  const input =
    typeof inputOrSiteType === "string"
      ? {
          siteType: inputOrSiteType,
          strategy: strategy ?? defaultFlexgridScenario.strategy,
          batteryMode: batteryMode ?? defaultFlexgridScenario.batteryMode,
          tariffPlan,
          evCount: clampFlexgridEvCount(evCount ?? defaultFlexgridScenario.evCount)
        }
      : {
          ...inputOrSiteType,
          evCount: clampFlexgridEvCount(inputOrSiteType.evCount)
        };
  const site = flexgridSiteProfiles[input.siteType];
  const chart = buildChart(input);
  const metrics = buildMetrics(input, chart);

  return {
    input,
    site,
    chart,
    metrics,
    assets: buildAssets(chart),
    recommendations: buildRecommendations(metrics, input),
    comparison: buildComparison(input),
    summary: buildSummary(site, metrics)
  };
}
