"use client";

import { contact, whatsappHref } from "@/lib/content";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

/**
 * Mobile Bottom-Bar — Business Case Kap. 6:
 * „Immer griffbereit — auf dem Smartphone als fixierte Leiste am unteren
 *  Bildschirmrand, die beim Scrollen mitwandert."
 *
 * Sitzt fix am unteren Rand, ab `md` unsichtbar (dort trägt der Header die CTAs).
 * Kein Ein-/Ausblenden beim Scrollen: im Notfall darf der Notruf nie wegscrollen.
 *
 * `padding-bottom: env(safe-area-inset-bottom)` hält die Bar über der
 * iOS-Home-Indicator-Leiste.
 */
export function StickyCTA() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-ink/95 backdrop-blur-sm md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-2">
        {/* aria-label MUSS den sichtbaren Text enthalten — sonst können
            Sprachsteuerungs-Nutzer den Link nicht per „Anrufen" ansprechen
            (WCAG 2.5.3 Label in Name). */}
        <a
          href={contact.phoneHref}
          className="flex items-center justify-center gap-2 bg-signal py-4 font-display text-sm font-semibold text-ink"
          aria-label={`Anrufen — Notruf ${contact.phone}, rund um die Uhr erreichbar`}
        >
          <PhoneIcon className="h-4 w-4" />
          Anrufen
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-4 font-display text-sm font-semibold text-snow"
          aria-label="Per WhatsApp schreiben"
        >
          <WhatsAppIcon className="h-4 w-4 text-glacier" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}

/**
 * Abstandhalter, damit die fixierte Bar auf Mobil nichts überdeckt
 * (u. a. den Footer und das Ende des Formulars).
 */
export function StickyCTASpacer() {
  return <div className="h-[3.75rem] md:hidden" aria-hidden="true" />;
}
