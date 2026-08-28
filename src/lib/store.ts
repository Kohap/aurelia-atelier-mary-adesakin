import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Currency, Lang } from "@/data/i18n";

export type PolicyId = "terms" | "returns" | "privacy";

export type CheckoutTarget = {
  slug: string;
  amount: number;
  label: string;
  title?: string;
  collection?: string;
};

type StudioState = {
  shortlist: string[];
  shortlistOpen: boolean;
  inquirySlug: string | null;
  checkout: CheckoutTarget | null;
  policy: PolicyId | null;
  lang: Lang;
  currency: Currency;
  rates: Record<string, number>;
  toggleShortlist: (slug: string) => void;
  removeFromShortlist: (slug: string) => void;
  setShortlistOpen: (open: boolean) => void;
  openInquiry: (slug: string | null) => void;
  openCheckout: (checkout: CheckoutTarget | null) => void;
  setPolicy: (policy: PolicyId | null) => void;
  setLang: (lang: Lang) => void;
  setCurrency: (currency: Currency) => void;
  setRates: (rates: Record<string, number>) => void;
};

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      shortlist: [],
      shortlistOpen: false,
      inquirySlug: null,
      checkout: null,
      policy: null,
      lang: "en",
      currency: "USD",
      rates: { USD: 1 },
      toggleShortlist: (slug) => {
        const has = get().shortlist.includes(slug);
        set({
          shortlist: has
            ? get().shortlist.filter((item) => item !== slug)
            : [...get().shortlist, slug],
        });
      },
      removeFromShortlist: (slug) =>
        set({ shortlist: get().shortlist.filter((item) => item !== slug) }),
      setShortlistOpen: (open) => set({ shortlistOpen: open }),
      openInquiry: (slug) => set({ inquirySlug: slug, shortlistOpen: false, checkout: null }),
      openCheckout: (checkout) => set({ checkout, shortlistOpen: false, inquirySlug: null }),
      setPolicy: (policy) => set({ policy }),
      setLang: (lang) => set({ lang }),
      setCurrency: (currency) => set({ currency }),
      setRates: (rates) => set({ rates }),
    }),
    {
      name: "arteli-studio",
      partialize: (state) => ({
        shortlist: state.shortlist,
        lang: state.lang,
        currency: state.currency,
      }),
    },
  ),
);
