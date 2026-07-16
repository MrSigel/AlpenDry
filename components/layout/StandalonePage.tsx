import type { ReactNode } from "react";
import Link from "next/link";

import { Section } from "@/components/ui/Section";
import { CTABanner } from "@/components/ui/CTABanner";
import { JsonLd } from "@/components/ui/JsonLd";
import { StickyCTASpacer } from "@/components/layout/StickyCTA";
import { breadcrumbJsonLd } from "@/lib/jsonld";

/**
 * Gerüst für die Seiten, die je einen Startseiten-Abschnitt tragen
 * (/einsatzgebiet, /ablauf, /fragen, /kontakt).
 *
 * Auf Kundenwunsch bekommt jeder Abschnitt der Startseite eine eigene Seite in
 * der Navigation. Die Abschnitte selbst sind unverändert — sie werden hier
 * einfach ein zweites Mal gerendert, mit `headingAs="h1"`, weil sie auf ihrer
 * eigenen Seite die Hauptüberschrift sind.
 *
 * Als gemeinsames Gerüst und nicht viermal kopiert: Brotkrume, Abschluss-Banner
 * und BreadcrumbList sind auf allen vier identisch. Vier Kopien würden beim
 * ersten Eingriff auseinanderlaufen.
 *
 * Die Startseite behält ihre Abschnitte. Sie ist laut Business Case Kap. 6 die
 * Zielseite der Anzeigen („Jeder Euro Werbebudget landet zuerst auf dieser
 * einen Seite") — sie auszudünnen würde genau das Gegenteil bewirken. Kein
 * Duplicate-Content-Problem: Die Startseite trägt Hero und sieben Abschnitte,
 * eine Unterseite genau einen. Das ist Teilüberschneidung, wie sie jede
 * Übersichtsseite hat, keine Kopie.
 */
export function StandalonePage({
  title,
  path,
  children,
}: {
  /** Sichtbarer Name in der Brotkrume + in der BreadcrumbList. */
  title: string;
  path: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="border-b border-hairline bg-abyss">
        <div className="mx-auto w-full max-w-shell px-6 pb-8 pt-32 md:px-10 md:pt-40">
          {/* Einzeilig — Begründung wie in leistungen/[slug]: Die Mono-Schrift
              lädt nachrangig; ein Umbruch, der beim Font-Swap zurückspringt,
              schöbe die ganze Seite. */}
          <nav aria-label="Brotkrümelnavigation">
            <ol className="flex items-center gap-2 whitespace-nowrap font-mono text-2xs uppercase tracking-eyebrow text-frost-dim">
              <li>
                <Link href="/" className="transition-colors hover:text-snow">
                  Start
                </Link>
              </li>
              <li aria-hidden="true">·</li>
              <li className="text-frost">{title}</li>
            </ol>
          </nav>
        </div>
      </div>

      {children}

      <Section tone="abyss">
        <CTABanner />
      </Section>

      <StickyCTASpacer />

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Start", path: "/" },
            { name: title, path },
          ]),
        ]}
      />
    </>
  );
}
