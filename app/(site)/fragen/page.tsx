import type { Metadata } from "next";

import { faq } from "@/lib/content";
import { Faq } from "@/components/sections/Faq";
import { StandalonePage } from "@/components/layout/StandalonePage";
import { buildMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/JsonLd";

/**
 * Fragen als eigene Seite (Kundenwunsch).
 *
 * Traegt denselben Abschnitt wie die Startseite — inhaltlich unveraendert,
 * nur mit headingAs="h1": Hier ist der Abschnitt die Hauptueberschrift, auf
 * der Startseite einer von mehreren unter dem Hero-h1.
 *
 * Warum die Startseite ihre Abschnitte behaelt und warum das kein
 * Duplicate Content ist: siehe components/layout/StandalonePage.tsx.
 */

export const metadata: Metadata = buildMetadata({
  title: "Häufige Fragen zu Wasserschaden, Trocknung und Schimmel | AlpenDry",
  description: "Was tun bei einem Wasserschaden? Wer zahlt die Trocknung? Muss die Wand aufgerissen werden? Die häufigsten Fragen — kurz beantwortet.",
  path: "/fragen",
});

export default function FaqPage() {
  return (
    <StandalonePage
      eyebrow={faq.eyebrow}
      title={faq.h2}
      crumb="Fragen"
      path="/fragen"
    >
      <Faq standalone />
      {/* Die FAQ-Rich-Snippets gehoeren auf DIESE Seite: Sie ist die Antwort
          auf die Fragen, nicht die Startseite, auf der sie nur ein Abschnitt
          unter vielen sind. */}
      <JsonLd data={[faqJsonLd()]} />
    </StandalonePage>
  );
}
