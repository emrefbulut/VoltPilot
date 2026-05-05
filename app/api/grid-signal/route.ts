import { NextResponse } from "next/server";
import {
  buildDemoGridSignal,
  flexgridGridProviders,
  isFlexgridGridDate,
  isFlexgridGridProvider,
  normalizeGridSignalInput
} from "@/src/lib/energy/grid-signal";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const providerParam = url.searchParams.get("provider");
  const dateParam = url.searchParams.get("date");

  if (providerParam !== null && !isFlexgridGridProvider(providerParam)) {
    return NextResponse.json(
      {
        error: "INVALID_GRID_PROVIDER",
        message: "provider demo, epias, entsoe, electricity-maps veya ember olmalı.",
        allowedProviders: flexgridGridProviders.map((provider) => provider.id)
      },
      { status: 400 }
    );
  }

  if (dateParam !== null && !isFlexgridGridDate(dateParam)) {
    return NextResponse.json(
      {
        error: "INVALID_GRID_DATE",
        message: "date YYYY-MM-DD formatında olmalı."
      },
      { status: 400 }
    );
  }

  const input = normalizeGridSignalInput({
    provider: providerParam,
    date: dateParam
  });
  const signal = buildDemoGridSignal(input);

  return NextResponse.json({
    ...signal,
    providers: flexgridGridProviders
  });
}
