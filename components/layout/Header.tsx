"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { contact, nav, whatsappHref } from "@/lib/content";
import { Logo } from "@/components/brand/Logo";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

/**
 * Kopfzeile.
 *
 * Business Case Kap. 6: „Notrufnummer und WhatsApp-Button sind ohne Scrollen
 * sichtbar, auf jeder Unterseite." → Beide CTAs sitzen ab `md` permanent hier.
 * Auf Mobil übernimmt das die fixierte Bottom-Bar (StickyCTA).
 *
 * Über dem 3D-Hero transparent, damit die Szene atmen kann; ab dem ersten
 * Scroll legt sich eine ink-Fläche mit Hairline darunter — Tiefe über Kante,
 * nicht über Schlagschatten.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ease-glide ${
        scrolled ? "border-b border-hairline bg-ink/90 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-shell items-center justify-between gap-8 px-6 md:px-10">
        {/* Kein aria-label: Der sichtbare Text („AlpenDry“ + Untertitel) bildet
            den Linknamen. Ein Label, das den sichtbaren Text nicht enthält,
            verstößt gegen WCAG 2.5.3 (Label in Name). */}
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="font-body text-sm text-frost transition-colors duration-300 hover:text-snow"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTAs im ersten Sichtfeld — Desktop */}
        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm border border-hairline px-4 py-2.5 font-display text-sm font-semibold text-snow transition-all duration-300 ease-glide hover:border-glacier hover:bg-glacier-glow"
          >
            <WhatsAppIcon className="h-4 w-4 text-glacier" />
            WhatsApp
          </a>
          <a
            href={contact.phoneHref}
            className="inline-flex items-center gap-2 rounded-sm bg-signal px-4 py-2.5 font-display text-sm font-semibold text-ink transition-colors duration-300 ease-glide hover:bg-glacier"
            aria-label={`Notruf ${contact.phone} — rund um die Uhr erreichbar`}
          >
            <PhoneIcon className="h-4 w-4" />
            <span className="font-mono tracking-tight">{contact.phone}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
