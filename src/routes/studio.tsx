import { Link, createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/reveal";
import { ThreadField } from "@/components/thread-field";
import { Button } from "@/components/ui/button";
import { artist, processSteps } from "@/data/studio";
import { useT } from "@/lib/use-t";

export const Route = createFileRoute("/studio")({
  component: StudioPage,
  head: () => ({ meta: [{ title: "Studio — Arteli" }] }),
});

function StudioPage() {
  const t = useT();
  return (
    <div>
      <section className="relative overflow-hidden">
        <ThreadField />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-8">
          <Reveal>
            <p className="kicker">{t.studio}</p>
            <h1 className="display-md mt-4">{t.studioTitle}</h1>
            <p className="mx-auto mt-6 max-w-xl text-muted">{t.studioIntro}</p>
          </Reveal>
        </div>
      </section>

      <div className="grid md:grid-cols-2">
        <div className="frame min-h-[360px]">
          <img
            src="/studio/worktable.jpg"
            alt="Embroidery hoop, needle, and terracotta thread on a studio table"
          />
        </div>
        <div className="frame min-h-[360px]">
          <img
            src="/studio/thread-macro.jpg"
            alt="Macro of terracotta and charcoal stitches on linen"
          />
        </div>
      </div>

      <section className="mx-auto max-w-[1100px] px-4 py-20 sm:px-8">
        {processSteps.map((step, i) => (
          <Reveal key={step.title}>
            <article
              className={`grid items-center gap-10 border-t border-line py-14 md:grid-cols-2 ${
                i % 2 ? "md:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="frame aspect-[4/3]">
                <img src={step.image} alt="" />
              </div>
              <div>
                <p className="font-display text-5xl text-terracotta">{step.numeral}</p>
                <h2 className="mt-2 font-display text-4xl">{step.title}</h2>
                <p className="mt-5 text-lg leading-relaxed text-muted">{step.copy}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </section>

      <section className="border-y border-line bg-paper">
        <div className="mx-auto grid max-w-[1100px] items-center gap-10 px-4 py-16 sm:px-8 md:grid-cols-2">
          <div className="frame aspect-video">
            <img
              src="/studio/thread-macro.jpg"
              alt="Close stitches in terracotta and charcoal thread"
              className="ken"
            />
          </div>
          <Reveal>
            <p className="kicker">{t.watchStitch}</p>
            <h2 className="display-md mt-3">{t.watchStitch}</h2>
            <p className="mt-4 text-muted">{t.watchCopy}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                className="btn btn-primary"
                href={artist.instagram}
                target="_blank"
                rel="noreferrer"
              >
                {t.instagram}
              </a>
              <a
                className="btn btn-ghost"
                href={artist.tiktok}
                target="_blank"
                rel="noreferrer"
              >
                {t.tiktok}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink py-20 text-paper">
        <Reveal className="mx-auto max-w-3xl px-6 text-center">
          <p className="kicker text-bronze">{t.commissions}</p>
          <h2 className="display-md mt-4 text-paper">{t.commissionTitle}</h2>
          <p className="mx-auto mt-5 max-w-xl text-paper/70">{t.commissionCopy}</p>
          <div className="mt-8">
            <Link
              to="/contact"
              className="btn bg-terracotta text-paper hover:bg-terracotta-deep"
            >
              {t.startCommission}
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-8">
        <Reveal>
          <h2 className="display-md">{t.visitTitle}</h2>
          <p className="mt-4 text-muted">{t.visitCopy}</p>
          <div className="mt-8">
            <Button asChild>
              <Link to="/contact">{t.requestVisit}</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
