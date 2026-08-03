import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { kv } from "./kv";
import { photos } from "./photos";

/**
 * Austauschbare Bilder — die Verbindung zwischen der Bildverwaltung auf
 * /analytics und den Stellen, an denen die Bilder auf der Website erscheinen.
 *
 * WIE ES FUNKTIONIERT
 * Die eingebauten Bilder liegen wie bisher in public/. Lädt die Inhaberin auf
 * /analytics ein neues Bild hoch, landet dessen Datei im Blob-Speicher und die
 * URL wird hier unter der Slot-ID vermerkt. Beim Rendern gewinnt die
 * hinterlegte URL über das eingebaute Bild — sonst bleibt alles beim Original.
 *
 * WARUM DIE STATISCHEN SEITEN TROTZDEM SCHNELL BLEIBEN
 * Der Abgleich läuft über eine getaggte Cache-Funktion (unstable_cache). Die
 * öffentlichen Seiten lesen daraus, ohne bei jedem Aufruf den Speicher
 * anzufassen. Erst ein Bildwechsel entwertet den Cache (revalidateTag) und die
 * betroffenen Seiten bauen sich neu — die Ausnahme, nicht der Normalfall.
 *
 * OHNE SPEICHER/BLOB: Alles fällt auf die eingebauten Bilder zurück, nichts
 * stürzt ab. Die Verwaltung auf /analytics zeigt sich dann als „nicht
 * verfügbar" (neutral, ohne Anbieter zu nennen).
 */

export type ManagedImage = {
  /** Stabile ID — Schlüssel im Speicher UND im Upload. Nie ändern. */
  readonly id: string;
  /** Sichtbarer Name in der Verwaltung. */
  readonly label: string;
  /** Gruppenüberschrift in der Verwaltung. */
  readonly group: string;
  /** Eingebautes Bild (Fallback). `srcSet` nur, wo es Responsive-Varianten gibt. */
  readonly fallback: { readonly src: string; readonly srcSet?: string };
};

const arbeiten = (key: string, label: string): ManagedImage => ({
  id: `arbeiten:${key}`,
  label,
  group: "Bisherige Arbeiten",
  fallback: {
    src: `/arbeiten/${key}-800.webp`,
    srcSet: `/arbeiten/${key}-400.webp 400w, /arbeiten/${key}-800.webp 800w`,
  },
});

// Fallback aus der echten Fotoliste (lib/photos.ts) ableiten — eine Quelle, kein
// zweites Mal Dateinamen abtippen. Die Breiten unterscheiden sich je Foto
// (z. B. wasserlauf 700/1400 statt 900/1600); das steht dort, nicht hier.
const foto = (key: keyof typeof photos, label: string): ManagedImage => ({
  id: `foto:${key}`,
  label,
  group: "Einsatzgebiet & Leistungen",
  fallback: { src: photos[key].srcWide },
});

/**
 * Alle austauschbaren Bilder. Reihenfolge = Anzeigereihenfolge in der Verwaltung.
 * Die Labels entsprechen den Leistungen bzw. den Bildunterschriften.
 */
export const MANAGED_IMAGES: readonly ManagedImage[] = [
  arbeiten("wasserschaden", "Wasserschadensanierung"),
  arbeiten("leckageortung", "Leckageortung"),
  arbeiten("trocknung", "Technische Trocknung"),
  arbeiten("schimmel", "Schimmelsanierung"),
  arbeiten("hochwasser", "Hochwasser-Prävention"),
  arbeiten("dokumentation", "Dokumentation"),
  foto("alpenpanorama", "Einsatzgebiet — Panorama"),
  foto("voralpensee", "See (Hochwasser-Seite)"),
  foto("wasserlauf", "Wasserlauf (Leckageortung-Seite)"),
  {
    id: "logo:mark",
    label: "Logo — Bergkette",
    group: "Marke",
    fallback: { src: "/brand/mark.png" },
  },
];

const VALID_IDS = new Set(MANAGED_IMAGES.map((m) => m.id));
export function isValidSlot(id: string): boolean {
  return VALID_IDS.has(id);
}

const HASH = "img:overrides";
const TAG = "managed-images";

/**
 * Alle hinterlegten Ersatzbilder (Slot-ID → URL). Getaggt gecacht, damit die
 * öffentlichen Seiten nicht bei jedem Aufruf den Speicher anfassen.
 */
export const getImageOverrides = unstable_cache(
  async (): Promise<Record<string, string>> => {
    const r = kv();
    if (!r) return {};
    try {
      return (await r.hgetall<Record<string, string>>(HASH)) ?? {};
    } catch {
      return {};
    }
  },
  ["managed-images"],
  { tags: [TAG] },
);

/** Aktuelles Bild eines Slots: hinterlegte URL (einzeln) oder Fallback (ggf. srcSet). */
export function resolveImage(
  image: ManagedImage,
  overrides: Record<string, string>,
): { src: string; srcSet?: string } {
  const url = overrides[image.id];
  return url ? { src: url } : image.fallback;
}

/** Ersatzbild hinterlegen. Entwertet den Cache, sodass die Website es zeigt. */
export async function setImageOverride(id: string, url: string): Promise<boolean> {
  const r = kv();
  if (!r || !VALID_IDS.has(id)) return false;
  await r.hset(HASH, { [id]: url });
  revalidateTag(TAG, "max");
  return true;
}

/** Auf das eingebaute Bild zurücksetzen. */
export async function clearImageOverride(id: string): Promise<boolean> {
  const r = kv();
  if (!r || !VALID_IDS.has(id)) return false;
  await r.hdel(HASH, id);
  revalidateTag(TAG, "max");
  return true;
}
