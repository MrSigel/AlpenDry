import { region } from "@/lib/content";
import { photos } from "@/lib/photos";
import { Section, SectionHead, type SectionVariant } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";

/**
 * Einsatzgebiet (Business Case Kap. 3).
 *
 * Hier steht das Panorama der Kundin — ihre eigene Aufnahme genau des Gebiets,
 * über das der Abschnitt spricht. Das ist kein Widerspruch zu plan.md §0 („keine
 * Stockfoto-Vibes"), sondern dessen Erfüllung: Das Verbot zielt auf
 * austauschbare Kaufbilder, und der Business Case (Kap. 6) verlangt „echte
 * Bilder … statt austauschbarer Stockfotos".
 *
 * Es ersetzt die frühere stilisierte Höhenlinie: Eine gezeichnete Bergkontur
 * unter einem Foto echter Berge wäre dieselbe Aussage zweimal — die schwächere
 * geht.
 */
export function Region({ standalone = false }: SectionVariant) {
  return (
    <Section id="einsatzgebiet" tone="ink">
      {/* Ohne Kopf gibt es keine zweite Spalte — die Orte bekommen dann die
          volle Breite, statt auf halber Fläche neben einer Leerstelle zu
          stehen. */}
      <div
        className={
          standalone ? "" : "grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20"
        }
      >
        {/* Auf der eigenen Seite trägt der Hero diesen Kopf — siehe SectionVariant. */}
        {!standalone && (
        <div>
          <SectionHead>
            <Reveal>
              <SectionLabel>{region.eyebrow}</SectionLabel>
              <h2 className="mt-6 text-2xl md:text-3xl">{region.h2}</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-6 font-body text-base text-frost md:text-lg">
                {region.lead}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              {/*
               * text-xl = 24px = 18pt. glacier auf ink erreicht gemessen
               * 3.9:1 — ab 18pt genügen WCAG 3:1, darunter wären 4.5:1
               * nötig. Vorher stand hier text-base (16px) und verfehlte die
               * Schwelle; auf der Startseite fiel es nie auf, weil der Satz
               * unter der Falte liegt und beim Test noch auf opacity 0 steht
               * (die Prüfung überspringt unsichtbare Elemente). Auf
               * /einsatzgebiet steht er oben — und wurde prompt gemeldet.
               *
               * Dieselbe Fassung wie der Claim in Hero und Footer, die diese
               * Rechnung schon länger tragen. Die Markenvorgabe schreibt
               * glacier fest, also skaliert der Text, statt die Farbe zu
               * brechen.
               */}
              <p className="mt-5 font-display text-xl italic text-glacier">
                {region.note}
              </p>
            </Reveal>
          </SectionHead>
        </div>
        )}

        {/* Die Orte des Gebiets */}
        <div className="flex flex-col justify-center">
          <RevealGroup className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-hairline bg-frost-faint">
            {region.places.map((place) => (
              <RevealItem
                key={place}
                className="flex items-center gap-3 bg-ink px-6 py-5"
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-glacier"
                  aria-hidden="true"
                />
                <span className="font-display text-base text-snow">{place}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>

      {/* Das Gebiet, über das der Text spricht — in voller Breite, damit es
          trägt statt zu illustrieren.
          sizes rechnet die Polsterung der Section heraus (px-6 = 3rem, ab md
          px-10 = 5rem); ab 1216px deckelt der Shell-Rahmen bei 1136px. */}
      <Reveal delay={0.15} className="mt-14 md:mt-20">
        <Photo
          {...photos.alpenpanorama}
          sizes="(min-width: 1216px) 1136px, (min-width: 768px) calc(100vw - 5rem), calc(100vw - 3rem)"
          className="aspect-[16/9] w-full md:aspect-[21/9]"
        />
      </Reveal>
    </Section>
  );
}
