import type { ReactNode } from "react";

/**
 * Steht diese Sektion auf ihrer eigenen Seite?
 *
 * Dieselbe Sektion erscheint an zwei Orten:
 *   Startseite — ein Abschnitt unter vielen. Er bringt seinen eigenen Kopf mit
 *     (Eyebrow + h2 + Lead), weil ihn sonst nichts einleitet.
 *   Eigene Seite (/ablauf, /kontakt, …) — dort trägt der Seiten-Hero diesen
 *     Kopf: als h1, mit Brotkrume und Notruf-Buttons, genau wie auf den
 *     Leistungsseiten. Die Sektion liefert dann NUR noch ihren Inhalt.
 *
 * Ohne diesen Schalter stünde derselbe Text zweimal untereinander — einmal im
 * Hero, einmal im Abschnittskopf.
 *
 * `standalone` schaltet zusätzlich die Ebene der Unterüberschriften eine Stufe
 * höher: Unter dem Hero-h1 wären die Karten sonst h3 und übersprängen h2.
 */
export type SectionVariant = { standalone?: boolean };

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
