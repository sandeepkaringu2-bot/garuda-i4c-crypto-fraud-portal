import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { t } from "@/lib/garuda/i18n";
import { SANCTIONS } from "@/lib/garuda/registry";
import { useGaruda } from "@/lib/garuda/store";

export const Route = createFileRoute("/intel")({ component: IntelPage });

function IntelPage() {
  const lang = useGaruda((s) => s.lang);
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-serif text-3xl md:text-4xl">{t(lang, "intel.title")}</h1>
      <p className="mt-2 text-sm text-muted">
        Every hop is screened against OFAC SDN, FIU-IND alerts, and NCRP repeat-match clusters before the graph grows.
        A mixer match is terminal. A collection-node match is not — we keep walking.
      </p>
      <div className="mt-6 space-y-3">
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
      <Card className="mt-8">
        <h2 className="font-serif text-xl">Why this screening order</h2>
        <p className="mt-2 text-sm text-muted">
          Earlier versions of this problem-statement treated every sanctioned hit as a dead end. That hid the TRON
          ransomware collection node’s bridge into CoinDCX. Garuda flags the hit, then keeps walking unless the address
          is a mixer — because mixers destroy recoverability, collection nodes do not.
        </p>
      </Card>
    </div>
  );
}
