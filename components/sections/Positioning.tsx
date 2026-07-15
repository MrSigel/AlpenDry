import { positioning } from "@/lib/content";
import { Section, SectionHead } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * Positionierung — „Die Spitze des Eisbergs" (Business Case Kap. 2).
 * Führt die Hero-Metapher in Text weiter: sichtbare Leistung oben,
 * volles Spektrum darunter.
 */
export function Positioning() {
  return (
    <Section id="positionierung" tone="ink">
      <SectionHead>
        <Reveal>
          <SectionLabel>{positioning.eyebrow}</SectionLabel>
          <h2 className="mt-6 text-2xl md:text-3xl">{positioning.h2}</h2>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-6 font-body text-base text-frost md:text-lg">
            {positioning.lead}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 font-body text-base text-frost-dim">
            {positioning.insurance}
          </p>
        </Reveal>
      </SectionHead>

      <RevealGroup className="mt-16 grid gap-px overflow-hidden rounded-sm border border-hairline bg-frost-faint md:mt-20 md:grid-cols-3">
        {positioning.pillars.map((pillar) => (
          <RevealItem key={pillar.title} className="bg-ink p-8">
            <h3 className="font-display text-lg font-semibold text-snow">
              {pillar.title}
            </h3>
            <p className="mt-4 font-body text-sm text-frost-dim">{pillar.body}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
