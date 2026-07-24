import type { Metadata } from "next";

import { contactSection } from "@/lib/content";
import { Contact } from "@/components/sections/Contact";
import { StandalonePage } from "@/components/layout/StandalonePage";
import { buildMetadata } from "@/lib/seo";

/**
 * Kontakt als eigene Seite (Kundenwunsch).
 *
 * Traegt denselben Abschnitt wie die Startseite — inhaltlich unveraendert,
 * nur mit headingAs="h1": Hier ist der Abschnitt die Hauptueberschrift, auf
 * der Startseite einer von mehreren unter dem Hero-h1.
 *
 * Warum die Startseite ihre Abschnitte behaelt und warum das kein
 * Duplicate Content ist: siehe components/layout/StandalonePage.tsx.
 */

export const metadata: Metadata = buildMetadata({
  title: "Kontakt — 24/7-Notdienst, WhatsApp und Formular | AlpenDry",
  description: "Drei Wege zu AlpenDry: Telefon für den Akutfall, WhatsApp für den schnellen Draht, das Formular für die strukturierte Anfrage. Rund um die Uhr erreichbar.",
  path: "/kontakt",
});

export default function ContactPage() {
  return (
    <StandalonePage
      eyebrow={contactSection.eyebrow}
      title={contactSection.h2}
      lead={contactSection.lead}
      crumb="Kontakt"
      path="/kontakt"
    >
      <Contact standalone />
    </StandalonePage>
  );
}
