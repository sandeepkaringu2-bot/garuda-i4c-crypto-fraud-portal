import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { sahyogPayload } from "@/lib/garuda/engine";
import { freezeNoticeEn, freezeNoticeHi, noticeId } from "@/lib/garuda/notices";
import { t } from "@/lib/garuda/i18n";
import { useGaruda } from "@/lib/garuda/store";
import type { Endpoint, TraceResult } from "@/lib/garuda/types";
import { KNOWN_VASPS } from "@/lib/garuda/registry";

export function FreezePanel({ trace }: { trace: TraceResult }) {
  const lang = useGaruda((s) => s.lang);
  const officerId = useGaruda((s) => s.officerId);
  const targets = trace.endpoints.filter((e) => e.kind === "vasp" || e.recoverable);
  const [wallet, setWallet] = useState(targets[0]?.wallet ?? trace.endpoints[0]?.wallet ?? "");
  const [docLang, setDocLang] = useState<"en" | "hi">(lang);
  const endpoint: Endpoint | undefined =
    trace.endpoints.find((e) => e.wallet === wallet) ?? trace.endpoints[0];

  const text = useMemo(() => {
    if (!endpoint) return "";
    const opts = {
      officerId,
      complaintId: trace.caseId ?? "UNATTACHED",
      sourceWallet: trace.source,
      endpoint,
    };
    return docLang === "hi" ? freezeNoticeHi(opts) : freezeNoticeEn(opts);
  }, [endpoint, officerId, trace, docLang]);

  if (!endpoint) {
    return <p className="text-sm text-muted">No custodial endpoint to serve a notice on.</p>;
  }

  const payload = sahyogPayload(endpoint, trace.caseId ?? "UNATTACHED", officerId);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <label className="text-xs text-muted">VASP</label>
          <select
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            className="h-11 rounded-md border border-border bg-bg px-3 text-sm"
          >
            {trace.endpoints
              .filter((e) => e.kind === "vasp" || e.kind === "mixer" || e.recoverable)
              .map((e) => (
                <option key={e.wallet} value={e.wallet}>
                  {e.entity}
                </option>
              ))}
          </select>
          <div className="flex rounded-md border border-border p-0.5">
            <button
              type="button"
              className={`h-9 rounded px-3 text-xs ${docLang === "en" ? "bg-surface-2 text-fg" : "text-muted"}`}
              onClick={() => setDocLang("en")}
            >
              English
            </button>
            <button
              type="button"
              className={`h-9 rounded px-3 text-xs ${docLang === "hi" ? "bg-surface-2 text-fg" : "text-muted"}`}
              onClick={() => setDocLang("hi")}
            >
              हिंदी
            </button>
          </div>
        </div>

        <article className="paper-doc rounded-lg p-6 font-serif text-[13px] leading-relaxed whitespace-pre-wrap">
          {text}
        </article>

        <div className="mt-3 flex flex-wrap gap-2 no-print">
          <Button
            size="sm"
            onClick={async () => {
              await navigator.clipboard.writeText(text);
              toast("Notice copied");
            }}
          >
            {t(lang, "notice.copy")}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              const w = window.open("", "_blank");
              if (!w) return;
              w.document.write(
                `<pre style="font-family:Georgia,serif;white-space:pre-wrap;padding:32px;max-width:720px">${text.replace(/</g, "<")}</pre>`,
              );
              w.document.close();
              w.print();
            }}
          >
            {t(lang, "notice.print")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const blob = new Blob([text], { type: "text/plain" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = `${noticeId(trace.caseId ?? "NA", endpoint.wallet)}.txt`;
              a.click();
            }}
          >
            Download .txt
          </Button>
        </div>
      </div>

      <aside className="rounded-xl bg-surface-2 p-4">
        <h4 className="text-sm font-medium">{t(lang, "notice.sahyog")}</h4>
        <p className="mt-1 text-xs text-muted">
          Drop this JSON on the SAHYOG connector. Same payload, machine-readable.
        </p>
        <pre className="mt-3 overflow-x-auto font-mono text-[10px] leading-relaxed text-muted">
          {JSON.stringify(payload, null, 2)}
        </pre>
        <Button
          size="sm"
          variant="ghost"
          className="mt-2"
          onClick={async () => {
            await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
            toast("SAHYOG payload copied");
          }}
        >
          Copy JSON
        </Button>
        {KNOWN_VASPS[endpoint.wallet] ? (
          <p className="mt-4 text-xs text-subtle">
            Nodal: {KNOWN_VASPS[endpoint.wallet].nodal}
            <br />
            {KNOWN_VASPS[endpoint.wallet].contact}
          </p>
        ) : null}
      </aside>
    </div>
  );
}
