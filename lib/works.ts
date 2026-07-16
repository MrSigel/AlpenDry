/**
 * „Bisherige Arbeiten" — Seiteninhalt.
 *
 * ⚠️ DIESE SEITE IST EIN GERÜST OHNE ECHTE REFERENZEN.
 *
 * Es gibt bislang KEINE Fotos von ausgeführten Arbeiten (die drei gelieferten
 * Bilder zeigen Landschaft, siehe lib/photos.ts). Fotos aus dem Internet kämen
 * nicht in Frage — fremde Arbeiten als eigene Referenz auszugeben ist
 * irreführende Werbung (§ 5 UWG) und verletzt zudem das Urheberrecht an den
 * Bildern. Deshalb stehen hier Platzhalter, bis echte Aufnahmen vorliegen.
 *
 * Aus demselben Grund behauptet KEIN Text auf dieser Seite ein konkretes
 * Projekt, eine Anzahl, eine Dauer oder einen Ort. Alles Folgende ist im
 * Business Case belegt:
 *   Kap. 2  „unzählige gelöste Schadensfälle", „Erfahrung statt Theorie"
 *   Kap. 12 der dokumentierte Ablauf (Fotodokumentation, Messprotokolle,
 *           Abschlussmessung, digitaler Bericht)
 *   Kap. 5  „Dokumentation — lückenlose Messprotokolle, Fotodokumentation,
 *           digitale Berichte für die Schadenakte"
 *
 * SOBALD FOTOS DA SIND — zwei Dinge sind vorher zu klären:
 *   1. Einwilligung. Aufnahmen aus fremden Wohnungen und Gebäuden brauchen die
 *      Zustimmung der Eigentümer bzw. Bewohner (DSGVO Art. 6 Abs. 1 lit. a,
 *      dazu das Hausrecht). Am einfachsten gleich im Auftragsformular mit
 *      abfragen.
 *   2. Anonymität. Keine Hausnummern, Klingelschilder, Kennzeichen, Personen
 *      oder Einrichtungsdetails, die eine Wohnung identifizierbar machen.
 */

export const works = {
  eyebrow: "Referenzen",
  h1: "Bisherige Arbeiten",
  /** Kap. 2 („unzählige gelöste Schadensfälle") + Kap. 12, verdichtet. */
  lead: "Jeder Auftrag wird bei uns dokumentiert — vom ersten Messprotokoll bis zur Abschlussmessung. Hier zeigen wir, wie diese Arbeit aussieht.",

  metaTitle: "Bisherige Arbeiten — Referenzen | AlpenDry",
  metaDescription:
    "Einblicke in abgeschlossene Einsätze von AlpenDry: Wasserschadensanierung, Leckageortung, Trocknung und Schimmelsanierung am Alpenrand.",

  /**
   * Der Platzhalter-Text. Bewusst deutlich als solcher erkennbar — eine
   * Referenzseite, die so tut, als hätte sie Inhalte, ist schlimmer als eine,
   * die ehrlich sagt, dass sie noch gefüllt wird.
   */
  placeholder: {
    label: "Hier erscheinen Fotos",
    note: "Aufnahme folgt",
  },

  /**
   * Die Kategorien, nach denen die Fotos später sortiert werden. Sie
   * entsprechen den Leistungen (Kap. 4) — so findet sich jedes Foto von selbst
   * an seinen Platz, und die Seite hat schon jetzt eine tragfähige Struktur.
   */
  categories: [
    {
      title: "Wasserschadensanierung",
      body: "Sofortmaßnahmen, Rückbau, Wiederherstellung — vom Notruf bis zur Übergabe.",
    },
    {
      title: "Leckageortung",
      body: "Zerstörungsarme Ortung mit Messtechnik: die Stelle finden, bevor geöffnet wird.",
    },
    {
      title: "Technische Trocknung",
      body: "Aufbau der Trocknungstechnik, laufende Überwachung, dokumentierter Verlauf.",
    },
    {
      title: "Schimmelsanierung",
      body: "Ursache messen, fachgerecht sanieren, Nachkontrolle.",
    },
    {
      title: "Hochwasser-Prävention",
      body: "Außenanlagen, die Starkregen ableiten, statt ihn ins Gebäude zu lassen.",
    },
    {
      title: "Dokumentation",
      body: "Messprotokolle, Fotodokumentation und digitale Berichte für die Schadenakte.",
    },
  ],

  /**
   * Erklärt, warum hier (noch) keine Bilder stehen — ohne sich zu
   * entschuldigen. Der Grund ist ein gutes Argument: Aufnahmen aus fremden
   * Wohnungen brauchen die Zustimmung der Kunden.
   * @freigabe (Micro-Copy, aus Kap. 5 + Kap. 12 abgeleitet)
   */
  consent: {
    title: "Warum hier noch nichts zu sehen ist",
    body: "Wir dokumentieren jeden Einsatz — Messprotokolle, Fotos, Abschlussbericht. Bevor eine dieser Aufnahmen hier erscheint, holen wir die Zustimmung der Kundin oder des Kunden ein und entfernen alles, was die Wohnung erkennbar macht. Das dauert länger als ein Bild aus dem Internet, ist dafür aber echt.",
  },
} as const;
