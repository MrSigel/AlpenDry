import type { ReactNode } from "react";

/**
 * Überschriftenebene einer Sektion.
 *
 * Dieselbe Sektion erscheint an zwei Orten: als ein Abschnitt unter vielen auf
 * der Startseite (dort ist ihre Überschrift ein `h2` unter dem Hero-`h1`) und
 * als eigene Seite (dort IST sie die Hauptüberschrift, also `h1`).
 *
 * Ohne diesen Schalter hätte die eigene Seite entweder gar kein h1 — schlecht
 * für Google und für Screenreader, die daran die Seite benennen — oder ein
 * zusätzliches h1 über einem h2 mit demselben Wortlaut.
 */
export type SectionHeading = { headingAs?: "h1" | "h2" };

/**
 * Sektions-Rahmen — hält den vertikalen Rhythmus (spacing.section / section-sm)
 * und die Shell-Breite (maxWidth.shell) an einer einzigen Stelle.
 *
 * `tone`:
 *   ink   → Grundfläche
 *   abyss → abgesetzte Fläche, erzeugt Tiefe über Farbe statt über Schatten
 */
export function Section({
  id,
  children,
  className = "",
  tone = "ink",
  bleed = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "ink" | "abyss";
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      className={`${tone === "abyss" ? "bg-abyss" : "bg-ink"} scroll-mt-24 py-section-sm md:py-section ${className}`}
    >
      <div className={bleed ? "" : "mx-auto w-full max-w-shell px-6 md:px-10"}>
        {children}
      </div>
    </section>
  );
}

/** Kopf einer Sektion: Eyebrow + h2 + optionaler Lead in ruhiger Textspalte. */
export function SectionHead({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <header className={`max-w-prose ${className}`}>{children}</header>;
}
