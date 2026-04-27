import { NextResponse } from "next/server";
import { buildCsv } from "@/src/lib/utils/csv";
import {
  buildFlexgridScenario,
  clampFlexgridEvCount,
  defaultFlexgridScenario,
  flexgridBatteryOptions,
  flexgridSiteProfiles,
  flexgridStrategyOptions,
  flexgridTariffOptions,
  isFlexgridBatteryMode,
  isFlexgridSiteType,
  isFlexgridStrategy,
  isFlexgridTariffPlan
} from "@/src/lib/energy/flexgrid";

function getScenarioParams(url: URL) {
  const siteTypeParam = url.searchParams.get("siteType");
  const strategyParam = url.searchParams.get("strategy");
  const batteryModeParam = url.searchParams.get("batteryMode");
  const tariffPlanParam = url.searchParams.get("tariffPlan");
  const evCountParam = Number(url.searchParams.get("evCount"));

  return {
    siteType: isFlexgridSiteType(siteTypeParam) ? siteTypeParam : defaultFlexgridScenario.siteType,
    strategy: isFlexgridStrategy(strategyParam) ? strategyParam : defaultFlexgridScenario.strategy,
    batteryMode: isFlexgridBatteryMode(batteryModeParam)
      ? batteryModeParam
      : defaultFlexgridScenario.batteryMode,
    tariffPlan: isFlexgridTariffPlan(tariffPlanParam)
      ? tariffPlanParam
      : defaultFlexgridScenario.tariffPlan,
    evCount: clampFlexgridEvCount(evCountParam)
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const format = url.searchParams.get("format");
  const params = getScenarioParams(url);
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
      ["baselinePeakKw", scenario.metrics.baselinePeakKw],
      ["peakReductionPct", scenario.metrics.peakReductionPct],
      ["dailyEnergyKwh", scenario.metrics.dailyEnergyKwh],
      ["monthlyCostTl", scenario.metrics.monthlyCostTl],
      ["monthlySavingsTl", scenario.metrics.monthlySavingsTl],
      ["carbonKgDaily", scenario.metrics.carbonKgDaily],
      ["carbonReductionPct", scenario.metrics.carbonReductionPct],
      ["readinessScore", scenario.metrics.readinessScore],
      ["transformerStress", scenario.metrics.transformerStress],
      ["summary", scenario.summary],
      [],
      ["hour", "totalLoadKw", "baselineLoadKw", "buildingLoadKw", "thermalLoadKw", "evLoadKw", "batteryKw", "flexibleLoadKw", "tariffTlPerKwh", "carbonKg"],
      ...scenario.chart.map((item) => [
        item.hour,
        item.totalLoadKw,
        item.baselineLoadKw,
        item.buildingLoadKw,
        item.thermalLoadKw,
        item.evLoadKw,
        item.batteryKw,
        item.flexibleLoadKw,
        item.tariffTlPerKwh,
        item.carbonKg
      ])
    ];

    return new Response(buildCsv(["metric", "value", "extra_1", "extra_2", "extra_3", "extra_4", "extra_5", "extra_6", "extra_7", "extra_8"], rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="flexgrid-tr-${params.siteType}-${params.strategy}.csv"`
      }
    });
  }

  return NextResponse.json(scenario);
}
