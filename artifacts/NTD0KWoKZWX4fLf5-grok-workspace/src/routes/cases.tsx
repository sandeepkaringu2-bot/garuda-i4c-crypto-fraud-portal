import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FreezeClock } from "@/components/clock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { runTrace } from "@/lib/garuda/engine";
import { usdt } from "@/lib/garuda/format";
import { t } from "@/lib/garuda/i18n";
import { COMPLAINTS, TYPOLOGY_LABEL } from "@/lib/garuda/registry";
import { useGaruda } from "@/lib/garuda/store";

export const Route = createFileRoute("/cases")({ component: CasesPage });

function CasesPage() {
  const lang = useGaruda((s) => s.lang);
  const extra = useGaruda((s) => s.extraComplaints);
  const addComplaint = useGaruda((s) => s.addComplaint);
  const [id, setId] = useState("NCRP-2026-");
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState("2500");

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-serif text-3xl md:text-4xl">{t(lang, "cases.title")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        NCRP queue plus a local intake form. Same wallet in two complaints is treated as organised activity — Garuda
        flags it on the trace.
      </p>

      <div className="mt-6 grid gap-4">
        {COMPLAINTS.map((c) => {
          const overlap = COMPLAINTS.filter((o) => o.id !== c.id).filter((o) => {
            const a = runTrace(c.victimWallet);
            const b = new Set(runTrace(o.victimWallet).nodes.map((n) => n.id));
            return a.nodes.some((n) => b.has(n.id));
          });
          return (
            <Card key={c.id} className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm">{c.id}</span>
                <Badge>{TYPOLOGY_LABEL[c.typology][lang]}</Badge>
                <Badge tone="info">{c.state}</Badge>
                <FreezeClock hoursAgo={c.hoursAgo} />
              </div>
              <p className="mt-2 text-sm text-muted">{c.brief}</p>
              <p className="mt-1 font-mono text-xs text-subtle">
                {c.victimWallet} · {usdt(c.amountUsdt)}
              </p>
              {overlap.length ? (
                <p className="mt-2 text-sm text-warn">
                  Shares graph with {overlap.map((o) => o.id).join(", ")} — syndicate signal.
                </p>
              ) : null}
              <Button asChild size="sm" className="mt-3">
                <Link to="/trace" search={{ wallet: c.victimWallet, caseId: c.id, run: "1" }}>
                  {t(lang, "home.track")}
                </Link>
              </Button>
            </Card>
          );
        })}
        {extra.map((c) => (
          <Card key={c.id} className="p-4">
            <div className="font-mono text-sm">{c.id}</div>
            <p className="mt-1 font-mono text-xs text-subtle">
              {c.wallet} · {usdt(c.amountUsdt)} · {c.typology}
            </p>
            <Button asChild size="sm" className="mt-3">
              <Link to="/trace" search={{ wallet: c.wallet, caseId: c.id, run: "1" }}>
                {t(lang, "home.track")}
              </Link>
            </Button>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <h2 className="font-serif text-xl">Simulate NCRP webhook</h2>
        <p className="mt-1 text-sm text-muted">
          In production this is the FastAPI /webhook/ncrp-alert endpoint. Here it lands in the local queue.
        </p>
        <form
          className="mt-4 grid gap-3 md:grid-cols-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!id || !wallet) return;
            addComplaint({ id, wallet, amountUsdt: Number(amount) || 0, typology: "custom" });
            setWallet("");
          }}
        >
          <div>
            <Label htmlFor="nid">Complaint ID</Label>
            <Input id="nid" value={id} onChange={(e) => setId(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="nw">Wallet</Label>
            <Input id="nw" className="font-mono" value={wallet} onChange={(e) => setWallet(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="na">USDT</Label>
            <Input id="na" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <Button type="submit" className="md:col-span-3">
            Queue complaint
          </Button>
        </form>
      </Card>
    </div>
  );
}
