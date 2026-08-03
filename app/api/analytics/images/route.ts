import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { put } from "@vercel/blob";
import sharp from "sharp";

import { AUTH_COOKIE, cookieIsValid } from "@/lib/analytics-auth";
import {
  isValidSlot,
  setImageOverride,
  clearImageOverride,
} from "@/lib/managed-images";

/**
 * Bild-Upload / Zurücksetzen für die Verwaltung auf /analytics.
 *
 * Nur mit gültigem Auth-Cookie — sonst kann jeder Fremdbilder auf die Seite
 * laden. Das hochgeladene Bild wird mit sharp auf WebP normalisiert (max. 1600
 * breit, verkleinert nie hoch), im Blob-Speicher abgelegt und die URL unter der
 * Slot-ID hinterlegt. `setImageOverride` entwertet den Cache, sodass die
 * Website das neue Bild zeigt.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 12 * 1024 * 1024; // 12 MB Rohdatei — nach WebP deutlich kleiner
const ALLOWED = /^image\/(png|jpe?g|webp|avif)$/i;

function redirect(req: Request, status: string) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const origin = host ? `${proto}://${host}` : new URL(req.url).origin;
  return NextResponse.redirect(`${origin}/analytics?bild=${status}#bilder`, {
    status: 303,
  });
}

export async function POST(req: Request) {
  // 1) Zugang
  const store = await cookies();
  if (!cookieIsValid(store.get(AUTH_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const slotId = form?.get("slotId");
  if (typeof slotId !== "string" || !isValidSlot(slotId)) {
    return redirect(req, "fehler");
  }

  // 2) Zurücksetzen auf das eingebaute Bild
  if (form?.get("action") === "reset") {
    await clearImageOverride(slotId).catch(() => {});
    return redirect(req, "zurueckgesetzt");
  }

  // 3) Neues Bild — Speicher vorhanden?
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return redirect(req, "nichtaktiv");
  }

  const file = form?.get("file");
  if (!(file instanceof File) || file.size === 0) return redirect(req, "fehler");
  if (file.size > MAX_BYTES) return redirect(req, "zugross");
  if (!ALLOWED.test(file.type)) return redirect(req, "falschertyp");

  try {
    const input = Buffer.from(await file.arrayBuffer());
    // rotate(): EXIF-Orientierung anwenden, sonst liegen Handyfotos quer.
    const webp = await sharp(input)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toBuffer();

    // Zufälliges Suffix im Namen: Der Blob-Speicher setzt sonst bei gleichem
    // Namen keinen neuen Inhalt durch (Caching). `addRandomSuffix` erledigt das.
    const { url } = await put(`managed/${slotId.replace(/:/g, "_")}.webp`, webp, {
      access: "public",
      contentType: "image/webp",
      addRandomSuffix: true,
    });

    const ok = await setImageOverride(slotId, url);
    return redirect(req, ok ? "ok" : "fehler");
  } catch (err) {
    console.error("[bilder] Upload fehlgeschlagen:", err);
    return redirect(req, "fehler");
  }
}
