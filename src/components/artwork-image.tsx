import { artworkSrcSet } from "@/lib/utils";

export function ArtworkImage({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const srcSet = artworkSrcSet(src);
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes="(min-width: 900px) 40vw, 100vw"
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}
