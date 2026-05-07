import { buildFlexgridScenario } from "@/src/lib/energy/flexgrid";
import { buildDemoGridSignal } from "@/src/lib/energy/grid-signal";
import { buildEngineeringReportMarkdown } from "@/src/lib/energy/report";
import { generateMockTelemetrySamples, compareTelemetrySamples } from "@/src/lib/energy/telemetry";
import { parseScenarioSearchParams } from "@/src/lib/energy/scenario-state";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = parseScenarioSearchParams(url.searchParams);
  const scenario = buildFlexgridScenario(params);
  const includeGridSignal = url.searchParams.has("gridProvider") || url.searchParams.has("gridDate");
  const gridSignal = includeGridSignal
    ? buildDemoGridSignal({
        provider: url.searchParams.get("gridProvider"),
        date: url.searchParams.get("gridDate")
      })
    : null;
  const telemetry = compareTelemetrySamples(scenario, generateMockTelemetrySamples(scenario.input));
  const report = buildEngineeringReportMarkdown({
    scenario,
    telemetry,
    gridSignal
  });

  return new Response(report, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="flexgrid-tr-${params.siteType}-${params.strategy}-report.md"`
    }
  });
}
