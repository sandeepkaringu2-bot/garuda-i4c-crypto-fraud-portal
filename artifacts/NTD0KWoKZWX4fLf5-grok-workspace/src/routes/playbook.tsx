import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { t } from "@/lib/garuda/i18n";
import { useGaruda } from "@/lib/garuda/store";

export const Route = createFileRoute("/playbook")({ component: PlaybookPage });

const CHAPTERS = [
  {
    title: "The 48-hour rule",
    body: "Crypto leaves a victim wallet and hits an exchange deposit cluster fast — often under an hour. The exchange can still freeze if the IO arrives with a named cluster and a statutory notice. After ~48 hours the funds have usually been P2P’d into INR or bridged. Garuda puts a clock on every NCRP row so the oldest window is obvious.",
  },
  {
    title: "Why the graph is not the product",
    body: "A matplotlib hop chart does not freeze money. A named Indian VASP, a rupee figure, and a bilingual Section 91 / PMLA 17 notice does. Trace until you hit a custodial sink. Stop walking into mixers. Keep walking through bridges.",
  },
  {
    title: "Peeling chains",
    body: "One wallet sending two or more similar-sized payments is not ‘diversification’. It is a peeling chain — a laundering pattern. Freeze every VASP that received a peel. They are the same operator.",
  },
  {
    title: "Co-spend clustering",
    body: "Bitcoin-style co-spend (two addresses used as inputs to one transaction) is strong evidence of common control. Ethereum approximations still help. If the victim’s burner co-spends with an intermediary, they are the same desk — not two strangers.",
  },
  {
    title: "Mixers vs collection nodes",
    body: "Tornado Cash is a black hole for victim recovery. A sanctioned scam-collection address is not. Flag it, then follow the outbound hop. Previous builds returned early on every sanction hit and missed the TRON → FixedFloat → CoinDCX offramp.",
  },
  {
    title: "India vs MLAT",
    body: "WazirX, CoinDCX, ZebPay, Unocoin, Giottus, CoinSwitch: FIU-IND registered, SAHYOG-reachable, hours. Binance / OKX / Bybit: LEA portals, days, and INR recovery still needs a bank. Do Indian VASPs first, always.",
  },
  {
    title: "UPI is the last mile",
    body: "Most Indian victims paid UPI to a mule who then bought USDT on a P2P desk. When Garuda lands on CoinDCX or WazirX, ask for the linked INR / UPI / bank account in the same freeze — that is where the victim’s rupees actually sit.",
  },
  {
    title: "Organised crime test",
    body: "One victim, one wallet: a case. Three NCRP complaints sharing a layering cluster: a syndicate. Escalate. One freeze notice covering the cluster is cheaper than three IOs discovering the same WazirX deposit a week apart.",
  },
];

function PlaybookPage() {
  const lang = useGaruda((s) => s.lang);
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-3xl md:text-4xl">{t(lang, "playbook.title")}</h1>
      <p className="mt-2 text-sm text-muted">
        Written for a station-house officer who has a wallet, a complaint number, and four hours — not a Chainalysis
        licence.
      </p>
      <div className="mt-8 space-y-4">
        {CHAPTERS.map((c, i) => (
          <Card key={c.title}>
            <p className="text-xs tracking-[0.14em] text-subtle uppercase">0{i + 1}</p>
            <h2 className="mt-1 font-serif text-xl">{c.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{c.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
