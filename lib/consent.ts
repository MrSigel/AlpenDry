"use client";

import { useSyncExternalStore } from "react";

/**
 * Cookie-Consent — Speicherung und Auslesen der Nutzerentscheidung.
 *
 * Bewusst localStorage statt Cookie: Die Entscheidung muss den Browser nie
 * verlassen. Ein Consent-Cookie würde bei jedem Request mitgeschickt — genau
 * das, was wir vermeiden wollen.
 *
 * Ohne Einwilligung wird NICHTS geladen, was Daten an Dritte sendet.
 */

export type ConsentValue = "granted" | "denied";

export const CONSENT_KEY = "alpendry_consent";

/** 6 Monate — danach wird erneut gefragt (siehe Cookie-Seite). */
const MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;

/** Wird gefeuert, wenn sich die Entscheidung ändert — Banner und Seite hören mit. */
export const CONSENT_EVENT = "alpendry:consent";

type Stored = { v: ConsentValue; t: number };

export function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    if (parsed.v !== "granted" && parsed.v !== "denied") return null;
    // Abgelaufene Einwilligung zählt als „nicht gefragt".
    if (!parsed.t || Date.now() - parsed.t > MAX_AGE_MS) return null;
    return parsed.v;
  } catch {
    // Privater Modus / localStorage gesperrt → wie „nicht gefragt" behandeln.
    return null;
  }
}

export function writeConsent(v: ConsentValue) {
  if (typeof window === "undefined") return;
  try {
    const payload: Stored = { v, t: Date.now() };
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
  } catch {
    // Nicht speicherbar: Die Wahl gilt dann nur für diese Sitzung.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: v }));
}

export function clearConsent() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* ignorieren */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}

// ─────────────────────────────────────────────────────────────────────
// React-Anbindung
// ─────────────────────────────────────────────────────────────────────

/**
 * Abo für useSyncExternalStore. Hört auf eigene Änderungen (CONSENT_EVENT)
 * und auf `storage` — so bleiben mehrere offene Tabs synchron.
 */
function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Auf dem Server ist keine Entscheidung bekannt — dort gilt „noch nicht gefragt". */
function getServerSnapshot(): ConsentValue | null {
  return null;
}

/**
 * Aktuelle Entscheidung als React-State.
 *
 * useSyncExternalStore statt useEffect+setState: localStorage ist ein externer
 * Store, und genau dafür ist die API da. Sie löst Hydration und Abo in einem,
 * ohne kaskadierende Renders.
 *
 * `getSnapshot` gibt einen primitiven Wert zurück, daher keine Endlosschleife.
 */
export function useConsent(): ConsentValue | null {
  return useSyncExternalStore(subscribe, readConsent, getServerSnapshot);
}
