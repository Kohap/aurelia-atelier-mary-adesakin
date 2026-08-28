import { type ReactNode, useEffect } from "react";
import { Toaster } from "sonner";
import { InquiryDialog } from "@/components/inquiry-dialog";
import { CheckoutDialog } from "@/components/checkout-dialog";
import { NeedleCursor } from "@/components/needle-cursor";
import { PolicyDialog } from "@/components/policy-dialog";
import { Preloader } from "@/components/preloader";
import { ShortlistDrawer } from "@/components/shortlist-drawer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useStudio } from "@/lib/store";
import { useT } from "@/lib/use-t";

export function SiteShell({ children }: { children: ReactNode }) {
  const t = useT();
  const lang = useStudio((s) => s.lang);
  const setRates = useStudio((s) => s.setRates);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    let alive = true;
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!alive || !data?.rates) return;
        setRates({
          USD: 1,
          NGN: Number(data.rates.NGN) || 0,
          EUR: Number(data.rates.EUR) || 0,
        });
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [setRates]);

  return (
    <div className="relative min-h-screen bg-parchment text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-paper focus:px-4 focus:py-2"
      >
        {t.skip}
      </a>
      <Preloader />
      <NeedleCursor />
      <SiteHeader />
      <main id="main" className="pt-[72px]">
        {children}
      </main>
      <SiteFooter />
      <ShortlistDrawer />
      <InquiryDialog />
      <CheckoutDialog />
      <PolicyDialog />
      <Toaster position="bottom-center" richColors />
    </div>
  );
}
