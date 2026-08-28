import { createFileRoute } from "@tanstack/react-router";
import { ArtworkImage } from "@/components/artwork-image";
import { artist, exhibitions } from "@/data/studio";
import { useCatalogue } from "@/lib/catalogue";
import { useT } from "@/lib/use-t";

export const Route = createFileRoute("/press")({
  component: PressPage,
  head: () => ({
    meta: [
      { title: "Press sheet — Arteli" },
      {
        name: "description",
        content:
          "One-page press sheet for Adesakin Mary Damilola — biography, selected works, and studio contact in Ile-Ife.",
      },
    ],
  }),
});

const FEATURED = ["loud-silence", "the-ife-muse", "the-weight-of-words"] as const;

function PressPage() {
  const t = useT();
  const { works: artworks } = useCatalogue();
  const works = FEATURED.map((slug) => artworks.find((work) => work.slug === slug)).filter(Boolean);
  const available = artworks.filter((work) => work.status === "Available").length;

  return (
    <div className="press-sheet mx-auto max-w-4xl px-4 py-12 sm:px-8 sm:py-16">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-8">
        <div>
          <p className="kicker">{t.pressKicker}</p>
          <h1 className="display-md mt-3">{t.pressTitle}</h1>
          <p className="mt-4 max-w-xl text-muted">{t.pressIntro}</p>
        </div>
        <a className="btn btn-primary no-print" href="/press-kit.pdf" download>
          {t.downloadPress}
        </a>
      </div>

      <section className="grid gap-10 border-b border-line py-12 md:grid-cols-12">
        <div className="frame aspect-[4/5] md:col-span-5">
          <ArtworkImage src={artist.portrait} alt={t.portraitAlt} className="object-cover object-[center_22%]" />
        </div>
        <div className="md:col-span-7">
          <h2 className="font-display text-4xl">{artist.name}</h2>
          <p className="mt-2 text-muted">
            {t.bornPrefix} {artist.born} · {artist.place}
          </p>
          <p className="mt-6 leading-relaxed">{artist.bio[0]}</p>
          <p className="mt-4 leading-relaxed text-muted">{artist.bio[1]}</p>
          <p className="mt-6 text-sm text-muted">{t.photoCredit}</p>
          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
            <div>
              <dt className="kicker">{t.metricsWorks}</dt>
              <dd className="font-display mt-2 text-3xl">{artworks.length}</dd>
            </div>
            <div>
              <dt className="kicker">{t.filterAvailable}</dt>
              <dd className="font-display mt-2 text-3xl">{available}</dd>
            </div>
            <div>
              <dt className="kicker">{t.metricsExhibitions}</dt>
              <dd className="font-display mt-2 text-3xl">{exhibitions.length}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="border-b border-line py-12">
        <p className="kicker">{t.selectedWorks}</p>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {works.map((work) =>
            work ? (
              <article key={work.slug}>
                <div className="frame aspect-[4/5]">
                  <ArtworkImage src={work.image} alt={work.title} />
                </div>
                <h3 className="font-display mt-4 text-2xl">{work.title}</h3>
                <p className="mt-1 text-sm text-muted">
                  {work.year} · {work.medium} · {work.dimensions}
                </p>
              </article>
            ) : null,
          )}
        </div>
      </section>

      <section className="grid gap-10 py-12 md:grid-cols-2">
        <div>
          <p className="kicker">{t.pressContact}</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a className="stitch" href={`mailto:${artist.email}`}>
                {artist.email}
              </a>
            </li>
            <li>{artist.phone}</li>
            <li>{artist.place}</li>
            <li>
              <a href={artist.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="kicker">{t.exhibitionsTitle}</p>
          <ul className="mt-4 space-y-3 text-sm">
            {exhibitions.slice(0, 4).map((show) => (
              <li key={show.title}>
                <span className="text-muted">{show.year}</span> · {show.title}, {show.venue}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
