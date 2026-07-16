import type { Metadata } from "next";
import Link from "next/link";

import { contact, whatsappHref } from "@/lib/content";
import { works } from "@/lib/works";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";

import { Section, SectionHead } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CTABanner } from "@/components/ui/CTABanner";
import { JsonLd } from "@/components/ui/JsonLd";
import { StickyCTASpacer } from "@/components/layout/StickyCTA";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

/**
 * Bisherige Arbeiten (/arbeiten).
 *
 * GERÜST OHNE ECHTE REFERENZEN — die Begründung steht in lib/works.ts.
 *
 * `noIndex: true`: Solange die Seite nur Platzhalter zeigt, gehört sie nicht in
 * den Index. Google bewertet dünne Seiten nicht neutral, sondern negativ — und
 * der Business Case (Kap. 8) stellt das Ranking der ganzen Domain in den
 * Mittelpunkt. Eine indexierte Seite, auf der „Hier erscheinen Fotos" steht,
 * arbeitet also gegen das eigene Ziel. Sobald echte Aufnahmen da sind: Zeile
 * entfernen — die Metadaten stehen schon bereit.
 *
 * Aus demselben Grund fehlt sie in der Hauptnavigation und steht stattdessen im
 * Footer: verlinkt und erreichbar, aber nicht beworben. Beides ist bewusst und
 * gehört zusammen zurückgedreht.
 */

export const metadata: Metadata = buildMetadata({
  title: works.metaTitle,
  description: works.metaDescription,
  path: "/arbeiten",
  noIndex: true,
});

export default function ArbeitenPage() {
  return (
    <>
      {/* ── Kopf ─────────────────────────────────────────────────── */}
      <header className="border-b border-hairline bg-abyss">
        <div className="mx-auto w-full max-w-shell px-6 pb-16 pt-36 md:px-10 md:pb-20 md:pt-44">
          {/* Einzeilig — Begründung wie in leistungen/[slug]: Die Mono-Schrift
              lädt nachrangig, ein Umbruch würde beim Font-Swap zurückspringen
              und die Seite schieben. */}
          <nav aria-label="Brotkrümelnavigation">
            <ol className="flex items-center gap-2 whitespace-nowrap font-mono text-2xs uppercase tracking-eyebrow text-frost-dim">
              <li>
                <Link href="/" className="transition-colors hover:text-snow">
                  Start
                </Link>
              </li>
              <li aria-hidden="true">·</li>
              <li className="text-frost">{works.h1}</li>
            </ol>
          </nav>

          <h1 className="mt-8 max-w-3xl text-3xl md:text-4xl lg:text-5xl">
            {works.h1}
          </h1>
          <p className="mt-6 max-w-prose font-body text-base text-frost md:text-lg">
            {works.lead}
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

      {/* ── Platzhalter-Raster ───────────────────────────────────── */}
      <Section>
        <SectionHead>
          <Reveal>
            <SectionLabel>{works.eyebrow}</SectionLabel>
            <h2 className="mt-6 text-2xl md:text-3xl">Nach Leistung sortiert</h2>
          </Reveal>
        </SectionHead>

        <RevealGroup
          as="ul"
          className="mt-12 grid gap-px overflow-hidden rounded-sm border border-hairline bg-frost-faint md:grid-cols-2 lg:grid-cols-3"
        >
          {works.categories.map((category) => (
            <RevealItem as="li" key={category.title} className="bg-ink">
              <article className="flex h-full flex-col">
                {/*
                 * Der Platzhalter. Bewusst KEIN graues Kästchen mit
                 * Bild-Symbol: Das liest sich wie ein Ladefehler. Stattdessen
                 * eine ruhige Fläche im Markenraster, die ehrlich sagt, was
                 * hier hinkommt — und die später exakt das Seitenverhältnis
                 * hat, das die Fotos bekommen (4:3, wie auf den
                 * Leistungsseiten).
                 */}
                <div className="flex aspect-[4/3] items-center justify-center border-b border-hairline bg-abyss">
                  <div className="px-6 text-center">
                    <p className="font-mono text-2xs uppercase tracking-eyebrow text-frost-dim">
                      {works.placeholder.label}
                    </p>
                    <p className="mt-2 font-mono text-2xs uppercase tracking-eyebrow text-steel">
                      {works.placeholder.note}
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-display text-lg font-semibold text-snow">
                    {category.title}
                  </h3>
                  <p className="mt-3 font-body text-sm text-frost-dim">
                    {category.body}
                  </p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* ── Warum noch nichts zu sehen ist ───────────────────────── */}
      <Section tone="abyss">
        <Reveal className="mx-auto max-w-prose">
          <h2 className="text-2xl md:text-3xl">{works.consent.title}</h2>
          <p className="mt-6 font-body text-base text-frost-dim">
            {works.consent.body}
          </p>
        </Reveal>

        <div className="mt-16 md:mt-20">
          <CTABanner />
        </div>
      </Section>

      <StickyCTASpacer />

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Start", path: "/" },
            { name: works.h1, path: "/arbeiten" },
          ]),
        ]}
      />
    </>
  );
}
