import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { CheckCircle2, ScrollText, ShieldCheck } from "lucide-react";
import { ArtworkCard } from "@/components/artwork-card";
import { Reveal } from "@/components/reveal";
import { artworks, collections } from "@/data/artworks";
import { useT } from "@/lib/use-t";

type CatalogueSearch = {
  q?: string;
  filter?: string;
  series?: string;
};

export const Route = createFileRoute("/catalogue")({
  component: CataloguePage,
  validateSearch: (search: Record<string, unknown>): CatalogueSearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
    filter: typeof search.filter === "string" ? search.filter : undefined,
    series: typeof search.series === "string" ? search.series : undefined,
  }),
  head: () => ({ meta: [{ title: "Works — Arteli" }] }),
});

const FILTERS = ["all", "available", "sold", "prints", "2026"] as const;

function CataloguePage() {
  const t = useT();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const query = search.q ?? "";
  const filter = FILTERS.includes(search.filter as (typeof FILTERS)[number])
    ? (search.filter as (typeof FILTERS)[number])
    : "all";
  const series = search.series ?? "";

  const labels: Record<(typeof FILTERS)[number], string> = {
    all: t.filterAll,
    available: t.filterAvailable,
    sold: t.filterSold,
    prints: t.filterPrints,
    "2026": t.year2026,
  };

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return artworks.filter((work) => {
      const hay = `${work.title} ${work.collection} ${work.medium} ${work.year} ${work.dimensions}`.toLowerCase();
      if (q && !hay.includes(q)) return false;
      if (series && work.collection !== series) return false;
      if (filter === "available") return work.status === "Available";
      if (filter === "sold") return work.status === "Sold";
      if (filter === "prints") return work.printOptions.length > 0;
      if (filter === "2026") return work.year === "2026";
      return true;
    });
  }, [query, filter, series]);

  const availableCount = artworks.filter((work) => work.status === "Available").length;
  const soldCount = artworks.filter((work) => work.status === "Sold").length;

  function patch(next: CatalogueSearch) {
    navigate({
      search: {
        q: next.q || undefined,
        filter: next.filter && next.filter !== "all" ? next.filter : undefined,
        series: next.series || undefined,
      },
      replace: true,
    });
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-8 sm:py-16">
      <Reveal>
        <p className="kicker">{t.catalogueKickerPage}</p>
        <h1 className="display-md mt-3">{t.catalogueTitle}</h1>
        <p className="mt-4 max-w-xl text-muted">{t.catalogueIntro}</p>
      </Reveal>

      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <input
          value={query}
          onChange={(e) => patch({ q: e.target.value, filter, series })}
          placeholder={t.search}
          className="h-12 w-full max-w-md border border-line bg-paper px-4 text-sm"
        />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => patch({ q: query, filter: item, series })}
              className={`h-10 px-3 text-xs tracking-[0.16em] uppercase ${
                filter === item ? "bg-ink text-parchment" : "border border-line text-muted"
              }`}
            >
              {labels[item]}
            </button>
          ))}
        </div>
      </div>

      <label className="mt-4 flex items-center gap-3 text-sm text-muted">
        <span className="kicker">{t.series}</span>
        <select
          value={series}
          onChange={(e) => patch({ q: query, filter, series: e.target.value })}
          className="h-11 min-w-48 border border-line bg-paper px-3 text-ink"
        >
          <option value="">{t.allSeries}</option>
          {collections.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <div className="trust-row mt-8 grid gap-3 text-sm text-muted sm:grid-cols-3">
        <p className="flex items-start gap-2">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-terracotta" />
          {t.trustOriginals}
        </p>
        <p className="flex items-start gap-2">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-terracotta" />
          {availableCount} {t.filterAvailable.toLowerCase()}, {soldCount} {t.inPrivate}.
        </p>
        <p className="flex items-start gap-2">
          <ScrollText size={16} className="mt-0.5 shrink-0 text-terracotta" />
          {t.trustPolicies}
        </p>
      </div>

      <p className="mt-6 text-sm text-muted">
        {list.length} {list.length === 1 ? t.workCount : t.worksCount}
      </p>

      {list.length ? (
        <div className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((work, i) => (
            <Reveal key={work.slug} delay={(i % 3) * 70}>
              <ArtworkCard work={work} prints={filter === "prints"} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="mt-16 max-w-md border border-line bg-paper p-8" role="status">
          <h2 className="font-display text-3xl">{t.emptyCatalogue}</h2>
          <p className="mt-3 text-muted">{t.emptyCatalogueCopy}</p>
          <button
            type="button"
            className="btn btn-ghost mt-6"
            onClick={() => patch({})}
          >
            {t.resetFilters}
          </button>
        </div>
      )}
    </div>
  );
}
