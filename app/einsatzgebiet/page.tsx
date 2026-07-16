import type { Metadata } from "next";

import { region } from "@/lib/content";
import { Region } from "@/components/sections/Region";
import { StandalonePage } from "@/components/layout/StandalonePage";
import { buildMetadata } from "@/lib/seo";

/**
 * Einsatzgebiet als eigene Seite (Kundenwunsch).
 *
 * Traegt denselben Abschnitt wie die Startseite — inhaltlich unveraendert,
 * nur mit headingAs="h1": Hier ist der Abschnitt die Hauptueberschrift, auf
 * der Startseite einer von mehreren unter dem Hero-h1.
 *
 * Warum die Startseite ihre Abschnitte behaelt und warum das kein
 * Duplicate Content ist: siehe components/layout/StandalonePage.tsx.
 */

export const metadata: Metadata = buildMetadata({
  title: "Einsatzgebiet — Wasserschaden-Notdienst am Alpenrand | AlpenDry",
  description: "Südlich von München bis Augsburg, Landsberg am Lech und zum Tegernsee: das Einsatzgebiet von AlpenDry. Kurze Anfahrtswege, eigener Fuhrpark, 24/7-Notdienst.",
  path: "/einsatzgebiet",
});

export default function RegionPage() {
  return (
    <StandalonePage title={region.h2} path="/einsatzgebiet">
      <Region headingAs="h1" />
    </StandalonePage>
  );
}
