"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics";

/**
 * Erfasst Seitenaufrufe und das Klickverhalten (Anruf / WhatsApp / Mail) —
 * DOPPELT, an zwei unabhängige Ziele:
 *   1. Vercel Analytics (`track`) → Zahlen im Vercel-Dashboard.
 *   2. Eigener Zähler (`/api/track`) → Zahlen auf der /analytics-Seite, die
 *      Vercel nicht ausliefern kann.
 *
 * EIN zentraler Klick-Listener am Dokument (Capture-Phase) statt eines onClick
 * an jedem der rund zwölf CTA-Buttons — derselbe Ansatz wie AnchorScroll. Jeder
 * neue Button ist dadurch automatisch mit dabei.
 *
 * `sendBeacon` für den eigenen Zähler: feuert zuverlässig auch dann noch, wenn
 * der Klick sofort auf eine andere Seite oder in WhatsApp führt (ein normales
 * fetch würde beim Navigieren abgebrochen).
 *
 * KEINE personenbezogenen Daten: übermittelt wird nur, WELCHE Aktion auf WELCHER
 * Seite ausgelöst wurde.
 */

function beacon(payload: object) {
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", body);
    } else {
      void fetch("/api/track", { method: "POST", body, keepalive: true });
    }
  } catch {
    /* Tracking darf nie stören. */
  }
}

export function UsageTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  // Seitenaufruf — einmal je Pfad, auch bei Client-Navigation.
  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    beacon({ type: "pageview", path: pathname });
  }, [pathname]);

  // CTA-Klicks.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const href = (event.target as Element | null)?.closest?.("a")?.getAttribute("href");
      if (!href) return;

      const action = href.startsWith("tel:")
        ? "call"
        : /wa\.me|whatsapp/i.test(href)
          ? "whatsapp"
          : href.startsWith("mailto:")
            ? "email"
            : null;
      if (!action) return;

      track(action, { from: window.location.pathname });
      beacon({ type: "event", action });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
