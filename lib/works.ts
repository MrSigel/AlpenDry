/**
 * „Bisherige Arbeiten" — Seiteninhalt.
 *
 * ALLE SECHS BILDER SIND KI-GENERIERT (von der Kundin geliefert, 1408×768).
 *
 * ERLEDIGT: Die frühere Fassung hatte echte Herstellernamen auf den Geräten
 * („CORROVENTA", „TROTEC", „SEWERIN", „LGR"), von der KI nachgebaut. Der Satz
 * neuer Bilder (07/2026) ist markenfrei — nachgesehen, jedes einzeln.
 *
 * ⚠️ OFFEN — im README:
 * KEINE KENNZEICHNUNG AM BILD. Auf Kundenwunsch entfernt. Der Hinweis steht
 * nur noch im Bildnachweis des Impressums. Zu bedenken: Art. 50 Abs. 4 KI-VO
 * (EU 2024/1689) gilt ab 02.08.2026 und verlangt die Kennzeichnung
 * fotorealistischer KI-Bilder beim ersten Ansehen — ein Impressumshinweis
 * genügt dafür nicht. Dazu § 5 UWG: Auf einer Seite mit der Überschrift
 * „Bisherige Arbeiten" lesen sich unbeschriftete Bilder als eigene Einsätze.
 * Entscheidung der Kundin; die Kennzeichnung ist eine Zeile
 * (`works.symbolLabel` + das `symbol`-Feld) und jederzeit reaktivierbar.
 *
 * Die echte Vorher/Nachher-Aufnahme eines abgeschlossenen Auftrags liegt weiter
 * im Projektordner (Wasserschaden.jpg), wird aber nicht mehr verwendet: Die
 * Kachel trägt jetzt das KI-Bild. Sie war das einzige Bild, das etwas belegte —
 * sobald echte Einsatzfotos gewünscht sind, gehört sie zurück.
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
 *   Je echtes Foto ein KI-Bild weniger — und die Seite wird stärker.
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
   * Kennzeichnung für KI-Bilder. Wird derzeit NICHT angezeigt (Kundenwunsch,
   * siehe Dateikopf Punkt 1) — steht hier, weil sie mit einer Zeile in
   * app/arbeiten/page.tsx zurückkommt, sobald sie gewünscht oder ab 02.08.2026
   * nötig ist.
   */
  symbolLabel: "Symbolbild · KI-generiert",

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
      symbol: true,
      alt: "Eine Hand hält ein Feuchtemessgerät an eine Wand; das Display zeigt einen Messwert.",
      caption: "Gemessen wird zuerst",
    },
    {
      title: "Leckageortung",
      body: "Zerstörungsarme Ortung mit Messtechnik: die Stelle finden, bevor geöffnet wird.",
      image: "leckageortung",
      symbol: true,
      alt: "Aus einem Riss in einer Kupferleitung tropft Wasser an einer Wand herunter.",
      caption: "Die undichte Stelle",
    },
    {
      title: "Technische Trocknung",
      body: "Aufbau der Trocknungstechnik, laufende Überwachung, dokumentierter Verlauf.",
      image: "trocknung",
      symbol: true,
      alt: "Ausgeräumter Raum mit Parkettboden; an der Wand zeichnen sich großflächige Feuchtigkeitsränder ab.",
      caption: "Feuchtigkeit in der Wand",
    },
    {
      title: "Schimmelsanierung",
      body: "Ursache messen, fachgerecht sanieren, Nachkontrolle.",
      image: "schimmel",
      symbol: true,
      alt: "Dunkle Schimmelflecken breiten sich in einer Zimmerecke entlang der Decke aus.",
      caption: "Befall an der Deckenkante",
    },
    {
      title: "Hochwasser-Prävention",
      body: "Außenanlagen, die Starkregen ableiten, statt ihn ins Gebäude zu lassen.",
      image: "hochwasser",
      symbol: true,
      alt: "Kellerraum mit fest installierten Schutzbarrieren an den Zugängen, dazu gestapelte Sandsäcke.",
      caption: "Vorbereitet für den Ernstfall",
    },
    {
      title: "Dokumentation",
      body: "Messprotokolle, Fotodokumentation und digitale Berichte für die Schadenakte.",
      image: "dokumentation",
      symbol: true,
      alt: "Aufgeräumter Büroarbeitsplatz mit Monitor und Drucker in einem Technikraum.",
      caption: "Jeder Auftrag wird erfasst",
    },
  ],

  /**
   * Erklärt, warum nicht jedes Bild ein Einsatzfoto ist — ohne sich zu
   * entschuldigen. Der Grund ist ein gutes Argument: Aufnahmen aus fremden
   * Wohnungen brauchen die Zustimmung der Kunden.
   *
   * Der letzte Satz verwies auf die Symbolbild-Kennzeichnung an den Bildern.
   * Die ist auf Kundenwunsch entfallen — der Satz musste mit, sonst behauptete
   * die Seite eine Kennzeichnung, die es nicht gibt. Die Aussage bleibt: Die
   * Bilder zeigen die Art der Arbeit, keinen konkreten Auftrag.
   * @freigabe (Micro-Copy, aus Kap. 5 + Kap. 12 abgeleitet)
   */
  consent: {
    title: "Was Sie hier sehen — und was nicht",
    body: "Wir dokumentieren jeden Einsatz: Messprotokolle, Fotos, Abschlussbericht. Bevor eine dieser Aufnahmen öffentlich wird, holen wir die Zustimmung der Kundin oder des Kunden ein und entfernen alles, was die Wohnung erkennbar macht. Deshalb wächst diese Seite langsam. Die Abbildungen auf dieser Seite zeigen die Art unserer Arbeit, nicht einen konkreten Auftrag.",
  },
} as const;
