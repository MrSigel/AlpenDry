import type { ReactNode } from "react";

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
