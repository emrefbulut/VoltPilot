import type { FlexgridGridSignal } from "@/src/lib/energy/grid-signal";
import {
  flexgridBatteryOptions,
  flexgridStrategyOptions,
  flexgridTariffOptions,
  type FlexgridScenario
} from "@/src/lib/energy/flexgrid";
import type { FlexgridTelemetryComparison } from "@/src/lib/energy/telemetry";

function formatNumber(value: number, suffix = "") {
  return `${value.toLocaleString("en-US")}${suffix}`;
}

function formatTl(value: number) {
  return `${value.toLocaleString("en-US")} TL`;
}

function formatPct(value: number) {
  return `${value.toLocaleString("en-US")}%`;
}

function labelFor<T extends string>(options: Array<{ id: T; label: string }>, id: T) {
  return options.find((option) => option.id === id)?.label ?? id;
}

function priorityLabel(priority: string) {
  if (priority === "high") return "High";
  if (priority === "medium") return "Medium";
  if (priority === "low") return "Low";

  return priority;
}

function telemetryStatusLabel(status: string) {
  if (status === "excellent") return "Excellent";
  if (status === "good") return "Good";
  if (status === "watch") return "Watch";
  if (status === "action") return "Action";

  return status;
}

function gridStatusLabel(status: FlexgridGridSignal["status"]) {
  if (status === "live") return "Live";
  if (status === "fallback") return "Source model";

  return "Local data";
}

function readinessStatusLabel(status: FlexgridScenario["readinessPassport"]["status"]) {
  if (status === "ready") return "Ready";
  if (status === "managed") return "Managed rollout";

  return "Upgrade required";
}

export function buildEngineeringReportMarkdown({
  scenario,
  telemetry,
  gridSignal,
  generatedAt = new Date().toISOString()
}: {
  scenario: FlexgridScenario;
  telemetry?: FlexgridTelemetryComparison | null;
  gridSignal?: FlexgridGridSignal | null;
  generatedAt?: string;
}) {
  const horizon = scenario.metrics.analysisDays === 1 ? "24 hours" : `${scenario.metrics.analysisDays} days`;
  const telemetrySection = telemetry
    ? [
        "## Telemetry Validation",
        "",
        `- Sample count: ${telemetry.metrics.sampleCount}`,
        `- Confidence score: ${telemetry.metrics.confidenceScore}/100 (${telemetryStatusLabel(telemetry.metrics.status)})`,
        `- MAE: ${formatNumber(telemetry.metrics.maeKw, " kW")}`,
        `- MAPE: ${formatPct(telemetry.metrics.mapePct)}`,
        `- Peak error: ${formatNumber(telemetry.metrics.peakErrorKw, " kW")}`,
        `- Energy delta: ${formatNumber(telemetry.metrics.energyDeltaKwh, " kWh")}`,
        ""
      ].join("\n")
    : "";
  const gridSection = gridSignal
    ? [
        "## Grid Signal",
        "",
        `- Provider: ${gridSignal.sourceLabel}`,
        `- Status: ${gridStatusLabel(gridSignal.status)}`,
        `- Date: ${gridSignal.date}`,
        `- Peak national load: ${formatNumber(gridSignal.summary.peakLoadMw, " MW")} at ${gridSignal.summary.peakHour}`,
        `- Average price: ${formatNumber(gridSignal.summary.averagePriceTlMwh, " TL/MWh")}`,
        `- Average carbon intensity: ${formatNumber(gridSignal.summary.carbonIntensityGco2Kwh, " gCO2/kWh")}`,
        `- Dispatch advice: ${gridSignal.summary.dispatchAdvice}`,
        ""
      ].join("\n")
    : "";

  return [
    "# VoltPilot Engineering Report",
    "",
    `Generated at: ${generatedAt}`,
    "",
    "## Scenario",
    "",
    `- Facility: ${scenario.site.label}`,
    `- Strategy: ${labelFor(flexgridStrategyOptions, scenario.input.strategy)}`,
    `- Battery mode: ${labelFor(flexgridBatteryOptions, scenario.input.batteryMode)}`,
    `- Tariff: ${labelFor(flexgridTariffOptions, scenario.input.tariffPlan)}`,
    `- Concurrent EV sessions: ${scenario.input.evCount}`,
    `- Analysis horizon: ${horizon}`,
    "",
    "## Executive Summary",
    "",
    scenario.summary,
    "",
    "## Readiness Passport",
    "",
    `- Decision status: ${readinessStatusLabel(scenario.readinessPassport.status)}`,
    `- Passport score: ${scenario.readinessPassport.passportScore}/100`,
    `- Max safe EV sessions: ${scenario.readinessPassport.maxSafeEvSessions}`,
    `- Requested EV sessions: ${scenario.readinessPassport.requestedEvSessions}`,
    `- EV headroom: ${scenario.readinessPassport.evHeadroom}`,
    `- First risk EV session: ${scenario.readinessPassport.firstRiskEvSessions ?? "Not reached in evaluated range"}`,
    `- Stress at requested plan: ${formatPct(scenario.readinessPassport.stressAtRequestedPct)}`,
    `- Stress at max safe EV count: ${formatPct(scenario.readinessPassport.stressAtMaxSafePct)}`,
    `- Next-EV stress estimate: ${formatPct(scenario.readinessPassport.nextEvStressPct)}`,
    `- Recommended transformer rating: ${formatNumber(scenario.readinessPassport.recommendedTransformerKva, " kVA")}`,
    `- Storage bridge estimate: ${formatNumber(scenario.readinessPassport.storageBridgeKwh, " kWh")}`,
    `- Limiting factor: ${scenario.readinessPassport.limitingFactor}`,
    `- Charger policy: ${scenario.readinessPassport.chargerPolicy}`,
    `- Next step: ${scenario.readinessPassport.recommendedNextStep}`,
    "",
    "## Core Engineering Metrics",
    "",
    `- Peak demand: ${formatNumber(scenario.metrics.peakKw, " kW")}`,
    `- Peak apparent power: ${formatNumber(scenario.metrics.peakKva, " kVA")}`,
    `- Transformer limit: ${formatNumber(scenario.metrics.transformerLimitKva, " kVA")}`,
    `- Transformer stress: ${scenario.metrics.transformerStress}/100`,
    `- Maximum current: ${formatNumber(scenario.metrics.maxCurrentA, " A")}`,
    `- Power factor: ${scenario.metrics.powerFactor.toFixed(2)}`,
    `- Overload hours: ${formatNumber(scenario.metrics.overloadHours, " hours")}`,
    `- Peak reduction: ${formatNumber(scenario.metrics.peakEventReductionKw, " kW")} (${formatPct(scenario.metrics.peakReductionPct)})`,
    `- Analysis energy: ${formatNumber(scenario.metrics.analysisEnergyKwh, " kWh")}`,
    `- Average daily energy: ${formatNumber(scenario.metrics.dailyEnergyKwh, " kWh/day")}`,
    `- Analysis cost: ${formatTl(scenario.metrics.analysisCostTl)}`,
    `- Monthly savings projection: ${formatTl(scenario.metrics.monthlySavingsTl)}`,
    `- Daily carbon impact: ${formatNumber(scenario.metrics.carbonKgDaily, " kgCO2/day")}`,
    `- Engineering confidence: ${scenario.metrics.engineeringConfidence}/100`,
    "",
    "## Battery and EV Assumptions",
    "",
    `- Battery charge: ${formatNumber(scenario.metrics.batteryChargeKwh, " kWh")}`,
    `- Battery discharge: ${formatNumber(scenario.metrics.batteryDischargeKwh, " kWh")}`,
    `- Battery efficiency loss: ${formatNumber(scenario.metrics.batteryEfficiencyLossKwh, " kWh")}`,
    `- Battery SoC minimum/final: ${scenario.metrics.batterySocMinPct}% / ${scenario.metrics.batterySocFinalPct}%`,
    `- Represented EV energy: ${formatNumber(scenario.metrics.evEnergyKwh, " kWh")}`,
    "",
    gridSection,
    telemetrySection,
    "## Recommendations",
    "",
    ...scenario.recommendations.map(
      (recommendation) => `- ${priorityLabel(recommendation.priority)}: ${recommendation.title} - ${recommendation.detail}`
    ),
    "",
    "## Model Limits",
    "",
    "- This report is not a power-flow solver.",
    "- kVA and current values are estimated from facility power factor and nominal service voltage.",
    "- The grid signal is produced from the selected data provider's daily profile.",
    "- Telemetry confidence is calculated from measured sample count and model fit.",
    ""
  ].join("\n");
}
