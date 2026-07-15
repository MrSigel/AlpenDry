import type { Metadata } from "next";
import Link from "next/link";

import { contact, region, services, whatsappHref } from "@/lib/content";
import { servicePages } from "@/lib/services-pages";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";

import { Section, SectionHead } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CTABanner } from "@/components/ui/CTABanner";
import { JsonLd } from "@/components/ui/JsonLd";
import { StickyCTASpacer } from "@/components/layout/StickyCTA";
import { PhoneIcon, WhatsAppIcon, ArrowRightIcon } from "@/components/ui/Icons";

/**
 * Übersicht aller Leistungen (/leistungen).
 *
 * Nötig, weil die Navigation sonst fünf gleichrangige Punkte tragen müsste —
 * und als Einstieg für die Unterseiten. Sammelt zusätzlich die
 * Verlinkungskraft für die einzelnen Leistungen.
 */

export const metadata: Metadata = buildMetadata({
  title: "Leistungen — Wasserschaden, Leckageortung, Trocknung | AlpenDry",
  description: `Alles rund um Wasser, Feuchtigkeit und Hochwasser: Wasserschadensanierung, Leckageortung, Trocknung, Schimmelsanierung und Hochwasser-Prävention für ${region.places
    .slice(0, 4)
    .join(", ")} und das Alpenvorland.`,
  path: "/leistungen",
});

export default function LeistungenPage() {
  return (
    <>
      <header className="border-b border-hairline bg-abyss">
        <div className="mx-auto w-full max-w-shell px-6 pb-16 pt-36 md:px-10 md:pb-20 md:pt-44">
          <nav aria-label="Brotkrümelnavigation">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-2xs uppercase tracking-eyebrow text-frost-dim">
              <li>
                <Link href="/" className="transition-colors hover:text-snow">
                  Start
                </Link>
              </li>
              <li aria-hidden="true">·</li>
              <li className="text-frost">Leistungen</li>
            </ol>
          </nav>

          <h1 className="mt-8 max-w-3xl text-3xl md:text-4xl lg:text-5xl">
            {services.h2}
          </h1>
          <p className="mt-6 max-w-prose font-body text-base text-frost md:text-lg">
            {services.lead}
          </p>

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

      <Section>
        <SectionHead>
          <Reveal>
            <SectionLabel>Im Detail</SectionLabel>
            <h2 className="mt-6 text-2xl md:text-3xl">Wobei wir helfen</h2>
          </Reveal>
        </SectionHead>

        <RevealGroup
          as="ul"
          className="mt-14 grid gap-px overflow-hidden rounded-sm border border-hairline bg-frost-faint md:mt-16 md:grid-cols-2"
        >
          {servicePages.map((p, i) => (
            <RevealItem key={p.slug} as="li" className="bg-abyss">
              <Link
                href={`/leistungen/${p.slug}`}
                className="group flex h-full flex-col justify-between gap-8 p-8 transition-colors hover:bg-ink md:p-10"
              >
                <div>
                  <span className="font-mono text-2xs text-frost-dim">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 hyphens-auto break-words font-display text-xl font-semibold text-snow">
                    {p.h1}
                  </h3>
                  <p className="mt-4 max-w-prose font-body text-sm text-frost-dim">
                    {p.lead}
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 font-display text-sm font-semibold text-frost transition-colors group-hover:text-snow">
                  Mehr erfahren
                  <ArrowRightIcon className="h-4 w-4" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-16 md:mt-20">
          <CTABanner />
        </div>
      </Section>

      <StickyCTASpacer />

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Start", path: "/" },
            { name: "Leistungen", path: "/leistungen" },
          ]),
        ]}
      />
    </>
  );
}
