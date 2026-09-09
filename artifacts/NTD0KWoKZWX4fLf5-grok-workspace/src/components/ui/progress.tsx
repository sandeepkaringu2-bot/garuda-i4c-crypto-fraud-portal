import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  tone = "ok",
}: {
  value: number;
  className?: string;
  tone?: "ok" | "warn" | "danger" | "info";
}) {
  const color =
    tone === "danger"
      ? "bg-danger"
      : tone === "warn"
        ? "bg-warn"
        : tone === "info"
          ? "bg-info"
          : "bg-ok";
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-2", className)}>
      <div className={cn("h-full rounded-full", color)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
