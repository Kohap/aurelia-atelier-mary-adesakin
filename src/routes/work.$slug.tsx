import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, Link as LinkIcon, Share2, X } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { ArtworkCard } from "@/components/artwork-card";
import { ArtworkImage } from "@/components/artwork-image";
import { Reveal } from "@/components/reveal";
import { ScaleFigure } from "@/components/scale-figure";
import { WallView } from "@/components/wall-view";
import { Button } from "@/components/ui/button";
import { getArtwork as seedGetArtwork } from "@/data/artworks";
import { relatedFromCatalogue, useArtwork } from "@/lib/catalogue";
import { useEscape } from "@/lib/use-escape";
import { useStudio } from "@/lib/store";
import { useMoney, useT } from "@/lib/use-t";
import { copyText, localize } from "@/lib/utils";
import { hasPaystack } from "@/lib/paystack";

export const Route = createFileRoute("/work/$slug")({
  component: WorkPage,
  head: ({ params }) => {
    const work = seedGetArtwork(params.slug);
    return {
      meta: [{ title: work ? `${work.title} — Arteli` : "Work — Arteli" }],
    };
  },
});

function WorkPage() {
  const { slug } = Route.useParams();
  const work = useArtwork(slug);
  const [zoomed, setZoomed] = useState(false);
  const [onWall, setOnWall] = useState(false);
  const listed = useStudio((s) => s.shortlist.includes(slug));
  const toggle = useStudio((s) => s.toggleShortlist);
  const inquire = useStudio((s) => s.openInquiry);
  const pay = useStudio((s) => s.openCheckout);
  const lang = useStudio((s) => s.lang);
  const t = useT();
  const money = useMoney();
  const closeZoom = useCallback(() => setZoomed(false), []);
  useEscape(closeZoom, zoomed);

  if (!work) throw notFound();
  const piece = work;

  const related = relatedFromCatalogue(piece.slug);
  const copy = localize(piece.description, lang);

  async function copyLink() {
    try {
      await copyText(window.location.href);
      toast.success(t.linkCopied);
    } catch {
      toast.error(t.copyLink);
    }
  }

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${piece.title} — Arteli`, text: copy, url });
        return;
      } catch {
        /* collector cancelled or share unavailable */
      }
    }
    await copyLink();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: work.title,
    creator: { "@type": "Person", name: "Adesakin Mary Damilola" },
    artMedium: work.medium,
    width: work.dimensions,
    dateCreated: work.year,
    image: work.image,
    description: work.description.en,
  };

  return (
    <article className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="kicker">
        <Link to="/catalogue" className="stitch">
          {t.catalogueKicker}
        </Link>
        <span className="mx-3 text-line">/</span>
        {work.collection}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          {onWall ? (
            <WallView
              image={work.image}
              title={work.title}
              dimensions={work.dimensions}
            />
          ) : (
            <button
              type="button"
              className="frame aspect-[4/5] w-full cursor-zoom-in"
              onClick={() => setZoomed(true)}
              aria-label={t.enlarge}
            >
              <ArtworkImage src={work.image} alt={work.title} priority />
            </button>
          )}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs tracking-widest text-muted uppercase">
              {onWall ? t.wallNote : t.enlarge}
            </p>
            <button
              type="button"
              className="kicker stitch"
              onClick={() => setOnWall((v) => !v)}
            >
              {onWall ? t.leaveWall : t.onWall}
            </button>
          </div>
        </div>
        <div className="lg:col-span-5">
          <p className="kicker">{work.year}</p>
          <h1 className="display-md mt-3">{work.title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">{copy}</p>
          <dl className="mt-8 divide-y divide-line border-y border-line text-sm">
            <Row label={t.medium} value={work.medium} />
            <Row label={t.dimensions} value={work.dimensions} />
            <Row label={t.edition} value={work.edition} />
            <Row
              label={t.status}
              value={work.status === "Sold" ? t.privateCollection : t.available}
            />
            <Row
              label={t.original}
              value={work.status === "Sold" ? t.noLonger : money(work.originalPrice)}
            />
            <Row label={t.provenanceLabel} value={work.provenance} />
          </dl>
          {work.printOptions.length > 0 ? (
            <div className="mt-6">
              <p className="kicker">{t.prints}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {work.printOptions.map((option) => (
                  <li key={option.size} className="flex items-center justify-between gap-3 border-b border-line py-2">
                    <span>{option.size}</span>
                    <span className="flex items-center gap-3">
                      <span>{money(option.price)}</span>
                      {hasPaystack ? (
                        <button
                          type="button"
                          className="kicker stitch"
                          onClick={() =>
                            pay({
                              slug: work.slug,
                              amount: option.price,
                              label: `${t.print} ${option.size}`,
                            })
                          }
                        >
                          {t.buyPrint}
                        </button>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <ScaleFigure dimensions={work.dimensions} label={t.scale} note={t.scaleNote} />
          <div className="mt-8 flex flex-wrap gap-3">
            {work.status === "Available" && hasPaystack && work.originalPrice ? (
              <Button
                onClick={() =>
                  pay({
                    slug: work.slug,
                    amount: work.originalPrice as number,
                    label: t.original,
                  })
                }
              >
                {t.acquire}
              </Button>
            ) : null}
            {work.status === "Available" ? (
              <Button
                variant={hasPaystack && work.originalPrice ? "ghost" : "primary"}
                onClick={() => inquire(work.slug)}
              >
                {t.requestWork}
              </Button>
            ) : (
              <Button variant="line" onClick={() => inquire(work.slug)}>
                {t.similarWork}
              </Button>
            )}
            {work.printOptions.length > 0 ? (
              <Button variant="ghost" onClick={() => inquire(work.slug)}>
                {t.inquirePrint}
              </Button>
            ) : null}
            <Button variant="ghost" onClick={() => toggle(work.slug)}>
              {listed ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              {listed ? t.onShortlist : t.shortlist}
            </Button>
            <Button variant="line" onClick={copyLink}>
              <LinkIcon size={16} />
              {t.copyLink}
            </Button>
            <Button variant="line" onClick={share}>
              <Share2 size={16} />
              {t.share}
            </Button>
          </div>
          <div className="mt-10 border-t border-line pt-6">
            <p className="kicker">{t.care}</p>
            <p className="mt-3 text-sm text-muted">{t.careConfirm}</p>
            <p className="mt-2 text-sm text-muted">{t.careShipping}</p>
          </div>
        </div>
      </div>

      <section className="mt-24">
        <Reveal>
          <p className="kicker">{t.continue}</p>
          <h2 className="display-md mt-3">{t.related}</h2>
        </Reveal>
        <div className="mt-10 grid gap-10 sm:grid-cols-3">
          {related.map((item) => (
            <ArtworkCard key={item.slug} work={item} />
          ))}
        </div>
      </section>

      {zoomed ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/90 p-4"
          onClick={closeZoom}
        >
          <button
            type="button"
            className="absolute top-4 right-4 grid size-11 place-items-center bg-paper text-ink"
            onClick={closeZoom}
            aria-label={t.close}
          >
            <X size={18} />
          </button>
          <img
            src={work.image}
            alt={work.title}
            className="max-h-[92vh] max-w-full object-contain"
          />
        </div>
      ) : null}
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 py-3">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
