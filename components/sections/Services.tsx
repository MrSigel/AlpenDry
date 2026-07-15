import { services } from "@/lib/content";
import { Section, SectionHead } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CTABanner } from "@/components/ui/CTABanner";

/**
 * Leistungen — „Alles aus einer Hand" (Business Case Kap. 4).
 * Leistungsraster + zwei Hervorhebungen (eigene Technik, Versicherung).
 */
export function Services() {
  return (
    <Section id="leistungen" tone="abyss">
      <SectionHead>
        <Reveal>
          <SectionLabel>{services.eyebrow}</SectionLabel>
          <h2 className="mt-6 text-2xl md:text-3xl">{services.h2}</h2>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-6 font-body text-base text-frost md:text-lg">{services.lead}</p>
        </Reveal>
      </SectionHead>

      {/* Leistungsraster — nummeriert, ruhige Hairline-Trennung */}
      <RevealGroup className="mt-16 grid gap-px overflow-hidden rounded-sm border border-hairline bg-frost-faint md:mt-20 md:grid-cols-2 lg:grid-cols-3">
        {services.items.map((item, i) => (
          <RevealItem key={item.title} className="flex flex-col bg-abyss p-8">
            <span className="font-mono text-2xs text-frost-dim">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-5 font-display text-lg font-semibold text-snow">
              {item.title}
            </h3>
            <p className="mt-3 font-body text-sm text-frost-dim">{item.body}</p>
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Zwei Hervorhebungen: eigene Technik + Versicherung */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Reveal className="rounded-sm border border-hairline bg-ink p-8">
          <h3 className="font-display text-xl font-semibold text-snow">
            {services.fleet.title}
          </h3>
          <p className="mt-4 font-body text-sm text-frost-dim">{services.fleet.body}</p>
        </Reveal>
        <Reveal
          delay={0.05}
          className="rounded-sm border border-hairline bg-ink p-8"
        >
          <h3 className="font-display text-xl font-semibold text-snow">
            {services.insurance.title}
          </h3>
          <p className="mt-4 font-body text-sm text-frost-dim">
            {services.insurance.body}
          </p>
          <p className="mt-6 border-l-2 border-glacier pl-5 font-display text-base italic text-frost">
            {services.insurance.pullquote}
          </p>
        </Reveal>
      </div>

      <div className="mt-16 md:mt-20">
        <CTABanner />
      </div>
    </Section>
  );
}
