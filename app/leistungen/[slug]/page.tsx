import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { contact, whatsappHref } from "@/lib/content";
import { getServicePage, servicePages, servicePageCta } from "@/lib/services-pages";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, serviceJsonLd, serviceFaqJsonLd } from "@/lib/jsonld";

import { Section, SectionHead } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CTABanner } from "@/components/ui/CTABanner";
import { JsonLd } from "@/components/ui/JsonLd";
import { StickyCTASpacer } from "@/components/layout/StickyCTA";
import { PhoneIcon, WhatsAppIcon, ArrowRightIcon } from "@/components/ui/Icons";

/**
 * Leistungs-Unterseiten (/leistungen/[slug]).
 *
 * Eine Route für alle fünf: Layout und Rhythmus bleiben dadurch garantiert
 * identisch — fünf handgebaute Seiten wären längst auseinandergelaufen.
 *
 * BEWUSST OHNE 3D-HERO: plan.md §0 — „Boldness ausschließlich im
 * 3D-Eisberg-Hero", ein Signature-Element. Der Eisberg auf jeder Unterseite
 * würde ihn entwerten (und 1,1 MB three.js je Seite kosten). Stattdessen ein
 * ruhiger Textkopf im selben Raster.
 *
 * Statisch vorgerendert (generateStaticParams) — die Inhalte sind konstant.
 */

export function generateStaticParams() {
  return servicePages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) return {};
  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/leistungen/${page.slug}`,
  });
}

export default async function ServicePageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();

  const related = page.related
    .map((s) => getServicePage(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      {/* ── Kopf ─────────────────────────────────────────────────── */}
      <header className="border-b border-hairline bg-abyss">
        <div className="mx-auto w-full max-w-shell px-6 pb-16 pt-36 md:px-10 md:pb-20 md:pt-44">
          {/* Brotkrumen — sichtbar, nicht nur als JSON-LD */}
          <nav aria-label="Brotkrümelnavigation">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-2xs uppercase tracking-eyebrow text-frost-dim">
              <li>
                <Link href="/" className="transition-colors hover:text-snow">
                  Start
                </Link>
              </li>
              <li aria-hidden="true">·</li>
              <li>
                <Link href="/leistungen" className="transition-colors hover:text-snow">
                  Leistungen
                </Link>
              </li>
              <li aria-hidden="true">·</li>
              <li className="text-frost">{page.nav}</li>
            </ol>
          </nav>

          {/* hyphens-auto: „Wasserschadensanierung" ist EIN Wort mit 22 Zeichen
              und sprengt in dieser Schriftgröße jedes Telefon-Display (gemessen
              158px Überlauf auf 390px). Die Trennung greift, weil <html lang="de">
              gesetzt ist; break-words fängt ab, was selbst dafür zu lang ist. */}
          <h1 className="mt-8 max-w-3xl hyphens-auto break-words text-3xl md:text-4xl lg:text-5xl">
            {page.h1}
          </h1>
          <p className="mt-6 max-w-prose font-body text-base text-frost md:text-lg">
            {page.lead}
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

      {/* ── Inhalt ───────────────────────────────────────────────── */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div className="space-y-14">
            {page.blocks.map((block) => (
              <Reveal key={block.h} as="section">
                <h2 className="hyphens-auto break-words font-display text-xl font-semibold text-snow md:text-2xl">
                  {block.h}
                </h2>
                <div className="mt-5 space-y-4">
                  {block.body.map((p) => (
                    <p key={p} className="max-w-prose font-body text-base text-frost-dim">
                      {p}
                    </p>
                  ))}
                </div>
                {block.list && (
                  <ul className="mt-6 space-y-3">
                    {block.list.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 font-body text-base text-frost-dim"
                      >
                        <span
                          className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-glacier"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            ))}
          </div>

          {/* Seitenspalte: Einsatzgebiet + Notruf */}
          <Reveal delay={0.05} className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-sm border border-hairline bg-abyss p-7">
              <SectionLabel>{servicePageCta.eyebrow}</SectionLabel>
              <h2 className="mt-6 font-display text-lg font-semibold text-snow">
                {servicePageCta.title}
              </h2>
              <p className="mt-4 font-body text-sm text-frost-dim">
                {servicePageCta.body}
              </p>
              <a
                href={contact.phoneHref}
                className="mt-6 inline-flex items-center gap-2.5 font-display text-lg font-semibold text-snow transition-colors hover:text-signal md:text-xl"
                aria-label={`Notruf ${contact.phone} — rund um die Uhr erreichbar`}
              >
                <PhoneIcon className="h-5 w-5 shrink-0 text-signal" />
                <span className="font-mono tracking-tight">{contact.phone}</span>
              </a>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <Section tone="abyss">
        <SectionHead>
          <Reveal>
            <SectionLabel>Häufige Fragen</SectionLabel>
            <h2 className="mt-6 hyphens-auto break-words text-2xl md:text-3xl">{page.h1} — kurz erklärt</h2>
          </Reveal>
        </SectionHead>

        <RevealGroup className="mx-auto mt-12 max-w-3xl">
          <div className="divide-y divide-hairline border-y border-hairline">
            {page.faq.map((item) => (
              <RevealItem key={item.q}>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-base font-semibold text-snow transition-colors hover:text-frost">
                    {item.q}
                    <span className="shrink-0 text-steel transition-transform duration-300 ease-glide group-open:rotate-45">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                        <path
                          d="M12 5v14M5 12h14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="max-w-prose pb-6 font-body text-sm text-frost-dim">
                    {item.a}
                  </p>
                </details>
              </RevealItem>
            ))}
          </div>
        </RevealGroup>

        <div className="mt-16 md:mt-20">
          <CTABanner />
        </div>
      </Section>

      {/* ── Verwandte Leistungen ─────────────────────────────────── */}
      {related.length > 0 && (
        <Section>
          <SectionHead>
            <Reveal>
              <SectionLabel>Weitere Leistungen</SectionLabel>
            </Reveal>
          </SectionHead>
          <RevealGroup
            as="ul"
            className="mt-10 grid gap-px overflow-hidden rounded-sm border border-hairline bg-frost-faint md:grid-cols-3"
          >
            {related.map((r) => (
              <RevealItem key={r.slug} as="li" className="bg-ink">
                <Link
                  href={`/leistungen/${r.slug}`}
                  className="group flex h-full flex-col justify-between gap-6 p-8 transition-colors hover:bg-abyss"
                >
                  <div>
                    <h3 className="font-display text-lg font-semibold text-snow">
                      {r.nav}
                    </h3>
                    <p className="mt-3 font-body text-sm text-frost-dim">{r.lead}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 font-display text-sm font-semibold text-frost transition-colors group-hover:text-snow">
                    Ansehen
                    <ArrowRightIcon className="h-4 w-4" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}

      <StickyCTASpacer />

      <JsonLd
        data={[
          serviceJsonLd(page),
          serviceFaqJsonLd(page),
          breadcrumbJsonLd([
            { name: "Start", path: "/" },
            { name: "Leistungen", path: "/leistungen" },
            { name: page.nav, path: `/leistungen/${page.slug}` },
          ]),
        ]}
      />
    </>
  );
}
