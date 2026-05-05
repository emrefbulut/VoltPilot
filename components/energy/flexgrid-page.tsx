import { Activity, ArrowUpRight, Cpu, Database, GitBranch, Layers3, PlugZap, RadioTower } from "lucide-react";
import { flexgridCopy } from "@/src/content/flexgrid-copy";
import { FlexgridSimulator } from "@/components/energy/flexgrid-simulator";

const architectureSteps = [
  {
    title: "Senaryo girdileri",
    description: "Tesis tipi, tarife, EV yoğunluğu, depolama ve kontrol stratejisi modele girer.",
    icon: PlugZap
  },
  {
    title: "Simülasyon çekirdeği",
    description: "Saatlik kW, kVA, akım, batarya SoC, maliyet, karbon ve güven skoru birlikte hesaplanır.",
    icon: Cpu
  },
  {
    title: "Telemetri doğrulama",
    description: "Sanal veya ölçülen örnekler simüle edilen dağıtım profiliyle karşılaştırılır.",
    icon: Layers3
  },
  {
    title: "Dışa aktarım katmanı",
    description: "JSON, CSV, grid signal ve POST telemetri API'leri aynı test edilmiş modeli kullanır.",
    icon: Database
  }
];

export function FlexgridPage() {
  return (
    <main className="bg-[#f5f7f3]">
      <FlexgridSimulator />

      <section id="architecture" className="border-y border-slate-900 bg-[#081113] px-4 py-16 text-white md:px-6">
        <div className="mx-auto grid max-w-[96rem] gap-10 xl:grid-cols-[0.9fr_1.4fr]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-teal-100">
              <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
              Mimari
            </div>
            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-normal md:text-5xl">
              Tek simülasyon çekirdeği UI, API katmanları, telemetri karşılaştırması ve CSV raporunu besler.
            </h2>
            <p className="mt-5 text-base leading-7 text-white/65">
              Uygulama kolay çalışır kalır, ama gerçek bir mühendislik sınırı vardır: senaryo girdileri yeniden
              kullanılabilir modele akar; kokpit, dışa aktarımlar, testler ve telemetri API katmanı aynı çıktıyı tüketir.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-2">
            {architectureSteps.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="bg-[#0d191c] p-6">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-teal-400 text-slate-950">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/62">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="roadmap" className="px-4 py-16 md:px-6">
        <div className="mx-auto grid max-w-[96rem] gap-10 xl:grid-cols-[24rem_minmax(0,1fr)]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-teal-800 shadow-sm">
              <RadioTower className="h-3.5 w-3.5" aria-hidden="true" />
              Yol haritası
            </div>
            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-normal text-slate-950 md:text-5xl">
              Şimdi sanal ve hibrit hazır, fiziksel donanım yolu sonra.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Mevcut sürüm yazılım öncelikli hibrit prototip olarak çalışır. Sonraki faz, ürün hikayesini bozmadan
              mock örnekleri ESP32 veya smart-plug telemetrisiyle değiştirebilir.
            </p>
          </div>

          <div className="relative grid gap-4">
            <div className="absolute bottom-0 left-5 top-0 hidden w-px bg-slate-200 md:block" />
            {flexgridCopy.phases.map((phase) => (
              <article key={phase.week} className="relative grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] md:grid-cols-[8rem_minmax(0,1fr)]">
                <div className="flex items-center gap-3">
                  <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-semibold text-white">
                    {phase.week.replace("Faz ", "F")}
                  </span>
                  <p className="text-sm font-semibold text-teal-700 md:hidden">{phase.week}</p>
                </div>
                <div>
                  <p className="hidden text-sm font-semibold text-teal-700 md:block">{phase.week}</p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-950">{phase.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{phase.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 px-4 py-16 md:px-6">
        <div className="mx-auto grid max-w-[96rem] gap-8 xl:grid-cols-[minmax(0,1fr)_28rem]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
              <Activity className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
              Repo değeri
            </div>
            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-normal text-slate-950 md:text-5xl">
              Okunmak, çalıştırılmak ve genişletilmek için tasarlandı.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              FlexGrid-TR yalnızca görsel demo değil. Yeniden kullanılabilir senaryo motoru, sanal şebeke sinyali,
              telemetri karşılaştırma API katmanı, otomatik testleri, açık dokümantasyonu ve düşük maliyetli donanıma
              inandırıcı geçiş yolu var.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-slate-950">Stack</h3>
              <ArrowUpRight className="h-5 w-5 text-teal-700" aria-hidden="true" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {flexgridCopy.stack.map((item) => (
                <span key={item} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
