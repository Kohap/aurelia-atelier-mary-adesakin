import { cn } from "@/lib/utils";

function MarkPaths({ fill, bar, thread }: { fill: string; bar: string; thread: string }) {
  return (
    <>
      <path d="M32 6.5 L54.8 58 H45.4 L40.7 44.6 H23.3 L18.6 58 H9.2 L32 6.5Z" fill={fill} />
      <path
        d="M23.6 41.8 H40.4"
        fill="none"
        stroke={bar}
        strokeWidth="3.1"
        strokeLinecap="round"
      />
      <path
        d="M19.4 41.8 C26.2 34.4 32.4 48.2 44.8 39.6"
        fill="none"
        stroke={thread}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </>
  );
}

type BrandMarkProps = {
  className?: string;
  /** Always the parchment-on-ink mark, for dark plinths like the footer. */
  onDark?: boolean;
  showWordmark?: boolean;
  compact?: boolean;
};

export function BrandMark({
  className,
  onDark = false,
  showWordmark = true,
  compact = false,
}: BrandMarkProps) {
  const size = compact ? "size-8" : "size-9 sm:size-10";

  return (
    <span className={cn("brand-lockup", className)}>
      <span className={cn("brand-mark", size)} aria-hidden="true">
        {onDark ? (
          <svg viewBox="0 0 64 64" className="size-full">
            <MarkPaths fill="#f4eee6" bar="#c4a574" thread="#d46a48" />
          </svg>
        ) : (
          <>
            <svg viewBox="0 0 64 64" className="logo-light size-full">
              <MarkPaths fill="#1c1511" bar="#b44a28" thread="#b44a28" />
            </svg>
            <svg viewBox="0 0 64 64" className="logo-dark size-full">
              <MarkPaths fill="#f4eee6" bar="#c4a574" thread="#d46a48" />
            </svg>
          </>
        )}
      </span>
      {showWordmark ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display tracking-[0.18em]",
              compact ? "text-[1.35rem]" : "text-[1.55rem] sm:text-[1.7rem]",
            )}
          >
            ARTELI
          </span>
          <span className="mt-1 hidden text-[0.62rem] tracking-[0.22em] text-muted uppercase sm:inline">
            Ile-Ife
          </span>
        </span>
      ) : (
        <span className="sr-only">Arteli</span>
      )}
    </span>
  );
}
