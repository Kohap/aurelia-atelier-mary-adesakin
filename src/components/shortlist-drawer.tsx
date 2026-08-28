import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useCallback } from "react";
import { artworks } from "@/data/artworks";
import { useEscape } from "@/lib/use-escape";
import { useStudio } from "@/lib/store";
import { useMoney, useT } from "@/lib/use-t";
import { Button } from "@/components/ui/button";

export function ShortlistDrawer() {
  const open = useStudio((s) => s.shortlistOpen);
  const setOpen = useStudio((s) => s.setShortlistOpen);
  const ids = useStudio((s) => s.shortlist);
  const remove = useStudio((s) => s.removeFromShortlist);
  const inquire = useStudio((s) => s.openInquiry);
  const items = artworks.filter((work) => ids.includes(work.slug));
  const t = useT();
  const money = useMoney();
  const close = useCallback(() => setOpen(false), [setOpen]);
  useEscape(close, open);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/40"
      onClick={() => setOpen(false)}
    >
      <aside
        className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-paper shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="shortlist-title"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 id="shortlist-title" className="font-display text-3xl">
            {t.shortlist}
          </h2>
          <button
            type="button"
            className="grid size-11 place-items-center"
            onClick={() => setOpen(false)}
            aria-label={t.close}
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="py-10 text-sm text-muted">{t.shortlistEmpty}</p>
          ) : (
            <ul className="space-y-5">
              {items.map((work) => (
                <li key={work.slug} className="flex gap-4">
                  <Link
                    to="/work/$slug"
                    params={{ slug: work.slug }}
                    onClick={() => setOpen(false)}
                    className="frame h-24 w-20 shrink-0"
                  >
                    <img src={work.image} alt="" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-xl leading-tight">{work.title}</p>
                    <p className="mt-1 text-sm text-muted">
                      {work.status === "Sold" ? t.privateCollection : money(work.originalPrice)}
                    </p>
                    <button
                      type="button"
                      className="mt-2 text-xs tracking-widest uppercase text-muted"
                      onClick={() => remove(work.slug)}
                    >
                      {t.remove}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-line p-6">
          <Button
            className="w-full"
            disabled={!items.length}
            onClick={() => inquire(items[0]?.slug ?? null)}
          >
            {t.shortlistInquire}
          </Button>
        </div>
      </aside>
    </div>
  );
}
