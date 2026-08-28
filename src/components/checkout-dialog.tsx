import { FormEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useArtwork } from "@/lib/catalogue";
import { useEscape } from "@/lib/use-escape";
import {
  PAYSTACK_CURRENCY,
  PAYSTACK_PUBLIC_KEY,
  loadPaystack,
  ngnFromUsd,
} from "@/lib/paystack";
import { useStudio } from "@/lib/store";
import { useMoney, useT } from "@/lib/use-t";
import { Button } from "@/components/ui/button";

export function CheckoutDialog() {
  const checkout = useStudio((s) => s.checkout);
  const close = useStudio((s) => s.openCheckout);
  const rates = useStudio((s) => s.rates);
  const setPolicy = useStudio((s) => s.setPolicy);
  const policy = useStudio((s) => s.policy);
  const work = useArtwork(checkout?.slug);
  const t = useT();
  const money = useMoney();
  const onClose = useCallback(() => close(null), [close]);
  useEscape(onClose, Boolean(checkout) && !policy);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ngnAmount, setNgnAmount] = useState<number | null>(null);

  const amountUsd = checkout?.amount ?? 0;

  useEffect(() => {
    if (!checkout) return;
    setError("");
    if (PAYSTACK_CURRENCY !== "NGN") {
      setNgnAmount(null);
      return;
    }
    const fromStore = ngnFromUsd(amountUsd, rates.NGN);
    if (fromStore) {
      setNgnAmount(fromStore);
      return;
    }
    setNgnAmount(null);
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const naira = ngnFromUsd(amountUsd, Number(data?.rates?.NGN));
        if (!naira) throw new Error(t.rateUnavailable);
        setNgnAmount(naira);
      })
      .catch(() => setError(t.rateUnavailable));
  }, [checkout, amountUsd, rates.NGN, t.rateUnavailable]);

  if (!checkout) return null;
  const piece = {
    slug: checkout.slug,
    title: work?.title ?? checkout.title ?? checkout.label,
    collection: work?.collection ?? checkout.collection ?? "Arteli",
  };
  const item = checkout;

  const chargeAmount = PAYSTACK_CURRENCY === "NGN" ? ngnAmount : amountUsd;
  const ngnDisplay =
    Number.isFinite(ngnAmount) && ngnAmount
      ? `₦${ngnAmount.toLocaleString("en-NG")}`
      : PAYSTACK_CURRENCY === "NGN"
        ? t.loadingRate
        : null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!Number.isFinite(chargeAmount) || !chargeAmount || chargeAmount <= 0) {
      setError(t.rateUnavailable);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const pop = await loadPaystack();
      const handler = pop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email,
        amount: chargeAmount * 100,
        currency: PAYSTACK_CURRENCY,
        ref: `${piece.slug}-${Date.now()}`,
        metadata: {
          custom_fields: [
            { display_name: "Buyer Name", variable_name: "buyer_name", value: name },
            { display_name: "Phone", variable_name: "phone", value: phone },
            { display_name: "Artwork", variable_name: "artwork", value: piece.title },
            { display_name: "Item", variable_name: "item", value: item.label },
          ],
        },
        onSuccess: (transaction) => {
          onClose();
          toast.success(`${t.paymentReceived} ${transaction.reference}`);
        },
        onCancel: () => undefined,
      });
      handler.openIframe();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.payFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/45 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-labelledby="checkout-title"
        className="w-full max-w-lg bg-paper p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="kicker">{piece.collection}</p>
            <h2 id="checkout-title" className="font-display mt-2 text-3xl">
              {piece.title}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {checkout.label} — {money(amountUsd)}
              {ngnDisplay ? ` (${ngnDisplay})` : ""}
            </p>
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
          <label className="grid gap-2 text-sm">
            {t.fullName}
            <input
              required
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 border border-line bg-parchment px-3"
            />
          </label>
          <label className="grid gap-2 text-sm">
            {t.email}
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 border border-line bg-parchment px-3"
            />
          </label>
          <label className="grid gap-2 text-sm">
            {t.phone}
            <input
              required
              type="tel"
              name="phone"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12 border border-line bg-parchment px-3"
            />
          </label>
          <p className="text-sm text-muted">{t.checkoutNote}</p>
          <p className="text-xs leading-relaxed text-muted">
            {t.checkoutAgree}{" "}
            <button
              type="button"
              className="underline decoration-line underline-offset-4"
              onClick={() => setPolicy("terms")}
            >
              {t.terms}
            </button>
            {", "}
            <button
              type="button"
              className="underline decoration-line underline-offset-4"
              onClick={() => setPolicy("returns")}
            >
              {t.returns}
            </button>
            {", "}
            <button
              type="button"
              className="underline decoration-line underline-offset-4"
              onClick={() => setPolicy("privacy")}
            >
              {t.privacy}
            </button>
            .
          </p>
          {error ? (
            <p className="text-sm text-terracotta" role="alert">
              {error}
            </p>
          ) : null}
          <Button
            type="submit"
            disabled={loading || (PAYSTACK_CURRENCY === "NGN" && !Number.isFinite(ngnAmount))}
          >
            {loading ? t.paying : `${t.pay} ${ngnDisplay ?? money(amountUsd)}`}
          </Button>
        </form>
      </div>
    </div>
  );
}
