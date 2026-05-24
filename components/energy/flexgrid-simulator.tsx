"use client";

import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  Activity,
  ArrowRight,
  BatteryCharging,
  BrainCircuit,
  CalendarDays,
  DatabaseZap,
  Download,
  FileText,
  FileJson,
  Gauge,
  Globe2,
  Leaf,
  Link2,
  LineChart,
  PlugZap,
  RadioTower,
  RotateCcw,
  Route,
  Save,
  ShieldAlert,
  SlidersHorizontal,
  Trash2,
  TrendingDown,
  Upload,
  Zap,
  type LucideIcon
} from "lucide-react";
import { VoltPilotLogo } from "@/components/brand/volt-pilot-logo";
import { Button } from "@/components/ui/button";
import {
  buildFlexgridScenario,
  clampFlexgridEvCount,
  defaultFlexgridScenario,
  flexgridAnalysisOptions,
  flexgridBatteryOptions,
  flexgridSiteProfiles,
  flexgridStrategyOptions,
  flexgridTariffOptions,
  type FlexgridAssetContribution,
  type FlexgridAnalysisDays,
  type FlexgridBatteryMode,
  type FlexgridScenario,
  type FlexgridScenarioInput,
  type FlexgridSiteType,
  type FlexgridStrategy,
  type FlexgridTariffPlan
} from "@/src/lib/energy/flexgrid";
import {
  createScenarioSearchParams,
  FLEXGRID_SCENARIO_STORAGE_KEY,
  flexgridScenarioPresets,
  parseScenarioInput,
  parseScenarioSearchParams,
  type SavedFlexgridScenario
} from "@/src/lib/energy/scenario-state";
import {
  compareTelemetrySamples,
  generateMockTelemetrySamples,
  parseTelemetryCsv,
  type FlexgridTelemetrySample,
  type FlexgridTelemetryComparison
} from "@/src/lib/energy/telemetry";
import {
  buildDemoGridSignal,
  flexgridGridProviders,
  isFlexgridGridDate,
  isFlexgridGridProvider,
  type FlexgridGridProvider,
  type FlexgridGridSignal
} from "@/src/lib/energy/grid-signal";
import { buildEngineeringReportMarkdown } from "@/src/lib/energy/report";

type SelectorOption<T extends string> = {
  id: T;
  label: string;
  description?: string;
};

const siteOptions: SelectorOption<FlexgridSiteType>[] = Object.entries(flexgridSiteProfiles).map(([id, profile]) => ({
  id: id as FlexgridSiteType,
  label: profile.shortLabel,
  description: `${profile.transformerLimitKva} kVA`
}));

const batteryOptions: SelectorOption<FlexgridBatteryMode>[] = flexgridBatteryOptions.map((option) => ({
  id: option.id,
  label: option.label,
  description: option.capacityKwh > 0 ? `${option.capacityKwh} kWh / ${option.maxPowerKw} kW` : "Software only"
}));

const navItems = [
  { href: "#cockpit", label: "Cockpit" },
  { href: "#architecture", label: "Scope" },
  { href: "#reports", label: "Reporting" }
];

const analysisOptions: SelectorOption<string>[] = flexgridAnalysisOptions.map((option) => ({
  id: String(option.id),
  label: option.label,
  description: option.description
}));

const gridProviderOptions: SelectorOption<FlexgridGridProvider>[] = flexgridGridProviders.map((provider) => ({
  id: provider.id,
  label: provider.label,
  description: provider.requiresCredential ? "Source metadata registered" : "Keyless data"
}));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readSavedScenarios(): SavedFlexgridScenario[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(FLEXGRID_SCENARIO_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.flatMap((item): SavedFlexgridScenario[] => {
      if (!isRecord(item) || typeof item.id !== "string" || typeof item.label !== "string" || typeof item.createdAt !== "string") {
        return [];
      }

      const scenarioResult = parseScenarioInput(item.input);
      if (!scenarioResult.ok) {
        return [];
      }

      return [
        {
          id: item.id,
          label: item.label,
          createdAt: item.createdAt,
          input: scenarioResult.input
        }
      ];
    });
  } catch {
    return [];
  }
}

function writeSavedScenarios(scenarios: SavedFlexgridScenario[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(FLEXGRID_SCENARIO_STORAGE_KEY, JSON.stringify(scenarios.slice(0, 8)));
  }
}

function formatTl(value: number) {
  return `${value.toLocaleString("en-US")} TL`;
}

function formatNumber(value: number, suffix = "") {
  return `${value.toLocaleString("en-US")}${suffix}`;
}

function formatPct(value: number) {
  return `${value.toLocaleString("en-US")}%`;
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function downloadTextFile(filename: string, content: string, mimeType = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function buildTelemetryCsvTemplate(samples: FlexgridTelemetrySample[]) {
  return [
    "hourIndex,measuredKw,voltageV,currentA,powerFactor",
    ...samples.map((sample) =>
      [
        sample.hourIndex,
        sample.measuredKw,
        sample.voltageV ?? "",
        sample.currentA ?? "",
        sample.powerFactor ?? ""
      ].join(",")
    )
  ].join("\n");
}

function gridStatusLabel(status: FlexgridGridSignal["status"]) {
  if (status === "live") {
    return "Live";
  }

  if (status === "fallback") {
    return "Source model";
  }

  return "Local data";
}

function demandRiskLabel(risk: FlexgridGridSignal["points"][number]["demandRisk"]) {
  if (risk === "high") {
    return "High";
  }

  if (risk === "medium") {
    return "Medium";
  }

  return "Low";
}

function SegmentedSelector<T extends string>({
  label,
  value,
  options,
  columns = "three",
  onChange
}: {
  label: string;
  value: T;
  options: SelectorOption<T>[];
  columns?: "two" | "three";
  onChange: (value: T) => void;
}) {
  const gridClass = columns === "two" ? "sm:grid-cols-2" : "sm:grid-cols-3";

  return (
    <section className="min-w-0 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-950">{label}</p>
        <span className="text-xs font-medium uppercase text-slate-400">{value}</span>
      </div>
      <div className={`grid min-w-0 gap-2 ${gridClass}`}>
        {options.map((option) => {
          const active = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              className={[
                "min-h-[4.25rem] min-w-0 rounded-lg border px-3 py-2 text-left text-[13px] transition duration-200",
                active
                  ? "border-slate-950 bg-slate-950 text-white shadow-[0_12px_30px_rgba(15,23,42,0.16)]"
                  : "border-slate-200 bg-white text-slate-700 hover:border-teal-500 hover:bg-teal-50/70"
              ].join(" ")}
              aria-pressed={active}
              onClick={() => startTransition(() => onChange(option.id))}
            >
              <span className="block font-semibold leading-5">{option.label}</span>
              {option.description ? (
                <span className={active ? "mt-1 block text-xs text-slate-300" : "mt-1 block text-xs text-slate-500"}>
                  {option.description}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function MetricTile({
  icon: Icon,
  label,
  value,
  helper,
  tone = "neutral"
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  helper: string;
  tone?: "neutral" | "green" | "amber" | "red" | "dark";
}) {
  const toneClass = {
    neutral: "border-slate-200 bg-white text-slate-950",
    green: "border-teal-200 bg-teal-50 text-teal-950",
    amber: "border-amber-200 bg-amber-50 text-amber-950",
    red: "border-rose-200 bg-rose-50 text-rose-950",
    dark: "border-slate-800 bg-slate-950 text-white"
  }[tone];
  const iconClass = {
    neutral: "bg-slate-100 text-slate-700",
    green: "bg-teal-100 text-teal-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-rose-100 text-rose-700",
    dark: "bg-white/10 text-teal-200"
  }[tone];

  return (
    <section className={`min-h-[9.5rem] rounded-lg border p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] ${toneClass}`}>
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-semibold opacity-80">{label}</p>
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-5 text-3xl font-semibold leading-none tracking-normal">{value}</p>
      <p className="mt-3 text-sm leading-5 opacity-70">{helper}</p>
    </section>
  );
}

function AssetRow({ label, valueKw, sharePct, status }: FlexgridAssetContribution) {
  const barClass = status === "support" ? "bg-amber-500" : status === "flexible" ? "bg-teal-600" : "bg-slate-500";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-slate-800">{label}</span>
        <span className="font-medium text-slate-500">{formatNumber(valueKw, " kW")}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${barClass}`} style={{ width: `${Math.min(100, Math.max(3, sharePct))}%` }} />
      </div>
    </div>
  );
}

function StatusPill({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-white">
      <Icon className="h-4 w-4 shrink-0 text-teal-200" aria-hidden="true" />
      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium uppercase text-white/50">{label}</p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function ChartLegend({ items }: { items: { label: string; color: string; dashed?: boolean }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2">
          <span
            className={item.dashed ? "h-px w-5 border-t border-dashed" : "h-2 w-2 rounded-full"}
            style={item.dashed ? { borderColor: item.color } : { backgroundColor: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

type EnergyTooltipPayload = {
  color?: string;
  dataKey?: string | number;
  fill?: string;
  name?: string;
  stroke?: string;
  value?: number | string | null;
};

function formatTooltipValue(value: EnergyTooltipPayload["value"], unit = "") {
  if (typeof value === "number") {
    return `${value.toLocaleString("en-US")}${unit ? ` ${unit}` : ""}`;
  }

  if (typeof value === "string") {
    return `${value}${unit ? ` ${unit}` : ""}`;
  }

  return "-";
}

function EnergyTooltip({
  active,
  label,
  payload,
  units = {}
}: {
  active?: boolean;
  label?: string | number;
  payload?: EnergyTooltipPayload[];
  units?: Record<string, string>;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="min-w-44 rounded-lg border border-slate-200 bg-white/95 p-3 text-sm shadow-[0_18px_50px_rgba(15,23,42,0.16)] backdrop-blur">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <div className="space-y-1.5">
        {payload.map((item) => {
          const key = String(item.dataKey ?? item.name ?? "");
          const color = item.color ?? item.stroke ?? item.fill ?? "#0f172a";

          return (
            <div key={`${key}-${item.name}`} className="flex items-center justify-between gap-5">
              <span className="inline-flex min-w-0 items-center gap-2 text-slate-600">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                <span className="truncate">{item.name ?? key}</span>
              </span>
              <span className="font-semibold text-slate-950">{formatTooltipValue(item.value, units[key])}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GridSignalPanel({
  signal,
  provider,
  date,
  apiHref,
  onProvider,
  onDate
}: {
  signal: FlexgridGridSignal;
  provider: FlexgridGridProvider;
  date: string;
  apiHref: string;
  onProvider: (value: FlexgridGridProvider) => void;
  onDate: (value: string) => void;
}) {
  const riskClass = {
    low: "border-teal-200 bg-teal-50 text-teal-950",
    medium: "border-amber-200 bg-amber-50 text-amber-950",
    high: "border-rose-200 bg-rose-50 text-rose-950"
  };
  const highestRisk = signal.points.some((point) => point.demandRisk === "high")
    ? "high"
    : signal.points.some((point) => point.demandRisk === "medium")
      ? "medium"
      : "low";
  const riskyHours = signal.points.filter((point) => point.demandRisk !== "low").map((point) => point.hour);
  const riskWindow = riskyHours.length > 0 ? `${riskyHours[0]} - ${riskyHours.at(-1)}` : "None";
  const providerMeta = flexgridGridProviders.find((item) => item.id === provider) ?? flexgridGridProviders[0]!;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
            <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
            Grid signal
          </div>
          <h3 className="mt-3 text-2xl font-semibold text-slate-950">Track market, load, and carbon signals on the same decision screen.</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            VoltPilot uses the same data contract for the selected provider; price, national load, carbon intensity, and
            risk window stay readable next to the scenario.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:w-[28rem]">
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Data provider
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-teal-500"
              value={provider}
              onChange={(event) => {
                const nextProvider = event.target.value;
                if (isFlexgridGridProvider(nextProvider)) {
                  startTransition(() => onProvider(nextProvider));
                }
              }}
            >
              {gridProviderOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Date
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-teal-500"
              type="date"
              value={date}
              onChange={(event) => startTransition(() => onDate(event.target.value || todayIsoDate()))}
            />
          </label>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {[
          ["Status", gridStatusLabel(signal.status)],
          ["Peak national load", formatNumber(signal.summary.peakLoadMw, " MW")],
          ["Average price", formatNumber(signal.summary.averagePriceTlMwh, " TL/MWh")],
          ["Renewable share", formatPct(signal.summary.renewableSharePct)],
          ["Carbon intensity", formatNumber(signal.summary.carbonIntensityGco2Kwh, " gCO2/kWh")],
          ["Risk hours", `${signal.summary.highRiskHours} high`]
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-h-[19rem] rounded-lg border border-slate-100 bg-slate-50 p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-semibold text-slate-950">24-hour load, price, and carbon signal</p>
            <ChartLegend
              items={[
                { label: "Load (MW)", color: "#0f766e" },
                { label: "Price (TL/MWh)", color: "#f59e0b" },
                { label: "Carbon", color: "#64748b", dashed: true }
              ]}
            />
          </div>
          <div className="mt-4 h-[15rem]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={signal.points} margin={{ left: -18, right: 10, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="gridLoad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100,116,139,0.22)" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <Tooltip content={<EnergyTooltip units={{ loadMw: "MW", marketPriceTlMwh: "TL/MWh", carbonIntensityGco2Kwh: "gCO2/kWh" }} />} />
                <Area
                  type="monotone"
                  dataKey="loadMw"
                  stroke="#0f766e"
                  strokeWidth={2}
                  fill="url(#gridLoad)"
                  name="Load (MW)"
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="marketPriceTlMwh"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  name="Price"
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="carbonIntensityGco2Kwh"
                  stroke="#64748b"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                  name="Carbon"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <DatabaseZap className="h-4 w-4 text-teal-700" aria-hidden="true" />
              <p className="text-sm font-semibold text-slate-950">Source status</p>
            </div>
            <div className="mt-3 grid gap-2 text-xs">
              {[
                ["Adapter", providerMeta.adapterStatus === "local" ? "Local deterministic" : "Source registered"],
                ["Credential", providerMeta.credentialEnvName ?? "No key required"],
                ["Refresh", providerMeta.refreshCadence],
                ["Granularity", providerMeta.granularity]
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-slate-50 p-3">
                  <p className="font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
                  <p className="mt-1 leading-5 text-slate-700">{value}</p>
                </div>
              ))}
            </div>
            <a
              href={providerMeta.sourceUrl}
              className="mt-3 inline-flex text-xs font-semibold text-teal-700 underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Source documentation
            </a>
          </div>
          <div className={`rounded-lg border p-4 ${riskClass[highestRisk]}`}>
            <p className="text-sm font-semibold">Dispatch advice</p>
            <p className="mt-2 text-sm leading-6 opacity-75">{signal.summary.dispatchAdvice}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold">
              <div className="rounded-lg bg-white/45 px-3 py-2">
                <p className="uppercase opacity-55">Peak hour</p>
                <p className="mt-1 text-sm opacity-90">{signal.summary.peakHour}</p>
              </div>
              <div className="rounded-lg bg-white/45 px-3 py-2">
                <p className="uppercase opacity-55">Risk window</p>
                <p className="mt-1 text-sm opacity-90">{riskWindow}</p>
              </div>
            </div>
            <p className="mt-3 text-xs font-semibold uppercase opacity-60">Risk level: {demandRiskLabel(highestRisk)}</p>
          </div>
          <a
            href={apiHref}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <span>Grid signal JSON</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-950">Integration notes</p>
            <div className="mt-3 space-y-2">
              {signal.integrationNotes.map((note) => (
                <p key={note} className="text-sm leading-6 text-slate-600">
                  {note}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NetworkMap({ scenario }: { scenario: FlexgridScenario }) {
  const stress = Math.min(100, Math.max(0, scenario.metrics.transformerStress));
  const flexibleShare = Math.min(100, Math.max(0, scenario.metrics.shiftedEnergyPct));
  const dispatchState = scenario.metrics.overloadHours > 0 ? "Action required" : scenario.metrics.transformerStress >= 85 ? "Peak under watch" : "Balanced dispatch";

  return (
    <section className="relative overflow-hidden rounded-lg border border-slate-800 bg-[#081113] text-white shadow-[0_24px_70px_rgba(15,23,42,0.24)]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:34px_34px]" />
      <div className="absolute left-0 right-0 top-1/2 h-px powerline" />
      <div className="relative grid gap-5 p-5 md:p-6 xl:grid-cols-[1fr_17rem]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-teal-100">
            <RadioTower className="h-3.5 w-3.5" aria-hidden="true" />
            Live scenario
          </div>
          <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-normal md:text-5xl">
            VoltPilot turns energy flexibility into an actionable decision.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
            EV charging, storage, tariff pressure, transformer loading, and carbon impact are tracked together in one operating cockpit.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <StatusPill icon={Gauge} label="Peak event" value={formatNumber(scenario.metrics.peakEventReductionKw, " kW drop")} />
            <StatusPill icon={BatteryCharging} label="Storage" value={formatNumber(scenario.metrics.batteryDischargeKwh, " kWh/day")} />
            <StatusPill icon={ShieldAlert} label="Transformer" value={`${scenario.metrics.transformerStress}/100`} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-white/70">
            <span className="rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-teal-100">{dispatchState}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1">
              Confidence {scenario.metrics.engineeringConfidence}/100
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1">
              Shareable scenario
            </span>
          </div>
        </div>

        <div className="relative min-h-[15rem] overflow-hidden rounded-lg border border-white/10 bg-white/[0.05] p-4">
          <div className="absolute left-4 top-4 z-10 rounded-full border border-white/10 bg-[#081113]/80 px-3 py-1 text-xs font-semibold text-white/70">
            Dispatch route
          </div>
          <svg className="h-full min-h-[12rem] w-full" viewBox="0 0 270 220" role="img" aria-label="VoltPilot energy flow map">
            <defs>
              <linearGradient id="flow" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.75" />
              </linearGradient>
            </defs>
            <path d="M36 116 C74 68 105 68 136 112 S201 158 236 84" fill="none" stroke="url(#flow)" strokeWidth="4" strokeLinecap="round" />
            <path d="M36 116 H92 L136 112 L184 156 H236" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="6 7" />
            {[
              { x: 36, y: 116, label: "Grid" },
              { x: 92, y: 84, label: "EV" },
              { x: 136, y: 112, label: "EMS" },
              { x: 184, y: 156, label: "BESS" },
              { x: 236, y: 84, label: "Load" }
            ].map((node) => (
              <g key={node.label}>
                <circle cx={node.x} cy={node.y} r="15" fill="#081113" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
                <circle cx={node.x} cy={node.y} r="6" fill={node.label === "BESS" ? "#f59e0b" : "#14b8a6"} />
                <text x={node.x} y={node.y + 31} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="12" fontWeight="700">
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
          <div className="absolute bottom-4 left-4 right-4 grid gap-3">
            <div>
              <div className="flex items-center justify-between text-xs text-white/55">
                <span>Transformer loading</span>
                <span>{stress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-teal-400" style={{ width: `${stress}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs text-white/55">
                <span>Flexible share</span>
                <span>{flexibleShare}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-amber-400" style={{ width: `${flexibleShare}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DecisionPanel({
  scenario,
  exportHref,
  jsonHref,
  reportHref
}: {
  scenario: FlexgridScenario;
  exportHref: string;
  jsonHref: string;
  reportHref: string;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
          <Route className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-950">Decision summary</p>
          <p className="text-xs font-medium uppercase text-slate-400">Current scenario</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{scenario.summary}</p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          ["Readiness", `${scenario.metrics.readinessScore}/100`],
          ["Confidence", `${scenario.metrics.engineeringConfidence}/100`],
          ["Overload", `${scenario.metrics.overloadHours} h`]
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-slate-100 bg-slate-50 px-2 py-3">
            <p className="text-[11px] font-semibold uppercase text-slate-400">{label}</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <Button asChild className="justify-between">
          <a href={exportHref}>
            <span className="inline-flex items-center gap-2">
              <Download className="h-4 w-4" aria-hidden="true" />
              Export CSV
            </span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
        <Button asChild variant="outline" className="justify-between">
          <a href={jsonHref}>
            <span className="inline-flex items-center gap-2">
              <FileJson className="h-4 w-4" aria-hidden="true" />
              JSON
            </span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
        <Button asChild variant="outline" className="justify-between">
          <a href={reportHref}>
            <span className="inline-flex items-center gap-2">
              <FileText className="h-4 w-4" aria-hidden="true" />
              Report
            </span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </section>
  );
}

function ScenarioLibrary({
  savedScenarios,
  onApplyScenario,
  onSaveScenario,
  onDeleteScenario
}: {
  savedScenarios: SavedFlexgridScenario[];
  onApplyScenario: (input: FlexgridScenario["input"]) => void;
  onSaveScenario: () => void;
  onDeleteScenario: (id: string) => void;
}) {
  return (
    <section className="mt-5 space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-950">Scenario library</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Ready presets and browser-saved records.</p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={onSaveScenario}>
          <Save className="h-4 w-4" aria-hidden="true" />
          Save
        </Button>
      </div>

      <div className="grid gap-2">
        {flexgridScenarioPresets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left transition hover:border-teal-500 hover:bg-teal-50"
            onClick={() => onApplyScenario(preset.input)}
          >
            <span className="block text-sm font-semibold text-slate-950">{preset.label}</span>
            <span className="mt-1 block text-xs leading-5 text-slate-500">{preset.description}</span>
          </button>
        ))}
      </div>

      {savedScenarios.length > 0 ? (
        <div className="space-y-2 border-t border-slate-200 pt-4">
          {savedScenarios.map((item) => (
            <div key={item.id} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2">
              <button type="button" className="min-w-0 flex-1 text-left" onClick={() => onApplyScenario(item.input)}>
                <span className="block truncate text-sm font-semibold text-slate-950">{item.label}</span>
                <span className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString("en-US")}</span>
              </button>
              <button
                type="button"
                aria-label={`Delete ${item.label}`}
                className="rounded-md p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                onClick={() => onDeleteScenario(item.id)}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
          Saved scenarios stay in localStorage. No database or account is required.
        </p>
      )}
    </section>
  );
}

function ControlPanel({
  scenario,
  siteType,
  strategy,
  batteryMode,
  tariffPlan,
  evCount,
  analysisDays,
  savedScenarios,
  onSiteType,
  onStrategy,
  onBatteryMode,
  onTariffPlan,
  onEvCount,
  onAnalysisDays,
  onApplyScenario,
  onSaveScenario,
  onDeleteScenario
}: {
  scenario: FlexgridScenario;
  siteType: FlexgridSiteType;
  strategy: FlexgridStrategy;
  batteryMode: FlexgridBatteryMode;
  tariffPlan: FlexgridTariffPlan;
  evCount: number;
  analysisDays: FlexgridAnalysisDays;
  savedScenarios: SavedFlexgridScenario[];
  onSiteType: (value: FlexgridSiteType) => void;
  onStrategy: (value: FlexgridStrategy) => void;
  onBatteryMode: (value: FlexgridBatteryMode) => void;
  onTariffPlan: (value: FlexgridTariffPlan) => void;
  onEvCount: (value: number) => void;
  onAnalysisDays: (value: FlexgridAnalysisDays) => void;
  onApplyScenario: (input: FlexgridScenario["input"]) => void;
  onSaveScenario: () => void;
  onDeleteScenario: (id: string) => void;
}) {
  const selectedStrategy = flexgridStrategyOptions.find((item) => item.id === strategy) ?? flexgridStrategyOptions[0]!;
  const controlSignals = [
    ["Readiness", `${scenario.metrics.readinessScore}/100`],
    ["Confidence", `${scenario.metrics.engineeringConfidence}/100`]
  ];

  return (
    <aside
      id="scenario-controls"
      className="order-2 w-full min-w-0 scroll-mt-24 rounded-lg border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.07)] lg:sticky lg:top-[5.5rem] lg:order-1 lg:h-fit"
    >
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Scenario controls</p>
            <p className="mt-1 text-xl font-semibold text-slate-950">{scenario.site.label}</p>
          </div>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-teal-700 shadow-sm">
            <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{selectedStrategy.description}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {controlSignals.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-[11px] font-semibold uppercase text-slate-400">{label}</p>
              <p className="mt-1 text-lg font-semibold leading-none text-slate-950">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <SegmentedSelector label="Facility" value={siteType} options={siteOptions} columns="two" onChange={onSiteType} />
        <SegmentedSelector label="Control" value={strategy} options={flexgridStrategyOptions} onChange={onStrategy} />
        <SegmentedSelector label="Battery" value={batteryMode} options={batteryOptions} onChange={onBatteryMode} />
        <SegmentedSelector label="Tariff" value={tariffPlan} options={flexgridTariffOptions} onChange={onTariffPlan} />
        <SegmentedSelector
          label="Analysis horizon"
          value={String(analysisDays)}
          options={analysisOptions}
          columns="two"
          onChange={(value) => onAnalysisDays(value === "7" ? 7 : 1)}
        />

        <section className="rounded-lg border border-slate-200 bg-slate-950 p-4 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">Concurrent EV sessions</p>
              <p className="mt-1 text-sm text-white/55">Charging intensity raises the coordination value.</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-400 text-xl font-semibold text-slate-950">
              {evCount}
            </div>
          </div>
          <input
            aria-label="Concurrent EV sessions"
            className="mt-5 w-full accent-teal-400"
            type="range"
            min={0}
            max={12}
            step={1}
            value={evCount}
            onChange={(event) => startTransition(() => onEvCount(clampFlexgridEvCount(Number(event.target.value))))}
          />
          <div className="mt-2 flex justify-between text-xs text-white/45">
            <span>0</span>
            <span>12</span>
          </div>
        </section>
      </div>

      <ScenarioLibrary
        savedScenarios={savedScenarios}
        onApplyScenario={onApplyScenario}
        onSaveScenario={onSaveScenario}
        onDeleteScenario={onDeleteScenario}
      />
    </aside>
  );
}

function StrategyTable({ scenario }: { scenario: FlexgridScenario }) {
  return (
    <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-950">Strategy comparison</p>
          <p className="mt-1 text-sm text-slate-500">Same facility, same tariff, different control logic.</p>
        </div>
        <LineChart className="h-5 w-5 text-teal-700" aria-hidden="true" />
      </div>
      <div className="mt-4 grid gap-2 md:hidden">
        {scenario.comparison.map((item) => {
          const selected = item.strategy === scenario.input.strategy;

          return (
            <article
              key={item.strategy}
              className={[
                "rounded-lg border p-3",
                selected ? "border-teal-200 bg-teal-50" : "border-slate-200 bg-slate-50"
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                <p className="text-sm font-semibold text-teal-700">{formatTl(item.monthlySavingsTl)}</p>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="font-semibold uppercase text-slate-400">Peak</dt>
                  <dd className="mt-1 text-slate-700">{formatNumber(item.peakKw, " kW")}</dd>
                </div>
                <div>
                  <dt className="font-semibold uppercase text-slate-400">Cost</dt>
                  <dd className="mt-1 text-slate-700">{formatTl(item.monthlyCostTl)}</dd>
                </div>
                <div>
                  <dt className="font-semibold uppercase text-slate-400">Confidence</dt>
                  <dd className="mt-1 text-slate-700">{item.engineeringConfidence}/100</dd>
                </div>
                <div>
                  <dt className="font-semibold uppercase text-slate-400">Readiness</dt>
                  <dd className="mt-1 text-slate-700">{item.readinessScore}/100</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
      <div className="mt-4 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-400">
            <tr>
              <th className="py-3 pr-4 font-semibold">Strategy</th>
              <th className="py-3 pr-4 font-semibold">Peak</th>
              <th className="py-3 pr-4 font-semibold">Monthly cost</th>
              <th className="py-3 pr-4 font-semibold">Savings</th>
              <th className="py-3 font-semibold">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {scenario.comparison.map((item) => {
              const selected = item.strategy === scenario.input.strategy;

              return (
                <tr key={item.strategy} className={selected ? "bg-teal-50/80" : "border-b border-slate-100 last:border-0"}>
                  <td className="py-3 pl-2 pr-4 font-semibold text-slate-950">{item.label}</td>
                  <td className="py-3 pr-4 text-slate-600">{formatNumber(item.peakKw, " kW")}</td>
                  <td className="py-3 pr-4 text-slate-600">{formatTl(item.monthlyCostTl)}</td>
                  <td className="py-3 pr-4 font-semibold text-teal-700">{formatTl(item.monthlySavingsTl)}</td>
                  <td className="py-3 text-slate-600">{item.engineeringConfidence}/100</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Recommendations({ scenario }: { scenario: FlexgridScenario }) {
  const priorityClass = {
    high: "bg-rose-500",
    medium: "bg-amber-500",
    low: "bg-teal-500"
  };

  return (
    <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-teal-700" aria-hidden="true" />
        <p className="text-sm font-semibold text-slate-950">Recommended actions</p>
      </div>
      <div className="mt-4 space-y-4">
        {scenario.recommendations.map((item) => (
          <article key={item.title} className="border-t border-slate-100 pt-4 first:border-0 first:pt-0">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${priorityClass[item.priority]}`} />
              <p className="text-sm font-semibold text-slate-950">{item.title}</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TelemetryValidation({
  comparison,
  modeLabel,
  importStatus,
  onTelemetryCsv,
  onResetTelemetry,
  onDownloadTemplate
}: {
  comparison: FlexgridTelemetryComparison;
  modeLabel: string;
  importStatus: string;
  onTelemetryCsv: (file: File) => void;
  onResetTelemetry: () => void;
  onDownloadTemplate: () => void;
}) {
  const statusClass = {
    excellent: "border-teal-200 bg-teal-50 text-teal-950",
    watch: "border-amber-200 bg-amber-50 text-amber-950",
    action: "border-rose-200 bg-rose-50 text-rose-950"
  }[comparison.metrics.status];

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <section className={`rounded-lg border p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ${statusClass}`}>
        <div className="flex items-center gap-2">
          <RadioTower className="h-5 w-5" aria-hidden="true" />
          <p className="text-sm font-semibold">Telemetry validation</p>
        </div>
        <p className="mt-4 text-5xl font-semibold leading-none">{comparison.metrics.confidenceScore}/100</p>
        <p className="mt-4 max-w-2xl text-sm leading-6 opacity-75">
          {modeLabel} samples are compared with the simulated dispatch profile. CSV measurement files are validated
          through the same API contract.
        </p>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] opacity-60">Current source: {modeLabel}</p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-950">Measured vs simulated</p>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={onDownloadTemplate}>
              <FileText className="h-4 w-4" aria-hidden="true" />
              CSV template
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={onResetTelemetry}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset
            </Button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          {[
            ["MAE", formatNumber(comparison.metrics.maeKw, " kW")],
            ["MAPE", formatPct(comparison.metrics.mapePct)],
            ["Peak error", formatNumber(comparison.metrics.peakErrorKw, " kW")],
            ["Energy delta", formatNumber(comparison.metrics.energyDeltaKwh, " kWh")]
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
            </div>
          ))}
        </div>
        <label className="mt-4 flex cursor-pointer flex-col gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600 transition hover:border-teal-500 hover:bg-teal-50">
          <span className="inline-flex items-center gap-2 font-semibold text-slate-950">
            <Upload className="h-4 w-4 text-teal-700" aria-hidden="true" />
            Import telemetry CSV
          </span>
          <span className="text-xs leading-5">
            Required columns: <span className="font-mono">hourIndex</span> and <span className="font-mono">measuredKw</span>.
            Optional columns: voltageV, currentA, powerFactor.
          </span>
          <input
            className="sr-only"
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                onTelemetryCsv(file);
                event.currentTarget.value = "";
              }
            }}
          />
        </label>
        <p className="mt-3 text-xs leading-5 text-slate-500">{importStatus}</p>
      </section>
    </section>
  );
}

function EngineeringReport({
  scenario,
  onDownloadReport
}: {
  scenario: FlexgridScenario;
  onDownloadReport: () => void;
}) {
  const rows = [
    ["Peak apparent power", formatNumber(scenario.metrics.peakKva, " kVA")],
    ["Transformer limit", formatNumber(scenario.metrics.transformerLimitKva, " kVA")],
    ["Maximum current", formatNumber(scenario.metrics.maxCurrentA, " A")],
    ["Power factor", scenario.metrics.powerFactor.toFixed(2)],
    ["Battery SoC min/final", `${scenario.metrics.batterySocMinPct}% / ${scenario.metrics.batterySocFinalPct}%`],
    ["Overload hours", `${scenario.metrics.overloadHours} h`],
    ["Analysis energy", formatNumber(scenario.metrics.analysisEnergyKwh, " kWh")],
    ["Analysis cost", formatTl(scenario.metrics.analysisCostTl)]
  ];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-950">Engineering report summary</p>
          <p className="mt-1 text-sm text-slate-500">
            Electrical values are estimated from facility power factor and a 400 V three-phase service assumption.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={onDownloadReport}>
          <Download className="h-4 w-4" aria-hidden="true" />
          Download report
        </Button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FlexgridSimulator() {
  const [siteType, setSiteType] = useState<FlexgridSiteType>(defaultFlexgridScenario.siteType);
  const [strategy, setStrategy] = useState<FlexgridStrategy>(defaultFlexgridScenario.strategy);
  const [batteryMode, setBatteryMode] = useState<FlexgridBatteryMode>(defaultFlexgridScenario.batteryMode);
  const [tariffPlan, setTariffPlan] = useState<FlexgridTariffPlan>(defaultFlexgridScenario.tariffPlan);
  const [evCount, setEvCount] = useState<number>(defaultFlexgridScenario.evCount);
  const [analysisDays, setAnalysisDays] = useState<FlexgridAnalysisDays>(defaultFlexgridScenario.analysisDays ?? 1);
  const [gridProvider, setGridProvider] = useState<FlexgridGridProvider>("demo");
  const [gridDate, setGridDate] = useState<string>(todayIsoDate());
  const [savedScenarios, setSavedScenarios] = useState<SavedFlexgridScenario[]>([]);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [importedTelemetrySamples, setImportedTelemetrySamples] = useState<FlexgridTelemetrySample[] | null>(null);
  const [telemetryImportStatus, setTelemetryImportStatus] = useState("Using deterministic demo telemetry. Import CSV to compare measured data.");
  const liveInput = useMemo(
    () => ({
      siteType,
      strategy,
      batteryMode,
      tariffPlan,
      evCount,
      analysisDays
    }),
    [analysisDays, batteryMode, evCount, siteType, strategy, tariffPlan]
  );
  const deferredInput = useDeferredValue(liveInput);
  const scenario = useMemo(() => buildFlexgridScenario(deferredInput), [deferredInput]);
  const mockTelemetrySamples = useMemo(() => generateMockTelemetrySamples(scenario.input), [scenario.input]);
  const telemetrySamples = importedTelemetrySamples ?? mockTelemetrySamples;
  const telemetryComparison = useMemo(
    () => compareTelemetrySamples(scenario, telemetrySamples),
    [scenario, telemetrySamples]
  );
  const telemetryByHour = useMemo(
    () => new Map(telemetryComparison.samples.map((sample) => [sample.hourIndex, sample])),
    [telemetryComparison.samples]
  );
  const chartData = useMemo(
    () =>
      scenario.chart.map((point) => ({
        ...point,
        measuredKw: telemetryByHour.get(point.hourIndex)?.measuredKw ?? null
      })),
    [scenario.chart, telemetryByHour]
  );
  const gridSignal = useMemo(
    () => buildDemoGridSignal({ provider: gridProvider, date: gridDate }),
    [gridDate, gridProvider]
  );
  const params = useMemo(
    () => createScenarioSearchParams(liveInput).toString(),
    [liveInput]
  );
  const shareParams = useMemo(() => {
    const nextParams = new URLSearchParams(params);

    nextParams.set("gridProvider", gridProvider);
    nextParams.set("gridDate", gridDate);

    return nextParams.toString();
  }, [gridDate, gridProvider, params]);
  const exportHref = `/api/scenario?${params}&format=csv`;
  const jsonHref = `/api/scenario?${params}`;
  const gridHref = `/api/grid-signal?provider=${gridProvider}&date=${gridDate}`;
  const reportHref = `/api/report?${shareParams}`;
  const bestStrategy = useMemo(
    () => scenario.comparison.reduce((best, item) => (item.monthlySavingsTl > best.monthlySavingsTl ? item : best)),
    [scenario.comparison]
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlScenario = parseScenarioSearchParams(urlParams);
    const providerParam = urlParams.get("gridProvider");
    const dateParam = urlParams.get("gridDate");
    startTransition(() => {
      setSavedScenarios(readSavedScenarios());
      setSiteType(urlScenario.siteType);
      setStrategy(urlScenario.strategy);
      setBatteryMode(urlScenario.batteryMode);
      setTariffPlan(urlScenario.tariffPlan);
      setEvCount(urlScenario.evCount);
      setAnalysisDays(urlScenario.analysisDays ?? 1);
      if (isFlexgridGridProvider(providerParam)) {
        setGridProvider(providerParam);
      }
      if (isFlexgridGridDate(dateParam)) {
        setGridDate(dateParam);
      }
    });
  }, []);

  useEffect(() => {
    const nextUrl = `${window.location.pathname}?${shareParams}`;
    window.history.replaceState(null, "", nextUrl);
  }, [shareParams]);

  function applyScenario(input: FlexgridScenarioInput) {
    startTransition(() => {
      setSiteType(input.siteType);
      setStrategy(input.strategy);
      setBatteryMode(input.batteryMode);
      setTariffPlan(input.tariffPlan);
      setEvCount(input.evCount);
      setAnalysisDays(input.analysisDays ?? 1);
    });
  }

  function saveCurrentScenario() {
    const strategyLabel = flexgridStrategyOptions.find((item) => item.id === scenario.input.strategy)?.label ?? scenario.input.strategy;
    const nextSaved: SavedFlexgridScenario = {
      id: String(Date.now()),
      label: `${scenario.site.shortLabel} - ${strategyLabel} - ${scenario.input.evCount} EV - ${scenario.metrics.analysisDays}d`,
      createdAt: new Date().toISOString(),
      input: scenario.input
    };
    const updated = [nextSaved, ...savedScenarios.filter((item) => item.label !== nextSaved.label)].slice(0, 8);

    setSavedScenarios(updated);
    writeSavedScenarios(updated);
  }

  function deleteSavedScenario(id: string) {
    const updated = savedScenarios.filter((item) => item.id !== id);

    setSavedScenarios(updated);
    writeSavedScenarios(updated);
  }

  async function copyShareUrl() {
    try {
      await window.navigator.clipboard.writeText(window.location.href);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1600);
    } catch {
      setCopyState("failed");
      window.setTimeout(() => setCopyState("idle"), 1600);
    }
  }

  async function handleTelemetryCsv(file: File) {
    try {
      const text = await file.text();
      const parsed = parseTelemetryCsv(text);

      if (!parsed.ok) {
        setTelemetryImportStatus(`CSV import failed: ${parsed.errors.join("; ")}`);
        return;
      }

      setImportedTelemetrySamples(parsed.samples);
      setTelemetryImportStatus(
        `Imported ${parsed.samples.length} measurement samples from ${file.name}.${parsed.warnings.length > 0 ? ` ${parsed.warnings.join(" ")}` : ""}`
      );
    } catch {
      setTelemetryImportStatus("CSV import failed: the selected file could not be read.");
    }
  }

  function resetTelemetryToMock() {
    setImportedTelemetrySamples(null);
    setTelemetryImportStatus("Using deterministic demo telemetry. Import CSV to compare measured data.");
  }

  function downloadTelemetryTemplate() {
    downloadTextFile(
      `voltpilot-telemetry-template-${scenario.metrics.analysisDays}d.csv`,
      buildTelemetryCsvTemplate(mockTelemetrySamples),
      "text/csv;charset=utf-8"
    );
  }

  function downloadEngineeringReport() {
    const report = buildEngineeringReportMarkdown({
      scenario,
      telemetry: telemetryComparison,
      gridSignal
    });

    downloadTextFile(
      `voltpilot-${scenario.input.siteType}-${scenario.input.strategy}-report.md`,
      report,
      "text/markdown;charset=utf-8"
    );
  }

  return (
    <div id="cockpit" className="energy-grid min-h-screen text-slate-950">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#081113]/95 px-4 py-3 text-white backdrop-blur md:px-6">
        <div className="mx-auto flex max-w-[96rem] items-center justify-between gap-4">
          <a href="#cockpit" className="flex items-center gap-3" aria-label="VoltPilot cockpit">
            <VoltPilotLogo subtitle="Energy decision cockpit" />
          </a>
          <nav className="hidden items-center gap-5 text-sm font-medium text-white/65 md:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#scenario-controls"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] text-white transition hover:bg-white/10 sm:hidden"
            aria-label="Open scenario controls"
          >
            <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
          </a>
          <div className="hidden items-center gap-2 sm:flex">
            <Button asChild size="sm" className="bg-teal-400 text-slate-950 shadow-none hover:bg-teal-300">
              <a href={exportHref}>
                <Download className="h-4 w-4" aria-hidden="true" />
                CSV
              </a>
            </Button>
            <Button asChild size="sm" variant="outline" className="border-white/15 bg-white/[0.06] text-white hover:bg-white/10">
              <a href={jsonHref}>
                <FileJson className="h-4 w-4" aria-hidden="true" />
                JSON
              </a>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-white/15 bg-white/[0.06] text-white hover:bg-white/10"
              onClick={copyShareUrl}
            >
              <Link2 className="h-4 w-4" aria-hidden="true" />
              {copyState === "copied" ? "Copied" : copyState === "failed" ? "Failed" : "Share"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[96rem] gap-5 px-4 pb-12 pt-5 md:px-6 lg:grid-cols-[23rem_minmax(0,1fr)]">
        <ControlPanel
          scenario={scenario}
          siteType={siteType}
          strategy={strategy}
          batteryMode={batteryMode}
          tariffPlan={tariffPlan}
          evCount={evCount}
          analysisDays={analysisDays}
          savedScenarios={savedScenarios}
          onSiteType={setSiteType}
          onStrategy={setStrategy}
          onBatteryMode={setBatteryMode}
          onTariffPlan={setTariffPlan}
          onEvCount={setEvCount}
          onAnalysisDays={setAnalysisDays}
          onApplyScenario={applyScenario}
          onSaveScenario={saveCurrentScenario}
          onDeleteScenario={deleteSavedScenario}
        />

        <div className="order-1 min-w-0 space-y-5 lg:order-2">
          <section className="surface-rise grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <NetworkMap scenario={scenario} />
            <div className="space-y-5">
              <DecisionPanel scenario={scenario} exportHref={exportHref} jsonHref={jsonHref} reportHref={reportHref} />
              <MetricTile
                icon={BrainCircuit}
                label="Strongest strategy"
                value={bestStrategy.label}
                helper={`${formatTl(bestStrategy.monthlySavingsTl)} monthly savings, ${bestStrategy.peakKw} kW peak`}
                tone="dark"
              />
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricTile
              icon={Gauge}
              label="Peak demand"
              value={formatNumber(scenario.metrics.peakKw, " kW")}
              helper={`Baseline ${formatNumber(scenario.metrics.baselinePeakKw, " kW")}`}
              tone={scenario.metrics.transformerStress > 85 ? "red" : "neutral"}
            />
            <MetricTile
              icon={TrendingDown}
              label="Monthly savings"
              value={formatTl(scenario.metrics.monthlySavingsTl)}
              helper={`${formatPct(scenario.metrics.peakReductionPct)} peak reduction`}
              tone="green"
            />
            <MetricTile
              icon={ShieldAlert}
              label="Transformer stress"
              value={`${scenario.metrics.transformerStress}/100`}
              helper={`${scenario.site.transformerLimitKva} kVA local limit`}
              tone={scenario.metrics.transformerStress > 85 ? "red" : "amber"}
            />
            <MetricTile
              icon={Leaf}
              label="Carbon impact"
              value={formatPct(scenario.metrics.carbonReductionPct)}
              helper={`${formatNumber(scenario.metrics.carbonKgDaily, " kg")} daily emissions`}
              tone="green"
            />
          </section>

          <GridSignalPanel
            signal={gridSignal}
            provider={gridProvider}
            date={gridDate}
            apiHref={gridHref}
            onProvider={setGridProvider}
            onDate={setGridDate}
          />

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                  <p className="text-sm font-semibold text-slate-950">
                    {scenario.metrics.analysisDays === 1 ? "24-hour" : "7-day"} load profile
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Selected scenario is shown with uncontrolled operation, demo telemetry, and transformer limit.
                </p>
              </div>
              <div className="space-y-2 md:text-right">
                <p className="text-sm font-semibold text-teal-700">Strongest strategy: {bestStrategy.label}</p>
                <ChartLegend
                  items={[
                    { label: "Selected", color: "#0f766e" },
                    { label: "Demo telemetry", color: "#f59e0b" },
                    { label: "Uncontrolled", color: "#64748b", dashed: true }
                  ]}
                />
              </div>
            </div>
            <div className="mt-5 h-[22rem]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ left: -18, right: 10, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="selectedLoad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#0f766e" stopOpacity={0.34} />
                      <stop offset="95%" stopColor="#0f766e" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100,116,139,0.2)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    content={
                      <EnergyTooltip
                        units={{
                          totalLoadKw: "kW",
                          baselineLoadKw: "kW",
                          measuredKw: "kW"
                        }}
                      />
                    }
                  />
                  <ReferenceLine y={scenario.site.transformerLimitKw} stroke="#e11d48" strokeDasharray="5 5" />
                  <Area
                    type="monotone"
                    dataKey="totalLoadKw"
                    stroke="#0f766e"
                    strokeWidth={2.5}
                    fill="url(#selectedLoad)"
                    name="Selected load"
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="baselineLoadKw"
                    stroke="#64748b"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                    name="Uncontrolled"
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="measuredKw"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                    name="Demo telemetry"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <TelemetryValidation
            comparison={telemetryComparison}
            modeLabel={importedTelemetrySamples ? "CSV telemetry" : "Demo telemetry"}
            importStatus={telemetryImportStatus}
            onTelemetryCsv={handleTelemetryCsv}
            onResetTelemetry={resetTelemetryToMock}
            onDownloadTemplate={downloadTelemetryTemplate}
          />
          <EngineeringReport scenario={scenario} onDownloadReport={downloadEngineeringReport} />

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Load composition at peak</p>
                  <p className="mt-1 text-sm text-slate-500">Peak-hour contribution by asset class.</p>
                </div>
                <Zap className="h-5 w-5 text-amber-600" aria-hidden="true" />
              </div>
              <div className="mt-5 h-[17rem]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scenario.assets} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100,116,139,0.2)" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} />
                    <Tooltip content={<EnergyTooltip units={{ valueKw: "kW" }} />} />
                    <Bar dataKey="valueKw" fill="#0f766e" radius={[6, 6, 0, 0]} name="kW" isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold text-slate-950">Peak asset share</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                The controllable share creates the engineering value.
              </p>
              <div className="mt-5 space-y-4">
                {scenario.assets.map((asset) => (
                  <AssetRow key={asset.id} {...asset} />
                ))}
              </div>
            </section>
          </section>

          <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_26rem]">
            <StrategyTable scenario={scenario} />
            <Recommendations scenario={scenario} />
          </section>

          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricTile
              icon={Zap}
              label="Flexible load share"
              value={formatPct(scenario.metrics.shiftedEnergyPct)}
              helper="Shiftable or controllable share"
            />
            <MetricTile
              icon={BatteryCharging}
              label="Battery discharge"
              value={formatNumber(scenario.metrics.batteryDischargeKwh, " kWh")}
              helper={`${formatNumber(scenario.metrics.batteryRoundTripEfficiencyPct, "%")} round-trip efficiency`}
              tone="amber"
            />
            <MetricTile
              icon={PlugZap}
              label="EV energy"
              value={formatNumber(scenario.metrics.evEnergyKwh, " kWh")}
              helper="Charging energy represented in the selected analysis"
            />
            <MetricTile
              icon={CalendarDays}
              label="Analysis horizon"
              value={scenario.metrics.analysisDays === 1 ? "24 h" : "7 days"}
              helper={`${formatNumber(scenario.metrics.analysisEnergyKwh, " kWh")} total analysis energy`}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
