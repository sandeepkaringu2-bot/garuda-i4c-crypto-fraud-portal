import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { t } from "@/lib/garuda/i18n";
import { DIRECTORY } from "@/lib/garuda/registry";
import { useGaruda } from "@/lib/garuda/store";

export const Route = createFileRoute("/vasps")({ component: VaspsPage });

function VaspsPage() {
  const lang = useGaruda((s) => s.lang);
  const indian = DIRECTORY.filter((d) => d.jurisdiction === "India");
  const foreign = DIRECTORY.filter((d) => d.jurisdiction !== "India" && d.kind === "vasp");
  const other = DIRECTORY.filter((d) => d.kind !== "vasp");

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-serif text-3xl md:text-4xl">{t(lang, "vasps.title")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Freeze leverage is a function of jurisdiction. An Indian FIU-IND VASP can move in hours. A foreign exchange is
        days to MLAT. A mixer does not take notices.
      </p>

      <Section title="India — FIU-IND registered" items={indian} lang={lang} />
      <Section title="International VASPs" items={foreign} lang={lang} />
      <Section title="Bridges & mixers (do not freeze — trace through)" items={other} lang={lang} />
    </div>
  );
}

function Section({
  title,
  items,
  lang,
}: {
  title: string;
  items: typeof DIRECTORY;
  lang: "en" | "hi";
}) {
  return (
    <section className="mt-8">
      <h2 className="font-serif text-xl">{title}</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {items.map((v) => (
          <Card key={v.id} className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{v.name}</span>
              <Badge tone={v.fiuRegistered ? "ok" : v.kind === "mixer" ? "danger" : "warn"}>
                {v.fiuRegistered ? t(lang, "fiu.yes") : v.kind.toUpperCase()}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted">{v.notes}</p>
            <p className="mt-2 text-xs text-subtle">
              {v.nodal}
              <br />
              {v.contact}
              {v.freezeSlaHours ? ` · typical freeze ${v.freezeSlaHours}h` : null}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
