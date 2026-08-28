import { copy } from "@/data/i18n";
import { useStudio } from "@/lib/store";

export function useT() {
  const lang = useStudio((s) => s.lang);
  return copy[lang];
}

export function useMoney() {
  const currency = useStudio((s) => s.currency);
  const rates = useStudio((s) => s.rates);
  const fallback = useT().priceOnRequest;
  return (value: number | null | undefined) =>
    formatWith(value, currency, rates, fallback);
}

function formatWith(
  value: number | null | undefined,
  currency: "USD" | "NGN" | "EUR",
  rates: Record<string, number>,
  fallback: string,
) {
  if (value == null) return fallback;
  const rate = currency === "USD" ? 1 : rates[currency];
  const amount = rate ? value * rate : value;
  const code = rate ? currency : "USD";
  const locale = code === "NGN" ? "en-NG" : code === "EUR" ? "fr-FR" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  }).format(amount);
}
