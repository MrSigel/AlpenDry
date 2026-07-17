import { contact, region } from "./content";
import { photos } from "./photos";

/**
 * Inhalte der Leistungs-Unterseiten.
 *
 * QUELLEN — in dieser Reihenfolge:
 *   1. Business Case Kap. 4 (Leistungsbeschreibung, wörtlich)
 *   2. Die eigenen AGB der Kundin — dort steht erstaunlich viel Fachliches:
 *      § 6 (Trocknungsdauer, Faktoren, Pflichten), § 8 (Leckortung/Thermo-
 *      graphie, Grenzen), § 9 (Rückbau/Wiederherstellung), § 3 (Leistungs-
 *      umfang). Das ist von der Kundin freigegebener Text, kein Marketing.
 *   3. Kap. 12 (Ablauf) und Kap. 3 (Einsatzgebiet) als wiederverwendete
 *      Bausteine.
 *
 * ⚠️ Passagen mit `@freigabe` sind von mir formuliert — fachlich üblich, aber
 * in keinem Dokument wörtlich belegt. BITTE GEGENLESEN. Bewusst enthalten
 * sie: keine Preise, keine Fristen, keine Erfolgszusagen. Wo die AGB Grenzen
 * nennen (z. B. „kein bestimmter Untersuchungserfolg garantiert"), stehen die
 * auch hier — eine Website, die mehr verspricht als die AGB hergeben, ist ein
 * Eigentor.
 */

export type ServiceBlock = {
  readonly h: string;
  readonly body: readonly string[];
  readonly list?: readonly string[];
};

export type ServicePage = {
  readonly slug: string;
  /** Kurzform für die Navigation. */
  readonly nav: string;
  readonly h1: string;
  /** Ein Satz unter dem h1 — trägt die regionalen Keywords. */
  readonly lead: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly blocks: readonly ServiceBlock[];
  /**
   * Ein Satz für den Handlungsaufruf mitten im Text.
   *
   * Pflichtfeld, damit keine Seite mit derselben Floskel abgespeist wird — die
   * Zeile soll das Problem DIESER Seite aufgreifen. Quelle ist überwiegend
   * Kap. 11 (die fertigen Anzeigentexte): von der Kundin freigegebene
   * Formulierungen, näher am Notfall als alles, was ich schreiben würde.
   */
  readonly ctaLine: string;
  readonly faq: readonly { readonly q: string; readonly a: string }[];
  /** Slugs verwandter Leistungen — als Querverweise am Seitenende. */
  readonly related: readonly string[];
  /**
   * Foto der Kundin — NUR wo das Bild zur Leistung wirklich etwas sagt.
   *
   * Absichtlich nicht auf jeder Seite: Es gibt bislang ausschließlich
   * Landschaftsaufnahmen, keine von Team, Technik oder Baustelle (siehe
   * lib/photos.ts). Ein Bergpanorama neben „Schimmelsanierung" wäre exakt die
   * beliebige Bebilderung, die plan.md §0 verbietet — dann lieber keins.
   * Sobald es Einsatzfotos gibt, bekommen die übrigen Seiten ihres.
   */
  readonly photo?: keyof typeof photos;
};

const ORTE = region.places.slice(0, 4).join(", ");

export const servicePages: readonly ServicePage[] = [
  // ───────────────────────────────────────────────────────────────────
  {
    slug: "wasserschadensanierung",
    nav: "Wasserschadensanierung",
    h1: "Wasserschadensanierung",
    /** Kap. 1 + Kap. 4, verdichtet. */
    lead: "Vom ersten Notruf bis zur fertigen Wiederherstellung — ein Anruf, ein Ansprechpartner, keine Koordination zwischen Gewerken.",
    metaTitle: "Wasserschadensanierung am Alpenrand — 24/7-Notdienst | AlpenDry",
    metaDescription: `Wasserschaden? 24/7-Notdienst für ${ORTE} und das Alpenvorland. Sofortmaßnahmen, Trocknung, Wiederherstellung — Abwicklung direkt mit Ihrer Versicherung.`,
    blocks: [
      {
        /** Kap. 4 wörtlich + Kap. 12 Schritt 1/2. */
        h: "Was im Akutfall zählt",
        body: [
          "Ein Wasserschaden wird mit jeder Stunde teurer. Wasser zieht in Estrich, Dämmung und Wände, und was zunächst nach einer feuchten Stelle aussieht, ist oft längst ein Schaden an der Bausubstanz.",
          "Deshalb beginnt jeder Einsatz mit Schadensbegrenzung: Wasser stoppen, betroffene Bereiche sichern, Folgeschäden begrenzen — noch bevor die eigentliche Sanierung beginnt. Erste Hinweise dazu bekommen Sie schon am Telefon.",
        ],
      },
      {
        /** Kap. 4, Liste wörtlich. */
        h: "Alles aus einer Hand",
        body: ["AlpenDry deckt die gesamte Kette ab:"],
        list: [
          "Sofortmaßnahmen zur Schadensbegrenzung, rund um die Uhr",
          "Leckageortung — auch bei unsichtbaren Leckschäden",
          "Systematische Feuchtemessung und Fotodokumentation",
          "Technische Trocknung mit eigenen, besonders leisen Maschinen",
          "Schimmelsanierung durch den zertifizierten Schimmelexperten",
          "Rückbau und Wiederherstellung bis zum fertigen Zustand",
        ],
      },
      {
        /** AGB § 9 (1),(2),(4) — von der Kundin freigegebener Text. */
        h: "Wenn mehr zum Vorschein kommt",
        body: [
          "Bei Rückbau- und Sanierungsarbeiten zeigt sich manchmal mehr, als anfangs sichtbar war: nicht erkennbare Vorschäden, versteckte Mängel oder ungeeignete Materialien können zusätzliche Maßnahmen erforderlich machen.",
          "Wir informieren Sie über wesentliche Zusatzarbeiten und stimmen sie ab, bevor wir sie ausführen. Bei Arbeiten an vorgeschädigten Bauteilen kann es zu Farbabweichungen oder Materialunterschieden kommen — auch das sagen wir vorher, nicht hinterher.",
        ],
      },
      {
        /** Kap. 4 „Die Versicherung zahlt" + Kap. 3 Zielgruppe 1. */
        h: "Abwicklung mit der Versicherung",
        body: [
          "Bei versicherten Schäden sind die Kosten in der Regel vollständig gedeckt. Wir übernehmen die komplette Kommunikation: Schadensmeldung, Dokumentation, Abstimmung mit dem Sachverständigen, Abrechnung.",
          "Kommt der Auftrag direkt von einer Versicherung oder einem Schadensteuerer, liefern wir lückenlose Messprotokolle, Fotodokumentation und digitale Berichte für die Schadenakte.",
        ],
      },
    ],
    /** Kap. 11, Anzeige 1 („Wasserschaden ruiniert mehr als den Boden — jede
        Stunde zählt."), auf den Seitenkontext gebracht. */
    ctaLine:
      "Ein Wasserschaden ruiniert mehr als den Boden — jede Stunde zählt. Rufen Sie an, wir sagen Ihnen noch am Telefon, was jetzt zu tun ist.",
    faq: [
      {
        /** @freigabe — abgeleitet aus Kap. 12 Schritt 1/2. */
        q: "Was soll ich bis zu Ihrem Eintreffen tun?",
        a: "Wasserzufuhr abstellen und, wenn gefahrlos möglich, den Strom in den betroffenen Bereichen abschalten. Bewegliche Gegenstände aus dem nassen Bereich holen. Alles Weitere besprechen wir am Telefon — wir sind rund um die Uhr erreichbar.",
      },
      {
        /** @freigabe — abgeleitet aus Kap. 4 + AGB § 10. */
        q: "Muss ich die Versicherung selbst informieren?",
        a: "Melden Sie den Schaden Ihrer Versicherung, sobald es geht — das ist Ihre Obliegenheit als Versicherungsnehmer. Die weitere Kommunikation, Dokumentation und Abrechnung übernehmen dann wir.",
      },
    ],
    related: ["leckageortung", "trocknung", "schimmelsanierung"],
  },

  // ───────────────────────────────────────────────────────────────────
  {
    slug: "leckageortung",
    nav: "Leckageortung",
    h1: "Leckageortung",
    /** Kap. 4 wörtlich. */
    lead: "Auch unsichtbare Leckschäden werden gefunden und beseitigt: zerstörungsarm, mit modernster Messtechnik.",
    metaTitle: "Leckageortung & Lecksuche am Alpenrand — zerstörungsarm | AlpenDry",
    metaDescription: `Leckageortung (Lecksuche) für ${ORTE} und das Alpenvorland. Zerstörungsarme Ortung mit moderner Messtechnik — feuchte Flecken, steigende Wasserrechnung, muffiger Geruch.`,
    blocks: [
      {
        /** @freigabe — Symptombeschreibung, fachlich üblich. */
        h: "Wenn etwas nicht stimmt, aber nichts zu sehen ist",
        body: [
          "Ein Leck zeigt sich selten dort, wo es entsteht. Typische Anzeichen sind feuchte Flecken an Wand oder Decke, eine unerklärlich steigende Wasserrechnung, muffiger Geruch, kalte Stellen an der Wand oder eine Heizung, die ständig Druck verliert.",
          "Je länger eine undichte Leitung unentdeckt bleibt, desto größer wird der Schaden an der Bausubstanz — und desto wahrscheinlicher wird daraus ein Schimmelproblem.",
        ],
      },
      {
        /** AGB § 8 (1),(3) + Kap. 4. */
        h: "Wie wir suchen",
        body: [
          "Leckortungen und thermographische Untersuchungen führen wir nach dem aktuellen Stand der Technik und mit geeigneten Messverfahren durch. Ziel ist die fachgerechte Eingrenzung und Lokalisierung möglicher Schadensursachen — bevor irgendwo aufgestemmt wird.",
        ],
        list: [
          "Thermographie — macht Temperaturunterschiede sichtbar",
          "Feuchtemessung an allen betroffenen Bauteilen",
          "Akustische Ortung von Leitungsgeräuschen",
          "Fotodokumentation und schriftliche Ersteinschätzung",
        ],
      },
      {
        /**
         * AGB § 8 (2),(4),(5) — bewusst übernommen. Die Website darf nicht
         * mehr versprechen, als die eigenen AGB hergeben.
         */
        h: "Was wir zusagen — und was nicht",
        body: [
          "Wir schulden die fachgerechte Durchführung der Untersuchung nach dem anerkannten Stand der Technik. Eine Garantie, jede Schadstelle zu finden, wäre unseriös: Bauliche Gegebenheiten, verdeckte Leitungsverläufe, Materialeigenschaften und technische Grenzen der Messverfahren setzen jedem Verfahren Grenzen.",
          "Zur Schadensfeststellung können Öffnungen oder Freilegungen nötig werden. Die erfolgen nur im erforderlichen Umfang. Stellt sich dabei heraus, dass die Schadstelle nicht exakt an dieser Stelle liegt, ist das kein Mangel der Untersuchung — sondern der Grund, warum wir vorher messen statt zu raten.",
        ],
      },
    ],
    /**
     * Kap. 11, Anzeige 2 — die Symptomkette wörtlich. „Festpreis für die
     * Ortung" aus derselben Anzeige bewusst NICHT übernommen: Preisaussagen
     * sind ausgeschlossen, und ob er noch gilt, weiß nur die Kundin.
     *
     * Der Schlusssatz war „rufen Sie an, wir klären am Telefon vor, was zu
     * messen ist" — Behördendeutsch: „klären vor" ist unüblich, und was „zu
     * messen ist", interessiert den Kunden nicht. Ihn interessiert, dass seine
     * Wand heil bleibt und dass er sofort jemanden erreicht. Genau das steht
     * jetzt da, in gewöhnlichen Worten.
     */
    ctaLine:
      "Feuchte Flecken, steigende Wasserrechnung, muffiger Geruch? Wir finden die Ursache, ohne Ihre Wand aufzureißen. Rufen Sie an — Sie erreichen uns sofort, und wir sagen Ihnen, was jetzt zu tun ist.",
    faq: [
      {
        /**
         * @freigabe — abgeleitet aus Kap. 4 („zerstörungsarm", wörtlich belegt)
         * und AGB § 8.
         *
         * Beginnt auf Kundenwunsch OHNE Verneinung — wie die Fassung in
         * content.ts. Dieselbe Frage steht an zwei Orten und darf nicht
         * unterschiedlich anfangen; beide bitte zusammen anfassen.
         *
         * Diese hier bleibt ausführlicher: Auf der Leistungsseite ist Platz für
         * die Einschränkung aus AGB § 8, in der FAQ der Startseite nicht.
         */
        q: "Muss für die Leckageortung die Wand aufgerissen werden?",
        a: "Wir messen zuerst und grenzen die undichte Stelle ein, bevor überhaupt etwas geöffnet wird. Ist eine Öffnung nötig, machen wir sie gezielt an der einen Stelle — und nur so groß wie nötig.",
      },
      {
        /** @freigabe — abgeleitet aus AGB § 8 (2). */
        q: "Finden Sie jedes Leck?",
        a: "Wir führen die Untersuchung fachgerecht nach dem anerkannten Stand der Technik durch und finden die Ursache in aller Regel. Eine pauschale Erfolgsgarantie geben wir bewusst nicht — verdeckte Leitungsverläufe und die technischen Grenzen der Messverfahren lassen das seriös nicht zu.",
      },
    ],
    related: ["wasserschadensanierung", "trocknung", "schimmelsanierung"],
    /** Wasser, das sich seinen Weg durch Fels sucht — genau das Prinzip, das
        eine Leitung im Mauerwerk unsichtbar macht. Trägt zur Aussage bei. */
    photo: "wasserlauf",
  },

  // ───────────────────────────────────────────────────────────────────
  {
    slug: "trocknung",
    nav: "Trocknung",
    h1: "Technische Trocknung",
    /** Kap. 4 wörtlich. */
    lead: "Mit eigenen, besonders leisen Maschinen — Sie können während der Trocknung normal wohnen und arbeiten.",
    metaTitle: "Technische Trocknung nach Wasserschaden — leise Geräte | AlpenDry",
    metaDescription: `Technische Trocknung für ${ORTE} und das Alpenvorland. Eigene, besonders leise Maschinen — wohnen und arbeiten Sie während der Trocknung normal weiter.`,
    blocks: [
      {
        /** @freigabe — fachlich üblich, ergänzt Kap. 4. */
        h: "Warum getrocknet werden muss",
        body: [
          "Nach einem Wasserschaden ist das Wasser sichtbar weg, lange bevor die Bausubstanz es ist. Feuchtigkeit sitzt in Estrich, Dämmschicht und Wandaufbau — dort, wo man sie weder sieht noch fühlt.",
          "Wird nicht oder zu kurz getrocknet, bleibt die Feuchte im Bauteil. Das Ergebnis sind Schimmel, geschädigter Estrich und ein zweiter Schaden, der teurer wird als der erste.",
        ],
      },
      {
        /** Kap. 4 wörtlich + AGB § 6 (1). */
        h: "Trocknen, ohne auszuziehen",
        body: [
          "Wir stellen geeignete Geräte entsprechend dem Schadensbild und den technischen Erfordernissen auf — eigene Maschinen, kein Warten auf Mietgeräte.",
          "Diese Geräte sind besonders leise. Das ist kein Detail: Trocknung dauert Tage bis Wochen, und in dieser Zeit sollen Sie normal wohnen und arbeiten können.",
        ],
      },
      {
        /** AGB § 6 (2) — Faktoren wörtlich. */
        h: "Wie lange dauert das?",
        body: [
          "Ehrlich: Das hängt vom Schaden ab. Die tatsächliche Trocknungsdauer wird bestimmt von:",
        ],
        list: [
          "Bauweise",
          "Materialbeschaffenheit",
          "Durchfeuchtungsgrad",
          "Raumklima",
          "Nutzung der Räume",
          "äußeren Bedingungen",
        ],
      },
      {
        /** AGB § 6 (3),(4) + § 22 — Mitwirkung. */
        h: "Was wir von Ihnen brauchen",
        body: [
          "Damit die Trocknung funktioniert, sollten die Geräte durchlaufen: nicht eigenmächtig umstellen oder ausschalten, Störungen bitte sofort melden, und Zugang für Kontrolle, Wartung und Abholung ermöglichen.",
          "Der Trocknungsverlauf wird laufend überwacht und dokumentiert. Am Ende steht eine Abschlussmessung — der Schaden ist erledigt, nachweisbar.",
        ],
      },
    ],
    /** Kap. 4 („eigene, besonders leise Maschinen … normal wohnen und
        arbeiten") — der Einwand, der bei Trocknung als Erstes kommt. */
    ctaLine:
      "Trocknung heißt nicht ausziehen: Unsere Maschinen sind besonders leise, Sie wohnen und arbeiten normal weiter. Rufen Sie an — wir sagen Ihnen, was auf Sie zukommt.",
    faq: [
      {
        /** Kap. 4 wörtlich belegt. */
        q: "Kann ich während der Trocknung in der Wohnung bleiben?",
        a: "Ja. Wir arbeiten mit eigenen, besonders leisen Maschinen — Sie können während der Trocknung normal wohnen und arbeiten.",
      },
      {
        /** @freigabe — abgeleitet aus AGB § 6 (4). */
        q: "Wer zahlt den Strom für die Geräte?",
        a: "Die Stromkosten für den Betrieb der Trocknungsgeräte trägt der Auftraggeber, sofern nichts anderes vereinbart ist. Bei Versicherungsschäden lässt sich der Verbrauch in der Regel über die Schadenabrechnung geltend machen — wir dokumentieren ihn entsprechend.",
      },
    ],
    related: ["wasserschadensanierung", "leckageortung", "schimmelsanierung"],
  },

  // ───────────────────────────────────────────────────────────────────
  {
    slug: "schimmelsanierung",
    nav: "Schimmelsanierung",
    h1: "Schimmelsanierung",
    /** Kap. 4 wörtlich. */
    lead: "Durch den zertifizierten Schimmelexperten — fachgerecht und mit Nachkontrolle.",
    metaTitle: "Schimmelsanierung am Alpenrand — zertifizierter Experte | AlpenDry",
    metaDescription: `Schimmelsanierung für ${ORTE} und das Alpenvorland. Ursache finden statt überstreichen — durch den zertifizierten Schimmelexperten, mit Nachkontrolle.`,
    blocks: [
      {
        /** @freigabe — Kernaussage aus Kap. 2 („Ursache statt Symptom"). */
        h: "Ursache finden statt überstreichen",
        body: [
          "Schimmel ist ein Symptom, keine Ursache. Er wächst, wo dauerhaft Feuchtigkeit ist — nach einem Wasserschaden, an einer Wärmebrücke oder an einer undichten Leitung.",
          "Wer ihn nur entfernt oder überstreicht, hat ihn in ein paar Monaten wieder. Deshalb messen wir zuerst, suchen die Feuchtequelle und beheben sie. Danach wird saniert.",
        ],
      },
      {
        /** Kap. 4 + Kap. 2 (zertifizierter Schimmelexperte, wörtlich belegt). */
        h: "Fachgerecht, nicht kosmetisch",
        body: [
          "Die Sanierung führt unser zertifizierter Schimmelexperte durch. Befallene Bereiche werden fachgerecht zurückgebaut, der Bereich gesichert und die Sanierung dokumentiert — versicherungstauglich.",
          "Zum Abschluss steht eine Nachkontrolle. Erst wenn die stimmt, ist die Sache erledigt.",
        ],
      },
      {
        /** @freigabe — fachlich üblich. */
        h: "Wann Sie uns rufen sollten",
        body: ["Nicht jeder dunkle Fleck ist ein Sanierungsfall. Ein Fachbetrieb gehört dazu, wenn:"],
        list: [
          "der Befall größer als etwa eine Handfläche ist",
          "Schimmel nach einem Wasserschaden auftritt",
          "er nach dem Entfernen wiederkommt",
          "die Ursache unklar ist",
          "empfindliche Personen im Haushalt leben",
        ],
      },
    ],
    /** Kap. 11, Anzeige 3 („Schimmel? Ursache finden statt überstreichen" /
        „Schimmel kommt wieder, solange die Feuchtequelle bleibt") — wörtlich. */
    ctaLine:
      "Schimmel kommt wieder, solange die Feuchtequelle bleibt: Ursache finden statt überstreichen. Rufen Sie an — wir messen, bevor wir sanieren.",
    faq: [
      {
        /** Kap. 4 wörtlich belegt. */
        q: "Warum kommt der Schimmel immer wieder?",
        a: "Weil die Feuchtequelle bleibt. Überstreichen beseitigt das Symptom, nicht die Ursache. Wir messen, finden die Ursache und sanieren fachgerecht durch den zertifizierten Schimmelexperten — mit Nachkontrolle.",
      },
      {
        /** @freigabe — abgeleitet aus Kap. 4 + Kap. 2. */
        q: "Zahlt die Versicherung die Schimmelsanierung?",
        a: "Wenn der Schimmel Folge eines versicherten Wasserschadens ist, in der Regel ja — wir dokumentieren den Zusammenhang und rechnen direkt mit der Versicherung ab. Bei Schimmel durch Bauschäden oder Lüftungsverhalten ist die Lage anders; wir sagen Ihnen offen, was wir einschätzen, und legen vorab einen Kostenvoranschlag vor.",
      },
    ],
    related: ["wasserschadensanierung", "trocknung", "leckageortung"],
  },

  // ───────────────────────────────────────────────────────────────────
  {
    slug: "hochwasser-praevention",
    nav: "Hochwasser-Prävention",
    h1: "Hochwasser-Prävention",
    /** Kap. 4 wörtlich. */
    lead: "Reinigung und Pflege der Außenanlagen, damit Starkregen und Hochwasser gar nicht erst Schäden anrichten.",
    metaTitle: "Hochwasser-Prävention am Alpenrand — Starkregen vorbeugen | AlpenDry",
    metaDescription: `Hochwasser-Prävention für ${ORTE} und das Alpenvorland. Außenanlagen prüfen und pflegen, bevor Starkregen zum Schaden wird.`,
    blocks: [
      {
        /** @freigabe — Kap. 2 nennt Hochwasser-Prävention als Zukunftsthema. */
        h: "Der Schaden, der nicht entsteht",
        body: [
          "Starkregen ist am Alpenrand keine Ausnahme mehr. Und anders als beim Rohrbruch kommt das Wasser hier von außen — durch Lichtschächte, über Kellerabgänge, aus überlasteten Abläufen oder einem Rückstau in der Kanalisation.",
          "Das Unangenehme daran: Diese Schäden kündigen sich an, aber niemand schaut hin, solange nichts passiert. Die Prävention ist ein Bruchteil dessen, was die Sanierung danach kostet.",
        ],
      },
      {
        /** Kap. 4 wörtlich + @freigabe (Aufzählung). */
        h: "Was wir prüfen und pflegen",
        body: [
          "Wir kümmern uns um Reinigung und Pflege der Außenanlagen, damit Starkregen und Hochwasser gar nicht erst zum Schaden werden:",
        ],
        list: [
          "Abläufe, Rinnen und Einläufe — frei und funktionsfähig",
          "Lichtschächte und Kellerabgänge",
          "Dachrinnen und Fallrohre",
          "Geländeführung rund ums Gebäude",
          "Hinweise zu Rückstausicherung und Schwachstellen",
        ],
      },
      {
        /** @freigabe — verbindet zur Kernleistung. */
        h: "Und wenn es doch passiert",
        body: [
          "Dann sind wir rund um die Uhr erreichbar. Sofortmaßnahmen, Trocknung, Sanierung und die Abwicklung mit der Versicherung — dieselbe Kette wie bei jedem Wasserschaden, mit einem Ansprechpartner.",
        ],
      },
    ],
    /** Kap. 4 („damit Starkregen und Hochwasser gar nicht erst Schäden
        anrichten") + Kap. 2 (Prävention als Teil des Spektrums). Als einzige
        Seite ohne Notfall — hier ist der Anruf Vorsorge, nicht Rettung. */
    ctaLine:
      "Der günstigste Wasserschaden ist der, der nie entsteht. Rufen Sie an — wir schauen uns Ihre Außenanlagen an, bevor der nächste Starkregen kommt.",
    faq: [
      {
        /** @freigabe — fachlich üblich. */
        q: "Wann ist der richtige Zeitpunkt dafür?",
        a: "Vor der Starkregensaison und nach dem Laubfall. Wichtiger als der Termin ist, dass es überhaupt regelmäßig passiert — ein verstopfter Ablauf fällt sonst genau dann auf, wenn er gebraucht wird.",
      },
      {
        /** @freigabe — abgeleitet aus Kap. 4. */
        q: "Zahlt die Versicherung Hochwasserschäden?",
        a: "Schäden durch Starkregen und Rückstau sind in der Regel nur über eine Elementarschadenversicherung gedeckt, nicht über die normale Gebäudeversicherung. Prüfen Sie Ihre Police — und lassen Sie es gar nicht erst so weit kommen.",
      },
    ],
    related: ["wasserschadensanierung", "trocknung"],
    /** Wasser in der Landschaft — das Thema dieser Seite ist genau das, was
        passiert, bevor es am Gebäude ankommt. */
    photo: "voralpensee",
  },
];

export function getServicePage(slug: string): ServicePage | undefined {
  return servicePages.find((p) => p.slug === slug);
}

/**
 * Vier harte Angaben, die auf jeder Leistungsseite unter dem Kopf stehen.
 *
 * Jede ist im Business Case belegt — bewusst KEINE Reaktionszeit-Zusage:
 * Kap. 5 nennt „unter 24 Stunden", aber als Messlatte für
 * Versicherungspartnerschaften, nicht als Zusage an jeden Besucher. Ein
 * Zeitversprechen auf der Website wäre eine Zusicherung, die die AGB nicht
 * decken — und im Streitfall genau das Eigentor, das dieses Projekt vermeidet.
 *
 * Ebenso ohne „Festpreis für die Ortung" (Kap. 11, Anzeige 2): Preisaussagen
 * sind ausdrücklich ausgeschlossen, und ob der Festpreis heute noch gilt, weiß
 * nur die Kundin.
 */
export const serviceFacts = [
  {
    /** Kap. 4 „24/7-Notfall-Service" (wörtlich). */
    value: "24/7",
    label: "Notdienst, rund um die Uhr erreichbar",
  },
  {
    /** Kundenangabe (Business Case Kap. 2 nennt 20 — die Kundin hat 25 bestätigt). */
    value: "25 Jahre",
    label: "Berufserfahrung von der Baustelle, nicht aus dem Hörsaal",
  },
  {
    /** Kap. 4 „Eigene Technik, eigener Fuhrpark" (wörtlich). */
    value: "Eigene Technik",
    label: "Eigene Maschinen und Fuhrpark — kein Warten auf Mietgeräte",
  },
  {
    /** Kap. 3 Zielgruppe 1 + Kap. 5 („Dokumentation — vollständig digital"). */
    value: "Digitale Akte",
    label: "Messprotokolle, Fotos und Berichte für die Versicherung",
  },
] as const;

/** Gemeinsamer Abschluss aller Leistungsseiten. @freigabe (Micro-Copy) */
export const servicePageCta = {
  eyebrow: "Einsatzgebiet",
  title: "Am Alpenrand zu Hause",
  body: `${region.note} Im Notfall erreichen Sie uns rund um die Uhr unter ${contact.phone}.`,
} as const;
