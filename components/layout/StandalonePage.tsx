import type { ReactNode } from "react";
import Link from "next/link";

import { contact, whatsappHref } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CTABanner } from "@/components/ui/CTABanner";
import { JsonLd } from "@/components/ui/JsonLd";
import { StickyCTASpacer } from "@/components/layout/StickyCTA";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
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
  eyebrow,
  title,
  lead,
  crumb,
  path,
  children,
}: {
  /** Kleines Label über der Überschrift — die Eyebrow der Sektion. */
  eyebrow: string;
  /** Das h1 der Seite — die Überschrift, die sonst die Sektion selbst trägt. */
  title: string;
  /** Ein Satz darunter. Der Lead der Sektion; Faq hat keinen. */
  lead?: string;
  /** Kurzform für die Brotkrume — das h1 ist dafür oft zu lang. */
  crumb: string;
  path: string;
  children: ReactNode;
}) {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────
          Gleicher Aufbau wie auf den Leistungsseiten und /arbeiten:
          Brotkrume, Eyebrow, h1, Lead, Notruf + WhatsApp. Ohne ihn fielen
          diese vier Seiten aus dem Muster — sie begannen direkt mit dem
          Abschnitt und hatten als einzige keinen Einstieg und keinen CTA
          im ersten Sichtfeld (Business Case Kap. 6: „Im ersten Sichtfeld —
          Notrufnummer und WhatsApp-Button ohne Scrollen sichtbar, auf jeder
          Unterseite"). */}
      <header className="border-b border-hairline bg-abyss">
        <div className="mx-auto w-full max-w-shell px-6 pb-16 pt-36 md:px-10 md:pb-20 md:pt-44">
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
              <li className="text-frost">{crumb}</li>
            </ol>
          </nav>

          <div className="mt-8">
            <SectionLabel>{eyebrow}</SectionLabel>
          </div>
          <h1 className="mt-6 max-w-3xl text-3xl md:text-4xl lg:text-5xl">
            {title}
          </h1>
          {lead && (
            <p className="mt-6 max-w-prose font-body text-base text-frost md:text-lg">
              {lead}
            </p>
          )}

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={contact.phoneHref}
              className="inline-flex items-center gap-2.5 rounded-sm bg-signal px-6 py-4 font-display text-sm font-semibold text-ink transition-colors duration-300 ease-glide hover:bg-glacier"
              aria-label={`Notruf ${contact.phone} — rund um die Uhr erreichbar`}
            >
              <PhoneIcon className="h-4 w-4" />
              <span className="font-mono">{contact.phone}</span>
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-sm border border-hairline px-6 py-4 font-display text-sm font-semibold text-snow transition-all duration-300 ease-glide hover:border-glacier hover:bg-glacier-glow"
            >
              <WhatsAppIcon className="h-4 w-4 text-glacier" />
              WhatsApp schreiben
            </a>
          </div>
        </div>
      </header>

      {children}

      <Section tone="abyss">
        <CTABanner />
      </Section>

      <StickyCTASpacer />

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Start", path: "/" },
            { name: crumb, path },
          ]),
        ]}
      />
    </>
  );
}
