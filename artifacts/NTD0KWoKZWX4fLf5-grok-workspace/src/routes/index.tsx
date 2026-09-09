import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Shield } from "lucide-react";
import { FreezeClock } from "@/components/clock";
import { KpiStat } from "@/components/kpi-stat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { COMPLAINTS, DIRECTORY, TYPOLOGY_LABEL } from "@/lib/garuda/registry";
import { inr, usdt } from "@/lib/garuda/format";
import { runTrace } from "@/lib/garuda/engine";
import { t } from "@/lib/garuda/i18n";
import { useGaruda } from "@/lib/garuda/store";

export const Route = createFileRoute("/")({ component: Command });

function Command() {
  const lang = useGaruda((s) => s.lang);
  const indian = DIRECTORY.filter((d) => d.jurisdiction === "India" && d.kind === "vasp").length;
  const tight = COMPLAINTS.find((c) => c.hoursAgo === Math.max(...COMPLAINTS.map((x) => x.hoursAgo)));
  const demo = runTrace("0xSuspect_Burner_Wallet_A", { caseId: "NCRP-2026-1001" });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="ledger-grid -mx-4 -mt-6 mb-8 rounded-none border-b border-border px-4 py-10 md:-mx-8 md:px-8">
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">{t(lang, "app.org")}</p>
        <h1 className="mt-3 max-w-2xl font-serif text-4xl text-fg md:text-5xl">{t(lang, "app.name")}</h1>
        <p className="mt-2 font-serif text-lg text-muted">{t(lang, "app.sub")}</p>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">{t(lang, "home.lead")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/trace" search={{ wallet: "0xSuspect_Burner_Wallet_A", caseId: "NCRP-2026-1001", run: "1" }}>
              {t(lang, "home.demo")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/trace">{t(lang, "home.trace")}</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/playbook">{t(lang, "nav.playbook")}</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiStat label={t(lang, "kpi.pending")} value={String(COMPLAINTS.length)} hint="From NCRP / SAHYOG" />
        <KpiStat
          label={t(lang, "kpi.window")}
          value={tight ? `${48 - tight.hoursAgo}h` : "—"}
          hint={tight?.id}
          tone="danger"
        />
        <KpiStat
          label={t(lang, "kpi.recoverable")}
          value={demo.recoverableUsdt.toLocaleString("en-IN")}
          hint={`${inr(demo.recoverableUsdt)} at Indian VASPs`}
          tone="ok"
        />
        <KpiStat label={t(lang, "kpi.indian")} value={String(indian)} hint="Freezeable without MLAT" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section>
          <h2 className="font-serif text-2xl">{t(lang, "home.queue")}</h2>
          <p className="mt-1 text-sm text-muted">Oldest freeze window first. Click through to attribute the wallet.</p>
          <ul className="mt-4 space-y-3">
            {[...COMPLAINTS]
              .sort((a, b) => b.hoursAgo - a.hoursAgo)
              .map((c) => (
                <li key={c.id}>
                  <Card className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm">{c.id}</span>
                        <Badge tone={c.hoursAgo > 36 ? "danger" : c.hoursAgo > 18 ? "warn" : "ok"}>
                          {TYPOLOGY_LABEL[c.typology][lang]}
                        </Badge>
                        <FreezeClock hoursAgo={c.hoursAgo} />
                      </div>
                      <p className="mt-2 text-sm text-muted">{c.brief}</p>
                      <p className="mt-1 font-mono text-xs text-subtle">
                        {c.victimWallet} · {usdt(c.amountUsdt)} · {c.state}
                      </p>
                    </div>
                    <Button asChild size="sm" className="shrink-0">
                      <Link to="/trace" search={{ wallet: c.victimWallet, caseId: c.id, run: "1" }}>
                        {t(lang, "home.track")}
                      </Link>
                    </Button>
                  </Card>
                </li>
              ))}
          </ul>
        </section>

        <aside className="space-y-4">
          <Card>
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 size-4 text-primary" />
              <div>
                <h3 className="text-sm font-medium">What previous teams missed</h3>
                <ul className="mt-2 space-y-2 text-sm text-muted">
                  <li>A 48-hour recovery clock tied to the NCRP timestamp.</li>
                  <li>Bilingual SAHYOG freeze notices (CrPC 91 · PMLA 17 · IT Act).</li>
                  <li>Syndicate correlation across complaints — same wallets, many victims.</li>
                  <li>Recoverable rupees, not just a matplotlib graph.</li>
                </ul>
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-medium">How to demo this in 90 seconds</h3>
            <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-sm text-muted">
              <li>Hit “Run jury demo” — investment scam NCRP-2026-1001.</li>
              <li>Read the risk banner and the rupee recovery split.</li>
              <li>Play the hop graph, then generate the WazirX freeze notice in Hindi.</li>
              <li>Open Complaints and show the same wallets in two other cases.</li>
            </ol>
          </Card>
        </aside>
      </div>
    </div>
  );
}
