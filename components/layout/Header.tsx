"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { contact, whatsappHref } from "@/lib/content";
import { nav } from "@/lib/nav";
import { Logo } from "@/components/brand/Logo";
import { ChevronIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

/**
 * Kopfzeile.
 *
 * Business Case Kap. 6: „Notrufnummer und WhatsApp-Button sind ohne Scrollen
 * sichtbar, auf jeder Unterseite." → Beide CTAs sitzen ab `md` permanent hier.
 * Auf Mobil übernimmt das die fixierte Bottom-Bar (StickyCTA).
 *
 * Seit es Unterseiten gibt, braucht der Header zwei Dinge mehr:
 *   1. Ein Dropdown für die fünf Leistungen — flach nebeneinander wären es
 *      neun Punkte, das trägt keine Kopfzeile.
 *   2. Ein MOBILES MENÜ. Vorher war die Navigation `hidden lg:block`, was beim
 *      Onepager reichte (die Bottom-Bar trug alles). Mit Unterseiten wären sie
 *      auf dem Telefon schlicht nicht erreichbar gewesen.
 *
 * Über dem 3D-Hero transparent, ab dem ersten Scroll mit ink-Fläche.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * Beim Seitenwechsel alles schließen — sonst bleibt das Menü über der neuen
   * Seite stehen, auch bei Zurück/Vorwärts im Browser (ein onClick an jedem Link
   * würde History-Navigation nicht erfassen).
   *
   * Bewusst KEIN Effect, sondern das React-Muster „State beim Wechsel eines
   * Werts anpassen": Ein Effect würde die neue Seite erst mit offenem Menü
   * zeichnen und es danach zuklappen — ein sichtbarer Doppel-Render. Der
   * Vergleich im Render-Body korrigiert den State, bevor überhaupt etwas ins
   * Bild kommt. React startet dann sofort neu, ohne Paint dazwischen.
   * https://react.dev/learn/you-might-not-need-an-effect
   */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setOpenDropdown(null);
  }

  // Esc schließt, Klick daneben schließt das Dropdown.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      setOpenDropdown(null);
    };
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpenDropdown(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, []);

  // Solange das mobile Menü offen ist, darf die Seite dahinter nicht scrollen.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href.startsWith("/") && !href.includes("#") && pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ease-glide ${
        scrolled || menuOpen
          ? "border-b border-hairline bg-ink/90 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-shell items-center justify-between gap-8 px-6 md:px-10">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        {/* ── Desktop-Navigation ──────────────────────────────────── */}
        <nav aria-label="Hauptnavigation" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) =>
              item.children ? (
                <li key={item.href} ref={dropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDropdown(openDropdown === item.href ? null : item.href)
                    }
                    aria-expanded={openDropdown === item.href}
                    aria-haspopup="true"
                    className={`inline-flex items-center gap-1.5 font-body text-sm transition-colors duration-300 ${
                      isActive(item.href) ? "text-snow" : "text-frost hover:text-snow"
                    }`}
                  >
                    {item.label}
                    <ChevronIcon
                      className={`h-3.5 w-3.5 transition-transform duration-300 ease-glide ${
                        openDropdown === item.href ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openDropdown === item.href && (
                      <motion.div
                        initial={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute left-0 top-full z-50 mt-4 w-64 rounded-sm border border-hairline bg-abyss p-2"
                      >
                        <Link
                          href={item.href}
                          className="block rounded-sm px-4 py-3 font-display text-sm font-semibold text-snow transition-colors hover:bg-ink"
                        >
                          Übersicht
                        </Link>
                        <span className="my-2 block h-px bg-frost-faint" aria-hidden="true" />
                        {item.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            className="block rounded-sm px-4 py-2.5 font-body text-sm text-frost transition-colors hover:bg-ink hover:text-snow"
                          >
                            {c.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-frost transition-colors duration-300 hover:text-snow"
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {/* CTAs im ersten Sichtfeld — Desktop */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-sm border border-hairline px-4 py-2.5 font-display text-sm font-semibold text-snow transition-all duration-300 ease-glide hover:border-glacier hover:bg-glacier-glow md:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4 text-glacier" />
            WhatsApp
          </a>
          <a
            href={contact.phoneHref}
            className="hidden items-center gap-2 rounded-sm bg-signal px-4 py-2.5 font-display text-sm font-semibold text-ink transition-colors duration-300 ease-glide hover:bg-glacier md:inline-flex"
            aria-label={`Notruf ${contact.phone} — rund um die Uhr erreichbar`}
          >
            <PhoneIcon className="h-4 w-4" />
            <span className="font-mono tracking-tight">{contact.phone}</span>
          </a>

          {/* ── Menü-Schalter (unter lg) ──────────────────────────── */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
            className="flex h-11 w-11 items-center justify-center rounded-sm border border-hairline text-snow transition-colors hover:border-glacier lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              {menuOpen ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobiles Menü ────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Hauptnavigation"
            initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-hairline bg-ink lg:hidden"
          >
            {/* max-h + scroll: Auf kleinen Displays passen sonst nicht alle
                Punkte über die Notruf-Leiste. */}
            <div className="max-h-[calc(100svh-9rem)] overflow-y-auto px-6 py-6">
              <ul className="space-y-1">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block py-3 font-display text-lg font-semibold text-snow"
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <ul className="mb-2 ml-4 space-y-1 border-l border-hairline pl-4">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              className="block py-2 font-body text-sm text-frost"
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
