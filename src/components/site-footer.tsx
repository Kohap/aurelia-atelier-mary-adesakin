import { Link } from "@tanstack/react-router";
import { artist } from "@/data/studio";
import { navPaths } from "@/data/i18n";
import { useStudio, type PolicyId } from "@/lib/store";
import { useT } from "@/lib/use-t";

export function SiteFooter() {
  const t = useT();
  const setPolicy = useStudio((s) => s.setPolicy);
  const policies: { id: PolicyId; label: string }[] = [
    { id: "terms", label: t.terms },
    { id: "returns", label: t.returns },
    { id: "privacy", label: t.privacy },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink text-paper">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-16 sm:px-8 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-6">
          <p className="kicker text-bronze">{t.atelier}</p>
          <p className="display mt-4 text-paper">ARTELI</p>
          <p className="mt-6 max-w-md text-paper/70">{t.footerBlurb}</p>
        </div>
        <div className="lg:col-span-3">
          <p className="kicker text-bronze">{t.visit}</p>
          <ul className="mt-5 space-y-3 text-sm text-paper/80">
            {navPaths.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-paper">
                  {t[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-3">
          <p className="kicker text-bronze">{t.studio}</p>
          <ul className="mt-5 space-y-3 text-sm text-paper/80">
            <li>
              <a href={`mailto:${artist.email}`}>{artist.email}</a>
            </li>
            <li>
              <a href={`tel:${artist.phone.replace(/\s/g, "")}`}>{artist.phone}</a>
            </li>
            <li>
              <a href={artist.whatsapp} target="_blank" rel="noreferrer">
                {t.whatsapp}
              </a>
            </li>
            <li>{artist.place}</li>
            <li className="flex flex-wrap gap-4 pt-2">
              <a href={artist.instagram} target="_blank" rel="noreferrer">
                {t.instagram}
              </a>
              <a href={artist.tiktok} target="_blank" rel="noreferrer">
                {t.tiktok}
              </a>
              <a href={artist.facebook} target="_blank" rel="noreferrer">
                {t.facebook}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10 px-4 py-6 sm:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 text-xs tracking-[0.16em] text-paper/70 uppercase">
          <span>© {new Date().getFullYear()} Arteli · Adesakin Mary Damilola</span>
          <div className="flex flex-wrap gap-4">
            {policies.map((item) => (
              <button
                key={item.id}
                type="button"
                className="hover:text-paper"
                onClick={() => setPolicy(item.id)}
              >
                {item.label}
              </button>
            ))}
            <span>{t.intention}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
