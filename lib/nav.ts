import { servicePages } from "./services-pages";

/**
 * Hauptnavigation.
 *
 * Eigene Datei, weil sie zwei Quellen zusammenführt (Seitenstruktur +
 * Leistungen) — in content.ts würde das einen Import-Zirkel erzeugen:
 * services-pages liest bereits aus content.
 *
 * ALLE ANKER SIND ABSOLUT ("/#ablauf", nicht "#ablauf"). Seit es Unterseiten
 * gibt, ist das kein Stil, sondern Funktion: Ein relativer Anker sucht das
 * Ziel auf der AKTUELLEN Seite — auf /leistungen/trocknung gibt es kein
 * #ablauf, der Klick liefe ins Leere.
 */

export type NavItem = {
  readonly label: string;
  readonly href: string;
  readonly children?: readonly { readonly label: string; readonly href: string }[];
};

export const nav: readonly NavItem[] = [
  {
    label: "Leistungen",
    href: "/leistungen",
    children: servicePages.map((p) => ({
      label: p.nav,
      href: `/leistungen/${p.slug}`,
    })),
  },
  { label: "Arbeiten", href: "/arbeiten" },
  /*
   * Eigene Seiten statt Anker auf die Startseite (Kundenwunsch).
   *
   * Vorher standen hier "/#einsatzgebiet", "/#ablauf", "/#fragen",
   * "/#kontakt" — die Navigation sprang also innerhalb der Startseite. Jetzt
   * trägt jeder Abschnitt eine eigene Seite; die Abschnitte selbst sind
   * unverändert und stehen weiterhin auch auf der Startseite (Begründung in
   * components/layout/StandalonePage.tsx).
   *
   * Die Anker in den Sektionen bleiben trotzdem bestehen: Alte Links auf
   * "/#kontakt" — aus E-Mails, Anzeigen, Lesezeichen — funktionieren weiter.
   */
  { label: "Einsatzgebiet", href: "/einsatzgebiet" },
  { label: "Ablauf", href: "/ablauf" },
  { label: "Fragen", href: "/fragen" },
  { label: "Kontakt", href: "/kontakt" },
];
