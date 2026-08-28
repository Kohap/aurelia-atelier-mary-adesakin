import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { artist } from "@/data/studio";
import { useT } from "@/lib/use-t";

const LIST = "https://formspree.io/f/mwleepdn";

export function CollectorListForm() {
  const t = useT();
  const [sending, setSending] = useState(false);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSending(true);
    try {
      const res = await fetch(LIST, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("fail");
      toast.success(t.sentList);
      form.reset();
    } catch {
      toast.error(`${t.sentFail} ${artist.email}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={send}>
      <label className="sr-only" htmlFor="collector-email">
        {t.email}
      </label>
      <input
        id="collector-email"
        required
        type="email"
        name="email"
        autoComplete="email"
        placeholder={t.emailPlaceholder}
        className="h-12 flex-1 border border-line bg-paper px-3 text-ink"
      />
      <Button type="submit" disabled={sending}>
        {sending ? t.joining : t.join}
      </Button>
    </form>
  );
}
