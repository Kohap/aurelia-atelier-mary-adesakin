import { useSyncExternalStore } from "react";
import { artworks, getArtwork as seedGetArtwork, relatedWorks as seedRelated, type Artwork } from "@/data/artworks";
import { normalizeCatalogue } from "@/lib/admin";

type CatalogueSnapshot = {
  works: Artwork[];
  source: "seed" | "live";
  ready: boolean;
};

let snapshot: CatalogueSnapshot = {
  works: artworks,
  source: "seed",
  ready: true,
};
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

export function getCatalogue() {
  return snapshot.works;
}

export function getCatalogueSource() {
  return snapshot.source;
}

export function subscribeCatalogue(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function applyPublishedCatalogue(works: Artwork[]) {
  if (!works.length) return;
  snapshot = { works, source: "live", ready: true };
  emit();
}

export function useCatalogue() {
  return useSyncExternalStore(subscribeCatalogue, () => snapshot, () => snapshot);
}

export function useArtwork(slug: string | null | undefined) {
  const { works } = useCatalogue();
  if (!slug) return null;
  return works.find((work) => work.slug === slug) ?? seedGetArtwork(slug) ?? null;
}

export function relatedFromCatalogue(slug: string, limit = 3) {
  return seedRelated(slug, limit, snapshot.works);
}

export async function hydrateCatalogue() {
  if (typeof window === "undefined") return;
  if (/github\.io$/.test(window.location.hostname)) {
    snapshot = { ...snapshot, ready: true };
    emit();
    return;
  }
  try {
    const res = await fetch("/api/catalogue", { headers: { accept: "application/json" } });
    if (res.ok) {
      const next = normalizeCatalogue(await res.json());
      if (next.length) {
        snapshot = { works: next, source: "live", ready: true };
        emit();
        return;
      }
    }
  } catch {
    /* keep seed */
  }
  snapshot = { ...snapshot, ready: true };
  emit();
}
