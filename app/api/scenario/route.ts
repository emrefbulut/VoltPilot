import { NextResponse } from "next/server";
import { buildCsv } from "@/src/lib/utils/csv";
import {
  buildFlexgridScenario,
  clampFlexgridEvCount,
  defaultFlexgridScenario,
  flexgridBatteryOptions,
  flexgridSiteProfiles,
  flexgridStrategyOptions,
  isFlexgridBatteryMode,
  isFlexgridSiteType,
  isFlexgridStrategy
} from "@/src/lib/energy/flexgrid";

function getScenarioParams(url: URL) {
  const siteTypeParam = url.searchParams.get("siteType");
  const strategyParam = url.searchParams.get("strategy");
  const batteryModeParam = url.searchParams.get("batteryMode");
  const evCountParam = Number(url.searchParams.get("evCount"));

  return {
    siteType: isFlexgridSiteType(siteTypeParam) ? siteTypeParam : defaultFlexgridScenario.siteType,
    strategy: isFlexgridStrategy(strategyParam) ? strategyParam : defaultFlexgridScenario.strategy,
    batteryMode: isFlexgridBatteryMode(batteryModeParam)
      ? batteryModeParam
      : defaultFlexgridScenario.batteryMode,
    evCount: clampFlexgridEvCount(evCountParam)
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const format = url.searchParams.get("format");
  const params = getScenarioParams(url);
  const scenario = buildFlexgridScenario(
    params.siteType,
    params.strategy,
    params.batteryMode,
    params.evCount
  );

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
      ["evCount", params.evCount],
      ["peakKw", scenario.metrics.peakKw],
      ["monthlyCostTl", scenario.metrics.monthlyCostTl],
      ["peakReductionPct", scenario.metrics.peakReductionPct],
      ["shiftedEnergyPct", scenario.metrics.shiftedEnergyPct],
      ["readinessScore", scenario.metrics.readinessScore],
      ["transformerStress", scenario.metrics.transformerStress],
      [],
      ["hour", "totalLoadKw", "flexibleLoadKw", "baselineBandKw"],
      ...scenario.chart.map((item) => [
        item.hour,
        item.totalLoadKw,
        item.flexibleLoadKw,
        item.baselineBandKw
      ])
    ];

    return new Response(buildCsv(["metric", "value", "extra_1", "extra_2"], rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="flexgrid-tr-${params.siteType}-${params.strategy}.csv"`
      }
    });
  }

  return NextResponse.json({
    scenario,
    params
  });
}
