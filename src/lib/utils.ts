import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Currency, Lang } from "@/data/i18n";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(
  value: number | null | undefined,
  currency: Currency = "USD",
  rates: Record<string, number> = { USD: 1 },
  fallback = "Price on request",
) {
  if (value == null) return fallback;
  const rate = currency === "USD" ? 1 : rates[currency];
  if (!rate) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }
  const converted = value * rate;
  const locale = currency === "NGN" ? "en-NG" : currency === "EUR" ? "fr-FR" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "NGN" ? 0 : 0,
  }).format(converted);
}

export function localize<T extends Record<Lang, string>>(
  value: T | string,
  lang: Lang,
) {
  if (typeof value === "string") return value;
  return value[lang] || value.en;
}

export function artworkSrcSet(image: string) {
  if (!image.endsWith(".webp")) return undefined;
  return `${image.replace(/\.webp$/, "-480.webp")} 480w, ${image} 900w`;
}

export function parseInches(dimensions: string) {
  const nums = [...dimensions.matchAll(/(\d+(?:\.\d+)?)/g)].map((m) => Number(m[1]));
  if (!nums.length) return null;
  return { w: nums[0] ?? 0, h: nums[1] ?? nums[0] ?? 0 };
}

export function artworkHref(slug: string) {
  if (typeof window === "undefined") return `/work/${slug}`;
  return new URL(`/work/${slug}`, window.location.origin).href;
}

export async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.left = "-9999px";
    document.body.appendChild(field);
    field.select();
    const ok = document.execCommand("copy");
    field.remove();
    if (!ok) throw new Error("copy failed");
  }
}

