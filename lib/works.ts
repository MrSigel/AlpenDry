/**
 * „Bisherige Arbeiten" — Seiteninhalt.
 *
 * ⚠️ NUR EIN BILD ZEIGT EINE ECHTE ARBEIT.
 *
 * Von den sechs gelieferten Bildern ist genau eines eine Aufnahme aus einem
 * ausgeführten Auftrag (`wasserschaden`: Vorher/Nachher eines sanierten
 * Raums). Die anderen fünf sind Stockmaterial — Studioaufnahmen, ein
 * Produktfoto und eine Vektorgrafik. Die Kundin hat bestätigt, dass sie
 * lizenziert sind; die Urheberrechtsfrage ist damit geklärt.
 *
 * DESHALB `symbol: true` UND DIE KENNZEICHNUNG „SYMBOLBILD".
 * Ohne sie behaupteten die fünf auf einer Seite mit der Überschrift „Bisherige
 * Arbeiten", Einsätze dieses Betriebs zu zeigen — das wäre irreführende Werbung
 * (§ 5 UWG). „Symbolbild" ist die etablierte Kennzeichnung dafür und kostet
 * nichts: Die Bilder bleiben, die falsche Behauptung entfällt. Gerade gegenüber
 * Versicherungen — laut Kap. 3 die strategische Hauptzielgruppe — wäre eine
 * aufgeflogene Fake-Referenz ruinös.
 *
 * Das echte Bild trägt bewusst KEIN „Symbolbild", sondern benennt, was es ist.
 * Genau dieser Unterschied macht es wertvoll.
 *
 * Kein Text behauptet ein konkretes Projekt, eine Anzahl, eine Dauer oder einen
 * Ort. Alles Folgende ist im Business Case belegt:
 *   Kap. 2  „unzählige gelöste Schadensfälle", „Erfahrung statt Theorie"
 *   Kap. 12 der dokumentierte Ablauf (Fotodokumentation, Messprotokolle,
 *           Abschlussmessung, digitaler Bericht)
 *   Kap. 5  „Dokumentation — lückenlose Messprotokolle, Fotodokumentation,
 *           digitale Berichte für die Schadenakte"
 *
 * FÜR JEDES WEITERE ECHTE FOTO — zwei Dinge vorher klären:
 *   1. Einwilligung. Aufnahmen aus fremden Wohnungen und Gebäuden brauchen die
 *      Zustimmung der Eigentümer bzw. Bewohner (DSGVO Art. 6 Abs. 1 lit. a,
 *      dazu das Hausrecht). Am einfachsten gleich im Auftragsformular mit
 *      abfragen.
 *   2. Anonymität. Keine Hausnummern, Klingelschilder, Kennzeichen, Personen
 *      oder Einrichtungsdetails, die eine Wohnung identifizierbar machen.
 *   Je echtes Foto ein `symbol: false` mehr — und die Seite wird stärker.
 */

export const works = {
  eyebrow: "Referenzen",
  h1: "Bisherige Arbeiten",
  /** Kap. 2 („unzählige gelöste Schadensfälle") + Kap. 12, verdichtet. */
  lead: "Jeder Auftrag wird bei uns dokumentiert — vom ersten Messprotokoll bis zur Abschlussmessung. Hier zeigen wir, wie diese Arbeit aussieht.",

  metaTitle: "Bisherige Arbeiten — Referenzen | AlpenDry",
  metaDescription:
    "Einblicke in abgeschlossene Einsätze von AlpenDry: Wasserschadensanierung, Leckageortung, Trocknung und Schimmelsanierung am Alpenrand.",

  /** Kennzeichnung für Stockmaterial. Herleitung im Dateikopf. */
  symbolLabel: "Symbolbild",

  /**
   * Die Kategorien entsprechen den Leistungen (Kap. 4) — so findet jedes Foto
   * von selbst seinen Platz.
   *
   * Die Dateien liegen 4:3 vorgeschnitten in public/arbeiten (400 = 1×,
   * 800 = 2×), erzeugt aus den Originalen mit sharp. Originale nicht im Repo.
   */
  categories: [
    {
      title: "Wasserschadensanierung",
      body: "Sofortmaßnahmen, Rückbau, Wiederherstellung — vom Notruf bis zur Übergabe.",
      image: "wasserschaden",
      /** Das EINZIGE echte Einsatzfoto. Deshalb kein Symbolbild-Hinweis. */
      symbol: false,
      alt: "Zwei Aufnahmen desselben Raums nebeneinander: links die feuchte, aufgestemmte Wand während der Sanierung, rechts der fertig wiederhergestellte Raum mit neuem Parkett.",
      caption: "Abgeschlossener Einsatz — vorher und nachher",
    },
    {
      title: "Leckageortung",
      body: "Zerstörungsarme Ortung mit Messtechnik: die Stelle finden, bevor geöffnet wird.",
      image: "leckageortung",
      symbol: true,
      alt: "Aus einem kleinen Riss in einer Kupferleitung tritt Wasser unter Druck aus.",
      caption: "Undichte Leitung",
    },
    {
      title: "Technische Trocknung",
      body: "Aufbau der Trocknungstechnik, laufende Überwachung, dokumentierter Verlauf.",
      image: "trocknung",
      symbol: true,
      alt: "Ein Bautrockner steht in einem leeren Raum vor einer Wand mit Feuchtigkeitsrändern.",
      caption: "Trocknungsgerät im Einsatz",
    },
    {
      title: "Schimmelsanierung",
      body: "Ursache messen, fachgerecht sanieren, Nachkontrolle.",
      image: "schimmel",
      symbol: true,
      alt: "Eine Fachkraft in Schutzanzug und Atemmaske behandelt eine von Schimmel befallene Wand.",
      caption: "Sanierung mit Schutzausrüstung",
    },
    {
      title: "Hochwasser-Prävention",
      body: "Außenanlagen, die Starkregen ableiten, statt ihn ins Gebäude zu lassen.",
      image: "hochwasser",
      symbol: true,
      alt: "Gestapelte Sandsäcke halten anstehendes Wasser zurück.",
      caption: "Schutz vor anstehendem Wasser",
    },
    {
      title: "Dokumentation",
      body: "Messprotokolle, Fotodokumentation und digitale Berichte für die Schadenakte.",
      image: "dokumentation",
      symbol: true,
      alt: "Illustration: Menschen bearbeiten eine Checkliste auf einem Klemmbrett.",
      caption: "Lückenlose Schadenakte",
    },
  ],

  /**
   * Erklärt, warum nicht jedes Bild ein Einsatzfoto ist — ohne sich zu
   * entschuldigen. Der Grund ist ein gutes Argument: Aufnahmen aus fremden
   * Wohnungen brauchen die Zustimmung der Kunden.
   *
   * Dieser Absatz ist zugleich die textliche Absicherung zur Symbolbild-
   * Kennzeichnung: Er sagt offen, was echt ist und was illustriert.
   * @freigabe (Micro-Copy, aus Kap. 5 + Kap. 12 abgeleitet)
   */
  consent: {
    title: "Was Sie hier sehen — und was nicht",
    body: "Wir dokumentieren jeden Einsatz: Messprotokolle, Fotos, Abschlussbericht. Bevor eine dieser Aufnahmen öffentlich wird, holen wir die Zustimmung der Kundin oder des Kunden ein und entfernen alles, was die Wohnung erkennbar macht. Deshalb wächst diese Seite langsam. Als Symbolbild gekennzeichnete Aufnahmen zeigen die Art der Arbeit, nicht einen konkreten Auftrag von uns.",
  },
} as const;
