import { artworks, type Artwork, type Localized, type PrintOption } from "@/data/artworks";

export const DESK_TOKEN_KEY = "arteli-desk-key";
export const MAX_ARTWORK_IMAGE_BYTES = 15 * 1024 * 1024;
const ALLOWED_ARTWORK_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export type DeskArtwork = Artwork & {
  _previewImage?: string;
  paystackPaymentUrl?: string;
};

export type ArtworkDraft = {
  title: string;
  collection: string;
  year: string;
  medium: string;
  dimensions: string;
  originalPrice: string;
  status: Artwork["status"];
  edition: string;
  provenance: string;
  descriptionEn: string;
  descriptionYo: string;
  descriptionFr: string;
  printSize: string;
  printPrice: string;
  paystackPaymentUrl: string;
  printPaystackUrl: string;
};

export function emptyArtworkDraft(): ArtworkDraft {
  return {
    title: "",
    collection: "",
    year: String(new Date().getFullYear()),
    medium: "",
    dimensions: "",
    originalPrice: "",
    status: "Available",
    edition: "Original work",
    provenance: "Original catalogue work by Mary Adesakin Damilola.",
    descriptionEn: "",
    descriptionYo: "",
    descriptionFr: "",
    printSize: "",
    printPrice: "",
    paystackPaymentUrl: "",
    printPaystackUrl: "",
  };
}

export function isDeskPath(pathname: string) {
  return pathname.replace(/\/+$/, "").endsWith("/adesakin/admin");
}

export function readDeskToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(DESK_TOKEN_KEY) ?? "";
}

export function writeDeskToken(value: string) {
  sessionStorage.setItem(DESK_TOKEN_KEY, value);
}

export function adminHeaders(token: string, extra?: HeadersInit): HeadersInit {
  return {
    ...(extra ?? {}),
    ...(token ? { "x-admin-token": token } : {}),
  };
}

export function isPositivePrice(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function normalizePrice(value: unknown): number | null {
  if (value === "" || value == null) return null;
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

export function hasPrintPricing(artwork: Pick<Artwork, "printOptions"> & { printPrice?: number | null }) {
  return artwork.printOptions.some((option) => isPositivePrice(option.price)) || isPositivePrice(artwork.printPrice);
}

export function slugifyArtworkTitle(title: string) {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function uniqueArtworkSlug(title: string, works: { slug: string }[]) {
  const base = slugifyArtworkTitle(title) || "untitled-artwork";
  const existing = new Set(works.map((work) => work.slug));
  if (!existing.has(base)) return base;
  let suffix = 2;
  while (existing.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

export function nextArtworkId(works: { id: number }[]) {
  return works.reduce((highest, work) => Math.max(highest, Number(work.id) || 0), 0) + 1;
}

export function isPaystackPaymentUrl(value: string) {
  if (!value.trim()) return false;
  try {
    const parsed = new URL(value);
    const host = parsed.hostname === "paystack.com" || parsed.hostname.endsWith(".paystack.com");
    const path = parsed.pathname.startsWith("/pay/") || parsed.pathname.startsWith("/buy/");
    return parsed.protocol === "https:" && host && path;
  } catch {
    return false;
  }
}

export function artworkSrc(image: string, preview?: string) {
  if (preview) return preview;
  if (!image) return "";
  if (/^(https?:|blob:|data:)/i.test(image)) return image;
  return `/${image.replace(/^\/+/, "").replace(/^assets\//, "")}`;
}

export function cloneSeedCatalogue(): DeskArtwork[] {
  return structuredClone(artworks);
}

export function normalizeArtwork(raw: unknown): DeskArtwork | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  if (typeof item.slug !== "string" || typeof item.title !== "string") return null;

  const descRaw = item.description;
  const description: Localized = { en: "", yo: "", fr: "" };
  if (descRaw && typeof descRaw === "object") {
    const desc = descRaw as Record<string, unknown>;
    description.en = String(desc.en ?? "");
    description.yo = String(desc.yo ?? "");
    description.fr = String(desc.fr ?? "");
  } else if (typeof descRaw === "string") {
    description.en = descRaw;
  }

  const printOptions: PrintOption[] = Array.isArray(item.printOptions)
    ? item.printOptions.flatMap((option) => {
        if (!option || typeof option !== "object") return [];
        const row = option as Record<string, unknown>;
        const size = String(row.size ?? "").trim();
        const price = normalizePrice(row.price);
        if (!size || !price) return [];
        const paystackPaymentUrl =
          typeof row.paystackPaymentUrl === "string" ? row.paystackPaymentUrl.trim() : "";
        return [
          {
            size,
            price,
            ...(paystackPaymentUrl ? { paystackPaymentUrl } : {}),
          },
        ];
      })
    : [];

  if (!printOptions.length) {
    const legacy = normalizePrice(item.printPrice);
    if (legacy) printOptions.push({ size: "Print", price: legacy });
  }

  const paystackPaymentUrl =
    typeof item.paystackPaymentUrl === "string" ? item.paystackPaymentUrl.trim() : "";

  return {
    id: Number(item.id) || 0,
    slug: item.slug,
    title: String(item.title),
    collection: String(item.collection ?? ""),
    year: String(item.year ?? ""),
    medium: String(item.medium ?? ""),
    dimensions: String(item.dimensions ?? ""),
    originalPrice: normalizePrice(item.originalPrice),
    printOptions,
    status: item.status === "Sold" ? "Sold" : "Available",
    edition: String(item.edition ?? "Original work"),
    provenance: String(item.provenance ?? ""),
    image: artworkSrc(String(item.image ?? "")),
    description,
    ...(paystackPaymentUrl ? { paystackPaymentUrl } : {}),
  };
}

export function normalizeCatalogue(raw: unknown): DeskArtwork[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeArtwork).filter((item): item is DeskArtwork => Boolean(item));
}

export function publishableCatalogue(works: DeskArtwork[]) {
  return works.map(({ _previewImage, ...artwork }) => artwork);
}

export function catalogueJson(works: DeskArtwork[]) {
  return `${JSON.stringify(publishableCatalogue(works), null, 2)}\n`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function loadArtworkImage(file: File) {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file);
    return {
      source: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      release: () => bitmap.close(),
    };
  }

  const sourceUrl = URL.createObjectURL(file);
  const image = new Image();
  image.src = sourceUrl;
  await image.decode();
  return {
    source: image,
    width: image.naturalWidth,
    height: image.naturalHeight,
    release: () => URL.revokeObjectURL(sourceUrl),
  };
}

export async function optimizeArtworkUpload(file: File, slug: string) {
  if (!ALLOWED_ARTWORK_IMAGE_TYPES.has(file.type)) {
    throw new Error("Choose a JPG, PNG, or WebP image.");
  }
  if (file.size > MAX_ARTWORK_IMAGE_BYTES) {
    throw new Error("The image must be 15 MB or smaller.");
  }

  const image = await loadArtworkImage(file);
  const scale = Math.min(1, 1400 / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext("2d");
  if (!context) {
    image.release();
    throw new Error("This browser could not prepare the image.");
  }
  context.drawImage(image.source, 0, 0, canvas.width, canvas.height);
  image.release();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.78));
  if (!blob) throw new Error("This browser could not prepare the image.");
  return { blob, filename: `${slug}.webp` };
}

export type PaystackTransaction = {
  id: number;
  amount: number;
  currency?: string;
  reference: string;
  paid_at?: string;
  created_at?: string;
  customer?: { email?: string };
  metadata?: {
    custom_fields?: { display_name?: string; variable_name?: string; value?: string }[];
  };
};

export type PaystackTransactionList = {
  data?: PaystackTransaction[];
};
