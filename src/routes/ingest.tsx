import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { t } from "@/lib/garuda/i18n";
import { useGaruda } from "@/lib/garuda/store";

export const Route = createFileRoute("/ingest")({ component: IngestPage });

const SAMPLE = `{
  "complaint_id": "NCRP-2026-1888",
  "victim_wallet": "0xSuspect_Burner_Wallet_A",
  "amount_usdt": 4200,
  "typology": "phishing",
  "state": "Rajasthan",
  "narrative": "UPI mule instructed victim to send USDT-ERC20."
}`;

function IngestPage() {
  const extra = useGaruda((s) => s.extraComplaints);
  const addComplaint = useGaruda((s) => s.addComplaint);
  const dispatches = useGaruda((s) => s.dispatches);
  const ackDispatch = useGaruda((s) => s.ackDispatch);
  const logAction = useGaruda((s) => s.logAction);
  const lang = useGaruda((s) => s.lang);
  const [raw, setRaw] = useState(SAMPLE);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-serif text-3xl md:text-4xl">{t(lang, "nav.ingest")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        NCRP webhook intake and SAHYOG freeze outbox. Production would POST to I4C SAHYOG; this command centre
        validates the same JSON, queues it, and records a hash-chained audit entry.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-serif text-xl">NCRP webhook</h2>
          <p className="mt-1 text-xs text-muted">POST /api/ncrp/ingest — JSON body</p>
          <Label className="mt-3" htmlFor="json">
            Payload
          </Label>
          <textarea
            id="json"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="mt-1 min-h-44 w-full rounded-md border border-border bg-bg p-3 font-mono text-xs"
          />
          <Button
            className="mt-3"
            onClick={async () => {
              try {
                const j = JSON.parse(raw) as {
                  complaint_id?: string;
                  victim_wallet?: string;
                  amount_usdt?: number;
                  typology?: string;
                };
                if (!j.complaint_id || !j.victim_wallet) throw new Error("complaint_id and victim_wallet required");
                addComplaint({
                  id: j.complaint_id,
                  wallet: j.victim_wallet,
                  amountUsdt: Number(j.amount_usdt) || 0,
                  typology: j.typology ?? "custom",
                });
                await logAction(j.victim_wallet, `NCRP ingest ${j.complaint_id}`);
                toast("Complaint queued");
              } catch (e) {
                toast(e instanceof Error ? e.message : "Invalid JSON");
              }
            }}
          >
            Ingest complaint
          </Button>
          {extra.length ? (
            <ul className="mt-4 space-y-2">
              {extra.map((c) => (
                <li key={c.id} className="text-sm">
                  <span className="font-mono text-xs">{c.id}</span>
                  <span className="text-muted"> · {c.wallet}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </Card>

        <Card>
          <h2 className="font-serif text-xl">SAHYOG outbox</h2>
          <p className="mt-1 text-xs text-muted">
            Notices queued from Trace. Acknowledge simulates VASP nodal receipt.
          </p>
          {dispatches.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              No freezes queued. Run a trace, open Freeze notice, then Queue on SAHYOG.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {dispatches.map((d) => (
                <li key={d.id} className="rounded-md border border-border p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs">{d.id}</span>
                    <Badge tone={d.status === "acknowledged" ? "ok" : "warn"}>{d.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm">
                    {d.vaspName} · {d.complaintId}
                  </p>
                  {d.status !== "acknowledged" ? (
                    <Button
                      size="sm"
                      className="mt-2"
                      variant="secondary"
                      onClick={() => {
                        ackDispatch(d.id);
                        toast("VASP acknowledged freeze");
                      }}
                    >
                      Mark acknowledged
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link to="/trace">Open tracer</Link>
          </Button>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="font-serif text-xl">Connector contract</h2>
        <p className="mt-2 text-sm text-muted">
          Fields match I4C / NCRP complaint JSON and SAHYOG freeze requests (CrPC §91, PMLA §17). Swap the
          outbox POST URL for the live SAHYOG endpoint when the agency connector is issued — the payload does
          not change.
        </p>
        <pre className="mt-3 overflow-x-auto font-mono text-[11px] text-muted">{`POST {SAHYOG_BASE}/asset-freeze
Authorization: Bearer <I4C_TOKEN>
Content-Type: application/json

${JSON.stringify(
  {
    request_type: "ASSET_FREEZE",
    channel: "SAHYOG",
    act: ["CrPC_S91", "PMLA_S17"],
    urgency: "P1",
  },
  null,
  2,
)}`}</pre>
      </Card>
    </div>
  );
}
