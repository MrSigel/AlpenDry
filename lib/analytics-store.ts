import "server-only";
import { Redis } from "@upstash/redis";

/**
 * Eigener, unabhängiger Zähler für die /analytics-Seite.
 *
 * WARUM ÜBERHAUPT ein zweiter Zähler, wo doch Vercel Analytics läuft?
 * Vercel sammelt dieselben Klicks, aber die Zahlen liegen ausschließlich im
 * Vercel-Dashboard — es gibt keinen Weg, sie in eine eigene Seite zu holen.
 * Die Kundin wollte die Auswertung auf der Seite selbst. Also zählen wir hier
 * ein zweites Mal, in einen Speicher, den wir auslesen dürfen.
 *
 * WAS GESPEICHERT WIRD: ausschließlich Zähler. Seitenaufrufe pro Pfad, Klicks
 * pro Aktion, ein Tageswert für den Verlauf. KEINE IP, kein User-Agent, kein
 * Identifikator — es lässt sich nicht auf eine Person zurückführen. Genau
 * deshalb ist das datenschutzrechtlich harmlos (aggregat, cookielos).
 *
 * SPEICHER: Upstash Redis (REST). Verbindet sich über Umgebungsvariablen, die
 * die Vercel-/Upstash-Integration setzt. Ist keine gesetzt, arbeitet alles im
 * Leerlauf — nichts stürzt ab, die Seite zeigt stattdessen die Einrichtung.
 * Beide Namensschemata werden akzeptiert (klassisches Vercel KV und die neue
 * Upstash-Integration).
 */

const url =
  process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "";
const token =
  process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "";

let redis: Redis | null = null;
function client(): Redis | null {
  if (!url || !token) return null;
  if (!redis) redis = new Redis({ url, token });
  return redis;
}

/** Ist ein Speicher verbunden? Steuert, ob /analytics Zahlen oder Anleitung zeigt. */
export function isStoreConfigured(): boolean {
  return Boolean(url && token);
}

const K = {
  pvTotal: "alpendry:pv:total",
  pvByPath: "alpendry:pv:path", // Hash: Feld = Pfad
  events: "alpendry:events", // Hash: Feld = Aktion
  daily: "alpendry:pv:daily", // Hash: Feld = YYYY-MM-DD
} as const;

/** Die vier Aktionen, die der Client meldet. Feste Liste — nichts anderes wird gezählt. */
export const TRACKED_ACTIONS = ["call", "whatsapp", "email", "form_submit"] as const;
export type TrackedAction = (typeof TRACKED_ACTIONS)[number];

/** Pfad säubern: nur der Pfad, keine Query (könnte sonst Fremddaten enthalten), gedeckelt. */
function cleanPath(path: unknown): string | null {
  if (typeof path !== "string") return null;
  const p = path.split("?")[0].split("#")[0].trim();
  if (!p.startsWith("/") || p.length > 120) return null;
  return p;
}

function today(): string {
  // Läuft zur Request-Zeit (dynamische Route), nicht beim Build — new Date() ist hier korrekt.
  return new Date().toISOString().slice(0, 10);
}

/** Ein Seitenaufruf. Fehler werden verschluckt — Tracking darf die Seite nie beeinträchtigen. */
export async function recordPageview(path: unknown): Promise<void> {
  const r = client();
  const p = cleanPath(path);
  if (!r || !p) return;
  try {
    await Promise.all([
      r.incr(K.pvTotal),
      r.hincrby(K.pvByPath, p, 1),
      r.hincrby(K.daily, today(), 1),
    ]);
  } catch {
    /* Speicher nicht erreichbar — ignorieren. */
  }
}

/** Ein Klick auf Anrufen / WhatsApp / Mail oder ein Formular-Absenden. */
export async function recordEvent(action: unknown): Promise<void> {
  const r = client();
  if (!r || !TRACKED_ACTIONS.includes(action as TrackedAction)) return;
  try {
    await r.hincrby(K.events, action as string, 1);
  } catch {
    /* ignorieren */
  }
}

export type UsageStats = {
  totalPageviews: number;
  topPaths: { path: string; count: number }[];
  events: Record<TrackedAction, number>;
  daily: { date: string; count: number }[];
};

const num = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/** Alles auslesen, was die /analytics-Seite anzeigt. Nur lesend. */
export async function readStats(days = 14): Promise<UsageStats> {
  const r = client();
  const empty: UsageStats = {
    totalPageviews: 0,
    topPaths: [],
    events: { call: 0, whatsapp: 0, email: 0, form_submit: 0 },
    daily: [],
  };
  if (!r) return empty;

  // Die letzten `days` Tage als Achse — auch Tage ohne Aufrufe erscheinen (als 0).
  const dates: string[] = [];
  const base = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setUTCDate(d.getUTCDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }

  try {
    const [total, paths, events, dailyVals] = await Promise.all([
      r.get<number>(K.pvTotal),
      r.hgetall<Record<string, number>>(K.pvByPath),
      r.hgetall<Record<string, number>>(K.events),
      dates.length ? r.hmget<Record<string, number>>(K.daily, ...dates) : Promise.resolve(null),
    ]);

    const topPaths = Object.entries(paths ?? {})
      .map(([path, count]) => ({ path, count: num(count) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);

    return {
      totalPageviews: num(total),
      topPaths,
      events: {
        call: num(events?.call),
        whatsapp: num(events?.whatsapp),
        email: num(events?.email),
        form_submit: num(events?.form_submit),
      },
      daily: dates.map((date) => ({ date, count: num((dailyVals as Record<string, unknown> | null)?.[date]) })),
    };
  } catch {
    return empty;
  }
}
