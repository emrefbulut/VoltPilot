"use client";

import { startTransition, useDeferredValue, useState } from "react";
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
  BatteryCharging,
  Download,
  FileJson,
  Gauge,
  Leaf,
  ShieldAlert,
  TrendingDown,
  Zap,
  type LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  buildFlexgridScenario,
  clampFlexgridEvCount,
  defaultFlexgridScenario,
  flexgridBatteryOptions,
  flexgridSiteProfiles,
  flexgridStrategyOptions,
  flexgridTariffOptions,
  type FlexgridBatteryMode,
  type FlexgridSiteType,
  type FlexgridStrategy,
  type FlexgridTariffPlan
} from "@/src/lib/energy/flexgrid";

function formatTl(value: number) {
  return `${value.toLocaleString("tr-TR")} TL`;
}

function formatNumber(value: number, suffix = "") {
  return `${value.toLocaleString("tr-TR")}${suffix}`;
}

function SegmentedSelector<T extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: T;
  options: { id: T; label: string; description?: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-zinc-900">{label}</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={[
              "min-h-11 rounded-lg border px-3 py-2 text-left text-sm transition",
              value === option.id
                ? "border-emerald-600 bg-emerald-50 text-emerald-950"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
            ].join(" ")}
            onClick={() => startTransition(() => onChange(option.id))}
          >
            <span className="block font-semibold">{option.label}</span>
            {option.description ? <span className="mt-1 block text-xs text-zinc-500">{option.description}</span> : null}
          </button>
        ))}
      </div>
    </div>
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
  tone?: "neutral" | "green" | "amber" | "red";
}) {
  const toneClass =
    tone === "green"
      ? "bg-emerald-50 text-emerald-900"
      : tone === "amber"
        ? "bg-amber-50 text-amber-900"
        : tone === "red"
          ? "bg-rose-50 text-rose-900"
          : "bg-zinc-50 text-zinc-900";

  return (
    <section className={`rounded-lg border border-zinc-200 p-4 ${toneClass}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{label}</p>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="mt-4 text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm opacity-75">{helper}</p>
    </section>
  );
}

function AssetRow({
  label,
  value,
  share,
  status
}: {
  label: string;
  value: number;
  share: number;
  status: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-zinc-800">{label}</span>
        <span className="text-zinc-500">{formatNumber(value, " kW")}</span>
      </div>
      <div className="h-2 rounded-full bg-zinc-100">
        <div
          className={status === "support" ? "h-2 rounded-full bg-amber-500" : "h-2 rounded-full bg-emerald-600"}
          style={{ width: `${Math.min(100, Math.max(3, share))}%` }}
        />
      </div>
    </div>
  );
}

export function FlexgridSimulator() {
  const [siteType, setSiteType] = useState<FlexgridSiteType>(defaultFlexgridScenario.siteType);
  const [strategy, setStrategy] = useState<FlexgridStrategy>(defaultFlexgridScenario.strategy);
  const [batteryMode, setBatteryMode] = useState<FlexgridBatteryMode>(defaultFlexgridScenario.batteryMode);
  const [tariffPlan, setTariffPlan] = useState<FlexgridTariffPlan>(defaultFlexgridScenario.tariffPlan);
  const [evCount, setEvCount] = useState<number>(defaultFlexgridScenario.evCount);
  const deferredInput = useDeferredValue({
    siteType,
    strategy,
    batteryMode,
    tariffPlan,
    evCount
  });
  const scenario = buildFlexgridScenario(deferredInput);
  const selectedStrategy =
    flexgridStrategyOptions.find((item) => item.id === strategy) ?? flexgridStrategyOptions[0]!;
  const params = `siteType=${siteType}&strategy=${strategy}&batteryMode=${batteryMode}&tariffPlan=${tariffPlan}&evCount=${evCount}`;
  const exportHref = `/api/scenario?${params}&format=csv`;
  const jsonHref = `/api/scenario?${params}`;
  const bestStrategy = scenario.comparison.reduce((best, item) =>
    item.monthlySavingsTl > best.monthlySavingsTl ? item : best
  );

  return (
    <div className="min-h-screen bg-[#f7f8f4] text-zinc-950">
      <header className="border-b border-zinc-200 bg-[#f7f8f4]/95 px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-[92rem] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-800">FlexGrid-TR</p>
            <h1 className="mt-1 text-3xl font-semibold md:text-4xl">Energy flexibility cockpit</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <a href={exportHref}>
                <Download className="h-4 w-4" />
                Export CSV
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={jsonHref}>
                <FileJson className="h-4 w-4" />
                JSON
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[92rem] gap-6 px-4 py-6 lg:grid-cols-[380px_minmax(0,1fr)] md:px-6">
        <aside className="space-y-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm lg:sticky lg:top-4 lg:h-fit">
          <div>
            <p className="text-sm text-zinc-500">Scenario</p>
            <p className="mt-1 text-lg font-semibold">{scenario.site.label}</p>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{selectedStrategy.description}</p>
          </div>

          <SegmentedSelector
            label="Facility"
            value={siteType}
            options={Object.entries(flexgridSiteProfiles).map(([id, profile]) => ({
              id: id as FlexgridSiteType,
              label: profile.shortLabel
            }))}
            onChange={setSiteType}
          />

          <SegmentedSelector
            label="Control"
            value={strategy}
            options={flexgridStrategyOptions}
            onChange={setStrategy}
          />

          <SegmentedSelector
            label="Battery"
            value={batteryMode}
            options={flexgridBatteryOptions}
            onChange={setBatteryMode}
          />

          <SegmentedSelector
            label="Tariff"
            value={tariffPlan}
            options={flexgridTariffOptions}
            onChange={setTariffPlan}
          />

          <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-900">Concurrent EV sessions</p>
                <p className="text-sm text-zinc-500">Charging density increases coordination value.</p>
              </div>
              <div className="rounded-lg bg-zinc-950 px-3 py-2 text-lg font-semibold text-white">{evCount}</div>
            </div>
            <input
              aria-label="Concurrent EV sessions"
              className="w-full accent-emerald-700"
              type="range"
              min={0}
              max={12}
              step={1}
              value={evCount}
              onChange={(event) => startTransition(() => setEvCount(clampFlexgridEvCount(Number(event.target.value))))}
            />
          </div>

          <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-950">Decision summary</p>
            <p className="mt-2 text-sm leading-6 text-emerald-900">{scenario.summary}</p>
          </section>
        </aside>

        <div className="space-y-6">
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
              helper={`${scenario.metrics.peakReductionPct}% peak reduction`}
              tone="green"
            />
            <MetricTile
              icon={ShieldAlert}
              label="Transformer stress"
              value={`${scenario.metrics.transformerStress}/100`}
              helper={`${scenario.site.transformerLimitKw} kW local limit`}
              tone={scenario.metrics.transformerStress > 85 ? "red" : "amber"}
            />
            <MetricTile
              icon={Leaf}
              label="Carbon impact"
              value={`${scenario.metrics.carbonReductionPct}%`}
              helper={`${formatNumber(scenario.metrics.carbonKgDaily, " kg")} daily emissions`}
              tone="green"
            />
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-900">24-hour load profile</p>
                <p className="mt-1 text-sm text-zinc-500">Selected scenario against uncontrolled operation and transformer limit.</p>
              </div>
              <p className="text-sm text-zinc-500">Best simulated strategy: {bestStrategy.label}</p>
            </div>
            <div className="mt-5 h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scenario.chart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(113,113,122,0.2)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#52525b" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#52525b" }} />
                  <Tooltip />
                  <ReferenceLine y={scenario.site.transformerLimitKw} stroke="#e11d48" strokeDasharray="5 5" />
                  <Area
                    type="monotone"
                    dataKey="totalLoadKw"
                    stroke="#047857"
                    strokeWidth={2}
                    fill="#d1fae5"
                    name="Selected load"
                  />
                  <Line
                    type="monotone"
                    dataKey="baselineLoadKw"
                    stroke="#71717a"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                    name="Uncontrolled"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-zinc-900">Load composition at peak</p>
              <div className="mt-5 h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scenario.assets}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(113,113,122,0.2)" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#52525b" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#52525b" }} />
                    <Tooltip />
                    <Bar dataKey="valueKw" fill="#0f766e" radius={[6, 6, 0, 0]} name="kW" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <div>
                <p className="text-sm font-semibold text-zinc-900">Peak asset share</p>
                <p className="mt-1 text-sm text-zinc-500">The controllable part is where the project creates engineering value.</p>
              </div>
              {scenario.assets.map((asset) => (
                <AssetRow
                  key={asset.id}
                  label={asset.label}
                  value={asset.valueKw}
                  share={asset.sharePct}
                  status={asset.status}
                />
              ))}
            </section>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
            <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-zinc-900">Strategy comparison</p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="border-b border-zinc-200 text-zinc-500">
                    <tr>
                      <th className="py-3 font-medium">Strategy</th>
                      <th className="py-3 font-medium">Peak</th>
                      <th className="py-3 font-medium">Monthly cost</th>
                      <th className="py-3 font-medium">Savings</th>
                      <th className="py-3 font-medium">DR score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenario.comparison.map((item) => (
                      <tr key={item.strategy} className="border-b border-zinc-100 last:border-0">
                        <td className="py-3 font-semibold text-zinc-900">{item.label}</td>
                        <td className="py-3 text-zinc-600">{formatNumber(item.peakKw, " kW")}</td>
                        <td className="py-3 text-zinc-600">{formatTl(item.monthlyCostTl)}</td>
                        <td className="py-3 text-emerald-700">{formatTl(item.monthlySavingsTl)}</td>
                        <td className="py-3 text-zinc-600">{item.readinessScore}/100</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-700" />
                <p className="text-sm font-semibold text-zinc-900">Recommended next actions</p>
              </div>
              <div className="mt-4 space-y-4">
                {scenario.recommendations.map((item) => (
                  <article key={item.title} className="border-t border-zinc-100 pt-4 first:border-0 first:pt-0">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-600" />
                      <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">{item.detail}</p>
                  </article>
                ))}
              </div>
            </section>
          </section>

          <section className="grid gap-3 md:grid-cols-3">
            <MetricTile
              icon={Zap}
              label="Flexible load share"
              value={`${scenario.metrics.shiftedEnergyPct}%`}
              helper="Share that can be shifted or controlled"
            />
            <MetricTile
              icon={BatteryCharging}
              label="Battery discharge"
              value={formatNumber(scenario.metrics.batteryDischargeKwh, " kWh")}
              helper="Daily discharge in the selected strategy"
              tone="amber"
            />
            <MetricTile
              icon={Activity}
              label="EV energy"
              value={formatNumber(scenario.metrics.evEnergyKwh, " kWh")}
              helper="Daily charging energy represented in the model"
            />
          </section>
        </div>
      </main>
    </div>
  );
}
