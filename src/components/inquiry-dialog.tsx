import { FormEvent, useCallback, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useArtwork } from "@/lib/catalogue";
import { artist } from "@/data/studio";
import { useEscape } from "@/lib/use-escape";
import { useStudio } from "@/lib/store";
import { useT } from "@/lib/use-t";
import { Button } from "@/components/ui/button";

const ENDPOINT = "https://formspree.io/f/mppaawgd";

export function InquiryDialog() {
  const slug = useStudio((s) => s.inquirySlug);
  const close = useStudio((s) => s.openInquiry);
  const setPolicy = useStudio((s) => s.setPolicy);
  const policy = useStudio((s) => s.policy);
  const shortlist = useStudio((s) => s.shortlist);
  const work = useArtwork(slug);
  const [sending, setSending] = useState(false);
  const t = useT();
  const onClose = useCallback(() => close(null), [close]);
  useEscape(onClose, Boolean(slug) && !policy);

  if (!slug) return null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSending(true);
    try {
      const body = new FormData(form);
      const res = await fetch(ENDPOINT, {
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("send failed");
      toast.success(t.sentInquiry);
      close(null);
      form.reset();
    } catch {
      toast.error(`${t.sentFail} ${artist.email}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/45 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-labelledby="inquiry-title"
        className="w-full max-w-lg bg-paper p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="kicker">{t.collectorDesk}</p>
            <h2 id="inquiry-title" className="font-display mt-2 text-3xl">
              {t.inquiryTitle} {work?.title ?? t.studio}
            </h2>
          </div>
          <button
            type="button"
            className="grid size-11 place-items-center"
            onClick={onClose}
            aria-label={t.close}
          >
            <X size={18} />
          </button>
        </div>
        <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
          <input type="hidden" name="artwork" value={work?.title ?? ""} />
          <input type="hidden" name="shortlist" value={shortlist.join(", ")} />
          <label className="grid gap-2 text-sm">
            {t.name}
            <input
              required
              name="name"
              className="h-12 border border-line bg-parchment px-3"
              autoComplete="name"
            />
          </label>
          <label className="grid gap-2 text-sm">
            {t.email}
            <input
              required
              type="email"
              name="email"
              className="h-12 border border-line bg-parchment px-3"
              autoComplete="email"
            />
          </label>
          <label className="grid gap-2 text-sm">
            {t.message}
            <textarea
              name="message"
              rows={4}
              className="border border-line bg-parchment px-3 py-3"
              placeholder={t.inquiryPlaceholder}
            />
          </label>
          <Button type="submit" disabled={sending}>
            {sending ? t.sending : t.sendInquiry}
          </Button>
          <button
            type="button"
            className="text-left text-xs tracking-widest text-muted uppercase"
            onClick={() => setPolicy("privacy")}
          >
            {t.privacy}
          </button>
        </form>
      </div>
    </div>
  );
}
