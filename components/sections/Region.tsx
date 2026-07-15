import { region } from "@/lib/content";
import { Section, SectionHead } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * Einsatzgebiet (Business Case Kap. 3).
 *
 * Stilisiert-typografisch statt Stockfoto-Karte (plan.md §0: keine Stockfoto-
 * Vibes). Die Orte sind als ruhige Liste gesetzt, eine stilisierte Höhenlinie
 * zitiert das Bergsymbol der Marke — Deko mit Funktion (Alpenrand).
 */
export function Region() {
  return (
    <Section id="einsatzgebiet" tone="ink">
      <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
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
              <p className="mt-5 font-display text-base italic text-glacier">
                {region.note}
              </p>
            </Reveal>
          </SectionHead>
        </div>

        {/* Orte + stilisierte Höhenlinie */}
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

          {/* Stilisierte Bergkontur — zitiert das Logo, rein dekorativ */}
          <Reveal delay={0.1} className="mt-8">
            <svg
              viewBox="0 0 600 80"
              className="h-16 w-full"
              fill="none"
              aria-hidden="true"
              preserveAspectRatio="none"
            >
              <path
                d="M0 78 L90 40 L150 58 L240 18 L320 54 L400 28 L470 60 L540 34 L600 66"
                stroke="var(--steel)"
                strokeWidth="1.5"
              />
              <path
                d="M0 78 L90 40 L150 58 L240 18 L320 54 L400 28 L470 60 L540 34 L600 66"
                stroke="var(--glacier)"
                strokeWidth="1.5"
                strokeDasharray="2 8"
              />
            </svg>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
