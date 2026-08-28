import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { CollectorListForm } from "@/components/collector-form";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { artist, faqs, policies } from "@/data/studio";
import { useT } from "@/lib/use-t";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({ meta: [{ title: "Contact — Arteli" }] }),
});

const INQUIRY = "https://formspree.io/f/mppaawgd";

function ContactPage() {
  const t = useT();
  const [sending, setSending] = useState(false);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSending(true);
    try {
      const res = await fetch(INQUIRY, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("fail");
      toast.success(t.sentInquiry);
      form.reset();
    } catch {
      toast.error(`${t.sentFail} ${artist.email}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-8 sm:py-20">
      <div className="grid gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="kicker">{t.contactKicker}</p>
          <h1 className="display-md mt-3">{t.contactTitle}</h1>
          <p className="mt-5 max-w-md text-muted">{t.contactIntro}</p>
          <dl className="mt-10 space-y-5 text-sm">
            <div>
              <dt className="kicker">{t.email}</dt>
              <dd className="mt-2">
                <a className="stitch" href={`mailto:${artist.email}`}>
                  {artist.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="kicker">{t.phone}</dt>
              <dd className="mt-2">
                <a href={`tel:${artist.phone.replace(/\s/g, "")}`}>{artist.phone}</a>
              </dd>
            </div>
            <div>
              <dt className="kicker">{t.whatsapp}</dt>
              <dd className="mt-2">
                <a className="stitch" href={artist.whatsapp} target="_blank" rel="noreferrer">
                  {t.whatsapp}
                </a>
              </dd>
            </div>
            <div>
              <dt className="kicker">{t.studio}</dt>
              <dd className="mt-2">{artist.place}</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={100} className="lg:col-span-7">
          <form
            className="grid gap-4 bg-paper p-6 sm:p-8"
            onSubmit={send}
          >
            <label className="grid gap-2 text-sm">
              {t.name}
              <input required name="name" autoComplete="name" className="h-12 border border-line bg-parchment px-3" />
            </label>
            <label className="grid gap-2 text-sm">
              {t.email}
              <input required type="email" name="email" autoComplete="email" className="h-12 border border-line bg-parchment px-3" />
            </label>
            <label className="grid gap-2 text-sm">
              {t.interest}
              <select name="interest" className="h-12 border border-line bg-parchment px-3">
                <option>{t.interestAcquisition}</option>
                <option>{t.interestCommission}</option>
                <option>{t.interestVisit}</option>
                <option>{t.interestPress}</option>
                <option>{t.interestOther}</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              {t.message}
              <textarea name="message" rows={5} required className="border border-line bg-parchment px-3 py-3" />
            </label>
            <Button type="submit" disabled={sending}>
              {sending ? t.sending : t.send}
            </Button>
          </form>
        </Reveal>
      </div>

      <Reveal className="mt-20 border border-line p-8">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <p className="kicker">{t.collectorList}</p>
            <h2 className="font-display mt-3 text-3xl">{t.firstLook}</h2>
          </div>
          <CollectorListForm />
        </div>
      </Reveal>

      <section className="mt-20">
        <h2 className="display-md">{t.questions}</h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {faqs.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="cursor-pointer font-display text-2xl">
                {item.q}
              </summary>
              <p className="mt-3 max-w-2xl text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-10 md:grid-cols-3">
        <Policy title={t.terms} lines={policies.terms} />
        <Policy title={t.returns} lines={policies.returns} />
        <Policy title={t.privacy} lines={policies.privacy} />
      </section>
    </div>
  );
}

function Policy({ title, lines }: { title: string; lines: string[] }) {
  return (
    <details>
      <summary className="kicker cursor-pointer">{title}</summary>
      <div className="mt-4 space-y-3 text-sm text-muted">
        {lines.map((line) => (
          <p key={line.slice(0, 32)}>{line}</p>
        ))}
      </div>
    </details>
  );
}
