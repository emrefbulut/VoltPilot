"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { BatteryCharging, Gauge, LineChart as LineChartIcon, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  buildFlexgridScenario,
  clampFlexgridEvCount,
  defaultFlexgridScenario,
  flexgridBatteryOptions,
  flexgridSiteProfiles,
  flexgridStrategyOptions,
  type FlexgridBatteryMode,
  type FlexgridSiteType,
  type FlexgridStrategy
} from "@/src/lib/energy/flexgrid";

function SegmentedSelector<T extends string>({
  value,
  options,
  onChange
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Button
          key={option.id}
          type="button"
          variant={value === option.id ? "default" : "outline"}
          className={value === option.id ? "" : "border-slate-200 bg-white"}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

export function FlexgridSimulator() {
  const [siteType, setSiteType] = useState<FlexgridSiteType>(defaultFlexgridScenario.siteType);
  const [strategy, setStrategy] = useState<FlexgridStrategy>(defaultFlexgridScenario.strategy);
  const [batteryMode, setBatteryMode] = useState<FlexgridBatteryMode>(defaultFlexgridScenario.batteryMode);
  const [evCount, setEvCount] = useState<number>(defaultFlexgridScenario.evCount);

  const scenario = buildFlexgridScenario(siteType, strategy, batteryMode, evCount);
  const selectedStrategy =
    flexgridStrategyOptions.find((item) => item.id === strategy) ?? flexgridStrategyOptions[0]!;
  const exportHref = `/api/scenario?siteType=${siteType}&strategy=${strategy}&batteryMode=${batteryMode}&evCount=${evCount}&format=csv`;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
      <aside className="space-y-6 rounded-[2.2rem] border border-slate-200 bg-white/92 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.06)] xl:sticky xl:top-6 xl:h-fit">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700/72">
            Canli Senaryo
          </p>
          <h3 className="font-display text-3xl font-semibold tracking-[-0.04em] text-slate-950">
            Fiziksel donanim olmadan bile karar destek gosterebilen MVP
          </h3>
          <p className="text-sm leading-7 text-slate-600">
            Tesis tipini, EV yogunlugunu, bataryayi ve kontrol stratejisini degistir. Panel, pik yuk,
            maliyet ve talep tarafi katilimi uygunlugunu aninda yeniden hesaplar.
          </p>
        </div>

        <div className="space-y-5 border-t border-slate-200 pt-5">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-900">Tesis tipi</p>
            <SegmentedSelector
              value={siteType}
              options={Object.entries(flexgridSiteProfiles).map(([id, profile]) => ({
                id: id as FlexgridSiteType,
                label: profile.label
              }))}
              onChange={setSiteType}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-900">Kontrol stratejisi</p>
            <SegmentedSelector
              value={strategy}
              options={flexgridStrategyOptions.map((item) => ({ id: item.id, label: item.label }))}
              onChange={setStrategy}
            />
            <p className="text-sm leading-6 text-slate-600">{selectedStrategy.description}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-900">Batarya senaryosu</p>
            <SegmentedSelector
              value={batteryMode}
              options={flexgridBatteryOptions}
              onChange={setBatteryMode}
            />
          </div>

          <div className="space-y-3 rounded-[1.6rem] bg-slate-950/[0.03] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Es zamanli EV sayisi</p>
                <p className="text-sm leading-6 text-slate-600">
                  Sarj yogunlugu arttikca koordinasyonun degeri daha net gorunur.
                </p>
              </div>
              <div className="rounded-full bg-slate-950 px-4 py-2 text-lg font-semibold text-white">
                {evCount}
              </div>
            </div>
            <input
              className="w-full accent-[hsl(var(--primary))]"
              type="range"
              min={0}
              max={10}
              step={1}
              value={evCount}
              onChange={(event) => setEvCount(clampFlexgridEvCount(Number(event.target.value)))}
            />
          </div>

          <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-5">
            <Button asChild>
              <a href={exportHref}>CSV senaryosunu indir</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/#architecture">Mimariyi incele</a>
            </Button>
          </div>
        </div>
      </aside>

      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[1.9rem] bg-[#07103a] p-5 text-white shadow-[0_25px_80px_rgba(7,16,58,0.18)]">
            <div className="flex items-center gap-3 text-cyan-200">
              <Gauge className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em]">Pik yuk</p>
            </div>
            <p className="mt-4 text-4xl font-semibold tracking-[-0.05em]">{scenario.metrics.peakKw} kW</p>
            <p className="mt-2 text-sm text-white/68">Yuksek pik, trafo ve besleme tarafini zorlar.</p>
          </article>

          <article className="rounded-[1.9rem] bg-white/92 p-5 shadow-[0_25px_80px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3 text-emerald-700">
              <Zap className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em]">Pik azalimi</p>
            </div>
            <p className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950">
              %{scenario.metrics.peakReductionPct}
            </p>
            <p className="mt-2 text-sm text-slate-600">Kontrolsuz duruma gore azaltilmis maksimum yuk.</p>
          </article>

          <article className="rounded-[1.9rem] bg-white/92 p-5 shadow-[0_25px_80px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3 text-sky-700">
              <LineChartIcon className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em]">Aylik maliyet</p>
            </div>
            <p className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950">
              {scenario.metrics.monthlyCostTl.toLocaleString("tr-TR")} TL
            </p>
            <p className="mt-2 text-sm text-slate-600">Tarife, EV sarji ve batarya etkisini birlikte yansitir.</p>
          </article>

          <article className="rounded-[1.9rem] bg-white/92 p-5 shadow-[0_25px_80px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3 text-amber-700">
              <BatteryCharging className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em]">DR skoru</p>
            </div>
            <p className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950">
              {scenario.metrics.readinessScore}/100
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Talep tarafi katilimi ve esnek yuk potansiyeli icin hizli uygunluk skoru.
            </p>
          </article>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
          <Card>
            <CardHeader>
              <CardTitle>24 saatlik yuk profili</CardTitle>
              <p className="text-sm leading-6 text-slate-600">
                Mavi alan secilen stratejiyi, kesikli cizgi ise kontrolsuz yuklenmeyi temsil eder.
              </p>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scenario.chart}>
                  <defs>
                    <linearGradient id="gridLoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.42} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.06} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.2)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#475569" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#475569" }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="totalLoadKw"
                    stroke="#0f766e"
                    strokeWidth={2.6}
                    fill="url(#gridLoad)"
                    name="Secilen senaryo"
                  />
                  <Line
                    type="monotone"
                    dataKey="baselineBandKw"
                    stroke="#94a3b8"
                    strokeDasharray="6 6"
                    strokeWidth={2}
                    dot={false}
                    name="Kontrolsuz yuk"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Karar ozeti</CardTitle>
              <p className="text-sm leading-6 text-slate-600">
                Bu bolum, README ve proje sunumunda dogrudan kullanabilecegin operasyon ciktisidir.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[1.5rem] bg-slate-950/[0.03] p-4">
                <p className="text-sm font-semibold text-slate-900">Kaydirilan enerji payi</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                  %{scenario.metrics.shiftedEnergyPct}
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-950/[0.03] p-4">
                <p className="text-sm font-semibold text-slate-900">Trafo stres endeksi</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                  {scenario.metrics.transformerStress}/100
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">
                  Sunum ciktisi
                </p>
                <p className="mt-3 text-sm leading-7 text-emerald-950">
                  {flexgridSiteProfiles[siteType].label} senaryosunda <strong>{selectedStrategy.label}</strong> stratejisi,
                  kontrolsuz profile gore pik talebi dusurup sistemin daha yonetilebilir hale geldigini gosteriyor.
                  Bu, ileride ENVER raporlama, saha telemetrisi ve yuk orkestrasyonu ile genisletilebilir.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Esnek yuk dagilimi</CardTitle>
            <p className="text-sm leading-6 text-slate-600">
              Saatlik olarak ne kadar yukun kaydirilabilir veya kontrol edilebilir hale geldigi gorunur.
            </p>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scenario.chart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#475569" }} />
                <YAxis tick={{ fontSize: 12, fill: "#475569" }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="flexibleLoadKw"
                  stroke="#0f172a"
                  strokeWidth={3}
                  dot={false}
                  name="Esnek yuk"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

