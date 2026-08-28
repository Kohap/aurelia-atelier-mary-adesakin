import { parseInches } from "@/lib/utils";

export function WallView({
  image,
  title,
  dimensions,
}: {
  image: string;
  title: string;
  dimensions: string;
  note?: string;
}) {
  const size = parseInches(dimensions);
  const height = size ? Math.max(13, Math.min(26, (size.h / 108) * 46)) : 20;
  const ratio = size ? `${size.w} / ${size.h}` : "4 / 5";

  return (
    <figure className="wall-scene relative aspect-[16/10] w-full overflow-hidden bg-line sm:aspect-[16/9]">
      <img
        src="/studio/gallery-wall.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="wall-hang absolute"
        style={{
          top: "34%",
          left: "50%",
          height: `${height}%`,
          aspectRatio: ratio,
        }}
      >
        <span className="picture-light" aria-hidden />
        <span className="picture-glow" aria-hidden />
        <div className="wall-frame">
          <img src={image} alt={title} />
        </div>
      </div>
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/55 to-transparent px-4 py-3 text-xs tracking-widest text-paper uppercase sm:px-5">
        {title} · {dimensions}
      </figcaption>
    </figure>
  );
}
