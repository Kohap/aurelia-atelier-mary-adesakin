import { Play } from "lucide-react";
import { stitchFilms, type StitchFilm } from "@/data/studio";
import { useT } from "@/lib/use-t";

function FilmFrame({ film }: { film: StitchFilm }) {
  const t = useT();
  return (
    <a
      href={film.href}
      target="_blank"
      rel="noreferrer"
      className="film-frame"
      aria-label={`${t.openFilm}: ${film.title}`}
    >
      {film.poster ? <img src={film.poster} alt="" className="film-poster" /> : null}
      <span className="film-play" aria-hidden="true">
        <span>
          <Play size={18} fill="currentColor" />
        </span>
      </span>
    </a>
  );
}

export function StitchFilms() {
  const t = useT();
  return (
    <div className="grid max-w-5xl gap-10 sm:grid-cols-2 sm:items-start">
      {stitchFilms.map((film) => (
        <article key={film.id} className="flex flex-col gap-4">
          <FilmFrame film={film} />
          <div>
            <p className="kicker">{film.kind === "instagram" ? t.instagram : t.tiktok}</p>
            <h3 className="font-display mt-2 text-2xl">{film.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{film.caption}</p>
            <a
              href={film.href}
              target="_blank"
              rel="noreferrer"
              className="stitch kicker mt-3 inline-block"
            >
              {t.openFilm}
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
