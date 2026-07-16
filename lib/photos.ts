/**
 * Die Fotos der Kundin.
 *
 * HERKUNFT: eigene Aufnahmen, per WhatsApp geliefert (Juli 2026). Keine
 * Stockbilder — Business Case Kap. 6 fordert ausdrücklich „echte Bilder … statt
 * austauschbarer Stockfotos".
 *
 * WAS SIE ZEIGEN — und was nicht: Alle drei zeigen die REGION, keinen Einsatz.
 * Es gibt kein Bild von Team, Technik oder einer Baustelle. Deshalb stehen sie
 * ausschließlich dort, wo es um das Einsatzgebiet und um Wasser in der Landschaft
 * geht. Sie als Beleg für ausgeführte Arbeiten zu setzen wäre eine Behauptung,
 * die das Bild nicht deckt.
 *
 * ORTSANGABEN: bewusst keine. Der See mit der Insel könnte der Staffelsee sein
 * (Murnau liegt an ihm, die Insel Wörth liegt darin) — bestätigt ist das nicht,
 * und ein falscher Ortsname auf der eigenen Seite ist schlimmer als gar keiner.
 * Die Texte beschreiben, was zu sehen ist. Sobald die Kundin die Orte benennt,
 * können die Unterschriften konkreter werden.
 *
 * Die Dateien liegen in genau den Breiten vor, in denen sie vorkommen (1× / 2×),
 * erzeugt aus den Originalen mit sharp. Originale nicht im Repo.
 */

export type Photo = {
  /** Kleinere Fassung. Die Zahl im Dateinamen IST die Breite — Photo.tsx liest sie. */
  readonly src: string;
  readonly srcWide: string;
  /** Maße der größeren Fassung. Halten das Seitenverhältnis frei (gegen CLS). */
  readonly width: number;
  readonly height: number;
  readonly alt: string;
  readonly caption: string;
};

export const photos = {
  /** Voralpenland mit Alpenkette am Horizont — das Einsatzgebiet als Ganzes. */
  alpenpanorama: {
    src: "/fotos/alpenpanorama-900.webp",
    srcWide: "/fotos/alpenpanorama-1600.webp",
    width: 1600,
    height: 900,
    alt: "Weiter Blick über Wiesen und Felder des Voralpenlands, dahinter die Kette der Alpen.",
    /** Belegt: Business Case Kap. 3 („der gesamte Alpenrand mit kurzen Anfahrtswegen"). */
    caption: "Das Einsatzgebiet — Alpenrand, kurze Wege",
  },

  /** See mit bewaldeter Insel aus der Luft. */
  voralpensee: {
    src: "/fotos/voralpensee-900.webp",
    srcWide: "/fotos/voralpensee-1600.webp",
    width: 1600,
    height: 900,
    alt: "Luftaufnahme eines Sees im Voralpenland mit bewaldeter Insel und Bootshaus am Ufer.",
    caption: "Wasser prägt die Region — und ihre Gebäude",
  },

  /**
   * Wasserlauf über Fels.
   *
   * Das Original ist Hochformat (900×1600); gezeigt wird es in einer 4:3-Box.
   * Die Dateien sind deshalb schon beim Erzeugen auf 4:3 beschnitten — per
   * object-cover hätten wir ein 9:16-Bild geladen und davon einen Streifen
   * gezeigt, also rund das 2,5-Fache an Pixeln übertragen.
   */
  wasserlauf: {
    src: "/fotos/wasserlauf-700.webp",
    srcWide: "/fotos/wasserlauf-1400.webp",
    width: 1400,
    height: 1050,
    alt: "Wasser läuft über eine bewachsene Felswand und sammelt sich zwischen den Steinen darunter.",
    caption: "Wasser sucht sich seinen Weg",
  },
} as const satisfies Record<string, Photo>;
