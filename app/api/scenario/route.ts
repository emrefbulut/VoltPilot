import { NextResponse } from "next/server";
import { buildCsv } from "@/src/lib/utils/csv";
import {
  buildFlexgridScenario,
  flexgridBatteryOptions,
  flexgridSiteProfiles,
  flexgridStrategyOptions,
  flexgridTariffOptions
} from "@/src/lib/energy/flexgrid";
import { buildDemoGridSignal } from "@/src/lib/energy/grid-signal";
import { parseScenarioSearchParams } from "@/src/lib/energy/scenario-state";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const format = url.searchParams.get("format");
  const params = parseScenarioSearchParams(url.searchParams);
  const scenario = buildFlexgridScenario(params);
  const includeGridSignal = url.searchParams.has("gridProvider") || url.searchParams.has("gridDate");
  const gridSignal = includeGridSignal
    ? buildDemoGridSignal({
        provider: url.searchParams.get("gridProvider"),
        date: url.searchParams.get("gridDate")
      })
    : null;

  if (format === "csv") {
    const rows: Array<Array<unknown>> = [
      ["siteType", params.siteType],
      ["siteLabel", flexgridSiteProfiles[params.siteType].label],
      ["strategy", params.strategy],
      [
        "strategyLabel",
        flexgridStrategyOptions.find((option) => option.id === params.strategy)?.label ?? params.strategy
      ],
      ["batteryMode", params.batteryMode],
      [
        "batteryLabel",
        flexgridBatteryOptions.find((option) => option.id === params.batteryMode)?.label ?? params.batteryMode
      ],
      ["tariffPlan", params.tariffPlan],
      [
        "tariffLabel",
        flexgridTariffOptions.find((option) => option.id === params.tariffPlan)?.label ?? params.tariffPlan
      ],
      ["evCount", params.evCount],
      ["analysisDays", params.analysisDays ?? 1],
      ["peakKw", scenario.metrics.peakKw],
      ["peakKva", scenario.metrics.peakKva],
      ["baselinePeakKw", scenario.metrics.baselinePeakKw],
      ["baselinePeakKva", scenario.metrics.baselinePeakKva],
      ["peakReductionPct", scenario.metrics.peakReductionPct],
      ["peakEventReductionKw", scenario.metrics.peakEventReductionKw],
      ["dailyEnergyKwh", scenario.metrics.dailyEnergyKwh],
      ["analysisEnergyKwh", scenario.metrics.analysisEnergyKwh],
      ["analysisCostTl", scenario.metrics.analysisCostTl],
      ["monthlyCostTl", scenario.metrics.monthlyCostTl],
      ["monthlySavingsTl", scenario.metrics.monthlySavingsTl],
      ["carbonKgDaily", scenario.metrics.carbonKgDaily],
      ["carbonReductionPct", scenario.metrics.carbonReductionPct],
      ["readinessScore", scenario.metrics.readinessScore],
      ["engineeringConfidence", scenario.metrics.engineeringConfidence],
      ["transformerStress", scenario.metrics.transformerStress],
      ["transformerLimitKva", scenario.metrics.transformerLimitKva],
      ["maxCurrentA", scenario.metrics.maxCurrentA],
      ["powerFactor", scenario.metrics.powerFactor],
      ["overloadHours", scenario.metrics.overloadHours],
      ["batterySocMinPct", scenario.metrics.batterySocMinPct],
      ["batterySocFinalPct", scenario.metrics.batterySocFinalPct],
      ["readinessStatus", scenario.readinessPassport.status],
      ["passportScore", scenario.readinessPassport.passportScore],
      ["maxSafeEvSessions", scenario.readinessPassport.maxSafeEvSessions],
      ["firstRiskEvSessions", scenario.readinessPassport.firstRiskEvSessions ?? ""],
      ["evHeadroom", scenario.readinessPassport.evHeadroom],
      ["recommendedTransformerKva", scenario.readinessPassport.recommendedTransformerKva],
      ["storageBridgeKwh", scenario.readinessPassport.storageBridgeKwh],
      ["readinessDecision", scenario.readinessPassport.decisionSummary],
      ...(gridSignal
        ? [
            ["gridProvider", gridSignal.provider],
            ["gridStatus", gridSignal.status],
            ["gridDate", gridSignal.date],
            ["gridPeakLoadMw", gridSignal.summary.peakLoadMw],
            ["gridPeakHour", gridSignal.summary.peakHour],
            ["gridAveragePriceTlMwh", gridSignal.summary.averagePriceTlMwh],
            ["gridCarbonIntensityGco2Kwh", gridSignal.summary.carbonIntensityGco2Kwh]
          ]
        : []),
      ["summary", scenario.summary],
      [],
      ["hour", "hourIndex", "dayIndex", "hourOfDay", "totalLoadKw", "totalKva", "baselineLoadKw", "buildingLoadKw", "thermalLoadKw", "evLoadKw", "batteryKw", "batterySocPct", "estimatedCurrentA", "transformerLoadingPct", "flexibleLoadKw", "tariffTlPerKwh", "carbonKg"],
      ...scenario.chart.map((item) => [
        item.hour,
        item.hourIndex,
        item.dayIndex,
        item.hourOfDay,
        item.totalLoadKw,
        item.totalKva,
        item.baselineLoadKw,
        item.buildingLoadKw,
        item.thermalLoadKw,
        item.evLoadKw,
        item.batteryKw,
        item.batterySocPct,
        item.estimatedCurrentA,
        item.transformerLoadingPct,
        item.flexibleLoadKw,
        item.tariffTlPerKwh,
        item.carbonKg
      ])
    ];

    return new Response(buildCsv(["metric", "value", "extra_1", "extra_2", "extra_3", "extra_4", "extra_5", "extra_6", "extra_7", "extra_8", "extra_9", "extra_10", "extra_11", "extra_12", "extra_13", "extra_14", "extra_15"], rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="voltpilot-${params.siteType}-${params.strategy}.csv"`
      }
    });
  }

  return NextResponse.json(gridSignal ? { ...scenario, gridSignal } : scenario);
}
