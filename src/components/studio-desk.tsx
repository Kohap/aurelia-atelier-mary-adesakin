import { FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  CreditCard,
  Download,
  ExternalLink,
  ImagePlus,
  Send,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { hasPaystack, PAYSTACK_CURRENCY } from "@/lib/paystack";
import { useStudio } from "@/lib/store";
import {
  adminHeaders,
  artworkSrc,
  catalogueJson,
  cloneSeedCatalogue,
  downloadBlob,
  emptyArtworkDraft,
  hasPrintPricing,
  isPaystackPaymentUrl,
  isPositivePrice,
  nextArtworkId,
  normalizeCatalogue,
  normalizePrice,
  optimizeArtworkUpload,
  readDeskToken,
  uniqueArtworkSlug,
  writeDeskToken,
  type ArtworkDraft,
  type DeskArtwork,
  type PaystackTransactionList,
} from "@/lib/admin";
import { cn } from "@/lib/utils";

export function StudioDesk() {
  const initialJson = useRef<string | null>(null);
  const [works, setWorks] = useState<DeskArtwork[]>(() => cloneSeedCatalogue());
  const [token, setToken] = useState("");
  const [source, setSource] = useState<"seed" | "live">("seed");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<ArtworkDraft>(() => emptyArtworkDraft());
  const [draftImage, setDraftImage] = useState<File | null>(null);
  const [draftError, setDraftError] = useState("");
  const [testAmount, setTestAmount] = useState("10");
  const [payments, setPayments] = useState<PaystackTransactionList | null>(null);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [busy, setBusy] = useState<"publish" | "live" | null>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const openCheckout = useStudio((s) => s.openCheckout);

  const currentJson = useMemo(() => catalogueJson(works), [works]);
  const dirty = Boolean(initialJson.current && currentJson !== initialJson.current);
  const pricedOriginals = works.filter((work) => isPositivePrice(work.originalPrice)).length;
  const pricedPrints = works.filter(hasPrintPricing).length;

  useEffect(() => {
    setToken(readDeskToken());
  }, []);

  useEffect(() => {
    if (works.length && initialJson.current === null) {
      initialJson.current = currentJson;
    }
  }, [works.length, currentJson]);

  function rememberToken(value: string) {
    setToken(value);
    writeDeskToken(value);
  }

  function patchWork(id: number, patch: (work: DeskArtwork) => DeskArtwork) {
    setWorks((items) => items.map((work) => (work.id === id ? patch(work) : work)));
  }

  async function loadLive() {
    setBusy("live");
    try {
      const res = await fetch("/api/catalogue");
      if (!res.ok) throw new Error("Live storage is empty or unavailable.");
      const next = normalizeCatalogue(await res.json());
      if (!next.length) throw new Error("Live storage did not return a catalogue.");
      setWorks(next);
      initialJson.current = catalogueJson(next);
      setSource("live");
      toast.success("Loaded the live catalogue from storage.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not load live storage.");
    } finally {
      setBusy(null);
    }
  }

  function resetCatalogue() {
    if (!initialJson.current) return;
    setWorks(normalizeCatalogue(JSON.parse(initialJson.current)));
    toast.message("Catalogue edits reset.");
  }

  function exportJson() {
    downloadBlob(new Blob([currentJson], { type: "application/json" }), "artworks.json");
    initialJson.current = currentJson;
    toast.success("Download complete. Keep this file as a git backup of the catalogue.");
  }

  async function publishCatalogue() {
    setBusy("publish");
    try {
      const res = await fetch("/api/publish-catalogue", {
        method: "POST",
        body: currentJson,
        headers: adminHeaders(token, { "content-type": "application/json" }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Publish failed — use Export JSON as a backup.");
      }
      initialJson.current = currentJson;
      setSource("live");
      toast.success("Catalogue published to storage.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Publish failed — use Export JSON as a backup.");
    } finally {
      setBusy(null);
    }
  }

  async function addArtwork(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (!draftImage) {
      setDraftError("Choose an artwork image.");
      return;
    }
    const printPrice = normalizePrice(draft.printPrice);
    const printSize = draft.printSize.trim();
    if (Boolean(printPrice) !== Boolean(printSize)) {
      setDraftError("Add both a print size and a print price, or leave both blank.");
      return;
    }
    const links = [draft.paystackPaymentUrl, draft.printPaystackUrl];
    if (links.some((link) => link.trim() && !isPaystackPaymentUrl(link.trim()))) {
      setDraftError("Use a valid secure Paystack payment or product link.");
      return;
    }

    setAdding(true);
    setDraftError("");

    try {
      const slug = uniqueArtworkSlug(draft.title, works);
      const prepared = await optimizeArtworkUpload(draftImage, slug);
      const previewImage = URL.createObjectURL(prepared.blob);
      let image = `/artwork/${prepared.filename}`;
      let uploaded = false;

      try {
        const uploadRes = await fetch(
          `/api/upload-artwork?filename=${encodeURIComponent(prepared.filename)}`,
          {
            method: "POST",
            body: prepared.blob,
            headers: adminHeaders(token, { "content-type": "image/webp" }),
          },
        );
        if (uploadRes.ok) {
          const result = (await uploadRes.json()) as { url?: string };
          if (result.url) {
            image = result.url;
            uploaded = true;
          }
        }
      } catch {
        uploaded = false;
      }

      if (!uploaded) downloadBlob(prepared.blob, prepared.filename);

      const artwork: DeskArtwork = {
        id: nextArtworkId(works),
        slug,
        title: draft.title.trim(),
        collection: draft.collection.trim(),
        year: draft.year.trim(),
        medium: draft.medium.trim(),
        dimensions: draft.dimensions.trim(),
        originalPrice: normalizePrice(draft.originalPrice),
        printOptions:
          printPrice && printSize
            ? [
                {
                  size: printSize,
                  price: printPrice,
                  ...(draft.printPaystackUrl.trim()
                    ? { paystackPaymentUrl: draft.printPaystackUrl.trim() }
                    : {}),
                },
              ]
            : [],
        status: draft.status,
        edition: draft.edition.trim(),
        provenance: draft.provenance.trim(),
        image,
        description: {
          en: draft.descriptionEn.trim(),
          yo: draft.descriptionYo.trim(),
          fr: draft.descriptionFr.trim(),
        },
        ...(draft.paystackPaymentUrl.trim()
          ? { paystackPaymentUrl: draft.paystackPaymentUrl.trim() }
          : {}),
        _previewImage: previewImage,
      };

      setWorks((items) => [...items, artwork]);
      setDraft(emptyArtworkDraft());
      setDraftImage(null);
      form.reset();
      toast.success(
        uploaded
          ? `${artwork.title} added. Image uploaded to storage.`
          : `${artwork.title} added. WebP downloaded — copy it to public/artwork/ before pushing.`,
      );
    } catch (err) {
      setDraftError(err instanceof Error ? err.message : "The artwork could not be added.");
    } finally {
      setAdding(false);
    }
  }

  async function loadPayments(page = 1) {
    setPaymentsLoading(true);
    try {
      const res = await fetch(`/api/transactions?perPage=20&page=${page}&status=success`, {
        headers: adminHeaders(token),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? "Could not load payments.");
      setPayments(body);
      setPaymentsPage(page);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not load payments.");
    } finally {
      setPaymentsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-parchment text-ink">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="kicker">
              <Settings size={14} className="inline" /> Studio desk
            </p>
            <h1 className="font-display mt-2 text-4xl tracking-tight">Arteli catalogue</h1>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Edit the Ile-Ife works, English / Yoruba / French copy, prints, and Paystack
              checkout. Publish writes live storage; export keeps a git backup.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <label className="desk-field w-full sm:w-72">
              <span>Studio key</span>
              <input
                type="password"
                autoComplete="off"
                value={token}
                onChange={(event) => rememberToken(event.target.value)}
                placeholder="Required on the live host"
              />
            </label>
            <Link to="/" className="btn btn-line">
              View atelier
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 sm:py-12">
        <div className="flex flex-col gap-4 border border-line bg-paper p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-5">
          <p className={cn("kicker", dirty ? "text-terracotta" : "text-ok")}>
            {dirty ? "Unsaved changes" : "No unsaved changes"}
            <span className="ml-3 text-muted">
              {source === "live" ? "Live storage" : "Atelier catalogue"}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="line" type="button" onClick={resetCatalogue} disabled={!dirty}>
              Reset
            </Button>
            <Button variant="line" type="button" onClick={loadLive} disabled={busy === "live"}>
              {busy === "live" ? "Loading…" : "Load live"}
            </Button>
            <Button type="button" onClick={publishCatalogue} disabled={busy === "publish"}>
              <Send size={16} /> {busy === "publish" ? "Publishing…" : "Publish"}
            </Button>
            <Button variant="ghost" type="button" onClick={exportJson}>
              <Download size={16} /> Export JSON
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-px bg-line sm:grid-cols-3">
          <Stat value={works.length} label="Total works" />
          <Stat value={pricedOriginals} label="Original prices" />
          <Stat value={pricedPrints} label="Print prices" />
        </div>

        <p className="mt-6 border border-line bg-paper px-4 py-4 text-sm text-muted">
          Publish pushes this desk to live storage used by the atelier host. Export JSON if you
          also want the bundled catalogue in git. Image uploads go to storage on the live host;
          locally the WebP downloads for `public/artwork/`.
        </p>

        <details className="desk-panel mt-8">
          <summary>
            <ImagePlus size={18} /> Add new artwork
          </summary>
          <form className="desk-grid" onSubmit={addArtwork}>
            <Field label="Artwork title">
              <input
                value={draft.title}
                onChange={(event) => setDraft((d) => ({ ...d, title: event.target.value }))}
                maxLength={120}
                required
              />
            </Field>
            <Field label="Collection">
              <input
                value={draft.collection}
                onChange={(event) => setDraft((d) => ({ ...d, collection: event.target.value }))}
                maxLength={120}
                required
              />
            </Field>
            <Field label="Year">
              <input
                value={draft.year}
                onChange={(event) => setDraft((d) => ({ ...d, year: event.target.value }))}
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                required
              />
            </Field>
            <Field label="Status">
              <select
                value={draft.status}
                onChange={(event) =>
                  setDraft((d) => ({ ...d, status: event.target.value as ArtworkDraft["status"] }))
                }
              >
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
              </select>
            </Field>
            <Field label="Medium">
              <input
                value={draft.medium}
                onChange={(event) => setDraft((d) => ({ ...d, medium: event.target.value }))}
                maxLength={160}
                required
              />
            </Field>
            <Field label="Dimensions">
              <input
                value={draft.dimensions}
                onChange={(event) => setDraft((d) => ({ ...d, dimensions: event.target.value }))}
                maxLength={80}
                placeholder="24 × 30 inches"
                required
              />
            </Field>
            <Field label="Original price in USD">
              <input
                type="number"
                min={1}
                step={1}
                value={draft.originalPrice}
                onChange={(event) => setDraft((d) => ({ ...d, originalPrice: event.target.value }))}
                placeholder="Price on request"
              />
            </Field>
            <Field label="Edition">
              <input
                value={draft.edition}
                onChange={(event) => setDraft((d) => ({ ...d, edition: event.target.value }))}
                maxLength={100}
                required
              />
            </Field>
            <Field label="English description" wide>
              <textarea
                value={draft.descriptionEn}
                onChange={(event) => setDraft((d) => ({ ...d, descriptionEn: event.target.value }))}
                rows={4}
                maxLength={1200}
                required
              />
            </Field>
            <Field label="Yoruba description" wide>
              <textarea
                value={draft.descriptionYo}
                onChange={(event) => setDraft((d) => ({ ...d, descriptionYo: event.target.value }))}
                rows={3}
                maxLength={1200}
              />
            </Field>
            <Field label="French description" wide>
              <textarea
                value={draft.descriptionFr}
                onChange={(event) => setDraft((d) => ({ ...d, descriptionFr: event.target.value }))}
                rows={3}
                maxLength={1200}
              />
            </Field>
            <Field label="Provenance" wide>
              <input
                value={draft.provenance}
                onChange={(event) => setDraft((d) => ({ ...d, provenance: event.target.value }))}
                maxLength={240}
                required
              />
            </Field>
            <Field label="Print size">
              <input
                value={draft.printSize}
                onChange={(event) => setDraft((d) => ({ ...d, printSize: event.target.value }))}
                maxLength={80}
                placeholder="10 × 12 inches"
              />
            </Field>
            <Field label="Print price in USD">
              <input
                type="number"
                min={1}
                step={1}
                value={draft.printPrice}
                onChange={(event) => setDraft((d) => ({ ...d, printPrice: event.target.value }))}
              />
            </Field>
            {hasPaystack ? (
              <p className="desk-help sm:col-span-2">
                Paystack Inline is active — collectors pay from the work page. No product links
                needed.
              </p>
            ) : (
              <>
                <Field label="Original Paystack product link">
                  <input
                    type="url"
                    inputMode="url"
                    value={draft.paystackPaymentUrl}
                    onChange={(event) =>
                      setDraft((d) => ({ ...d, paystackPaymentUrl: event.target.value }))
                    }
                    placeholder="https://paystack.com/buy/..."
                  />
                </Field>
                <Field label="Print Paystack product link">
                  <input
                    type="url"
                    inputMode="url"
                    value={draft.printPaystackUrl}
                    onChange={(event) =>
                      setDraft((d) => ({ ...d, printPaystackUrl: event.target.value }))
                    }
                    placeholder="https://paystack.com/buy/..."
                  />
                </Field>
              </>
            )}
            <Field label="Artwork image" wide>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setDraftImage(event.target.files?.[0] ?? null)}
                required
              />
            </Field>
            <p className="desk-help sm:col-span-2">
              Images are resized to 1,400 pixels and converted to WebP. On the live host they
              upload automatically; here they download for `public/artwork/`.
            </p>
            {draftError ? (
              <p className="sm:col-span-2 text-sm text-terracotta" role="alert">
                {draftError}
              </p>
            ) : null}
            <Button className="sm:col-span-2" type="submit" disabled={adding}>
              <ImagePlus size={16} /> {adding ? "Preparing artwork…" : "Add artwork"}
            </Button>
          </form>
        </details>

        {hasPaystack ? (
          <details className="desk-panel mt-4">
            <summary>
              <CreditCard size={18} /> Test checkout
            </summary>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <Field label="Test amount (USD)" className="sm:w-48">
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={testAmount}
                  onChange={(event) => setTestAmount(event.target.value)}
                />
              </Field>
              <Button
                type="button"
                onClick={() =>
                  openCheckout({
                    slug: "studio-desk-test",
                    amount: Number(testAmount) || 10,
                    label: "Test payment",
                    title: "Studio desk test",
                    collection: "Arteli",
                  })
                }
              >
                <CreditCard size={16} /> Open test checkout
              </Button>
            </div>
            <p className="desk-help mt-4">
              Opens the same Paystack Inline the atelier uses. Use a Paystack test card only if
              this public key is in test mode.
            </p>
          </details>
        ) : null}

        <details className="desk-panel mt-4">
          <summary>
            <ExternalLink size={18} /> Payment records
          </summary>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="desk-help">
              Successful Paystack charges. The live host needs the Paystack secret key on the
              server — it is never stored in this desk.
            </p>
            <Button type="button" onClick={() => loadPayments(1)} disabled={paymentsLoading}>
              {paymentsLoading ? "Loading…" : payments ? "Refresh" : "Load payments"}
            </Button>
          </div>
          {payments ? <PaymentsTable payments={payments} page={paymentsPage} loading={paymentsLoading} onPage={loadPayments} /> : null}
        </details>

        <div className="mt-8 grid gap-4">
          {works.map((work) => (
            <WorkEditor
              key={work.id}
              work={work}
              open={openSlug === work.slug}
              onToggle={() => setOpenSlug((slug) => (slug === work.slug ? null : work.slug))}
              onPatch={(patch) => patchWork(work.id, patch)}
              showLinks={!hasPaystack}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-paper px-5 py-6">
      <p className="font-display text-4xl">{value}</p>
      <p className="kicker mt-2">{label}</p>
    </div>
  );
}

function Field({
  label,
  children,
  wide,
  className,
}: {
  label: string;
  children: ReactNode;
  wide?: boolean;
  className?: string;
}) {
  return (
    <label className={cn("desk-field", wide && "sm:col-span-2", className)}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function WorkEditor({
  work,
  open,
  onToggle,
  onPatch,
  showLinks,
}: {
  work: DeskArtwork;
  open: boolean;
  onToggle: () => void;
  onPatch: (patch: (work: DeskArtwork) => DeskArtwork) => void;
  showLinks: boolean;
}) {
  return (
    <article className="border border-line bg-paper">
      <div className="grid gap-4 p-4 sm:grid-cols-[7rem_minmax(0,1fr)_10rem_10rem] sm:items-center sm:p-5">
        <img
          src={artworkSrc(work.image, work._previewImage)}
          alt=""
          className="aspect-[4/5] w-full object-cover sm:w-28"
        />
        <div>
          <span className={cn("kicker", work.status === "Sold" ? "text-muted" : "text-ok")}>
            {work.status}
          </span>
          <h2 className="font-display mt-1 text-3xl">{work.title}</h2>
          <p className="mt-1 text-sm text-muted">
            {work.medium} / {work.dimensions} / {work.year}
          </p>
        </div>
        <Field label="Original USD">
          <input
            type="number"
            min={1}
            step={1}
            value={work.originalPrice ?? ""}
            onChange={(event) =>
              onPatch((item) => ({ ...item, originalPrice: normalizePrice(event.target.value) }))
            }
            placeholder="On request"
          />
        </Field>
        <Field label="Status">
          <select
            value={work.status}
            onChange={(event) =>
              onPatch((item) => ({
                ...item,
                status: event.target.value as DeskArtwork["status"],
              }))
            }
          >
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
          </select>
        </Field>
      </div>

      {work.printOptions.length ? (
        <div className="grid gap-3 border-t border-line px-4 py-4 sm:grid-cols-2 sm:px-5">
          {work.printOptions.map((option, index) => (
            <Field key={`${option.size}-${index}`} label={`Print ${option.size}`}>
              <input
                type="number"
                min={1}
                step={1}
                value={option.price ?? ""}
                onChange={(event) => {
                  const price = normalizePrice(event.target.value);
                  onPatch((item) => ({
                    ...item,
                    printOptions: item.printOptions.map((row, rowIndex) =>
                      rowIndex === index ? { ...row, price: price ?? 0 } : row,
                    ),
                  }));
                }}
              />
            </Field>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        className="flex w-full items-center justify-between border-t border-line px-4 py-3 text-left kicker sm:px-5"
        onClick={onToggle}
        aria-expanded={open}
      >
        {open ? "Close copy" : "Edit copy & details"}
        <span aria-hidden="true">{open ? "–" : "+"}</span>
      </button>

      {open ? (
        <div className="desk-grid border-t border-line px-4 py-5 sm:px-5">
          <Field label="Title">
            <input
              value={work.title}
              onChange={(event) => onPatch((item) => ({ ...item, title: event.target.value }))}
            />
          </Field>
          <Field label="Collection">
            <input
              value={work.collection}
              onChange={(event) =>
                onPatch((item) => ({ ...item, collection: event.target.value }))
              }
            />
          </Field>
          <Field label="Year">
            <input
              value={work.year}
              onChange={(event) => onPatch((item) => ({ ...item, year: event.target.value }))}
            />
          </Field>
          <Field label="Medium">
            <input
              value={work.medium}
              onChange={(event) => onPatch((item) => ({ ...item, medium: event.target.value }))}
            />
          </Field>
          <Field label="Dimensions">
            <input
              value={work.dimensions}
              onChange={(event) =>
                onPatch((item) => ({ ...item, dimensions: event.target.value }))
              }
            />
          </Field>
          <Field label="Edition">
            <input
              value={work.edition}
              onChange={(event) => onPatch((item) => ({ ...item, edition: event.target.value }))}
            />
          </Field>
          <Field label="English" wide>
            <textarea
              rows={3}
              value={work.description.en}
              onChange={(event) =>
                onPatch((item) => ({
                  ...item,
                  description: { ...item.description, en: event.target.value },
                }))
              }
            />
          </Field>
          <Field label="Yoruba" wide>
            <textarea
              rows={3}
              value={work.description.yo}
              onChange={(event) =>
                onPatch((item) => ({
                  ...item,
                  description: { ...item.description, yo: event.target.value },
                }))
              }
            />
          </Field>
          <Field label="French" wide>
            <textarea
              rows={3}
              value={work.description.fr}
              onChange={(event) =>
                onPatch((item) => ({
                  ...item,
                  description: { ...item.description, fr: event.target.value },
                }))
              }
            />
          </Field>
          <Field label="Provenance" wide>
            <input
              value={work.provenance}
              onChange={(event) =>
                onPatch((item) => ({ ...item, provenance: event.target.value }))
              }
            />
          </Field>
          {showLinks ? (
            <Field label="Paystack product link" wide>
              <input
                type="url"
                value={work.paystackPaymentUrl ?? ""}
                onChange={(event) =>
                  onPatch((item) => ({ ...item, paystackPaymentUrl: event.target.value }))
                }
              />
            </Field>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function PaymentsTable({
  payments,
  page,
  loading,
  onPage,
}: {
  payments: PaystackTransactionList;
  page: number;
  loading: boolean;
  onPage: (page: number) => void;
}) {
  const rows = payments.data ?? [];
  if (!rows.length) {
    return <p className="desk-help pt-4">No payments found.</p>;
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="kicker">
          <tr className="border-b border-line">
            <th className="py-3 pr-4 font-medium">Date</th>
            <th className="py-3 pr-4 font-medium">Buyer</th>
            <th className="py-3 pr-4 font-medium">Artwork</th>
            <th className="py-3 pr-4 font-medium">Amount</th>
            <th className="py-3 font-medium">Reference</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((tx) => {
            const fields = Array.isArray(tx.metadata?.custom_fields) ? tx.metadata.custom_fields : [];
            const field = (name: string) =>
              fields.find((item) => item.variable_name === name)?.value ?? "—";
            const date = new Date(tx.paid_at ?? tx.created_at ?? "").toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const major = tx.amount / 100;
            const amount =
              (tx.currency || PAYSTACK_CURRENCY) === "NGN"
                ? `₦${major.toLocaleString("en-NG")}`
                : `$${major.toLocaleString("en-US")}`;
            return (
              <tr key={tx.id} className="border-b border-line align-top">
                <td className="py-3 pr-4">{date}</td>
                <td className="py-3 pr-4">
                  <strong className="font-medium">{field("buyer_name")}</strong>
                  <div className="text-muted">{tx.customer?.email}</div>
                  <div className="text-muted">{field("phone")}</div>
                </td>
                <td className="py-3 pr-4">
                  <strong className="font-medium">{field("artwork")}</strong>
                  <div className="text-muted">{field("item")}</div>
                </td>
                <td className="py-3 pr-4 tabular-nums">{amount}</td>
                <td className="py-3 font-mono text-xs">{tx.reference}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-4 flex items-center justify-between gap-3">
        <Button variant="line" type="button" onClick={() => onPage(page - 1)} disabled={loading || page <= 1}>
          Previous
        </Button>
        <span className="kicker">Page {page}</span>
        <Button
          variant="line"
          type="button"
          onClick={() => onPage(page + 1)}
          disabled={loading || rows.length < 20}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
