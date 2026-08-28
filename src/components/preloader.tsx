import { useEffect, useState } from "react";
import { BrandMark } from "@/components/brand-mark";

export function Preloader() {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("arteli-boot");
    if (seen || reduce) {
      setMounted(false);
      return;
    }
    sessionStorage.setItem("arteli-boot", "1");
    const hide = window.setTimeout(() => setMounted(false), 1100);
    return () => window.clearTimeout(hide);
  }, []);

  if (!mounted) return null;

  return (
    <div className="preloader" aria-hidden="true">
      <div className="grid justify-items-center gap-5">
        <span className="kicker">Ile-Ife · Thread Painting</span>
        <BrandMark />
        <span
          className="h-px w-48 origin-left bg-terracotta"
          style={{ animation: "boot-line 0.6s cubic-bezier(0.23,1,0.32,1) 0.12s both" }}
        />
      </div>
    </div>
  );
}
