import type { Metadata } from "next";

import { process } from "@/lib/content";
import { Process } from "@/components/sections/Process";
import { StandalonePage } from "@/components/layout/StandalonePage";
import { buildMetadata } from "@/lib/seo";

/**
 * Ablauf als eigene Seite (Kundenwunsch).
 *
 * Traegt denselben Abschnitt wie die Startseite — inhaltlich unveraendert,
 * nur mit headingAs="h1": Hier ist der Abschnitt die Hauptueberschrift, auf
 * der Startseite einer von mehreren unter dem Hero-h1.
 *
 * Warum die Startseite ihre Abschnitte behaelt und warum das kein
 * Duplicate Content ist: siehe components/layout/StandalonePage.tsx.
 */

export const metadata: Metadata = buildMetadata({
  title: "Der Ablauf — vom Anruf bis zur Übergabe | AlpenDry",
  description: "So läuft jeder Auftrag bei AlpenDry: Anruf, Sofortmaßnahmen, Feuchtemessung, Sanierungsplan, Trocknung, Abnahme — dokumentiert und nachweisbar.",
  path: "/ablauf",
});

export default function ProcessPage() {
  return (
    <StandalonePage title={process.h2} path="/ablauf">
      <Process headingAs="h1" />
    </StandalonePage>
  );
}
