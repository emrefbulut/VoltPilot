export type FlexgridSiteType = "apartment" | "workshop" | "cafe" | "lab";
export type FlexgridStrategy = "baseline" | "tou" | "orchestrated" | "optimizer";
export type FlexgridBatteryMode = "none" | "small" | "medium";
export type FlexgridTariffPlan = "flat" | "tou" | "critical";
export type FlexgridAnalysisDays = 1 | 7;
export type RecommendationPriority = "high" | "medium" | "low";

export type FlexgridSiteProfile = {
  label: string;
  shortLabel: string;
  baseLoadKw: number;
  dailyKwh: number;
  transformerLimitKw: number;
  transformerLimitKva: number;
  nominalVoltageV: number;
  phaseCount: 1 | 3;
  powerFactor: number;
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
  analysisDays?: FlexgridAnalysisDays;
};

export type FlexgridScenarioPoint = {
  hour: string;
  hourIndex: number;
  hourOfDay: number;
  dayIndex: number;
  dayLabel: string;
  totalLoadKw: number;
  totalKva: number;
  baselineLoadKw: number;
  baselineKva: number;
  buildingLoadKw: number;
  evLoadKw: number;
  thermalLoadKw: number;
  batteryKw: number;
  batterySocPct: number;
  flexibleLoadKw: number;
  transformerLimitKw: number;
  transformerLimitKva: number;
  transformerLoadingPct: number;
  estimatedCurrentA: number;
  tariffTlPerKwh: number;
  carbonKg: number;
  overloaded: boolean;
};

export type FlexgridScenarioMetrics = {
  analysisDays: FlexgridAnalysisDays;
  peakKw: number;
  peakKva: number;
  baselinePeakKw: number;
  baselinePeakKva: number;
  peakReductionPct: number;
  peakEventReductionKw: number;
  dailyEnergyKwh: number;
  baselineDailyEnergyKwh: number;
  analysisEnergyKwh: number;
  baselineAnalysisEnergyKwh: number;
  analysisCostTl: number;
  monthlyCostTl: number;
  baselineMonthlyCostTl: number;
  monthlySavingsTl: number;
  carbonKgDaily: number;
  carbonReductionPct: number;
  readinessScore: number;
  engineeringConfidence: number;
  transformerStress: number;
  transformerLimitKva: number;
  maxCurrentA: number;
  nominalVoltageV: number;
  powerFactor: number;
  overloadHours: number;
  shiftedEnergyPct: number;
  batteryDischargeKwh: number;
  batteryChargeKwh: number;
  batteryEfficiencyLossKwh: number;
  batterySocMinPct: number;
  batterySocFinalPct: number;
  batteryRoundTripEfficiencyPct: number;
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
  peakKva: number;
  monthlyCostTl: number;
  monthlySavingsTl: number;
  readinessScore: number;
  engineeringConfidence: number;
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
    transformerLimitKva: 50,
    nominalVoltageV: 400,
    phaseCount: 3,
    powerFactor: 0.91,
    demandResponseFit: 62,
    shiftableShare: 0.24,
    carbonIntensityKgPerKwh: 0.43,
    peakHours: [18, 23],
    hourlyShape: [0.48, 0.46, 0.45, 0.45, 0.47, 0.5, 0.58, 0.66, 0.71, 0.73, 0.75, 0.77, 0.79, 0.81, 0.84, 0.89, 0.97, 1.04, 1.18, 1.28, 1.34, 1.27, 1.05, 0.76]
  },
  workshop: {
    label: "Small production workshop",
    shortLabel: "Workshop",
    baseLoadKw: 18,
    dailyKwh: 312,
    transformerLimitKw: 58,
    transformerLimitKva: 70,
    nominalVoltageV: 400,
    phaseCount: 3,
    powerFactor: 0.9,
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
    transformerLimitKva: 55,
    nominalVoltageV: 400,
    phaseCount: 3,
    powerFactor: 0.92,
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
    transformerLimitKva: 63,
    nominalVoltageV: 400,
    phaseCount: 3,
    powerFactor: 0.93,
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
    description: "Loads follow their natural pattern without coordination."
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
  },
  {
    id: "optimizer",
    label: "Constraint optimizer",
    description: "The optimizer solves peak clipping, tariff impact, and battery SoC bounds together."
  }
];

export const flexgridAnalysisOptions: Array<{
  id: FlexgridAnalysisDays;
  label: string;
  description: string;
}> = [
  {
    id: 1,
    label: "1 day",
    description: "Fast 24-hour engineering view."
  },
  {
    id: 7,
    label: "7 days",
    description: "Weekday/weekend variance and continuous battery SoC profile."
  }
];

export const flexgridBatteryOptions: Array<{
  id: FlexgridBatteryMode;
  label: string;
  capacityKwh: number;
  maxPowerKw: number;
}> = [
  { id: "none", label: "No battery", capacityKwh: 0, maxPowerKw: 0 },
  { id: "small", label: "Small battery", capacityKwh: 12, maxPowerKw: 3 },
  { id: "medium", label: "Medium battery", capacityKwh: 28, maxPowerKw: 6 }
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
    description: "Higher cost during daytime and evening peaks."
  },
  {
    id: "critical",
    label: "Critical peak",
    description: "Strong cost pressure during the local peak window."
  }
];

export const defaultFlexgridScenario: FlexgridScenarioInput = {
  siteType: "workshop",
  strategy: "orchestrated",
  batteryMode: "small",
  tariffPlan: "tou",
  evCount: 4,
  analysisDays: 1
};

const BATTERY_CHARGE_EFFICIENCY = 0.92;
const BATTERY_DISCHARGE_EFFICIENCY = 0.9;

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

export function getFlexgridTariffForHour(hour: number, plan: FlexgridTariffPlan, peakHours: [number, number]) {
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

function batteryOption(mode: FlexgridBatteryMode) {
  return flexgridBatteryOptions.find((option) => option.id === mode) ?? flexgridBatteryOptions[0]!;
}

function analysisDaysForInput(input: FlexgridScenarioInput): FlexgridAnalysisDays {
  return input.analysisDays === 7 ? 7 : 1;
}

function dayLoadFactor(dayIndex: number, analysisDays: FlexgridAnalysisDays) {
  if (analysisDays === 1) {
    return 1;
  }

  const factors = [1, 1.03, 1.04, 1.02, 0.98, 0.9, 0.86];

  return factors[dayIndex % factors.length] ?? 1;
}

function dayEvFactor(dayIndex: number, analysisDays: FlexgridAnalysisDays) {
  if (analysisDays === 1) {
    return 1;
  }

  const factors = [1, 1.04, 1.08, 1.05, 0.95, 0.72, 0.64];

  return factors[dayIndex % factors.length] ?? 1;
}

export function calculateFlexgridKva(kw: number, powerFactor: number) {
  return kw / Math.max(0.1, powerFactor);
}

export function calculateFlexgridCurrentA(kva: number, voltageV: number, phaseCount: 1 | 3) {
  if (phaseCount === 3) {
    return (kva * 1000) / (Math.sqrt(3) * voltageV);
  }

  return (kva * 1000) / voltageV;
}

export function calculateTransformerLoadingPct(loadKva: number, transformerLimitKva: number) {
  return (loadKva / Math.max(transformerLimitKva, 1)) * 100;
}

function buildChart(input: FlexgridScenarioInput, strategyOverride?: FlexgridStrategy) {
  const strategy = strategyOverride ?? input.strategy;
  const profile = flexgridSiteProfiles[input.siteType];
  const battery = batteryOption(input.batteryMode);
  const analysisDays = analysisDaysForInput(input);
  const flexibleBoost = strategy === "baseline" ? 0 : strategy === "tou" ? 0.12 : strategy === "orchestrated" ? 0.24 : 0.32;
  const thermalRelief = strategy === "baseline" ? 0 : strategy === "tou" ? 0.08 : strategy === "orchestrated" ? 0.16 : 0.22;
  const coordinationRelief = strategy === "optimizer" ? 0.2 : strategy === "orchestrated" ? 0.14 : strategy === "tou" ? 0.06 : 0;
  let batterySocKwh = battery.capacityKwh * 0.58;

  return Array.from({ length: analysisDays }).flatMap((_, dayIndex) =>
    profile.hourlyShape.map((shape, hourOfDay) => {
      const hourIndex = dayIndex * 24 + hourOfDay;
      const peak = isPeakHour(hourOfDay, profile.peakHours);
      const night = hourOfDay <= 6 || hourOfDay >= 23;
      const solarWindow = hourOfDay >= 10 && hourOfDay <= 15;
      const tariffTlPerKwh = getFlexgridTariffForHour(hourOfDay, input.tariffPlan, profile.peakHours);
      const loadFactor = dayLoadFactor(dayIndex, analysisDays);
      const evFactor = dayEvFactor(dayIndex, analysisDays);
      const buildingLoadKw = profile.baseLoadKw * shape * loadFactor;
      const baselineThermalKw = buildingLoadKw * (peak ? 0.2 : 0.12);
      const thermalLoadKw = baselineThermalKw * (peak ? 1 - thermalRelief : 1);
      const baselineEvKw = (peak ? input.evCount * 4.3 : input.evCount * 0.35) * evFactor;

      let evLoadKw = baselineEvKw;
      if (strategy === "tou") {
        evLoadKw = (night ? input.evCount * 3.5 : peak ? input.evCount * 1.15 : input.evCount * 0.7) * evFactor;
      }

      if (strategy === "orchestrated") {
        evLoadKw = (night || solarWindow ? input.evCount * 2.8 : peak ? input.evCount * 0.65 : input.evCount * 0.85) * evFactor;
      }

      if (strategy === "optimizer") {
        const lowCostWindow = tariffTlPerKwh <= 5.7 || solarWindow || night;
        const headroomTargetKw = profile.transformerLimitKw * 0.72;
        const availableHeadroomKw = Math.max(0, headroomTargetKw - buildingLoadKw - thermalLoadKw);
        const desiredEvKw = lowCostWindow ? input.evCount * 3.2 * evFactor : peak ? input.evCount * 0.35 * evFactor : input.evCount * 0.72 * evFactor;
        evLoadKw = Math.min(desiredEvKw, Math.max(input.evCount * 0.25 * evFactor, availableHeadroomKw));
      }

      let batteryKw = 0;
      const preBatteryLoadKw = buildingLoadKw + thermalLoadKw + evLoadKw;
      const optimizerTargetKw = profile.transformerLimitKw * 0.68;
      const shouldDischarge =
        strategy === "optimizer"
          ? preBatteryLoadKw > optimizerTargetKw || tariffTlPerKwh >= 8.1 || peak
          : strategy !== "baseline" && peak;

      if (strategy !== "baseline" && battery.capacityKwh > 0 && shouldDischarge) {
        const availableOutputKw = batterySocKwh * BATTERY_DISCHARGE_EFFICIENCY;
        const requestedSupportKw =
          strategy === "optimizer"
            ? Math.max(0, preBatteryLoadKw - optimizerTargetKw) || (tariffTlPerKwh >= 8.1 ? battery.maxPowerKw * 0.65 : 0)
            : battery.maxPowerKw;
        batteryKw = Math.min(battery.maxPowerKw, availableOutputKw, requestedSupportKw);
        batterySocKwh = Math.max(0, batterySocKwh - batteryKw / BATTERY_DISCHARGE_EFFICIENCY);
      } else if ((strategy === "orchestrated" || strategy === "optimizer") && battery.capacityKwh > 0 && (solarWindow || night || tariffTlPerKwh <= 4.2)) {
        const remainingCapacityKwh = battery.capacityKwh - batterySocKwh;
        const chargeLimitKw = strategy === "optimizer" ? battery.maxPowerKw * 0.75 : 1.6;
        const loadHeadroomKw = strategy === "optimizer" ? Math.max(0, profile.transformerLimitKw * 0.74 - preBatteryLoadKw) : chargeLimitKw;
        const chargeInputKw = Math.min(chargeLimitKw, battery.maxPowerKw, loadHeadroomKw, remainingCapacityKwh / BATTERY_CHARGE_EFFICIENCY);
        batteryKw = -Math.max(0, chargeInputKw);
        batterySocKwh = Math.min(battery.capacityKwh, batterySocKwh + Math.max(0, chargeInputKw) * BATTERY_CHARGE_EFFICIENCY);
      }

      const chargeLoadKw = Math.max(0, -batteryKw);
      const dischargeSupportKw = Math.max(0, batteryKw);
      const totalLoadKw = Math.max(
        buildingLoadKw + thermalLoadKw + evLoadKw + chargeLoadKw - dischargeSupportKw,
        profile.baseLoadKw * 0.22
      );
      const baselineLoadKw = buildingLoadKw + baselineThermalKw + baselineEvKw;
      const totalKva = calculateFlexgridKva(totalLoadKw, profile.powerFactor);
      const baselineKva = calculateFlexgridKva(baselineLoadKw, profile.powerFactor);
      const transformerLoadingPct = calculateTransformerLoadingPct(totalKva, profile.transformerLimitKva);
      const estimatedCurrentA = calculateFlexgridCurrentA(totalKva, profile.nominalVoltageV, profile.phaseCount);
      const flexibleLoadKw = Math.max(totalLoadKw * (profile.shiftableShare + flexibleBoost + coordinationRelief), 0);
      const carbonKg = totalLoadKw * carbonIntensityForHour(hourOfDay, profile.carbonIntensityKgPerKwh);
      const hourLabel = `${hourOfDay.toString().padStart(2, "0")}:00`;

      return {
        hour: analysisDays === 1 ? hourLabel : `D${dayIndex + 1} ${hourLabel}`,
        hourIndex,
        hourOfDay,
        dayIndex,
        dayLabel: `Day ${dayIndex + 1}`,
        totalLoadKw: round(totalLoadKw),
        totalKva: round(totalKva),
        baselineLoadKw: round(baselineLoadKw),
        baselineKva: round(baselineKva),
        buildingLoadKw: round(buildingLoadKw),
        evLoadKw: round(evLoadKw),
        thermalLoadKw: round(thermalLoadKw),
        batteryKw: round(batteryKw),
        batterySocPct: battery.capacityKwh > 0 ? Math.round((batterySocKwh / battery.capacityKwh) * 100) : 0,
        flexibleLoadKw: round(flexibleLoadKw),
        transformerLimitKw: profile.transformerLimitKw,
        transformerLimitKva: profile.transformerLimitKva,
        transformerLoadingPct: Math.round(transformerLoadingPct),
        estimatedCurrentA: Math.round(estimatedCurrentA),
        tariffTlPerKwh: round(tariffTlPerKwh, 2),
        carbonKg: round(carbonKg, 2),
        overloaded: transformerLoadingPct > 100
      };
    })
  );
}

function buildEngineeringConfidence(input: FlexgridScenarioInput, transformerStress: number, overloadHours: number) {
  const strategyBonus = input.strategy === "optimizer" ? 12 : input.strategy === "orchestrated" ? 9 : input.strategy === "tou" ? 4 : 0;
  const batteryBonus = input.batteryMode === "none" ? 0 : input.batteryMode === "small" ? 3 : 5;
  const stressPenalty = transformerStress > 100 ? 18 : transformerStress > 90 ? 10 : transformerStress > 75 ? 4 : 0;
  const overloadPenalty = overloadHours * 3;

  return Math.min(98, Math.max(35, Math.round(76 + strategyBonus + batteryBonus - stressPenalty - overloadPenalty)));
}

function buildMetrics(input: FlexgridScenarioInput, chart: FlexgridScenarioPoint[]): FlexgridScenarioMetrics {
  const profile = flexgridSiteProfiles[input.siteType];
  const battery = batteryOption(input.batteryMode);
  const analysisDays = analysisDaysForInput(input);
  const totalEnergy = sum(chart.map((point) => point.totalLoadKw));
  const baselineEnergy = sum(chart.map((point) => point.baselineLoadKw));
  const analysisCost = sum(chart.map((point) => point.totalLoadKw * point.tariffTlPerKwh));
  const baselineAnalysisCost = sum(chart.map((point) => point.baselineLoadKw * point.tariffTlPerKwh));
  const monthlyCost = analysisCost * (30 / analysisDays);
  const baselineMonthlyCost = baselineAnalysisCost * (30 / analysisDays);
  const peakKw = Math.max(...chart.map((point) => point.totalLoadKw));
  const peakKva = Math.max(...chart.map((point) => point.totalKva));
  const baselinePeakKw = Math.max(...chart.map((point) => point.baselineLoadKw));
  const baselinePeakKva = Math.max(...chart.map((point) => point.baselineKva));
  const batteryDischargeKwh = sum(chart.map((point) => Math.max(0, point.batteryKw)));
  const batteryChargeKwh = sum(chart.map((point) => Math.max(0, -point.batteryKw)));
  const batteryEfficiencyLossKwh = Math.max(
    0,
    batteryChargeKwh * BATTERY_CHARGE_EFFICIENCY - batteryDischargeKwh / BATTERY_DISCHARGE_EFFICIENCY
  );
  const evEnergyKwh = sum(chart.map((point) => point.evLoadKw));
  const carbonKgDaily = sum(chart.map((point) => point.carbonKg));
  const baselineCarbonKgDaily = sum(
    chart.map((point) => point.baselineLoadKw * carbonIntensityForHour(point.hourOfDay, profile.carbonIntensityKgPerKwh))
  );
  const transformerStress = calculateTransformerLoadingPct(peakKva, profile.transformerLimitKva);
  const shiftedEnergyPct = (sum(chart.map((point) => point.flexibleLoadKw)) / Math.max(totalEnergy, 1)) * 100;
  const strategyBonus = input.strategy === "optimizer" ? 16 : input.strategy === "orchestrated" ? 12 : input.strategy === "tou" ? 6 : 0;
  const batteryBonus = input.batteryMode === "none" ? 0 : input.batteryMode === "small" ? 4 : 7;
  const stressPenalty = transformerStress > 100 ? 12 : transformerStress > 90 ? 8 : transformerStress > 75 ? 4 : 0;
  const overloadHours = chart.filter((point) => point.overloaded).length;
  const engineeringConfidence = buildEngineeringConfidence(input, transformerStress, overloadHours);

  return {
    analysisDays,
    peakKw: round(peakKw),
    peakKva: round(peakKva),
    baselinePeakKw: round(baselinePeakKw),
    baselinePeakKva: round(baselinePeakKva),
    peakReductionPct: round(Math.max(0, ((baselinePeakKw - peakKw) / Math.max(baselinePeakKw, 1)) * 100), 0),
    peakEventReductionKw: round(Math.max(0, baselinePeakKw - peakKw)),
    dailyEnergyKwh: round(totalEnergy / analysisDays),
    baselineDailyEnergyKwh: round(baselineEnergy / analysisDays),
    analysisEnergyKwh: round(totalEnergy),
    baselineAnalysisEnergyKwh: round(baselineEnergy),
    analysisCostTl: Math.round(analysisCost),
    monthlyCostTl: Math.round(monthlyCost),
    baselineMonthlyCostTl: Math.round(baselineMonthlyCost),
    monthlySavingsTl: Math.max(0, Math.round(baselineMonthlyCost - monthlyCost)),
    carbonKgDaily: round(carbonKgDaily / analysisDays),
    carbonReductionPct: round(Math.max(0, ((baselineCarbonKgDaily - carbonKgDaily) / Math.max(baselineCarbonKgDaily, 1)) * 100), 0),
    readinessScore: Math.min(
      98,
      Math.max(25, Math.round(profile.demandResponseFit + input.evCount * 1.3 + strategyBonus + batteryBonus - stressPenalty))
    ),
    engineeringConfidence,
    transformerStress: Math.round(transformerStress),
    transformerLimitKva: profile.transformerLimitKva,
    maxCurrentA: Math.max(...chart.map((point) => point.estimatedCurrentA)),
    nominalVoltageV: profile.nominalVoltageV,
    powerFactor: profile.powerFactor,
    overloadHours,
    shiftedEnergyPct: Math.round(shiftedEnergyPct),
    batteryDischargeKwh: round(batteryDischargeKwh),
    batteryChargeKwh: round(batteryChargeKwh),
    batteryEfficiencyLossKwh: round(batteryEfficiencyLossKwh, 2),
    batterySocMinPct: battery.capacityKwh > 0 ? Math.min(...chart.map((point) => point.batterySocPct)) : 0,
    batterySocFinalPct: battery.capacityKwh > 0 ? chart.at(-1)?.batterySocPct ?? 0 : 0,
    batteryRoundTripEfficiencyPct: battery.capacityKwh > 0 ? Math.round(BATTERY_CHARGE_EFFICIENCY * BATTERY_DISCHARGE_EFFICIENCY * 100) : 0,
    evEnergyKwh: round(evEnergyKwh)
  };
}

function buildAssets(chart: FlexgridScenarioPoint[]): FlexgridAssetContribution[] {
  const peakPoint = chart.reduce((currentPeak, point) => (point.totalLoadKw > currentPeak.totalLoadKw ? point : currentPeak), chart[0]!);
  const total = Math.max(peakPoint.totalLoadKw, 1);

  return [
    {
      id: "building",
      label: "Building base load",
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

  if (metrics.overloadHours > 0) {
    recommendations.push({
      priority: "high",
      title: "Resolve transformer overload first",
      detail: `${metrics.overloadHours} hours exceed the kVA limit. Reduce concurrent EV charging or reserve battery discharge for peak hours.`
    });
  } else if (metrics.transformerStress >= 85) {
    recommendations.push({
      priority: "high",
      title: "Prioritize transformer stress reduction",
      detail: "Peak stress is high. Move EV charging outside the local peak window and reserve battery discharge for the two heaviest hours."
    });
  }

  if (metrics.monthlySavingsTl >= 3000) {
    recommendations.push({
      priority: "medium",
      title: "Turn this scenario into an operating rule",
      detail: "The current strategy produces monthly savings. Keep event logs with the same rule set and compare achieved reduction against the target."
    });
  }

  if (input.batteryMode === "none") {
    recommendations.push({
      priority: "medium",
      title: "Make storage impact visible",
      detail: "The storage option compares how peak clipping affects cost and transformer stress in the same cockpit."
    });
  }

  if (input.evCount >= 6) {
    recommendations.push({
      priority: "low",
      title: "Apply EV session priority",
      detail: "When concurrent EV count increases, rank charging priority by departure time and minimum energy requirement."
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      priority: "low",
      title: "Ready for telemetry validation",
      detail: "The scenario is balanced. Use CSV telemetry comparison to track measured versus modeled load deviation in the same report."
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
      peakKva: metrics.peakKva,
      monthlyCostTl: metrics.monthlyCostTl,
      monthlySavingsTl: metrics.monthlySavingsTl,
      readinessScore: metrics.readinessScore,
      engineeringConfidence: metrics.engineeringConfidence
    };
  });
}

function buildSummary(site: FlexgridSiteProfile, metrics: FlexgridScenarioMetrics) {
  const horizon = metrics.analysisDays === 1 ? "24-hour" : "7-day";

  return `${site.label} ${horizon} scenario reduces peak demand by ${metrics.peakReductionPct}% (${metrics.peakEventReductionKw.toLocaleString("en-US")} kW) and creates an estimated ${metrics.monthlySavingsTl.toLocaleString("en-US")} TL/month saving.`;
}

export function isFlexgridSiteType(value: string | null): value is FlexgridSiteType {
  return value === "apartment" || value === "workshop" || value === "cafe" || value === "lab";
}

export function isFlexgridStrategy(value: string | null): value is FlexgridStrategy {
  return value === "baseline" || value === "tou" || value === "orchestrated" || value === "optimizer";
}

export function isFlexgridBatteryMode(value: string | null): value is FlexgridBatteryMode {
  return value === "none" || value === "small" || value === "medium";
}

export function isFlexgridTariffPlan(value: string | null): value is FlexgridTariffPlan {
  return value === "flat" || value === "tou" || value === "critical";
}

export function normalizeFlexgridAnalysisDays(value: string | number | null | undefined): FlexgridAnalysisDays {
  const normalized = Number(value);

  return normalized === 7 ? 7 : 1;
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
  const input: FlexgridScenarioInput =
    typeof inputOrSiteType === "string"
      ? {
          siteType: inputOrSiteType,
          strategy: strategy ?? defaultFlexgridScenario.strategy,
          batteryMode: batteryMode ?? defaultFlexgridScenario.batteryMode,
          tariffPlan,
          evCount: clampFlexgridEvCount(evCount ?? defaultFlexgridScenario.evCount),
          analysisDays: defaultFlexgridScenario.analysisDays
        }
      : {
          ...inputOrSiteType,
          evCount: clampFlexgridEvCount(inputOrSiteType.evCount),
          analysisDays: normalizeFlexgridAnalysisDays(inputOrSiteType.analysisDays)
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
