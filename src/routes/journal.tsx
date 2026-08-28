import { Link, createFileRoute } from "@tanstack/react-router";
import { ArtworkImage } from "@/components/artwork-image";
import { Reveal } from "@/components/reveal";
import { getArtwork } from "@/data/artworks";
import { notes } from "@/data/journal";
import { useT } from "@/lib/use-t";

export const Route = createFileRoute("/journal")({
  component: JournalPage,
  head: () => ({ meta: [{ title: "Journal — Arteli" }] }),
});

function JournalPage() {
  const t = useT();
  return (
    <div className="mx-auto max-w-[900px] px-4 py-14 sm:px-8 sm:py-20">
      <Reveal>
        <p className="kicker">{t.journalKicker}</p>
        <h1 className="display-md mt-3">{t.journalTitle}</h1>
        <p className="mt-4 max-w-xl text-muted">{t.journalIntro}</p>
      </Reveal>
      <div className="mt-16 space-y-16">
        {notes.map((note, i) => {
          const work = getArtwork(note.work);
          return (
            <Reveal key={note.slug} delay={i * 40}>
              <article className="grid gap-6 border-t border-line pt-10 sm:grid-cols-12">
                {work ? (
                  <Link
                    to="/work/$slug"
                    params={{ slug: work.slug }}
                    className="frame aspect-[4/5] sm:col-span-4"
                  >
                    <ArtworkImage src={work.image} alt={work.title} />
                  </Link>
                ) : null}
                <div className="sm:col-span-8">
                  <p className="kicker">{note.year}</p>
                  <h2 className="mt-2 font-display text-3xl">{note.title}</h2>
                  <p className="mt-4 text-lg leading-relaxed text-muted">{note.body}</p>
                  {work ? (
                    <Link
                      to="/work/$slug"
                      params={{ slug: work.slug }}
                      className="stitch kicker mt-6 inline-block"
                    >
                      {work.title}
                    </Link>
                  ) : null}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
