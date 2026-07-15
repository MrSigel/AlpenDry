import Link from "next/link";
import type { ReactNode } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ArrowRightIcon } from "@/components/ui/Icons";
import type { LegalBlock } from "@/lib/legal";

/**
 * Gemeinsames Layout für Impressum, Datenschutz, AGB und Cookies.
 * Ruhige, lesbare Textspalte — keine Deko, reine Rechtsinformation.
 */
export function LegalPage({
  title,
  updated,
  intro,
  blocks,
  children,
}: {
  title: string;
  updated: string;
  intro?: string;
  blocks: readonly LegalBlock[];
  /** Optionaler Zusatz am Ende — z. B. der Consent-Widerruf auf der Cookie-Seite. */
  children?: ReactNode;
}) {
  return (
    /**
     * `hyphens-auto` + `break-words`: Rechtstexte stecken voller deutscher
     * Komposita („Verbraucherschlichtungsstelle", „Schadensanierungsleistungen").
     * Ohne Silbentrennung ragen die auf schmalen Geräten aus ihrer Box und
     * erzeugen horizontalen Überlauf — gemessen 182 px auf einem 320er-Display.
     * Die Trennung greift, weil <html lang="de"> gesetzt ist; `break-words`
     * fängt ab, was selbst dafür zu lang ist.
     */
    <div className="mx-auto w-full max-w-3xl hyphens-auto break-words px-6 pb-24 pt-36 md:px-10 md:pt-44">
      <SectionLabel>Rechtliches</SectionLabel>
      <h1 className="mt-6 text-3xl md:text-4xl">{title}</h1>
      <p className="mt-4 font-mono text-2xs uppercase tracking-eyebrow text-frost-dim">
        {updated}
      </p>

      {intro && <p className="mt-8 font-body text-base text-frost">{intro}</p>}

      <div className="mt-12 space-y-10">
        {blocks.map((block) => (
          <section key={block.h}>
            <h2 className="font-display text-lg font-semibold text-snow">{block.h}</h2>
            <div className="mt-3 space-y-3">
              {block.body.map((part, i) =>
                part.t === "p" ? (
                  <p key={i} className="font-body text-sm leading-relaxed text-frost-dim">
                    {part.text}
                  </p>
                ) : (
                  <ul key={i} className="ml-1 space-y-2">
                    {part.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 font-body text-sm leading-relaxed text-frost-dim"
                      >
                        <span
                          className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-steel"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ),
              )}
            </div>
          </section>
        ))}
      </div>

      {children}

      <Link
        href="/"
        className="mt-16 inline-flex items-center gap-2 font-display text-sm font-semibold text-frost transition-colors hover:text-snow"
      >
        <ArrowRightIcon className="h-4 w-4 rotate-180" />
        Zurück zur Startseite
      </Link>
    </div>
  );
}
