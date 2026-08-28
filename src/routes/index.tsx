import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowRight } from "lucide-react";
import { ArtworkCard } from "@/components/artwork-card";
import { ArtworkImage } from "@/components/artwork-image";
import { CollectorListForm } from "@/components/collector-form";
import { Reveal } from "@/components/reveal";
import { ThreadField } from "@/components/thread-field";
import { Button } from "@/components/ui/button";
import { artworks as seedArtworks, featuredSlug, getArtwork } from "@/data/artworks";
import { artist, exhibitions, processSteps } from "@/data/studio";
import { useCatalogue } from "@/lib/catalogue";
import { useStudio } from "@/lib/store";
import { useT } from "@/lib/use-t";
import { localize } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const t = useT();
  const lang = useStudio((s) => s.lang);
  const { works: artworks } = useCatalogue();
  const featured = getArtwork(featuredSlug, artworks) ?? artworks[0] ?? seedArtworks[0];
  const selected = artworks
    .filter((w) => w.slug !== featured?.slug && w.slug !== "the-ife-muse")
    .slice(0, 6);
  const titles = [...artworks, ...artworks].map((w) => w.title);

  return (
    <div className="overflow-x-hidden">
      <section className="relative min-h-[calc(100svh-72px)]">
        <ThreadField />
        <div className="relative mx-auto grid max-w-[1440px] items-start gap-8 px-4 py-8 sm:px-8 lg:min-h-[calc(100svh-72px)] lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-0">
          <div className="hero-copy order-2 lg:order-1 lg:col-span-6 lg:pb-8">
            <p className="kicker">{t.heroKicker}</p>
            <h1 className="display mt-4 lg:mt-6">
              {t.heroTitle}
              <br />
              <em className="italic">{t.heroAccent}</em>
            </h1>
            <p className="mt-8 max-w-md text-lg text-muted">{t.heroCopy}</p>
            <p className="mt-4 max-w-md text-sm text-muted">{t.heroTrust}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/catalogue">
                  {t.explore} <ArrowRight size={16} />
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/artist">{t.theArtist}</Link>
              </Button>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
              <div>
                <dt className="kicker">{t.metricsWorks}</dt>
                <dd className="font-display mt-2 text-3xl">{artworks.length}</dd>
              </div>
              <div>
                <dt className="kicker">{t.metricsExhibitions}</dt>
                <dd className="font-display mt-2 text-3xl">{exhibitions.length}</dd>
              </div>
              <Link
                to="/catalogue"
                search={{ filter: "prints" }}
                className="block"
              >
                <dt className="kicker">{t.metricsPrints}</dt>
                <dd className="font-display mt-2 text-3xl">
                  {artworks.filter((work) => work.printOptions.length > 0).length}
                </dd>
              </Link>
            </dl>
          </div>
          <div className="relative order-1 lg:order-2 lg:col-span-6">
            <div className="frame aspect-[4/5] max-h-[58vh] w-full lg:ml-auto lg:max-h-[78vh] lg:max-w-[560px]">
              <ArtworkImage
                src="/artwork/the-ife-muse.webp"
                alt="The Ife Muse, thread and acrylic on canvas"
                className="ken"
                priority
              />
            </div>
            <p className="mt-4 flex justify-between text-sm text-muted">
              <span>The Ife Muse · 2026</span>
              <Link to="/work/$slug" params={{ slug: "the-ife-muse" }} className="stitch">
                {t.viewWork}
              </Link>
            </p>
          </div>
        </div>
        <a
          href="#selected"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted lg:flex"
        >
          <span className="kicker">{t.scroll}</span>
          <ArrowDown size={16} className="animate-bounce" />
        </a>
      </section>

      <div className="overflow-hidden border-y border-line py-4">
        <div className="marquee-track gap-12 px-8">
          {titles.map((title, i) => (
            <span
              key={`${title}-${i}`}
              className="font-display text-3xl tracking-tight whitespace-nowrap text-ink/80"
            >
              {title}
              <span className="mx-8 text-terracotta">/</span>
            </span>
          ))}
        </div>
      </div>

      {featured ? (
        <section className="mx-auto grid max-w-[1440px] gap-10 px-4 py-20 sm:px-8 lg:grid-cols-12 lg:py-28">
          <Reveal className="lg:col-span-7">
            <div className="frame aspect-[5/4]">
              <ArtworkImage src={featured.image} alt={featured.title} />
            </div>
          </Reveal>
          <Reveal delay={120} className="flex flex-col justify-center lg:col-span-5">
            <p className="kicker">{t.nowOnWall}</p>
            <h2 className="display-md mt-4">{featured.title}</h2>
            <p className="mt-6 max-w-md text-muted">{localize(featured.description, lang)}</p>
            <p className="mt-5 text-sm">
              {featured.medium} · {featured.dimensions} · {featured.year}
            </p>
            <div className="mt-8">
              <Button asChild>
                <Link to="/work/$slug" params={{ slug: featured.slug }}>
                  {t.enterWork}
                </Link>
              </Button>
            </div>
          </Reveal>
        </section>
      ) : null}

      <section id="selected" className="bg-paper py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker">{t.catalogueKicker}</p>
              <h2 className="display-md mt-3">{t.selectedWorks}</h2>
            </div>
            <Link to="/catalogue" className="btn btn-ghost">
              {t.fullCatalogue}
            </Link>
          </Reveal>
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {selected.map((work, i) => (
              <Reveal key={work.slug} delay={i * 80}>
                <ArtworkCard work={work} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 lg:py-28">
        <ThreadField className="opacity-70" />
        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8">
          <Reveal>
            <p className="kicker">{t.making}</p>
            <h2 className="display-md mt-3 max-w-2xl">{t.makingTitle}</h2>
          </Reveal>
          <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 90}>
                <p className="font-display text-4xl text-terracotta">{step.numeral}</p>
                <h3 className="mt-3 font-display text-2xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{step.copy}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12">
            <Button variant="ghost" asChild>
              <Link to="/studio">
                {t.insideStudio} <ArrowRight size={16} />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="grid lg:grid-cols-2">
        <div className="frame aspect-[4/5] min-h-[420px] lg:min-h-[640px]">
          <img
            src={artist.portrait}
            alt={t.portraitAlt}
            className="object-cover object-[center_22%]"
          />
        </div>
        <div className="flex flex-col justify-center bg-ink px-6 py-16 text-paper sm:px-12 lg:px-16">
          <Reveal>
            <p className="kicker text-bronze">{t.artistKicker}</p>
            <h2 className="display-md mt-4 text-paper">{t.artistHomeTitle}</h2>
            <p className="mt-6 max-w-md text-paper/70">{artist.bio[0]}</p>
            <div className="mt-8">
              <Link to="/artist" className="btn border-paper/30 text-paper hover:bg-paper hover:text-ink">
                {t.readBio}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 lg:py-28">
        <Reveal className="mb-12 flex items-end justify-between">
          <div>
            <p className="kicker">{t.trail}</p>
            <h2 className="display-md mt-3">{t.exhibitionsTitle}</h2>
          </div>
          <Link to="/exhibitions" className="hidden stitch kicker sm:inline">
            {t.allExhibitions}
          </Link>
        </Reveal>
        <div className="divide-y divide-line border-y border-line">
          {exhibitions.slice(0, 4).map((show, i) => (
            <Reveal key={show.title} delay={i * 60}>
              <div className="grid gap-2 py-6 sm:grid-cols-12 sm:items-baseline">
                <span className="kicker sm:col-span-2">{show.year}</span>
                <span className="font-display text-2xl sm:col-span-6">{show.title}</span>
                <span className="text-sm text-muted sm:col-span-4 sm:text-right">
                  {show.venue}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-paper">
        <img
          src="/studio/thread-macro.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-8">
          <Reveal>
            <p className="kicker">{t.collectorList}</p>
            <h2 className="display-md mt-4">{t.collectorTitle}</h2>
            <p className="mx-auto mt-5 max-w-md text-muted">{t.collectorCopy}</p>
            <div className="mx-auto mt-8 max-w-lg text-left">
              <CollectorListForm />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
