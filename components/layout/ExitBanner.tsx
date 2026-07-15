"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { contact, exitBanner, whatsappHref } from "@/lib/content";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

/**
 * Exit-Intent-Banner.
 *
 * Erscheint einmal pro Sitzung, wenn der Zeiger den Viewport nach oben
 * verlässt (Richtung Tab-Leiste/Adresszeile).
 *
 * Bewusste Grenzen — ein Exit-Popup ist schnell aufdringlich, und plan.md §0
 * verlangt Ruhe:
 *   - nur Desktop mit Maus (`pointer: fine`). Auf Touch gibt es kein
 *     Exit-Intent; ein Popup beim Hochwischen wäre reine Belästigung, und die
 *     Notruf-Leiste trägt dort ohnehin.
 *   - einmal pro Sitzung (sessionStorage), nie erneut nach dem Schließen.
 *   - erst nach 5 s Verweildauer — wer sofort wieder geht, war falsch hier.
 *   - schließbar per X, Esc, Klick auf den Hintergrund.
 *   - kein zweiter Inhalt, nur die zwei CTAs, die es ohnehin gibt.
 */

const SEEN_KEY = "alpendry_exit_seen";
const MIN_DWELL_MS = 5000;

export function ExitBanner() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Nur Zeigergeräte mit echtem Hover — kein Touch.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    try {
      if (window.sessionStorage.getItem(SEEN_KEY)) return;
    } catch {
      return; // sessionStorage gesperrt → lieber gar nicht zeigen
    }

    const armedAt = Date.now() + MIN_DWELL_MS;

    const onLeave = (e: MouseEvent) => {
      // Nur nach oben aus dem Fenster, nicht seitlich.
      if (e.clientY > 0 || e.relatedTarget) return;
      if (Date.now() < armedAt) return;
      try {
        window.sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* ignorieren */
      }
      setOpen(true);
      document.removeEventListener("mouseout", onLeave);
    };

    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, []);

  // Esc schließt.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Hintergrund — Klick schließt */}
          <div
            className="absolute inset-0 bg-ink/85 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-title"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg rounded-sm border border-hairline bg-abyss p-8 md:p-10"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Hinweis schließen"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-sm text-steel transition-colors hover:text-snow"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <p className="eyebrow">{exitBanner.eyebrow}</p>
            <h2 id="exit-title" className="mt-5 text-2xl">
              {exitBanner.title}
            </h2>
            <p className="mt-4 max-w-prose font-body text-sm text-frost-dim">
              {exitBanner.body}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={contact.phoneHref}
                className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-signal px-6 py-4 font-display text-sm font-semibold text-ink transition-colors duration-300 ease-glide hover:bg-glacier"
                aria-label={`Notruf ${contact.phone} — rund um die Uhr erreichbar`}
              >
                <PhoneIcon className="h-4 w-4" />
                <span className="font-mono">{contact.phone}</span>
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-sm border border-hairline px-6 py-4 font-display text-sm font-semibold text-snow transition-all duration-300 ease-glide hover:border-glacier hover:bg-glacier-glow"
              >
                <WhatsAppIcon className="h-4 w-4 text-glacier" />
                WhatsApp
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
