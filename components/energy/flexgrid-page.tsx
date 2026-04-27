import { ArrowRight, Cpu, Gauge, GitBranch, Layers3, PlugZap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { flexgridCopy } from "@/src/content/flexgrid-copy";
import { FlexgridSimulator } from "@/components/energy/flexgrid-simulator";

const iconMap = [PlugZap, Cpu, ShieldCheck, GitBranch, Gauge, Layers3];

export function FlexgridPage() {
  return (
    <main className="overflow-hidden">
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#05111f] px-4 pb-16 pt-10 text-white md:px-8 md:pt-14">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(circle at 18% 22%, rgba(45,212,191,0.22), transparent 22%), radial-gradient(circle at 82% 16%, rgba(34,197,94,0.12), transparent 18%), radial-gradient(circle at 70% 70%, rgba(59,130,246,0.2), transparent 28%), linear-gradient(135deg, #03101c 0%, #062137 42%, #0a4f63 100%)"
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "30px 30px"
          }}
        />

        <div className="relative z-10 mx-auto grid max-w-[92rem] gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div className="space-y-8">
            <div className="landing-reveal space-y-5">
              <p className="landing-eyebrow border-white/12 bg-white/6">{flexgridCopy.brand.label}</p>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-semibold uppercase tracking-[0.26em] text-emerald-100/84">
                <span className="status-dot bg-emerald-300" />
                {flexgridCopy.brand.name}
              </div>
              <h1 className="font-display max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] [text-wrap:balance] md:text-7xl xl:text-[5.45rem]">
                {flexgridCopy.brand.title}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-white/76 md:text-xl">
                {flexgridCopy.brand.description}
              </p>
            </div>

            <div className="landing-reveal landing-delay-1 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <a href="#simulator">
                  Simulatore Git
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/16 bg-white/8 text-white hover:bg-white/14"
                asChild
              >
                <a href="#paths">Net Yollari Gor</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/16 bg-transparent text-white hover:bg-white/10"
                asChild
              >
                <a href="#roadmap">Roadmap</a>
              </Button>
            </div>

            <dl className="landing-reveal landing-delay-2 grid gap-4 border-t border-white/12 pt-6 sm:grid-cols-3">
              <div>
                <dt className="text-sm uppercase tracking-[0.22em] text-white/48">MVP tipi</dt>
                <dd className="mt-2 text-base font-semibold text-white">Donanimsiz baslayabilir</dd>
              </div>
              <div>
                <dt className="text-sm uppercase tracking-[0.22em] text-white/48">Hedef etki</dt>
                <dd className="mt-2 text-base font-semibold text-white">Pik azaltma + gorunurluk</dd>
              </div>
              <div>
                <dt className="text-sm uppercase tracking-[0.22em] text-white/48">CV gucu</dt>
                <dd className="mt-2 text-base font-semibold text-white">Elektrik + yazilim + veri + kontrol</dd>
              </div>
            </dl>
          </div>

          <div className="landing-reveal landing-delay-2 rounded-[2.5rem] border border-white/12 bg-white/8 p-6 shadow-[0_30px_120px_rgba(3,7,31,0.38)] backdrop-blur-xl md:p-8">
            <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/46">
                  Neden Bu Proje?
                </p>
                <h2 className="font-display max-w-md text-3xl font-semibold leading-tight [text-wrap:balance]">
                  Sebeke, bina ve kullanici tarafini tek yuzeyde bulusturan ogrenci seviyesinde ama sektor seviyesinde anlamli bir demo.
                </h2>
                <p className="max-w-lg text-sm leading-7 text-white/68 md:text-base">
                  Buradaki mantik basit: sadece grafik gosteren bir dashboard degil, kontrol stratejisi degistiginde teknik sonucu degisen bir urun vitrini kuruyoruz.
                </p>
              </div>
              <div className="inline-flex max-w-max items-center gap-2 rounded-full border border-emerald-300/28 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-100">
                <span className="status-dot bg-emerald-300 shadow-[0_0_20px_rgba(110,231,183,0.76)]" />
                Fiziksel donanim opsiyonel
              </div>
            </div>

            <div className="grid gap-5 pt-6 md:grid-cols-3">
              {flexgridCopy.marketSignals.map((item) => (
                <article key={item.title} className="rounded-[1.8rem] border border-white/10 bg-black/10 p-5">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/66">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="paths" className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-700/72">Net Yollar</p>
            <h2 className="font-display text-4xl font-semibold tracking-[-0.04em] text-slate-950 md:text-5xl">
              Bu projeyi iki net yol ile yurutecegiz.
            </h2>
            <p className="text-base leading-7 text-slate-600 md:text-lg">
              Ilk yol seni hizlica GitHub ve CV cikisina goturur. Ikinci yol, ilk yolu cope atmadan fiziksel prototip etkisi ekler.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {flexgridCopy.paths.map((path) => (
              <section
                key={path.id}
                className="rounded-[2.5rem] border border-slate-200 bg-white/92 p-7 shadow-[0_30px_90px_rgba(15,23,42,0.06)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700/72">
                      {path.eyebrow}
                    </p>
                    <h3 className="font-display mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
                      {path.title}
                    </h3>
                    <p className="mt-2 text-base font-semibold text-slate-500">{path.subtitle}</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-slate-950 px-5 py-4 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/54">Butce</p>
                    <p className="mt-2 text-xl font-semibold">{path.budget}</p>
                  </div>
                </div>

                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">{path.description}</p>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-[1.5rem] bg-slate-950/[0.03] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Sure</p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">{path.duration}</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-slate-950/[0.03] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Donanim</p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">{path.hardware}</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-slate-950/[0.03] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Hedef</p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">{path.subtitle}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {path.output.map((item) => (
                    <div key={item} className="flex items-start gap-3 border-t border-slate-200 pt-3 first:border-t-0 first:pt-0">
                      <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <p className="text-sm leading-6 text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section id="simulator" className="px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-sky-800/72">Interaktif Demo</p>
            <h2 className="font-display text-4xl font-semibold tracking-[-0.04em] text-slate-950 md:text-5xl">
              GitHub&apos;a koydugunda acilip oynanabilen bir teknik MVP.
            </h2>
            <p className="text-base leading-7 text-slate-600 md:text-lg">
              Burasi senin “ben ne yaptim?” cevabin olacak. Kullanici sadece bakmiyor; senaryo degistirip pik yuk, maliyet ve esnek yuk etkisini hissediyor.
            </p>
          </div>

          <FlexgridSimulator />
        </div>
      </section>

      <section id="architecture" className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-700/72">Mimari</p>
            <h2 className="font-display text-4xl font-semibold tracking-[-0.04em] text-slate-950 md:text-5xl">
              UI, simulasyon ve disa aktarim ayni cekirdege bagli.
            </h2>
            <p className="text-base leading-7 text-slate-600 md:text-lg">
              Bu sayede ekrandaki sayilar ile indirilen CSV ayni senaryo mantigindan gelir. Yarin
              telemetri ekledigimizde yine ayni cekirdegi besleriz.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
            <section className="rounded-[2.4rem] bg-[#07103a] p-8 text-white shadow-[0_30px_90px_rgba(7,16,58,0.24)] md:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200/76">Veri akisi</p>
              <div className="mt-8 space-y-5">
                {[
                  "Kullanici tesis tipi, EV sayisi, strateji ve batarya modunu secer.",
                  "FlexGrid cekirdegi 24 saatlik yuk egirisini ve KPI'lari hesaplar.",
                  "Grafikler ve karar kartlari ayni sonucu gosterir.",
                  "Ayni senaryo JSON veya CSV olarak disa aktarilabilir.",
                  "Gelecek fazda ESP32 veya akilli priz telemetrisi bu cekirdegi besler."
                ].map((item, index) => (
                  <div key={item} className="flex gap-4 border-t border-white/10 pt-5 first:border-t-0 first:pt-0">
                    <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/38">
                      0{index + 1}
                    </div>
                    <p className="text-sm leading-7 text-white/72">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Sunum katmani",
                  description: "Next.js rota ve simulator bilesenleri etkileşimi ve gorsel deneyimi tasir."
                },
                {
                  title: "Icerik katmani",
                  description: "Proje dili, yol haritasi ve sektor anlatisi merkezi bir kopya kaynaginda tutulur."
                },
                {
                  title: "Muhendislik cekirdegi",
                  description: "Tesis profilleri, stratejiler ve KPI hesaplari tek utility dosyasinda yasar."
                },
                {
                  title: "Export katmani",
                  description: "UI ile ayni senaryoyu JSON veya CSV olarak sunar; bu da sunum tutarliligi saglar."
                }
              ].map((item) => (
                <Card key={item.title}>
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-7 text-slate-600">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </section>
          </div>
        </div>
      </section>

      <section id="roadmap" className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2.6rem] bg-[#07103a] p-8 text-white shadow-[0_35px_120px_rgba(7,16,58,0.32)] md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200/76">
              4 Haftalik Plan
            </p>
            <h2 className="font-display mt-4 max-w-sm text-4xl font-semibold tracking-[-0.04em] [text-wrap:balance]">
              Hedefimiz fikri degil, teslim edilebilir urunu buyutmek.
            </h2>
            <div className="mt-10 space-y-6">
              {flexgridCopy.phases.map((phase, index) => (
                <article key={phase.week} className="border-t border-white/10 pt-6 first:border-t-0 first:pt-0">
                  <div className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-white/36">
                    0{index + 1} · {phase.week}
                  </div>
                  <h3 className="text-xl font-semibold leading-snug text-white">{phase.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/68">{phase.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[2.6rem] border border-slate-200 bg-white/92 p-6 shadow-[0_35px_120px_rgba(15,23,42,0.08)] md:p-8">
            <div className="space-y-3 border-b border-slate-200 pb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700/72">
                GitHub Ciktilari
              </p>
              <h2 className="font-display text-4xl font-semibold tracking-[-0.04em] text-slate-950 [text-wrap:balance]">
                Repo, sunum ve teknik anlatim ayni hikayeyi anlatmali.
              </h2>
              <p className="text-sm leading-7 text-slate-600">
                Buradaki dosya duzeni ve teslim mantigi, projeyi staj ve mulakat anlatimina uygun hale getirir.
              </p>
            </div>

            <div className="grid gap-4 pt-6 md:grid-cols-2">
              {flexgridCopy.repoLayout.map((item, index) => {
                const Icon = iconMap[index] ?? Layers3;

                return (
                  <Card key={item} className="border-slate-200/80 shadow-none">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full border border-slate-200 bg-slate-50 p-3">
                          <Icon className="h-5 w-5 text-slate-950" />
                        </div>
                        <CardTitle className="text-lg">{item}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm leading-6 text-slate-600">
                        Bu parca, repoda “oyuncak demo” degil, duzenli urun mantigi kurdugunu gosterir.
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-8 rounded-[2rem] border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-800">Sonraki teknik adimlar</p>
              <div className="mt-4 space-y-3">
                {flexgridCopy.stack.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <p className="text-sm leading-6 text-emerald-950">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}




