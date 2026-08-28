import { parseInches } from "@/lib/utils";

const PERSON = 66;

export function ScaleFigure({
  dimensions,
  label,
  note,
}: {
  dimensions: string;
  label: string;
  note: string;
}) {
  const size = parseInches(dimensions);
  if (!size) return null;
  const tall = Math.max(size.w, size.h);
  const pct = Math.max(12, Math.min(100, (tall / PERSON) * 100));

  return (
    <div className="mt-8">
      <p className="kicker">{label}</p>
      <div className="mt-4 flex h-28 items-end gap-4">
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-9 bg-terracotta"
            style={{ height: `${pct}%` }}
            title={dimensions}
          />
          <span className="text-[10px] tracking-widest text-muted uppercase">Work</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-full w-9 bg-line" />
          <span className="text-[10px] tracking-widest text-muted uppercase">5′6″</span>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">
        {dimensions} {note}
      </p>
    </div>
  );
}
