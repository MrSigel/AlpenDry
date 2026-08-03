import "server-only";
import { Redis } from "@upstash/redis";

/**
 * Gemeinsamer Speicher-Client (Upstash Redis, REST).
 *
 * Eine Stelle für beide Nutzer: die Nutzungszählung (lib/analytics-store.ts)
 * und die Bildverwaltung (lib/managed-images.ts). Verbindet sich über die
 * Umgebungsvariablen, die die Vercel-/Upstash-Integration setzt; beide
 * Namensschemata werden akzeptiert. Ohne Variablen liefert `kv()` null — die
 * Aufrufer fangen das ab und arbeiten mit den eingebauten Vorgaben weiter.
 */

const url =
  process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "";
const token =
  process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "";

let client: Redis | null = null;

export function kv(): Redis | null {
  if (!url || !token) return null;
  if (!client) client = new Redis({ url, token });
  return client;
}

export function kvConfigured(): boolean {
  return Boolean(url && token);
}
