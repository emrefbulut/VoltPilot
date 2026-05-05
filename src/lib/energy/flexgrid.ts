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
};

export type FlexgridScenarioPoint = {
  hour: string;
  hourIndex: number;
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
  peakKw: number;
  peakKva: number;
  baselinePeakKw: number;
  baselinePeakKva: number;
  peakReductionPct: number;
  peakEventReductionKw: number;
  dailyEnergyKwh: number;
  baselineDailyEnergyKwh: number;
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
    label: "Apartman bloğu",
    shortLabel: "Apartman",
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
    label: "KOBİ üretim atölyesi",
    shortLabel: "Atölye",
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
    label: "Kafe ve restoran",
    shortLabel: "Kafe",
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
    label: "Üniversite elektronik laboratuvarı",
    shortLabel: "Laboratuvar",
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
    label: "Kontrolsüz",
    description: "Yükler koordinasyon olmadan doğal davranışını izler."
  },
  {
    id: "tou",
    label: "Tarife duyarlı",
    description: "EV şarjı ve esnek yükler daha ucuz saatlere kaydırılır."
  },
  {
    id: "orchestrated",
    label: "Orkestre",
    description: "EV şarjı, esnek yükler ve batarya tek bir portföy gibi yönetilir."
  }
];

export const flexgridBatteryOptions: Array<{
  id: FlexgridBatteryMode;
  label: string;
  capacityKwh: number;
  maxPowerKw: number;
}> = [
  { id: "none", label: "Batarya yok", capacityKwh: 0, maxPowerKw: 0 },
  { id: "small", label: "Küçük batarya", capacityKwh: 12, maxPowerKw: 3 },
  { id: "medium", label: "Orta batarya", capacityKwh: 28, maxPowerKw: 6 }
];

export const flexgridTariffOptions: Array<{
  id: FlexgridTariffPlan;
  label: string;
  description: string;
}> = [
  {
    id: "flat",
    label: "Sabit tarife",
    description: "Günün tamamında tek enerji fiyatı."
  },
  {
    id: "tou",
    label: "Zaman bazlı",
    description: "Gündüz ve akşam piklerinde daha yüksek maliyet."
  },
  {
    id: "critical",
    label: "Kritik pik",
    description: "Yerel pik aralığında güçlü ceza fiyatı."
  }
];

export const defaultFlexgridScenario: FlexgridScenarioInput = {
  siteType: "workshop",
  strategy: "orchestrated",
  batteryMode: "small",
  tariffPlan: "tou",
  evCount: 4
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
  const flexibleBoost = strategy === "baseline" ? 0 : strategy === "tou" ? 0.12 : 0.24;
  const thermalRelief = strategy === "baseline" ? 0 : strategy === "tou" ? 0.08 : 0.16;
  const coordinationRelief = strategy === "orchestrated" ? 0.14 : strategy === "tou" ? 0.06 : 0;
  let batterySocKwh = battery.capacityKwh * 0.58;

  return profile.hourlyShape.map((shape, hour) => {
    const peak = isPeakHour(hour, profile.peakHours);
    const night = hour <= 6 || hour >= 23;
    const solarWindow = hour >= 10 && hour <= 15;
    const tariffTlPerKwh = getFlexgridTariffForHour(hour, input.tariffPlan, profile.peakHours);
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

    let batteryKw = 0;
    if (strategy !== "baseline" && battery.capacityKwh > 0 && peak) {
      const availableOutputKw = batterySocKwh * BATTERY_DISCHARGE_EFFICIENCY;
      batteryKw = Math.min(battery.maxPowerKw, availableOutputKw);
      batterySocKwh = Math.max(0, batterySocKwh - batteryKw / BATTERY_DISCHARGE_EFFICIENCY);
    } else if (strategy === "orchestrated" && battery.capacityKwh > 0 && (solarWindow || night)) {
      const remainingCapacityKwh = battery.capacityKwh - batterySocKwh;
      const chargeInputKw = Math.min(1.6, battery.maxPowerKw, remainingCapacityKwh / BATTERY_CHARGE_EFFICIENCY);
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
    const carbonKg = totalLoadKw * carbonIntensityForHour(hour, profile.carbonIntensityKgPerKwh);

    return {
      hour: `${hour.toString().padStart(2, "0")}:00`,
      hourIndex: hour,
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
  });
}

function buildEngineeringConfidence(input: FlexgridScenarioInput, transformerStress: number, overloadHours: number) {
  const strategyBonus = input.strategy === "orchestrated" ? 9 : input.strategy === "tou" ? 4 : 0;
  const batteryBonus = input.batteryMode === "none" ? 0 : input.batteryMode === "small" ? 3 : 5;
  const stressPenalty = transformerStress > 100 ? 18 : transformerStress > 90 ? 10 : transformerStress > 75 ? 4 : 0;
  const overloadPenalty = overloadHours * 3;

  return Math.min(98, Math.max(35, Math.round(76 + strategyBonus + batteryBonus - stressPenalty - overloadPenalty)));
}

function buildMetrics(input: FlexgridScenarioInput, chart: FlexgridScenarioPoint[]): FlexgridScenarioMetrics {
  const profile = flexgridSiteProfiles[input.siteType];
  const battery = batteryOption(input.batteryMode);
  const totalEnergy = sum(chart.map((point) => point.totalLoadKw));
  const baselineEnergy = sum(chart.map((point) => point.baselineLoadKw));
  const monthlyCost = sum(chart.map((point) => point.totalLoadKw * point.tariffTlPerKwh)) * 30;
  const baselineMonthlyCost = sum(chart.map((point) => point.baselineLoadKw * point.tariffTlPerKwh)) * 30;
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
    chart.map((point) => point.baselineLoadKw * carbonIntensityForHour(point.hourIndex, profile.carbonIntensityKgPerKwh))
  );
  const transformerStress = calculateTransformerLoadingPct(peakKva, profile.transformerLimitKva);
  const shiftedEnergyPct = (sum(chart.map((point) => point.flexibleLoadKw)) / Math.max(totalEnergy, 1)) * 100;
  const strategyBonus = input.strategy === "orchestrated" ? 12 : input.strategy === "tou" ? 6 : 0;
  const batteryBonus = input.batteryMode === "none" ? 0 : input.batteryMode === "small" ? 4 : 7;
  const stressPenalty = transformerStress > 100 ? 12 : transformerStress > 90 ? 8 : transformerStress > 75 ? 4 : 0;
  const overloadHours = chart.filter((point) => point.overloaded).length;
  const engineeringConfidence = buildEngineeringConfidence(input, transformerStress, overloadHours);

  return {
    peakKw: round(peakKw),
    peakKva: round(peakKva),
    baselinePeakKw: round(baselinePeakKw),
    baselinePeakKva: round(baselinePeakKva),
    peakReductionPct: round(Math.max(0, ((baselinePeakKw - peakKw) / Math.max(baselinePeakKw, 1)) * 100), 0),
    peakEventReductionKw: round(Math.max(0, baselinePeakKw - peakKw)),
    dailyEnergyKwh: round(totalEnergy),
    baselineDailyEnergyKwh: round(baselineEnergy),
    monthlyCostTl: Math.round(monthlyCost),
    baselineMonthlyCostTl: Math.round(baselineMonthlyCost),
    monthlySavingsTl: Math.max(0, Math.round(baselineMonthlyCost - monthlyCost)),
    carbonKgDaily: round(carbonKgDaily),
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
      label: "Bina baz yükü",
      valueKw: peakPoint.buildingLoadKw,
      sharePct: Math.round((peakPoint.buildingLoadKw / total) * 100),
      status: "fixed"
    },
    {
      id: "thermal",
      label: "Termal yük",
      valueKw: peakPoint.thermalLoadKw,
      sharePct: Math.round((peakPoint.thermalLoadKw / total) * 100),
      status: "flexible"
    },
    {
      id: "ev",
      label: "EV şarjı",
      valueKw: peakPoint.evLoadKw,
      sharePct: Math.round((peakPoint.evLoadKw / total) * 100),
      status: "flexible"
    },
    {
      id: "battery",
      label: "Batarya desteği",
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
      title: "Ölçeklemeden önce trafo aşımını çöz",
      detail: `${metrics.overloadHours} simülasyon saati kVA sınırını aşıyor. Yeni yük eklemeden önce eş zamanlı EV şarjını azalt veya batarya desteğini artır.`
    });
  } else if (metrics.transformerStress >= 85) {
    recommendations.push({
      priority: "high",
      title: "Önce yerel trafonun güvenliğini koru",
      detail: "Pik stres yüksek. EV şarjını yerel pik pencerenin dışında tut ve batarya deşarjını en yoğun iki saate ayır."
    });
  }

  if (metrics.monthlySavingsTl >= 3000) {
    recommendations.push({
      priority: "medium",
      title: "Bu senaryoyu talep yanıtı playbook'una çevir",
      detail: "Mevcut strateji görünür aylık tasarruf üretiyor; sonraki sürüm olayları saklayıp planlanan ve gerçekleşen azaltımı karşılaştırabilir."
    });
  }

  if (input.batteryMode === "none") {
    recommendations.push({
      priority: "medium",
      title: "Küçük batarya seçeneğini modelle",
      detail: "Küçük bir batarya, projeyi donanım ağırlıklı yapmadan pik kırpma etkisini göstermek için yeterli."
    });
  }

  if (input.evCount >= 6) {
    recommendations.push({
      priority: "low",
      title: "EV oturum önceliği ekle",
      detail: "Eş zamanlı EV sayısı arttığında sonraki adım, kalkış saati ve minimum enerji ihtiyacına göre şarj önceliği atamak."
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      priority: "low",
      title: "Telemetriye hazır",
      detail: "Senaryo, bir sanal veri akışının veya ileride ESP32/smart-plug ölçümünün simülasyon kanallarından birinin yerine geçmesi için yeterince stabil."
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
  return `${site.label} bu senaryoda pik talebi %${metrics.peakReductionPct} (${metrics.peakEventReductionKw.toLocaleString("tr-TR")} kW) azaltabilir ve yaklaşık ${metrics.monthlySavingsTl.toLocaleString("tr-TR")} TL/ay tasarruf sağlayabilir.`;
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
  const input: FlexgridScenarioInput =
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
