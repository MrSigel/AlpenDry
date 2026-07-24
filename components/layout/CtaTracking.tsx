"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

/**
 * Erfasst das Klickverhalten auf den wichtigsten Handlungen der Seite:
 * Anruf, WhatsApp, E-Mail.
 *
 * EIN zentraler Listener am Dokument (Capture-Phase) statt eines onClick an
 * jedem Button. Der Grund ist derselbe wie bei AnchorScroll: Anruf- und
 * WhatsApp-Buttons stehen an rund einem Dutzend Stellen (Header, Hero, jede
 * Unterseite, Sticky-Bar, Exit-Banner …). Sie einzeln zu instrumentieren wäre
 * fehleranfällig, und jeder neue Button müsste daran denken. So wird jeder
 * `tel:`-, `wa.me`- und `mailto:`-Klick automatisch mitgezählt — auch künftige.
 *
 * Was ankommt: benannte Ereignisse im Vercel-Dashboard ("call", "whatsapp",
 * "email") mit der Seite, von der aus geklickt wurde. Keine personenbezogenen
 * Daten — nur, WELCHE Aktion WO ausgelöst wurde.
 *
 * `<Analytics />` (Seitenaufrufe) läuft separat im Layout. Ohne diesen Tracker
 * sähe Vercel nur Aufrufe, nicht das Klickverhalten.
 */
export function CtaTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a");
      const href = anchor?.getAttribute("href");
      if (!href) return;

      const action = href.startsWith("tel:")
        ? "call"
        : /wa\.me|whatsapp/i.test(href)
          ? "whatsapp"
          : href.startsWith("mailto:")
            ? "email"
            : null;
      if (!action) return;

      // `location.pathname` verrät, VON WELCHER Seite aus geklickt wurde —
      // so lässt sich später sehen, wo die CTAs am besten ziehen.
      track(action, { from: window.location.pathname });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
