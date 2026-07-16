import { faq } from "@/lib/content";
import { Section, SectionHead, type SectionHeading } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ChevronIcon } from "@/components/ui/Icons";
import { CTABanner } from "@/components/ui/CTABanner";

/**
 * FAQ / AEO (Business Case Kap. 8, plan.md §5).
 *
 * Auf nativem <details>/<summary> gebaut: Tastaturbedienung, Screenreader und
 * Öffnen/Schließen funktionieren ohne JavaScript — robust und zugänglich.
 * Die Fragen speisen zusätzlich das FAQPage-JSON-LD (lib/jsonld.ts).
 */
export function Faq({ headingAs: H = "h2" }: SectionHeading) {
  return (
    <Section id="fragen" tone="abyss">
      <SectionHead>
        <Reveal>
          <SectionLabel>{faq.eyebrow}</SectionLabel>
          <H className="mt-6 text-2xl md:text-3xl">{faq.h2}</H>
        </Reveal>
      </SectionHead>

      <RevealGroup className="mx-auto mt-14 max-w-3xl md:mt-16">
        <div className="divide-y divide-hairline border-y border-hairline">
          {faq.items.map((item) => (
            <RevealItem key={item.q}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                  <span className="font-display text-base font-semibold text-snow md:text-lg">
                    {item.q}
                  </span>
                  <ChevronIcon className="h-5 w-5 shrink-0 text-steel transition-transform duration-300 ease-glide group-open:rotate-180 group-open:text-glacier" />
                </summary>
                <p className="max-w-prose pb-6 font-body text-sm text-frost-dim md:text-base">
                  {item.a}
                </p>
              </details>
            </RevealItem>
          ))}
        </div>
      </RevealGroup>

      <div className="mx-auto mt-16 max-w-3xl md:mt-20">
        <CTABanner />
      </div>
    </Section>
  );
}
