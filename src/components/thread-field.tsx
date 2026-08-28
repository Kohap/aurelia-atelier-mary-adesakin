export function ThreadField({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`thread-svg pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1200 800"
      fill="none"
      aria-hidden="true"
    >
      <path d="M-40 120 C 180 40, 320 240, 520 180 S 860 40, 1240 210" />
      <path d="M-20 430 C 220 510, 390 280, 640 360 S 980 540, 1260 320" />
      <path d="M40 720 C 300 640, 480 780, 740 680 S 1040 600, 1220 740" />
    </svg>
  );
}
