import { Link, createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { artist } from "@/data/studio";
import { useT } from "@/lib/use-t";

export const Route = createFileRoute("/artist")({
  component: ArtistPage,
  head: () => ({ meta: [{ title: "The Artist — Arteli" }] }),
});

function ArtistPage() {
  const t = useT();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: artist.name,
    jobTitle: "Thread painter",
    birthDate: artist.born,
    email: artist.email,
    telephone: artist.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ile-Ife",
      addressRegion: "Osun",
      addressCountry: "NG",
    },
    sameAs: [artist.instagram, artist.tiktok, artist.facebook],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mx-auto grid max-w-[1440px] gap-12 px-4 py-14 sm:px-8 lg:grid-cols-12 lg:py-20">
        <Reveal className="lg:col-span-6">
          <p className="kicker">{t.artistPageKicker}</p>
          <h1 className="display-md mt-4">{artist.name}</h1>
          <p className="mt-4 text-muted">
            {t.bornPrefix} {artist.born} · {artist.place}
          </p>
          <div className="mt-8 space-y-5 text-lg leading-relaxed">
            {artist.bio.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-6">
          <div className="frame aspect-[4/5]">
            <img
              src="/artwork/beauty-in-becoming.webp"
              alt="Beauty in Becoming, a thread painting by Adesakin Mary Damilola"
            />
          </div>
        </Reveal>
      </section>

      <section className="bg-ink py-20 text-paper">
        <Reveal className="mx-auto max-w-3xl px-6 text-center">
          <p className="kicker text-bronze">{t.statement}</p>
          <blockquote className="font-display mt-6 text-3xl leading-snug italic sm:text-4xl">
            “{artist.statement}”
          </blockquote>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-10 px-4 py-20 sm:px-8 md:grid-cols-3">
        <Reveal>
          <p className="kicker">{t.education}</p>
          <p className="mt-4 text-lg">{artist.education}</p>
        </Reveal>
        <Reveal delay={80}>
          <p className="kicker">{t.mentorship}</p>
          <p className="mt-4 text-lg">{artist.mentorship}</p>
        </Reveal>
        <Reveal delay={160}>
          <p className="kicker">{t.studio}</p>
          <p className="mt-4 text-lg">{t.studioPractice}</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-8">
        <Reveal className="grid gap-6 border border-line bg-paper p-8 md:grid-cols-2 md:items-center md:p-12">
          <div>
            <h2 className="display-md">{t.workWith}</h2>
            <p className="mt-4 text-muted">{t.workWithCopy}</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Button asChild>
              <Link to="/contact">{t.contact}</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/catalogue">{t.viewWorks}</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
