import { X } from "lucide-react";
import { policies } from "@/data/studio";
import { useEscape } from "@/lib/use-escape";
import { useStudio } from "@/lib/store";
import { useT } from "@/lib/use-t";

const titles = {
  terms: "terms",
  returns: "returns",
  privacy: "privacy",
} as const;

export function PolicyDialog() {
  const policy = useStudio((s) => s.policy);
  const setPolicy = useStudio((s) => s.setPolicy);
  const t = useT();
  useEscape(() => setPolicy(null), Boolean(policy));

  if (!policy) return null;
  const lines = policies[policy];

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-ink/45 p-4"
      onClick={() => setPolicy(null)}
    >
      <div
        role="dialog"
        aria-labelledby="policy-title"
        className="max-h-[86vh] w-full max-w-lg overflow-auto bg-paper p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="policy-title" className="font-display text-3xl">
            {t[titles[policy]]}
          </h2>
          <button
            type="button"
            className="grid size-11 place-items-center"
            onClick={() => setPolicy(null)}
            aria-label={t.close}
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
          {lines.map((line) => (
            <p key={line.slice(0, 40)}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
