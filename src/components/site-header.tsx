import { Link, useRouterState } from "@tanstack/react-router";
import { Bookmark, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { currencies, languages, navPaths, type Currency, type Lang } from "@/data/i18n";
import { useStudio } from "@/lib/store";
import { useT } from "@/lib/use-t";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const count = useStudio((s) => s.shortlist.length);
  const openShortlist = useStudio((s) => s.setShortlistOpen);
  const lang = useStudio((s) => s.lang);
  const setLang = useStudio((s) => s.setLang);
  const currency = useStudio((s) => s.currency);
  const setCurrency = useStudio((s) => s.setCurrency);
  const t = useT();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/80 bg-parchment/88 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-8">
        <Link to="/" className="flex items-baseline gap-3">
          <span className="font-display text-[1.7rem] leading-none tracking-[0.18em]">
            ARTELI
          </span>
          <span className="hidden text-[0.68rem] tracking-[0.22em] text-muted uppercase sm:inline">
            Ile-Ife
          </span>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {navPaths.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "stitch kicker pb-1",
                pathname.startsWith(item.to) && "is-active text-ink",
              )}
            >
              {t[item.key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <label className="hidden md:block">
            <span className="sr-only">{t.language}</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="h-11 border border-line bg-paper px-2 text-xs tracking-widest uppercase"
            >
              {languages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="hidden md:block">
            <span className="sr-only">{t.currency}</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="h-11 border border-line bg-paper px-2 text-xs tracking-widest uppercase"
            >
              {currencies.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="btn btn-line h-11 min-h-11 px-3"
            onClick={() => openShortlist(true)}
            aria-label={`${t.shortlist}, ${count}`}
          >
            <Bookmark size={15} />
            <span className="tabular-nums">{count}</span>
          </button>
          <button
            type="button"
            className="grid size-11 place-items-center border border-line xl:hidden"
            aria-label={open ? t.close : t.menu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-line bg-parchment transition-[max-height,opacity] duration-400 xl:hidden",
          open ? "max-h-[640px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="flex flex-col px-6 py-6">
          {navPaths.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="border-b border-line py-4 font-display text-3xl"
            >
              {t[item.key]}
            </Link>
          ))}
          <div className="mt-4 flex gap-2 md:hidden">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="h-11 flex-1 border border-line bg-paper px-2 text-xs uppercase"
            >
              {languages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="h-11 w-24 border border-line bg-paper px-2 text-xs uppercase"
            >
              {currencies.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </nav>
      </div>
    </header>
  );
}
