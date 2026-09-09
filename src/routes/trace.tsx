import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { HopGraph } from "@/components/graph/hop-graph";
import { FreezePanel } from "@/components/notice/freeze-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateOfficerBrief } from "@/lib/garuda/ai-brief";
import { explainRisk } from "@/lib/garuda/ml-risk";
import { runTrace } from "@/lib/garuda/engine";
import { displayAddress, inr, riskTone, usdt } from "@/lib/garuda/format";
import { t } from "@/lib/garuda/i18n";
import { detectChain, fetchLiveHops } from "@/lib/garuda/live";
import { COMPLAINTS } from "@/lib/garuda/registry";
import { useGaruda } from "@/lib/garuda/store";
import type { TraceResult, TxHop } from "@/lib/garuda/types";
import { cn } from "@/lib/utils";

type Search = { wallet?: string; caseId?: string; run?: string };

export const Route = createFileRoute("/trace")({
  component: TracePage,
  validateSearch: (s: Record<string, unknown>): Search => ({
    wallet: typeof s.wallet === "string" ? s.wallet : undefined,
    caseId: typeof s.caseId === "string" ? s.caseId : undefined,
    run: typeof s.run === "string" ? s.run : undefined,
  }),
});

const PIPE = [
  "Screening OFAC / FIU-IND / NCRP repeat matches",
  "Walking outbound hops (cap 6) with cycle guard",
  "Attributing VASP clusters and co-spent inputs",
  "Inspecting bridges for destination-chain recipients",
  "Correlating wallets against other NCRP complaints",
  "Valuing recoverable INR at Indian VASPs",
];

function TracePage() {
  const search = Route.useSearch();
  const lang = useGaruda((s) => s.lang);
  const officerId = useGaruda((s) => s.officerId);
  const setOfficerId = useGaruda((s) => s.setOfficerId);
  const addressMode = useGaruda((s) => s.addressMode);
  const setAddressMode = useGaruda((s) => s.setAddressMode);
  const lastTrace = useGaruda((s) => s.lastTrace);
  const setTrace = useGaruda((s) => s.setTrace);
  const logAction = useGaruda((s) => s.logAction);

  const [wallet, setWallet] = useState(search.wallet ?? "0xSuspect_Burner_Wallet_A");
  const [caseId, setCaseId] = useState(search.caseId ?? "NCRP-2026-1001");
  const [source, setSource] = useState<"sim" | "eth" | "btc" | "tron" | "auto">("sim");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(0);
  const [brief, setBrief] = useState<string | null>(null);
  const [briefing, setBriefing] = useState(false);

  const autoRan = useRef(false);

  useEffect(() => {
    if (search.wallet) setWallet(search.wallet);
    if (search.caseId) setCaseId(search.caseId);
  }, [search.wallet, search.caseId]);

  useEffect(() => {
    if (search.run === "1" && search.wallet && !autoRan.current) {
      autoRan.current = true;
      void execute(search.wallet, search.caseId, "sim");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.run, search.wallet, search.caseId]);

  async function execute(w = wallet, cid = caseId, src = source) {
    setBusy(true);
    setBrief(null);
    setStep(0);
    for (let i = 0; i < PIPE.length; i++) {
      setStep(i + 1);
      await new Promise((r) => setTimeout(r, 220));
    }
    let extra: Record<string, TxHop[]> | undefined;
    let mode: TraceResult["mode"] = "simulated";
    if (src !== "sim") {
      const chain =
        src === "btc"
          ? "bitcoin"
          : src === "tron"
            ? "tron"
            : src === "auto"
              ? detectChain(w)
              : "ethereum";
      const live = await fetchLiveHops({
        data: { address: w, chain, walk: true },
      });
      if (live.status === "SUCCESS" && (live.hops.length || Object.keys(live.ledger).length)) {
        extra = live.ledger;
        mode = "live";
        toast(`Live ${live.chain} ledger: ${live.hops.length} outbound hops (indexed)`);
      } else {
        toast(
          live.status === "RATE_LIMITED"
            ? "Live API rate-limited — using simulated ledger"
            : "Live lookup empty — using simulated ledger",
        );
      }
    }
    const result = runTrace(w, { caseId: cid || undefined, extraLedger: extra, mode });
    setTrace(result);
    await logAction(w, `Trace ${cid || "unattached"} via ${mode} ledger`);
    setBusy(false);
  }

  const trace = lastTrace;

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-serif text-3xl md:text-4xl">{t(lang, "trace.title")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">{t(lang, "trace.hint")}</p>

      <Card className="mt-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="officer">{t(lang, "trace.officer")}</Label>
            <Input id="officer" value={officerId} onChange={(e) => setOfficerId(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="wallet">{t(lang, "trace.wallet")}</Label>
            <Input
              id="wallet"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="font-mono"
            />
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <div>
            <Label htmlFor="case">NCRP complaint</Label>
            <select
              id="case"
              value={caseId}
              onChange={(e) => {
                const id = e.target.value;
                setCaseId(id);
                const c = COMPLAINTS.find((x) => x.id === id);
                if (c) setWallet(c.victimWallet);
              }}
              className="flex h-11 w-full rounded-md border border-border bg-bg px-3 text-sm"
            >
              {COMPLAINTS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} · {c.victimWallet}
                </option>
              ))}
              <option value="">Unattached / custom</option>
            </select>
          </div>
          <div>
            <Label htmlFor="src">{t(lang, "trace.source")}</Label>
            <select
              id="src"
              value={source}
              onChange={(e) => setSource(e.target.value as typeof source)}
              className="flex h-11 w-full rounded-md border border-border bg-bg px-3 text-sm"
            >
              <option value="sim">{t(lang, "trace.sim")}</option>
              <option value="auto">{t(lang, "trace.auto")}</option>
              <option value="eth">{t(lang, "trace.eth")}</option>
              <option value="btc">{t(lang, "trace.btc")}</option>
              <option value="tron">{t(lang, "trace.tron")}</option>
            </select>
          </div>
          <Button className="w-full md:w-auto" disabled={busy} onClick={() => void execute()}>
            {t(lang, "trace.run")}
          </Button>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className={cn("h-9 rounded-md px-3 text-xs", addressMode === "label" ? "bg-surface-2 text-fg" : "text-muted")}
            onClick={() => setAddressMode("label")}
          >
            {t(lang, "trace.labels")}
          </button>
          <button
            type="button"
            className={cn("h-9 rounded-md px-3 text-xs", addressMode === "hex" ? "bg-surface-2 text-fg" : "text-muted")}
            onClick={() => setAddressMode("hex")}
          >
            {t(lang, "trace.hex")}
          </button>
        </div>
        {busy ? (
          <div className="mt-5">
            <Progress value={(step / PIPE.length) * 100} tone="info" />
            <p className="mt-2 text-sm text-muted">{PIPE[Math.max(0, step - 1)]}</p>
          </div>
        ) : null}
      </Card>

      {!trace && !busy ? (
        <p className="mt-8 text-sm text-muted">{t(lang, "empty.trace")}</p>
      ) : null}

      {trace ? <Results trace={trace} brief={brief} setBrief={setBrief} briefing={briefing} setBriefing={setBriefing} /> : null}
    </div>
  );
}

function Results({
  trace,
  brief,
  setBrief,
  briefing,
  setBriefing,
}: {
  trace: TraceResult;
  brief: string | null;
  setBrief: (s: string | null) => void;
  briefing: boolean;
  setBriefing: (b: boolean) => void;
}) {
  const lang = useGaruda((s) => s.lang);
  const mode = useGaruda((s) => s.addressMode);
  const exchanges = trace.endpoints.filter((e) => e.kind === "vasp").length;
  const top = trace.endpoints[0];
  const tone = top ? riskTone(top.risk) : "ok";
  const riskKey = tone === "danger" ? "risk.high" : tone === "warn" ? "risk.med" : "risk.low";
  const total = trace.recoverableUsdt + trace.atRiskUsdt + trace.lostUsdt || 1;

  return (
    <div className="mt-8 animate-fade-up">
      <div
        className={cn(
          "rounded-xl border-l-4 p-5",
          tone === "danger" && "border-danger bg-danger/10",
          tone === "warn" && "border-warn bg-warn/10",
          tone === "ok" && "border-ok bg-ok/10",
        )}
      >
        <h2 className="font-serif text-2xl">{t(lang, riskKey)}</h2>
        {top ? (
          <p className="mt-2 text-sm leading-relaxed">
            Money reached <strong>{top.entity}</strong> ({top.risk}/100, {top.hops} hops). Recoverable at Indian
            VASPs: <strong>{usdt(trace.recoverableUsdt)}</strong> ≈ {inr(trace.recoverableUsdt)}. Mixer / sanctioned:{" "}
            {usdt(trace.lostUsdt)}.
          </p>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <Kpi label={t(lang, "res.wallets")} value={String(trace.nodes.length)} />
        <Kpi label={t(lang, "res.exchanges")} value={String(exchanges)} />
        <Kpi label={t(lang, "res.patterns")} value={String(trace.typologies.length)} />
        <Kpi label={t(lang, "res.bridges")} value={String(trace.bridges.length)} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {trace.recovery.map((s) => (
          <div key={s.label} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <div className="text-xs text-muted">{s.label}</div>
            <div
              className={cn(
                "mt-1 font-serif text-xl tabular-nums",
                s.tone === "ok" && "text-ok",
                s.tone === "warn" && "text-warn",
                s.tone === "danger" && "text-danger",
                s.tone === "muted" && "text-muted",
              )}
            >{usdt(s.usdt)}</div>
            <div className="text-xs text-subtle">{inr(s.usdt)}</div>
            <Progress className="mt-2" value={(s.usdt / total) * 100} tone={s.tone === "muted" ? "info" : s.tone} />
          </div>
        ))}
      </div>

      <ol className="mt-5 space-y-2">
        {trace.recommendations.map((r) => (
          <li key={r.title} className="rounded-xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={r.priority === 1 ? "danger" : r.priority === 2 ? "warn" : "info"}>P{r.priority}</Badge>
              <span className="text-sm font-medium">{r.title}</span>
            </div>
            <p className="mt-1 text-sm text-muted">{r.detail}</p>
          </li>
        ))}
      </ol>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="secondary"
          disabled={briefing}
          onClick={async () => {
            setBriefing(true);
            const res = await generateOfficerBrief({ data: { trace, lang } });
            setBrief(res.text);
            setBriefing(false);
          }}
        >
          {briefing ? t(lang, "brief.working") : t(lang, "brief.cta")}
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link to="/dossier">{t(lang, "dossier")}</Link>
        </Button>
      </div>

      {brief ? (
        <Card className="mt-4">
          <h3 className="text-sm font-medium">Officer briefing</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted">{brief}</p>
        </Card>
      ) : null}

      <Tabs defaultValue="summary" className="mt-8">
        <TabsList>
          <TabsTrigger value="summary">{t(lang, "tab.summary")}</TabsTrigger>
          <TabsTrigger value="graph">{t(lang, "tab.graph")}</TabsTrigger>
          <TabsTrigger value="landed">{t(lang, "tab.landed")}</TabsTrigger>
          <TabsTrigger value="related">{t(lang, "tab.related")}</TabsTrigger>
          <TabsTrigger value="notice">{t(lang, "tab.notice")}</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <ul className="space-y-3">
            {trace.endpoints.slice(0, 6).map((e) => (
              <li key={e.wallet} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{e.entity}</span>
                  <Badge tone={riskTone(e.risk)}>{e.risk}/100</Badge>
                  <span className="text-xs text-muted">{e.chainHint}</span>
                </div>
                <p className="mt-1 font-mono text-xs text-subtle">
                  {displayAddress(e.wallet, mode)} · {e.hops} hops · {usdt(e.amountUsdt)}
                </p>
                <p className="mt-1 text-xs text-muted">{explainRisk(e).join(" ")}</p>
              </li>
            ))}
          </ul>
          {trace.typologies.length ? (
            <div className="mt-4 space-y-2">
              {trace.typologies.map((ty) => (
                <div key={ty.typology + ty.node} className="rounded-xl border border-warn/30 bg-warn/10 p-4">
                  <div className="text-sm font-medium">{ty.typology}</div>
                  <p className="mt-1 text-sm text-muted">{ty.description}</p>
                  <p className="mt-2 text-sm">{ty.officerNote}</p>
                </div>
              ))}
            </div>
          ) : null}
          {trace.classified ? (
            <Card className="mt-4">
              <div className="text-xs text-muted">Auto-classified typology</div>
              <div className="mt-1 text-sm font-medium">
                {trace.classified.id.replace("_", " ")} · {trace.classified.confidence}%
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                {trace.classified.reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </Card>
          ) : null}
          {trace.contractHits?.length ? (
            <Card className="mt-4">
              <div className="text-xs text-muted">Mixer / DeFi contracts on this walk</div>
              <ul className="mt-2 space-y-1 text-sm">
                {trace.contractHits.map((h) => (
                  <li key={h.node}>
                    <Badge tone={h.kind === "mixer" ? "danger" : "info"}>{h.kind}</Badge> {h.label}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </TabsContent>
        <TabsContent value="graph">
          <HopGraph trace={trace} />
        </TabsContent>
        <TabsContent value="landed">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs tracking-wide text-muted uppercase">
                <tr>
                  <th className="pb-2 pr-3">Entity</th>
                  <th className="pb-2 pr-3">Wallet</th>
                  <th className="pb-2 pr-3">Hops</th>
                  <th className="pb-2 pr-3">Value</th>
                  <th className="pb-2">Risk</th>
                </tr>
              </thead>
              <tbody>
                {trace.endpoints.map((e) => (
                  <tr key={e.wallet} className="border-t border-border">
                    <td className="py-2 pr-3">{e.entity}</td>
                    <td className="py-2 pr-3 font-mono text-xs">{displayAddress(e.wallet, mode)}</td>
                    <td className="py-2 pr-3 tabular-nums">{e.hops}</td>
                    <td className="py-2 pr-3 tabular-nums">{usdt(e.amountUsdt)}</td>
                    <td className="py-2">
                      <Badge tone={riskTone(e.risk)}>{e.risk}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="related">
          {trace.clusters.length ? (
            trace.clusters.map((c) => (
              <Card key={c.root} className="mb-3">
                <div className="text-sm font-medium">{c.attributed}</div>
                <pre className="mt-2 font-mono text-xs text-muted">{c.wallets.map((w) => displayAddress(w, mode)).join("\n")}</pre>
              </Card>
            ))
          ) : (
            <p className="text-sm text-muted">No co-spend clusters on this walk.</p>
          )}
          <h3 className="mt-6 text-sm font-medium">Cross-chain</h3>
          {trace.bridges.length ? (
            trace.bridges.map((b) => (
              <p key={b.bridge} className="mt-2 text-sm text-muted">
                {b.bridge}: {b.amount} {b.sourceAsset} → {b.targetNetwork} ({b.targetRecipient})
              </p>
            ))
          ) : (
            <p className="mt-2 text-sm text-muted">No bridge events.</p>
          )}
          <h3 className="mt-6 text-sm font-medium">Other NCRP complaints sharing wallets</h3>
          {trace.correlations.length ? (
            <ul className="mt-2 space-y-2">
              {trace.correlations.slice(0, 6).map((c) => (
                <li key={c.wallet} className="text-sm">
                  <span className="font-mono text-xs">{displayAddress(c.wallet, mode)}</span>
                  <span className="text-muted"> · {c.complaintIds.join(", ")} — {c.note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted">No overlap with other queued complaints.</p>
          )}
        </TabsContent>
        <TabsContent value="notice">
          <FreezePanel trace={trace} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 font-serif text-2xl tabular-nums">{value}</div>
    </div>
  );
}
