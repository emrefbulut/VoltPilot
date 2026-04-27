import { Activity, Cpu, Database, GitBranch, Layers3, PlugZap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { flexgridCopy } from "@/src/content/flexgrid-copy";
import { FlexgridSimulator } from "@/components/energy/flexgrid-simulator";

const repoIcons = [PlugZap, Cpu, Database, GitBranch];

export function FlexgridPage() {
  return (
    <main className="bg-[#f7f8f4]">
      <FlexgridSimulator />

      <section id="architecture" className="border-t border-zinc-200 px-4 py-14 md:px-6">
        <div className="mx-auto max-w-[92rem] space-y-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-emerald-800">Architecture</p>
            <h2 className="mt-2 text-3xl font-semibold text-zinc-950 md:text-4xl">
              One simulation core powers the UI, JSON response, and CSV report.
            </h2>
            <p className="mt-3 text-base leading-7 text-zinc-600">
              The application is intentionally small, but it has a real engineering boundary: scenario inputs flow
              into a reusable model, then the product surface and exports consume the same output.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Scenario inputs",
                description: "Facility type, tariff, EV density, storage, and control strategy."
              },
              {
                title: "Simulation core",
                description: "Hourly load, cost, carbon, asset share, stress, and readiness scoring."
              },
              {
                title: "Operator cockpit",
                description: "Controls, charts, strategy comparison, and recommendations."
              },
              {
                title: "Export layer",
                description: "CSV and JSON outputs generated from the same model used by the screen."
              }
            ].map((item, index) => {
              const Icon = repoIcons[index] ?? Layers3;

              return (
                <Card key={item.title}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
                        <Icon className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                      </div>
                      <CardTitle>{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-zinc-600">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="roadmap" className="border-t border-zinc-200 px-4 py-14 md:px-6">
        <div className="mx-auto grid max-w-[92rem] gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div>
            <p className="text-sm font-semibold text-emerald-800">Roadmap</p>
            <h2 className="mt-2 text-3xl font-semibold text-zinc-950 md:text-4xl">Finished MVP, clear hardware path.</h2>
            <p className="mt-3 text-base leading-7 text-zinc-600">
              The current version is complete as a software-first portfolio project. The next phase can add one
              measured telemetry channel without changing the public product story.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {flexgridCopy.phases.map((phase) => (
              <Card key={phase.week}>
                <CardHeader>
                  <p className="text-sm font-semibold text-emerald-700">{phase.week}</p>
                  <CardTitle>{phase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-zinc-600">{phase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 px-4 py-14 md:px-6">
        <div className="mx-auto grid max-w-[92rem] gap-6 xl:grid-cols-[1fr_420px]">
          <div>
            <p className="text-sm font-semibold text-emerald-800">Repository value</p>
            <h2 className="mt-2 text-3xl font-semibold text-zinc-950 md:text-4xl">Built to be read, run, and extended.</h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600">
              FlexGrid-TR is not only a visual demo. It has a reusable scenario engine, an API export path, public
              documentation, and a credible next step toward low-cost telemetry.
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                <CardTitle>Stack</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {flexgridCopy.stack.map((item) => (
                  <div key={item} className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
