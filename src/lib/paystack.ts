export const PAYSTACK_PUBLIC_KEY =
  import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ||
  "pk_live_302f72919d4fb3a70e2a64fee603a52a077da7a5";

export const PAYSTACK_CURRENCY = (import.meta.env.VITE_PAYSTACK_CURRENCY ||
  "NGN") as "NGN" | "USD";

export const hasPaystack = Boolean(PAYSTACK_PUBLIC_KEY.startsWith("pk_"));

type PaystackPop = {
  setup: (options: {
    key: string;
    email: string;
    amount: number;
    currency: string;
    ref: string;
    metadata: {
      custom_fields: { display_name: string; variable_name: string; value: string }[];
    };
    onSuccess: (transaction: { reference: string }) => void;
    onCancel: () => void;
  }) => { openIframe: () => void };
};

declare global {
  interface Window {
    PaystackPop?: PaystackPop;
  }
}

export async function loadPaystack() {
  if (window.PaystackPop) return window.PaystackPop;
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Could not load Paystack. Check the connection and try again."));
    document.head.appendChild(script);
  });
  if (!window.PaystackPop) throw new Error("Paystack did not initialize.");
  return window.PaystackPop;
}

export function ngnFromUsd(amountUsd: number, rate: number) {
  if (!Number.isFinite(rate) || rate <= 0) return null;
  return Math.round(amountUsd * rate);
}
