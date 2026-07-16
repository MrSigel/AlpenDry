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
 * Zeigt jetzt Bilder statt Platzhalter — davon EINES aus einem echten Einsatz,
 * fünf lizenziertes Stockmaterial. Letztere sind als „Symbolbild"
 * gekennzeichnet; Herleitung in lib/works.ts.
 *
 * Das frühere `noIndex` ist damit weg: Es galt der dünnen Platzhalter-Fassung,
 * die dem Ranking der ganzen Domain geschadet hätte (Business Case Kap. 8).
 * Die Seite trägt jetzt Inhalt und darf in den Index.
 */

export const metadata: Metadata = buildMetadata({
  title: works.metaTitle,
  description: works.metaDescription,
  path: "/arbeiten",
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
                <figure className="relative aspect-[4/3] overflow-hidden border-b border-hairline">
                  {/* eslint-disable-next-line @next/next/no-img-element -- Die
                      Dateien liegen bereits als WebP in genau den beiden
                      Breiten vor, die vorkommen; next/image würde sie zur
                      Laufzeit ein zweites Mal konvertieren. Gleiche
                      Entscheidung wie in components/ui/Photo.tsx. */}
                  <img
                    src={`/arbeiten/${category.image}-400.webp`}
                    srcSet={`/arbeiten/${category.image}-400.webp 400w, /arbeiten/${category.image}-800.webp 800w`}
                    sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, calc(100vw - 3rem)"
                    width={800}
                    height={600}
                    alt={category.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />

                  {/* Bindet das Bild an die Seitenfläche und trägt die
                      Unterschrift — dieselbe Mechanik wie in Photo.tsx. Nötig
                      hier besonders: Die meisten dieser Aufnahmen sind hell,
                      ungefasst stünden sie als weiße Blöcke im dunklen Raster. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink via-ink/70 to-transparent"
                  />

                  <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-x-2 gap-y-1 px-5 py-4 font-mono text-2xs uppercase tracking-eyebrow">
                    <span className="text-frost">{category.caption}</span>
                    {/*
                     * „Symbolbild" — Kennzeichnung für Stockmaterial.
                     * Herleitung in lib/works.ts: Ohne sie behauptete das Bild
                     * auf einer Seite namens „Bisherige Arbeiten", einen
                     * eigenen Einsatz zu zeigen (§ 5 UWG). Das echte Foto trägt
                     * die Kennzeichnung bewusst NICHT — der Unterschied ist der
                     * Punkt.
                     */}
                    {category.symbol && (
                      <span className="text-steel">· {works.symbolLabel}</span>
                    )}
                  </figcaption>
                </figure>

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
