import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { t } from "@/lib/garuda/i18n";
import { useGaruda } from "@/lib/garuda/store";

export const Route = createFileRoute("/evidence")({ component: EvidencePage });

function EvidencePage() {
  const lang = useGaruda((s) => s.lang);
  const audit = useGaruda((s) => s.audit);

  let broken = -1;
  for (let i = 1; i < audit.length; i++) {
    if (audit[i].previousHash !== audit[i - 1].hash) {
      broken = i;
      break;
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-serif text-3xl md:text-4xl">{t(lang, "evidence.title")}</h1>
      <p className="mt-2 text-sm text-muted">
        Every trace and notice action is appended to a SHA-256 hash chain. Tampering a past record breaks the link.
        Export this chain with the dossier — it is the chain of custody, not a blog of clicks.
      </p>

      <Card className="mt-6 p-4">
        {broken >= 0 ? (
          <p className="text-sm text-danger">Chain broken at record {broken + 1}.</p>
        ) : (
          <p className="text-sm text-ok">
            Chain intact · {audit.length} record{audit.length === 1 ? "" : "s"} verified.
          </p>
        )}
      </Card>

      <ol className="mt-4 space-y-2">
        {audit.length === 0 ? (
          <p className="text-sm text-muted">Run a trace to write the first block after genesis.</p>
        ) : (
          [...audit].reverse().map((e) => (
            <li key={e.hash} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>#{e.index}</Badge>
                <span className="text-sm">{e.summary}</span>
              </div>
              <p className="mt-2 font-mono text-[11px] leading-relaxed text-subtle">
                {e.officerId} · {e.target}
                <br />
                {new Date(e.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
                <br />
                prev {e.previousHash.slice(0, 20)}…
                <br />
                hash {e.hash.slice(0, 20)}…
              </p>
            </li>
          ))
        )}
      </ol>
    </div>
  );
}
