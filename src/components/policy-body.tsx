import type { PolicyBlock } from "@/data/studio";

export function PolicyBody({ blocks }: { blocks: PolicyBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block) => (
        <div key={block.heading ?? block.body.slice(0, 48)}>
          {block.heading ? (
            <h3 className="kicker mb-2 text-ink">{block.heading}</h3>
          ) : null}
          <p className="text-sm leading-relaxed text-muted">{block.body}</p>
        </div>
      ))}
    </div>
  );
}
