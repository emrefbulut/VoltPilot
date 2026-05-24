import { cn } from "@/src/lib/utils/cn";

export function VoltPilotMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-teal-400 text-slate-950 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]",
        className
      )}
    >
      <span className="absolute inset-1 rounded-md border border-slate-950/15" />
      <span className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-slate-950" />
      <span className="absolute bottom-2 right-2 h-1.5 w-5 rounded-full bg-slate-950" />
      <span className="relative text-[17px] font-black leading-none tracking-normal">V</span>
    </span>
  );
}

export function VoltPilotLogo({
  className,
  subtitle
}: {
  className?: string;
  subtitle?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <VoltPilotMark />
      <span>
        <span className="block text-sm font-semibold leading-4">VoltPilot</span>
        {subtitle ? <span className="block text-xs text-white/45">{subtitle}</span> : null}
      </span>
    </span>
  );
}
