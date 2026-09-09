import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { t } from "@/lib/garuda/i18n";
import { DEFI_ROUTERS, MIXER_CONTRACTS, SANCTIONS } from "@/lib/garuda/registry";
import { indexStats } from "@/lib/garuda/live";
import { useGaruda } from "@/lib/garuda/store";

export const Route = createFileRoute("/intel")({ component: IntelPage });

function IntelPage() {
  const lang = useGaruda((s) => s.lang);
  const [stats, setStats] = useState<{ cachedAddresses: number; ttlMinutes: number } | null>(null);
  useEffect(() => {
    void indexStats().then(setStats).catch(() => setStats({ cachedAddresses: 0, ttlMinutes: 10 }));
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-serif text-3xl md:text-4xl">{t(lang, "intel.title")}</h1>
      <p className="mt-2 text-sm text-muted">
        Live hop cache, OFAC / FIU screening, mixer contracts, and DeFi routers. A mixer match is terminal. A
        collection-node match is not — we keep walking.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Card className="p-4">
          <div className="text-xs text-muted">Indexed addresses (live cache)</div>
          <div className="mt-1 font-serif text-3xl tabular-nums">{stats?.cachedAddresses ?? "—"}</div>
          <p className="mt-1 text-xs text-subtle">TTL {stats?.ttlMinutes ?? 10} min · per-request walk, no full-chain node</p>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted">Mixer contracts screened</div>
          <div className="mt-1 font-serif text-3xl tabular-nums">{Object.keys(MIXER_CONTRACTS).length}</div>
          <p className="mt-1 text-xs text-subtle">Plus equal-lot deposit heuristic</p>
        </Card>
      </div>

      <h2 className="mt-10 font-serif text-2xl">Sanctions & collection nodes</h2>
      <div className="mt-4 space-y-3">
        {Object.entries(SANCTIONS).map(([wallet, s]) => (
          <Card key={wallet} className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={s.severity === "CRITICAL" ? "danger" : "warn"}>{s.severity}</Badge>
              <Badge>{s.source}</Badge>
              {s.terminal ? <Badge tone="danger">Terminal hop</Badge> : <Badge tone="info">Continue tracing</Badge>}
            </div>
            <p className="mt-2 font-mono text-xs">{wallet}</p>
            <p className="mt-2 text-sm text-muted">{s.reason}</p>
          </Card>
        ))}
      </div>

      <h2 className="mt-10 font-serif text-2xl">Live mixer / privacy pools</h2>
      <ul className="mt-3 space-y-2">
        {Object.entries(MIXER_CONTRACTS).map(([addr, name]) => (
          <li key={addr} className="rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]">
            <div className="text-sm font-medium">{name}</div>
            <div className="font-mono text-[11px] text-muted break-all">{addr}</div>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-serif text-2xl">DeFi / bridge routers</h2>
      <p className="mt-1 text-sm text-muted">
        Hits are layering, not terminal. Garuda labels the protocol and keeps walking to the custodial sink.
      </p>
      <ul className="mt-3 space-y-2">
        {Object.entries(DEFI_ROUTERS).map(([addr, name]) => (
          <li key={addr} className="rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]">
            <div className="text-sm font-medium">{name}</div>
            <div className="font-mono text-[11px] text-muted break-all">{addr}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
