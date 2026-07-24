import { NextResponse } from "next/server";
import { recordEvent, recordPageview } from "@/lib/analytics-store";

/**
 * Ingest für den eigenen Zähler (siehe lib/analytics-store.ts).
 *
 * Der Client meldet per `navigator.sendBeacon` entweder einen Seitenaufruf oder
 * einen CTA-Klick. Der Endpunkt zählt nur — er speichert nichts Personen-
 * bezogenes und antwortet IMMER mit 204, egal was passiert: Tracking darf den
 * Besuch nie stören, und ein Fehler hier soll dem Nutzer nichts verraten.
 *
 * Bots werden nicht mitgezählt (grobe User-Agent-Prüfung, der UA wird NICHT
 * gespeichert — nur zur Entscheidung genutzt).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BOT = /bot|crawl|spider|slurp|bingpreview|headless|lighthouse|preview/i;

export async function POST(req: Request) {
  const ua = req.headers.get("user-agent") ?? "";
  if (BOT.test(ua)) return new NextResponse(null, { status: 204 });

  try {
    // sendBeacon schickt als text/plain — robust selbst parsen statt req.json().
    const raw = await req.text();
    const body = raw ? JSON.parse(raw) : {};

    if (body?.type === "pageview") {
      await recordPageview(body.path);
    } else if (body?.type === "event") {
      await recordEvent(body.action);
    }
  } catch {
    /* Ungültige Nutzlast — still verwerfen. */
  }

  return new NextResponse(null, { status: 204 });
}
