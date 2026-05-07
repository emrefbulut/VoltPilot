import type { FlexgridGridSignal } from "@/src/lib/energy/grid-signal";
import type { FlexgridScenario } from "@/src/lib/energy/flexgrid";
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

function priorityLabel(priority: string) {
  return priority.toUpperCase();
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
        `- Confidence score: ${telemetry.metrics.confidenceScore}/100 (${telemetry.metrics.status})`,
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
        `- Status: ${gridSignal.status}`,
        `- Date: ${gridSignal.date}`,
        `- Peak national load: ${formatNumber(gridSignal.summary.peakLoadMw, " MW")} at ${gridSignal.summary.peakHour}`,
        `- Average price: ${formatNumber(gridSignal.summary.averagePriceTlMwh, " TL/MWh")}`,
        `- Average carbon intensity: ${formatNumber(gridSignal.summary.carbonIntensityGco2Kwh, " gCO2/kWh")}`,
        `- Dispatch advice: ${gridSignal.summary.dispatchAdvice}`,
        ""
      ].join("\n")
    : "";

  return [
    "# FlexGrid-TR Engineering Report",
    "",
    `Generated at: ${generatedAt}`,
    "",
    "## Scenario",
    "",
    `- Facility: ${scenario.site.label}`,
    `- Strategy: ${scenario.input.strategy}`,
    `- Battery mode: ${scenario.input.batteryMode}`,
    `- Tariff plan: ${scenario.input.tariffPlan}`,
    `- Concurrent EV sessions: ${scenario.input.evCount}`,
    `- Analysis horizon: ${horizon}`,
    "",
    "## Executive Summary",
    "",
    scenario.summary,
    "",
    "## Key Engineering Metrics",
    "",
    `- Peak demand: ${formatNumber(scenario.metrics.peakKw, " kW")}`,
    `- Peak apparent power: ${formatNumber(scenario.metrics.peakKva, " kVA")}`,
    `- Transformer limit: ${formatNumber(scenario.metrics.transformerLimitKva, " kVA")}`,
    `- Transformer stress: ${scenario.metrics.transformerStress}/100`,
    `- Maximum current: ${formatNumber(scenario.metrics.maxCurrentA, " A")}`,
    `- Power factor: ${scenario.metrics.powerFactor.toFixed(2)}`,
    `- Overload hours: ${formatNumber(scenario.metrics.overloadHours, " h")}`,
    `- Peak event reduction: ${formatNumber(scenario.metrics.peakEventReductionKw, " kW")} (${formatPct(scenario.metrics.peakReductionPct)})`,
    `- Analysis energy: ${formatNumber(scenario.metrics.analysisEnergyKwh, " kWh")}`,
    `- Average daily energy: ${formatNumber(scenario.metrics.dailyEnergyKwh, " kWh/day")}`,
    `- Analysis cost: ${formatTl(scenario.metrics.analysisCostTl)}`,
    `- Projected monthly savings: ${formatTl(scenario.metrics.monthlySavingsTl)}`,
    `- Daily carbon impact: ${formatNumber(scenario.metrics.carbonKgDaily, " kgCO2/day")}`,
    `- Engineering confidence: ${scenario.metrics.engineeringConfidence}/100`,
    "",
    "## Battery and EV Assumptions",
    "",
    `- Battery charge: ${formatNumber(scenario.metrics.batteryChargeKwh, " kWh")}`,
    `- Battery discharge: ${formatNumber(scenario.metrics.batteryDischargeKwh, " kWh")}`,
    `- Battery efficiency loss: ${formatNumber(scenario.metrics.batteryEfficiencyLossKwh, " kWh")}`,
    `- Battery SoC minimum/final: ${scenario.metrics.batterySocMinPct}% / ${scenario.metrics.batterySocFinalPct}%`,
    `- EV energy represented: ${formatNumber(scenario.metrics.evEnergyKwh, " kWh")}`,
    "",
    gridSection,
    telemetrySection,
    "## Recommendations",
    "",
    ...scenario.recommendations.map((recommendation) => `- ${priorityLabel(recommendation.priority)}: ${recommendation.title} - ${recommendation.detail}`),
    "",
    "## Model Boundaries",
    "",
    "- This is not a power-flow solver.",
    "- kVA and current are estimated from site-level power factor and nominal service voltage.",
    "- Virtual grid data is deterministic unless a live provider adapter is configured.",
    "- Telemetry confidence improves when measured samples replace mock samples.",
    ""
  ].join("\n");
}
