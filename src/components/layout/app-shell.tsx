import type { ReactNode } from "react";
import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Building2,
  FolderOpen,
  GitFork,
  Inbox,
  LayoutDashboard,
  Menu,
  ScrollText,
  ShieldAlert,
  X,
} from "lucide-react";
import { GarudaMark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/garuda/i18n";
import { useGaruda } from "@/lib/garuda/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", key: "nav.command", icon: LayoutDashboard },
  { to: "/trace", key: "nav.trace", icon: GitFork },
  { to: "/cases", key: "nav.cases", icon: FolderOpen },
  { to: "/ingest", key: "nav.ingest", icon: Inbox },
  { to: "/vasps", key: "nav.vasps", icon: Building2 },
  { to: "/intel", key: "nav.intel", icon: ShieldAlert },
  { to: "/evidence", key: "nav.evidence", icon: ScrollText },
  { to: "/playbook", key: "nav.playbook", icon: BookOpen },
] as const;

function NavLinks({ onClick, stacked }: { onClick?: () => void; stacked?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lang = useGaruda((s) => s.lang);
  return (
    <nav className={cn("flex gap-1", stacked ? "flex-col" : "flex-col")}>
      {NAV.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClick}
            className={cn(
              "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
              active ? "bg-surface-2 text-fg" : "text-muted hover:bg-surface-2/60 hover:text-fg",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {t(lang, item.key)}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const lang = useGaruda((s) => s.lang);
  const setLang = useGaruda((s) => s.setLang);
  const officerId = useGaruda((s) => s.officerId);
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div className="flex min-h-dvh">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
          <div className="flex items-center gap-2.5 px-4 py-5">
            <GarudaMark className="size-8" />
            <div>
              <div className="font-serif text-lg leading-none tracking-tight">{t(lang, "app.name")}</div>
              <div className="mt-1 text-[10px] tracking-[0.14em] text-muted uppercase">I4C · CIS</div>
            </div>
          </div>
          <div className="px-3 pb-4">
            <NavLinks />
          </div>
          <div className="mt-auto border-t border-border px-4 py-4 text-xs text-subtle">
            <div className="font-mono text-[11px] text-muted">{officerId}</div>
            <div className="mt-1">{t(lang, "app.org")}</div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-bg/90 px-4 backdrop-blur-sm md:h-16 md:px-6">
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                className="flex size-11 items-center justify-center rounded-md text-fg"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
              <GarudaMark className="size-6" />
              <span className="font-serif text-base">{t(lang, "app.name")}</span>
            </div>
            <p className="hidden text-sm text-muted md:block">{t(lang, "app.sub")}</p>
            <div className="ml-auto flex items-center gap-2">
              <div className="flex rounded-md border border-border p-0.5">
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  className={cn(
                    "h-8 rounded px-2.5 text-xs font-medium",
                    lang === "en" ? "bg-surface-2 text-fg" : "text-muted",
                  )}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLang("hi")}
                  className={cn(
                    "h-8 rounded px-2.5 text-xs font-medium",
                    lang === "hi" ? "bg-surface-2 text-fg" : "text-muted",
                  )}
                >
                  हिं
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-bg/80"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex h-full w-64 flex-col bg-surface p-3">
            <div className="mb-4 flex items-center justify-between px-1">
              <span className="font-serif text-lg">{t(lang, "app.name")}</span>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close">
                <X />
              </Button>
            </div>
            <NavLinks stacked onClick={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
