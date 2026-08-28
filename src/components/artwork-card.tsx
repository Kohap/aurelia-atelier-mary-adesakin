import { Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, Link as LinkIcon } from "lucide-react";
import type { MouseEvent } from "react";
import { toast } from "sonner";
import { ArtworkImage } from "@/components/artwork-image";
import type { Artwork } from "@/data/artworks";
import { useStudio } from "@/lib/store";
import { useMoney, useT } from "@/lib/use-t";
import { artworkHref, cn, copyText } from "@/lib/utils";

export function ArtworkCard({
  work,
  large = false,
  prints = false,
}: {
  work: Artwork;
  large?: boolean;
  prints?: boolean;
}) {
  const listed = useStudio((s) => s.shortlist.includes(work.slug));
  const toggle = useStudio((s) => s.toggleShortlist);
  const t = useT();
  const money = useMoney();
  const print = work.printOptions[0];
  const price = prints
    ? print
      ? money(print.price)
      : t.priceOnRequest
    : work.status === "Sold"
      ? t.inCollection
      : money(work.originalPrice);

  async function copyLink(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    try {
      await copyText(artworkHref(work.slug));
      toast.success(t.linkCopied);
    } catch {
      toast.error(t.copyLink);
    }
  }

  return (
    <article className="group">
      <Link
        to="/work/$slug"
        params={{ slug: work.slug }}
        className={cn("frame relative block", large ? "aspect-[4/5]" : "aspect-[4/5]")}
      >
        <ArtworkImage src={work.image} alt={work.title} className="block" />
        {work.printOptions.length > 0 ? (
          <span className="print-badge">{t.print}</span>
        ) : null}
        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/70 to-transparent p-4 text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="kicker text-paper">{work.year}</span>
          <span className="kicker text-paper">
            {work.status === "Sold" ? t.privateCollection : t.view}
          </span>
        </span>
      </Link>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="kicker truncate">{work.collection}</p>
          <Link
            to="/work/$slug"
            params={{ slug: work.slug }}
            className="font-display mt-1 block text-2xl leading-tight tracking-tight"
          >
            {work.title}
          </Link>
          <p className="mt-1 text-sm text-muted">
            {prints && print ? print.size : `${work.medium} · ${work.dimensions}`}
          </p>
          <p className="mt-1 text-sm">
            {prints ? `${t.printsFrom} ${price}` : price}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <button
            type="button"
            className="grid size-11 place-items-center border border-line text-muted transition-colors hover:border-ink hover:text-ink"
            aria-label={listed ? t.removeShortlist : t.addShortlist}
            onClick={() => toggle(work.slug)}
          >
            {listed ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
          <button
            type="button"
            className="grid size-11 place-items-center border border-line text-muted transition-colors hover:border-ink hover:text-ink"
            aria-label={t.copyLink}
            onClick={copyLink}
          >
            <LinkIcon size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
