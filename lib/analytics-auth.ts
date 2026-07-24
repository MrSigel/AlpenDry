import "server-only";
import { createHash, timingSafeEqual } from "crypto";

/**
 * Passwortschutz für /analytics — serverseitig, damit das Passwort NIE zum
 * Client gelangt.
 *
 * Das Passwort steht in der Umgebungsvariable ANALYTICS_PASSWORD, nicht im
 * Code: Das Repo ist öffentlich, ein hartkodiertes Passwort stünde damit für
 * jeden lesbar auf GitHub.
 *
 * Der Cookie enthält NICHT das Passwort, sondern seinen SHA-256-Hash. Damit
 * lässt sich aus dem Cookie nicht auf das Passwort zurückschließen, und ein
 * geändertes Passwort macht alte Cookies automatisch ungültig. Der Vergleich
 * läuft zeitkonstant (timingSafeEqual), damit die Antwortzeit nichts über die
 * Richtigkeit verrät.
 */

export const AUTH_COOKIE = "alpendry_analytics";

function hash(value: string): string {
  return createHash("sha256").update(`alpendry:${value}`).digest("hex");
}

/** Ist überhaupt ein Passwort gesetzt? Ohne das zeigt /analytics die Einrichtung. */
export function isAuthConfigured(): boolean {
  return Boolean(process.env.ANALYTICS_PASSWORD);
}

/** Der Cookie-Wert, der nach korrektem Login gesetzt wird. */
export function tokenForCurrentPassword(): string | null {
  const pw = process.env.ANALYTICS_PASSWORD;
  return pw ? hash(pw) : null;
}

/** Stimmt das eingegebene Passwort? Zeitkonstanter Vergleich. */
export function passwordMatches(input: string): boolean {
  const pw = process.env.ANALYTICS_PASSWORD;
  if (!pw) return false;
  const a = Buffer.from(hash(input));
  const b = Buffer.from(hash(pw));
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Ist der mitgeschickte Cookie gültig? */
export function cookieIsValid(cookieValue: string | undefined): boolean {
  const expected = tokenForCurrentPassword();
  if (!expected || !cookieValue) return false;
  const a = Buffer.from(cookieValue);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
