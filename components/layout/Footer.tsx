import Link from "next/link";
import { contact, footer, site } from "@/lib/content";
import { servicePages } from "@/lib/services-pages";
import { Logo } from "@/components/brand/Logo";
import { MailIcon, PhoneIcon } from "@/components/ui/Icons";

/**
 * Spaltenüberschrift. Dreimal identisch gebraucht — als Konstante, damit die
 * drei Spalten nicht auseinanderlaufen, wenn eine angefasst wird.
 */
function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-xs font-semibold uppercase tracking-eyebrow text-frost">
      {children}
    </h2>
  );
}

/**
 * Ein Link in einer Footer-Spalte. Gleiche Farbe, gleicher Hover für ALLE
 * Listen — Leistungen wie Rechtliches.
 */
function ColumnLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-body text-sm text-frost-dim transition-colors duration-300 ease-glide hover:text-snow"
    >
      {children}
    </Link>
  );
}

/**
 * Telefon und E-Mail — bewusst BAUGLEICH.
 *
 * Vorher waren die beiden inkonsistent, und zwar in beide Richtungen: die
 * Nummer stand in `snow` und wurde beim Hover `signal`, die Adresse stand in
 * `frost` und wurde `snow`. Also unterschiedliche Grundfarbe UND
 * unterschiedliches Hover-Ziel, direkt untereinander.
 *
 * Jetzt eine Komponente für beide: Was gleich aussehen soll, wird auch nur
 * einmal beschrieben. Das Icon führt das Auge und macht die Zeile ohne Lesen
 * einordenbar (plan.md §0: Deko nur mit Funktion).
 *
 * Beide in `font-mono`: Es sind Kontaktdaten, keine Fließtexte — dieselbe
 * Schrift, die die Nummer schon im Hero und in der Kontakt-Sektion trägt.
 * Nebeneinander lesen sie sich dadurch als ein Block.
 *
 * Hover: Text frost-dim → snow, Icon glacier → signal, beide über dieselbe
 * Kurve. `group` trägt es, damit der ganze Bereich reagiert und nicht nur das,
 * worauf der Zeiger zufällig steht.
 *
 * Icon in glacier, nicht steel: steel erreicht auf ink nur 2.84:1. Für ein rein
 * dekoratives Icon wäre das zulässig (der Text daneben sagt dasselbe), aber
 * glacier ist die Marken-Akzentfarbe und liegt mit 3.9:1 auch über der
 * 3:1-Schwelle für Nicht-Text (WCAG 1.4.11).
 */
function ContactLine({
  href,
  icon: Icon,
  children,
  ariaLabel,
}: {
  href: string;
  icon: typeof PhoneIcon;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className="group inline-flex items-center gap-3 font-mono text-sm text-frost-dim transition-colors duration-300 ease-glide hover:text-snow"
    >
      <Icon className="h-4 w-4 shrink-0 text-glacier transition-colors duration-300 ease-glide group-hover:text-signal" />
      <span>{children}</span>
    </a>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-ink">
      <div className="mx-auto w-full max-w-shell px-6 py-16 md:px-10 md:py-20">
        {/* Vier Spalten ab lg. Auf dem Tablet zwei, damit die Listen nicht auf
            je eine Zeile Breite zusammenschrumpfen. */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-10">
          {/* Marke */}
          <div>
            <Logo />
            <p className="mt-6 max-w-xs font-body text-sm text-frost-dim">
              {footer.tagline}
            </p>
            {/* text-xl = 24px = 18pt. glacier auf ink erreicht 4.31:1 — unter
                18pt verlangt WCAG 4.5:1, ab 18pt genügen 3:1. Die Markenvorgabe
                schreibt glacier fest, also skaliert der Claim, statt die Farbe
                zu brechen. (font-semibold half nicht: WCAG zählt erst ab
                Gewicht 700 als „fett".) */}
            <p className="mt-6 font-display text-xl italic text-glacier underline decoration-glacier/40 underline-offset-4">
              {site.claim}
            </p>
          </div>

          {/* Leistungen — aus servicePages, nicht abgetippt: Die Liste IST die
              Quelle, aus der auch die Navigation und die Routen entstehen. Eine
              neue Leistung erscheint dadurch automatisch hier. */}
          <div>
            <ColumnHeading>Leistungen</ColumnHeading>
            <ul className="mt-5 space-y-3">
              {servicePages.map((page) => (
                <li key={page.slug}>
                  <ColumnLink href={`/leistungen/${page.slug}`}>{page.nav}</ColumnLink>
                </li>
              ))}
              <li>
                <ColumnLink href="/leistungen">
                  <span className="text-frost">Alle Leistungen</span>
                </ColumnLink>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <ColumnHeading>Kontakt</ColumnHeading>
            {/* Bewusst ohne Anschrift — die Postadresse steht im Impressum
                (Pflicht nach § 5 DDG) und in der Kontakt-Sektion. */}
            <address className="mt-5 space-y-3 not-italic">
              <div>
                <ContactLine
                  href={contact.phoneHref}
                  icon={PhoneIcon}
                  ariaLabel={`Notruf ${contact.phone} — rund um die Uhr erreichbar`}
                >
                  {contact.phone}
                </ContactLine>
              </div>
              <div>
                <ContactLine href={contact.emailHref} icon={MailIcon}>
                  {contact.email}
                </ContactLine>
              </div>
            </address>
          </div>

          {/* Rechtliches */}
          <div>
            <ColumnHeading>Rechtliches</ColumnHeading>
            <ul className="mt-5 space-y-3">
              {footer.legal.map((item) => (
                <li key={item.href}>
                  <ColumnLink href={item.href}>{item.label}</ColumnLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-xs text-frost-dim">{footer.copyright}</p>
          <p className="font-mono text-2xs uppercase text-frost-dim">
            {contact.availability}
          </p>
        </div>
      </div>
    </footer>
  );
}
