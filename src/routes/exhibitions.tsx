import { Link, createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { exhibitions } from "@/data/studio";
import { useT } from "@/lib/use-t";

export const Route = createFileRoute("/exhibitions")({
  component: ExhibitionsPage,
  head: () => ({ meta: [{ title: "Exhibitions — Arteli" }] }),
});

function ExhibitionsPage() {
  const t = useT();
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-8 sm:py-20">
      <Reveal>
        <p className="kicker">{t.trail}</p>
        <h1 className="display-md mt-3">{t.exhibitionsTitle}</h1>
        <p className="mt-4 max-w-xl text-muted">{t.exhibitionsIntro}</p>
      </Reveal>

      <ol className="relative mt-16 border-l border-line pl-8 sm:pl-12">
        {exhibitions.map((show, i) => (
          <Reveal key={`${show.year}-${show.title}`} delay={i * 70}>
            <li className="relative pb-14">
              <span className="absolute top-1.5 -left-[39px] size-3 rounded-full bg-terracotta sm:-left-[55px]" />
              <p className="kicker">{show.year}</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">{show.title}</h2>
              <p className="mt-2 text-muted">{show.venue}</p>
              <p className="mt-3 max-w-xl">{show.note}</p>
            </li>
          </Reveal>
        ))}
      </ol>

      <Reveal className="border-t border-line pt-12">
        <h2 className="font-display text-3xl">{t.pressLoans}</h2>
        <p className="mt-3 max-w-xl text-muted">{t.pressCopy}</p>
        <div className="mt-6">
          <Button asChild>
            <Link to="/contact">{t.pressKit}</Link>
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
