import { useEffect, useState } from "react";
import { formatDuration, slaRemaining } from "@/lib/garuda/format";
import { t } from "@/lib/garuda/i18n";
import { useGaruda } from "@/lib/garuda/store";
import { cn } from "@/lib/utils";

export function FreezeClock({ hoursAgo, compact }: { hoursAgo: number; compact?: boolean }) {
  const lang = useGaruda((s) => s.lang);
  const [left, setLeft] = useState(() => slaRemaining(hoursAgo));

  useEffect(() => {
    setLeft(slaRemaining(hoursAgo));
    const id = setInterval(() => setLeft(slaRemaining(hoursAgo)), 30000);
    return () => clearInterval(id);
  }, [hoursAgo]);

  const closed = left <= 0;
  const tight = left > 0 && left < 4 * 3600000;
  const label = closed ? t(lang, "clock.closed") : `${formatDuration(left)} ${t(lang, "clock.left")}`;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums",
        closed && "bg-danger/15 text-danger",
        tight && !closed && "bg-warn/15 text-warn",
        !tight && !closed && "bg-ok/15 text-ok",
        compact && "text-[11px]",
      )}
    >
      {label}
    </span>
  );
}
