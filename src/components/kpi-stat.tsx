import { cn } from "@/lib/utils";

export function KpiStat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "danger" | "ok" | "warn";
}) {
  return (
    <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
      <div className="text-xs font-medium tracking-wide text-muted uppercase">{label}</div>
      <div
        className={cn(
          "mt-2 font-serif text-2xl tabular-nums tracking-tight",
          tone === "danger" && "text-danger",
          tone === "ok" && "text-ok",
          tone === "warn" && "text-warn",
          !tone && "text-fg",
        )}
      >
        {value}
      </div>
      {hint ? <div className="mt-1 text-xs text-subtle">{hint}</div> : null}
    </div>
  );
}
