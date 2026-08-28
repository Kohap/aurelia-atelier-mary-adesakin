import { X } from "lucide-react";
import { PolicyBody } from "@/components/policy-body";
import { policies, policyUpdated } from "@/data/studio";
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
  const blocks = policies[policy];

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-ink/45 p-4"
      onClick={() => setPolicy(null)}
    >
      <div
        role="dialog"
        aria-labelledby="policy-title"
        className="max-h-[86vh] w-full max-w-2xl overflow-auto bg-paper p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="kicker">{t.atelier}</p>
            <h2 id="policy-title" className="font-display mt-2 text-3xl">
              {t[titles[policy]]}
            </h2>
            <p className="mt-2 text-xs tracking-widest text-muted uppercase">
              {t.policyUpdated} {policyUpdated}
            </p>
          </div>
          <button
            type="button"
            className="grid size-11 place-items-center"
            onClick={() => setPolicy(null)}
            aria-label={t.close}
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-8">
          <PolicyBody blocks={blocks} />
        </div>
      </div>
    </div>
  );
}
