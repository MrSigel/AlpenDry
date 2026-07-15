import Link from "next/link";
import { contact, footer, site } from "@/lib/content";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-ink">
      <div className="mx-auto w-full max-w-shell px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
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

          {/* Kontakt */}
          <div>
            <h2 className="font-display text-xs font-semibold uppercase tracking-eyebrow text-frost">
              Kontakt
            </h2>
            {/* Bewusst ohne Anschrift — die Postadresse steht im Impressum
                (Pflicht nach § 5 DDG) und in der Kontakt-Sektion. */}
            <address className="mt-5 space-y-3 not-italic">
              <a
                href={contact.phoneHref}
                className="block font-mono text-sm text-snow transition-colors hover:text-signal"
              >
                {contact.phone}
              </a>
              <a
                href={contact.emailHref}
                className="block font-body text-sm text-frost transition-colors hover:text-snow"
              >
                {contact.email}
              </a>
            </address>
          </div>

          {/* Rechtliches */}
          <div>
            <h2 className="font-display text-xs font-semibold uppercase tracking-eyebrow text-frost">
              Rechtliches
            </h2>
            <ul className="mt-5 space-y-3">
              {footer.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-frost transition-colors hover:text-snow"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-xs text-frost-dim">{footer.copyright}</p>
          <p className="font-mono text-2xs uppercase text-frost-dim">{contact.availability}</p>
        </div>
      </div>
    </footer>
  );
}
