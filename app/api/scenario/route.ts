import { NextResponse } from "next/server";
import { buildCsv } from "@/src/lib/utils/csv";
import {
  buildFlexgridScenario,
  flexgridBatteryOptions,
  flexgridSiteProfiles,
  flexgridStrategyOptions,
  flexgridTariffOptions
} from "@/src/lib/energy/flexgrid";
import { parseScenarioSearchParams } from "@/src/lib/energy/scenario-state";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const format = url.searchParams.get("format");
  const params = parseScenarioSearchParams(url.searchParams);
  const scenario = buildFlexgridScenario(params);

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
      ["peakKw", scenario.metrics.peakKw],
      ["peakKva", scenario.metrics.peakKva],
      ["baselinePeakKw", scenario.metrics.baselinePeakKw],
      ["baselinePeakKva", scenario.metrics.baselinePeakKva],
      ["peakReductionPct", scenario.metrics.peakReductionPct],
      ["peakEventReductionKw", scenario.metrics.peakEventReductionKw],
      ["dailyEnergyKwh", scenario.metrics.dailyEnergyKwh],
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
      ["summary", scenario.summary],
      [],
      ["hour", "totalLoadKw", "totalKva", "baselineLoadKw", "buildingLoadKw", "thermalLoadKw", "evLoadKw", "batteryKw", "batterySocPct", "estimatedCurrentA", "transformerLoadingPct", "flexibleLoadKw", "tariffTlPerKwh", "carbonKg"],
      ...scenario.chart.map((item) => [
        item.hour,
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

    return new Response(buildCsv(["metric", "value", "extra_1", "extra_2", "extra_3", "extra_4", "extra_5", "extra_6", "extra_7", "extra_8", "extra_9", "extra_10", "extra_11", "extra_12"], rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="flexgrid-tr-${params.siteType}-${params.strategy}.csv"`
      }
    });
  }

  return NextResponse.json(scenario);
}
