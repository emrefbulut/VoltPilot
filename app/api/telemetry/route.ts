import { NextResponse } from "next/server";
import { buildFlexgridScenario } from "@/src/lib/energy/flexgrid";
import { compareTelemetrySamples, parseTelemetryRequestBody } from "@/src/lib/energy/telemetry";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Invalid JSON body",
        errors: ["request body must be valid JSON"]
      },
      { status: 400 }
    );
  }

  const parsed = parseTelemetryRequestBody(body);
  if (!parsed.ok) {
    return NextResponse.json(
      {
        error: "Invalid telemetry payload",
        errors: parsed.errors
      },
      { status: 400 }
    );
  }

  const scenario = buildFlexgridScenario(parsed.scenarioInput);
  const comparison = compareTelemetrySamples(scenario, parsed.samples);

  return NextResponse.json({
    mode: parsed.mode,
    ...comparison
  });
}
