"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useConsent, writeConsent } from "@/lib/consent";

/**
 * Cookie-Banner.
 *
 * DSGVO-Kern: „Ablehnen" ist genauso prominent wie „Akzeptieren" — gleiche
 * Größe, gleiche Position, keine Farbfalle. Kein Vorankreuzen, kein
 * Wegklick-X (das wäre eine Entscheidung ohne Entscheidung). Ohne Einwilligung
 * lädt nichts, was Daten an Dritte sendet.
 *
 * Sitzt auf Mobil ÜBER der fixierten Notruf-Leiste (bottom-[3.75rem]) — im
 * Notfall darf ein Cookie-Banner den Notruf nicht verdecken.
 */
export function CookieBanner() {
  const reduced = useReducedMotion();
  /**
   * Kein useState/useEffect: `useConsent` liest den Store über
   * useSyncExternalStore. Serverseitig liefert er `null`, was hier bewusst
   * NICHT sofort das Banner zeigt — der erste Client-Frame korrigiert das,
   * bevor etwas sichtbar wird (AnimatePresence blendet ein).
   * Nebeneffekt: Ein Widerruf auf der Cookie-Seite lässt das Banner
   * automatisch wieder erscheinen, ohne eigene Verdrahtung.
   */
  const consent = useConsent();
  const open = consent === null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label="Cookie-Einstellungen"
          aria-live="polite"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-[3.75rem] z-[55] px-4 pb-4 md:bottom-0 md:px-6 md:pb-6"
        >
          {/* Bewusst flach gehalten: Der Banner sitzt über den Hero-CTAs
              (Notruf/WhatsApp), die laut Business Case Kap. 6 ohne Scrollen
              sichtbar sein müssen. Je höher er baut, desto mehr verdeckt er sie
              — deshalb eine Zeile Text statt Absatz. */}
          <div className="mx-auto flex max-w-shell flex-col gap-4 rounded-sm border border-hairline bg-abyss/98 px-6 py-4 backdrop-blur-md md:flex-row md:items-center md:justify-between md:gap-8">
            <p className="font-body text-sm text-frost-dim">
              Wir nutzen notwendige Cookies. Analyse-Cookies nur mit Ihrer
              Einwilligung, jederzeit widerrufbar —{" "}
              <Link
                href="/cookies"
                className="text-frost underline underline-offset-2 transition-colors hover:text-snow"
              >
                Cookie-Hinweise
              </Link>{" "}
              ·{" "}
              <Link
                href="/datenschutz"
                className="text-frost underline underline-offset-2 transition-colors hover:text-snow"
              >
                Datenschutz
              </Link>
            </p>

            {/* Beide Optionen gleich gewichtet — kein Dark Pattern. */}
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => writeConsent("denied")}
                className="rounded-sm border border-hairline px-5 py-3 font-display text-sm font-semibold text-snow transition-colors duration-300 ease-glide hover:border-glacier"
              >
                Nur notwendige
              </button>
              <button
                type="button"
                onClick={() => writeConsent("granted")}
                className="rounded-sm border border-hairline px-5 py-3 font-display text-sm font-semibold text-snow transition-colors duration-300 ease-glide hover:border-glacier"
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
