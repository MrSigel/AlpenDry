import { process } from "@/lib/content";
import { Section, SectionHead } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CTABanner } from "@/components/ui/CTABanner";
import { ProcessSerpentine } from "./ProcessSerpentine";

/**
 * 6-Schritte-Ablauf (Business Case Kap. 12, plan.md §4).
 *
 * Zwei Darstellungen, per CSS umgeschaltet:
 *   ab lg  → Serpentine mit Verbindungslinie, die sich beim Scrollen zeichnet
 *   mobil  → ruhiger vertikaler Stepper
 *
 * Warum getrennt statt responsive: Eine Schlangenlinie über zwei Reihen braucht
 * Breite. Auf 390px wären die Punkte zu eng und die Wendekurve unleserlich —
 * dort trägt die klassische Zeitachse den Ablauf besser.
 *
 * Der Umschalter läuft über `hidden`/`lg:hidden` statt über einen Media-Query-
 * Hook: kein Hydration-Flash. Die `id` sitzt am gemeinsamen Wrapper — sonst
 * gäbe es sie zweimal im DOM und der Sprung aus der Navigation landete auf
 * der jeweils ausgeblendeten Variante.
 */
export function Process() {
  return (
    <div id="ablauf" className="scroll-mt-24 bg-abyss">
      {/* ── Desktop: Serpentine ───────────────────────────────────── */}
      <div className="hidden lg:block">
        <ProcessSerpentine />

        {/* Steht nach der Scroll-Strecke, also erst wenn die Schlange
            durchlaufen ist. */}
        <div className="mx-auto w-full max-w-shell px-6 pb-section md:px-10">
          <Reveal className="border-l-2 border-glacier pl-6">
            <p className="max-w-prose font-display text-xl italic text-frost md:text-2xl">
              {process.pullquote}
            </p>
          </Reveal>
          <div className="mt-16 md:mt-20">
            <CTABanner />
          </div>
        </div>
      </div>

      {/* ── Mobil: vertikaler Stepper ─────────────────────────────── */}
      <Section tone="abyss" className="lg:hidden">
        <SectionHead>
          <Reveal>
            <SectionLabel>{process.eyebrow}</SectionLabel>
            <h2 className="mt-6 text-2xl md:text-3xl">{process.h2}</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-6 font-body text-base text-frost md:text-lg">
              {process.lead}
            </p>
          </Reveal>
        </SectionHead>

        <RevealGroup className="mt-16 md:mt-20">
          <ol className="relative space-y-10 md:space-y-12">
            {/* durchgehende Zeitachse */}
            <span
              className="absolute bottom-4 left-[1.35rem] top-4 w-px bg-frost-faint md:left-7"
              aria-hidden="true"
            />
            {process.steps.map((step, i) => (
              <RevealItem key={step.title} as="li" className="relative flex gap-6 md:gap-10">
                <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-glacier bg-ink font-mono text-sm text-glacier md:h-14 md:w-14">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="pt-1 md:pt-2.5">
                  <h3 className="font-display text-lg font-semibold text-snow">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-prose font-body text-sm text-frost-dim">
                    {step.body}
                  </p>
                </div>
              </RevealItem>
            ))}
          </ol>
        </RevealGroup>

        <Reveal className="mt-14 border-l-2 border-glacier pl-6 md:mt-16">
          <p className="max-w-prose font-display text-xl italic text-frost md:text-2xl">
            {process.pullquote}
          </p>
        </Reveal>

        <div className="mt-16 md:mt-20">
          <CTABanner />
        </div>
      </Section>
    </div>
  );
}
