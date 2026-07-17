/**
 * AlpenDry — zentrale Textquelle
 * ------------------------------------------------------------------
 * ALLE sichtbaren Texte der Website stehen in dieser Datei.
 * Keine Strings in Komponenten. Änderungen am Wording passieren hier.
 *
 * HERKUNFT: AlpenDry_Business_Case.docx (Juli 2026).
 * Jede Passage trägt die Kapitel-Referenz, aus der sie stammt.
 *
 * BEWUSST NICHT ÜBERNOMMEN (interne Strategie, gehört nicht auf die Kundenseite):
 *   - Kap. 5  „KI-gestützte Akquise" — Vertriebsinterna gegenüber Versicherungen
 *   - Kap. 10 Tagesbudget 15–20 € — internes Werbebudget
 *   - Kap. 11 Anzeigentexte — Google-Ads-Copy, kein Seiteninhalt
 *              (enthält „Festpreis für die Ortung" — Preisaussage, nirgends übernommen)
 *   - Kap. 13 Wirtschaftlichkeit / Auftragswerte — interne Zahlen
 *   - Kap. 14 90-Tage-Umsetzungsplan — internes Projektmanagement
 *   - Kap. 2  „Spitzenpreise für Top-Service" — interne Preisstrategie
 *
 * FREIGABE NÖTIG: Passagen mit `@freigabe` sind aus belegten Fakten des
 * Business Case abgeleitet, stehen dort aber nicht wörtlich. Bitte prüfen.
 */

// ─────────────────────────────────────────────────────────────────────
// Stammdaten
// ─────────────────────────────────────────────────────────────────────

export const site = {
  name: "AlpenDry",
  legalName: "AlpenDry GmbH",
  /** Logo-Wortmarke: „Alpen" in snow, „Dry" in glacier. */
  wordmark: { first: "Alpen", second: "Dry" },
  subtitle: "WASSERSCHADENSANIERUNG",
  /**
   * Logo-Untertitel lang. Erscheint über dem Hero-Titel und im Footer.
   * „TROCKNUNG" auf Kundenwunsch ergänzt (Business Case nennt auf der
   * Titelseite nur Wasserschadensanierung · Lecksuche · Alpenland).
   *
   * „LECKAGEORTUNG" statt „LECKSUCHE": Kundenwunsch, klingt fachlicher.
   * Achtung SEO — „Lecksuche" ist der Begriff, den Kunden tatsächlich tippen
   * (Business Case Kap. 10 führt dafür eine eigene Ads-Kampagne). Er bleibt
   * deshalb in der Meta-Description und in `knowsAbout` (lib/jsonld.ts)
   * erhalten, nur eben nicht mehr in der sichtbaren Marken-Zeile.
   */
  subtitleLong: "WASSERSCHADENSANIERUNG · TROCKNUNG · LECKAGEORTUNG · ALPENLAND",
  /** Claim: kursiv, glacier, unterstrichen. */
  claim: "Sauber. Trocken. Sicher.",
  url: "https://www.alpendry.de",
  locale: "de_DE",
} as const;

export const contact = {
  phone: "+49 151 53402149",
  /** E.164 ohne Leerzeichen — für tel: und wa.me */
  phoneRaw: "+4915153402149",
  phoneHref: "tel:+4915153402149",
  whatsappNumber: "4915153402149",
  /** Kap. 7: „öffnet den Chat direkt beim persönlichen Ansprechpartner — mit vorbereiteter Nachricht." */
  whatsappMessage:
    "Hallo AlpenDry, ich habe einen Wasserschaden und brauche Hilfe. Mein Ort: ",
  email: "info@alpendry.de",
  emailHref: "mailto:info@alpendry.de",
  street: "Neu-Egling 33",
  postalCode: "82418",
  city: "Murnau a. Staffelsee",
  region: "Bayern",
  country: "DE",
  /**
   * Koordinaten des Weilers Neuegling (Quelle: OpenStreetMap/Nominatim,
   * Typ „hamlet", abgefragt 07/2026).
   *
   * Vorher stand hier das Ortszentrum von Murnau — gemessen 2,18 km entfernt.
   * Für das lokale Ranking ist das erheblich: Google gleicht die Koordinaten
   * mit dem Unternehmensprofil ab, und der Betrieb wirbt mit „kurzen
   * Anfahrtswegen" (Kap. 3). Der neue Wert liegt im richtigen Weiler.
   *
   * NOCH GENAUER GEHT: Nominatim kennt die Hausnummer Neu-Egling 33 nicht, das
   * hier ist der Ortsmittelpunkt — je nach Lage des Hofs ein paar hundert Meter
   * daneben. Wer es exakt will: Google Maps → Rechtsklick auf das Grundstück →
   * Koordinaten kopieren. Wichtig ist vor allem, dass sie mit dem
   * Google-Unternehmensprofil übereinstimmen.
   */
  geo: { lat: 47.6938, lng: 11.2202 },
  /** Kap. 4: „24/7-Notfall-Service […] rund um die Uhr" */
  availability: "24/7 erreichbar — auch nachts, am Wochenende und an Feiertagen",
} as const;

/**
 * Social Media.
 *
 * Als eigene Liste, nicht als Einzelfeld: Kommt ein zweiter Kanal dazu
 * (Facebook, LinkedIn), wird er hier eingetragen und erscheint automatisch —
 * ohne dass der Footer angefasst werden muss.
 *
 * Der Link speist zusätzlich `sameAs` im LocalBusiness-JSON-LD: Google nutzt
 * bestätigte Profile, um das Unternehmen als real zu erkennen — das zahlt
 * direkt auf das lokale Ranking ein (Business Case Kap. 8).
 */
export const social = [
  {
    label: "Instagram",
    /** Kundenangabe. */
    href: "https://www.instagram.com/alpendry_gmbh/",
    handle: "@alpendry_gmbh",
  },
] as const;

export const whatsappHref = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
  contact.whatsappMessage,
)}`;

// ─────────────────────────────────────────────────────────────────────
// Globale CTAs — Kap. 6: „Konsequent wiederholt — jeder Abschnitt der
// Seite endet mit derselben klaren Aufforderung."
// ─────────────────────────────────────────────────────────────────────

export const cta = {
  primary: { label: "Notruf", sublabel: contact.phone, href: contact.phoneHref },
  secondary: { label: "WhatsApp", sublabel: "Direkt zum Ansprechpartner", href: whatsappHref },
  form: { label: "Rückruf anfordern", href: "#kontakt" },
  /** Wiederholte Aufforderung nach jedem Abschnitt. @freigabe (Micro-Copy) */
  repeat: "Wasserschaden? Jede Minute zählt.",
} as const;

// ─────────────────────────────────────────────────────────────────────
// Hero — Kap. 2 (Kernsatz) + Kap. 3 (Einsatzgebiet für regionale Keywords)
// ─────────────────────────────────────────────────────────────────────

export const hero = {
  eyebrow: site.subtitleLong,
  /** Kap. 2 wörtlich: „Wasserschaden? Wir sind da. Jede Minute zählt." — einziges h1 der Seite. */
  h1: "Wasserschaden? Wir sind da. Jede Minute zählt.",
  /**
   * Trägt die regionalen Keywords. Orte aus Kap. 3.
   * @freigabe (Zusammenzug aus Kap. 3 + 4)
   *
   * Spricht bewusst BEIDE Zielgruppen an: „für Privatkunden und
   * Versicherungen". Vorher endete der Satz auf „in der Regel zahlt die
   * Versicherung" — reine Privatkundensicht, obwohl Versicherungen der
   * Hauptauftraggeber sind.
   */
  sub: "Wasserschadensanierung, Trocknung, Leckageortung und Schimmelsanierung zwischen München, Augsburg, Landsberg am Lech und dem Tegernsee. 24/7-Notdienst für Privatkunden und Versicherungen — Sanierung, Dokumentation und Abrechnung aus einer Hand.",
  claim: site.claim,
  /**
   * Auf Höhe der Wasserlinie — zwischen Ebene 1 und der Unterwasser-Ebene.
   *
   * Füllt die Strecke, auf der vorher NUR der Berg stand: Ebene 1 war bei 26 %
   * ausgeblendet, die Unterwasser-Ebene kam erst ab 52 %. Dazwischen lag ein
   * halber Bildschirm ohne Aussage.
   *
   * Kap. 4 wörtlich („Alles aus einer Hand" / „AlpenDry deckt die gesamte Kette
   * ab — vom ersten Notruf bis zur fertigen Wiederherstellung. Ein Anruf, ein
   * Ansprechpartner"). Passt auf die Kamerafahrt: oben der akute Schaden, an
   * der Wasserlinie die ganze Kette, darunter das volle Spektrum.
   */
  waterline: {
    line: "Alles aus einer Hand.",
    sub: "Vom ersten Notruf bis zur fertigen Wiederherstellung. Ein Anruf, ein Ansprechpartner.",
  },
  /**
   * Erscheint, wenn die Kamera unter die Wasserlinie taucht.
   * Beide Sätze aus Kap. 2 wörtlich (dort im Fließtext zusammenhängend).
   * Zahlt die Metapher ein: über Wasser die sichtbare Leistung,
   * unter Wasser das volle Spektrum.
   */
  underwater: {
    line: "Nur die Spitze des Eisbergs.",
    sub: "Dahinter steht ein komplettes Leistungsspektrum rund um Wasser, Feuchtigkeit und Hochwasser.",
  },
} as const;

// ─────────────────────────────────────────────────────────────────────
// Positionierung — Kap. 2
// ─────────────────────────────────────────────────────────────────────

export const positioning = {
  eyebrow: "Positionierung",
  h2: "Die Spitze des Eisbergs",
  /** Kap. 2 wörtlich. */
  lead: "Wasserschadensanierung und Trocknung sind nur die Spitze des Eisbergs. Dahinter steht ein komplettes Leistungsspektrum rund um Wasser, Feuchtigkeit und Hochwasser: von der Ortung unsichtbarer Leckschäden über zertifizierte Schimmelsanierung bis zur Pflege der Außenanlagen, damit Starkregen und Hochwasser gar nicht erst zum Schaden werden.",
  /** Kap. 2 wörtlich. */
  insurance:
    "Und das Entscheidende für den Kunden: In der Regel deckt die Versicherung die Kosten — AlpenDry wickelt alles direkt mit ihr ab.",
  pillars: [
    {
      /**
       * Kap. 2 „20 Jahre Erfahrung — Expertise, die man nicht studieren kann".
       *
       * ABWEICHUNG VOM BUSINESS CASE: Auf Kundenwunsch 25 statt 20 Jahre.
       * Der Business Case nennt an allen Stellen „20 Jahre" bzw. „Zwei
       * Jahrzehnte" (Kap. 2 und Kap. 9). Die Jahreszahl steht an mehreren
       * Stellen (hier, bei `trust.badges` und in der Metadata-Description der
       * Startseite) — bei einer erneuten Änderung alle drei mitziehen.
       */
      title: "25 Jahre Erfahrung",
      body: "25 Jahre Berufserfahrung, zertifizierter Schimmelexperte, unzählige gelöste Schadensfälle. Diese Kompetenz kommt nicht aus dem Hörsaal, sondern von der Baustelle — Erfahrung statt Theorie. Das Ergebnis: schnelle, treffsichere Entscheidungen und Reaktionszeiten, die im Notfall den Unterschied machen.",
    },
    {
      /** Kap. 2 „Von Mensch zu Mensch" */
      title: "Von Mensch zu Mensch",
      body: "Ein Ansprechpartner durch das gesamte Projekt — von A bis Z. Keine Hotline, kein Weiterreichen, keine wechselnden Zuständigkeiten. Der Kunde hat vom ersten Anruf bis zur Übergabe denselben Menschen an seiner Seite.",
    },
    {
      /** Kap. 2 „Der Kerngedanke" */
      title: "Ruhe im Ausnahmefall",
      body: "Ein Wasserschaden ist für den Betroffenen eine Ausnahmesituation. AlpenDry ist nicht „noch ein Sanierungsbetrieb“, sondern der ruhige, erfahrene Experte, der in genau diesem Moment Sicherheit gibt.",
    },
  ],
} as const;

// ─────────────────────────────────────────────────────────────────────
// Leistungen — Kap. 4
// ─────────────────────────────────────────────────────────────────────

export const services = {
  eyebrow: "Leistungen",
  h2: "Alles aus einer Hand",
  /** Kap. 4 wörtlich. */
  lead: "AlpenDry deckt die gesamte Kette ab — vom ersten Notruf bis zur fertigen Wiederherstellung. Ein Anruf, ein Ansprechpartner, keine Koordination zwischen Gewerken.",
  /** Kap. 4, Liste wörtlich. */
  items: [
    {
      title: "Leckageortung",
      body: "Auch unsichtbare Leckschäden werden gefunden und beseitigt: zerstörungsarm, mit modernster Messtechnik.",
    },
    {
      title: "Technische Trocknung",
      body: "Mit eigenen, besonders leisen Maschinen — Kunden können während der Trocknung normal wohnen und arbeiten.",
    },
    {
      title: "Schimmelsanierung",
      body: "Durch den zertifizierten Schimmelexperten, fachgerecht und mit Nachkontrolle.",
    },
    {
      title: "Hochwasser-Prävention",
      body: "Reinigung und Pflege der Außenanlagen, damit Starkregen und Hochwasser gar nicht erst Schäden anrichten.",
    },
    {
      title: "Dienstleistungen in jeglicher Hinsicht",
      body: "Alles rund um das Thema Wasser, Feuchtigkeit und Gebäudeschutz.",
    },
    {
      title: "24/7-Notfall-Service",
      body: "Sofortmaßnahmen zur Schadensbegrenzung, rund um die Uhr.",
    },
  ],
  /**
   * Kap. 4 „Eigene Technik, eigener Fuhrpark".
   *
   * FAKTENKORREKTUR (Kundin): Der Business Case behauptet „keine Abhängigkeit
   * von Subunternehmern". Tatsächlich arbeitet AlpenDry mit Partnerbetrieben —
   * die Organisation läuft über AlpenDry, die Ausführung bei Bedarf extern.
   * Die Marketing-Aussage war also zu absolut; die eigenen AGB (§ 3 Abs. 4)
   * sehen den Einsatz von Fachunternehmen ausdrücklich vor. Neu formuliert,
   * ohne das Versprechen „ein Ansprechpartner" aufzugeben — das bleibt wahr,
   * weil die Koordination bei AlpenDry liegt.
   */
  fleet: {
    title: "Eigene Technik, eine Regie",
    body: "Für Sofortmaßnahmen, Trocknung und Messtechnik kommen eigene Maschinen und der eigene Fuhrpark zum Einsatz — kein Warten auf Mietgeräte. Wo Spezialgewerke nötig sind, arbeiten wir mit eingespielten Partnerbetrieben. Die Organisation, die Terminplanung und die Verantwortung bleiben dabei bei uns: Sie haben einen Ansprechpartner, nicht fünf.",
  },
  /**
   * Kap. 4 „Die Versicherung zahlt — AlpenDry kümmert sich".
   *
   * Adressiert die Privatkundensicht (Schaden ist gedeckt, wir wickeln ab).
   * Die zweite Zielgruppe — Versicherungen als Hauptauftraggeber — trägt der
   * Hero-Untertitel („für Privatkunden und Versicherungen") und die FAQ
   * „Wer zahlt die Trocknung?", die beide Fälle beantwortet.
   */
  insurance: {
    /**
     * Business Case: „Die Versicherung zahlt — AlpenDry kümmert sich".
     * Abgeschwächt auf Kundenwunsch: Der Originaltitel verspricht absolut, was
     * der eigene Fließtext schon relativiert („in der Regel") — und was nicht
     * immer stimmt (Verschleiß, grobe Fahrlässigkeit, ungedeckte Fälle). Ein
     * absolutes Zahlungsversprechen wäre als Werbeaussage angreifbar.
     * „AlpenDry kümmert sich" entfällt im Titel, weil der Absatz es ohnehin
     * ausführt — und der Titel sonst über drei Zeilen liefe.
     */
    title: "In der Regel zahlt die Versicherung",
    body: "Bei versicherten Schäden sind die Kosten in der Regel vollständig gedeckt. AlpenDry übernimmt die komplette Kommunikation — Schadensmeldung, Dokumentation, Abstimmung mit dem Sachverständigen, Abrechnung. Sie haben einen festen Ansprechpartner von A bis Z und müssen sich um nichts kümmern. Ist ein Schaden einmal nicht gedeckt, sagen wir das offen und legen vorab einen nachvollziehbaren Kostenvoranschlag vor.",
    pullquote:
      "Weniger Stress für den Kunden. Weniger Aufwand für die Versicherung. Genau dazwischen liegt der Wert von AlpenDry.",
  },
} as const;

// ─────────────────────────────────────────────────────────────────────
// Einsatzgebiet — Kap. 3
// ─────────────────────────────────────────────────────────────────────

export const region = {
  eyebrow: "Einsatzgebiet",
  h2: "Am Alpenrand zu Hause",
  /** Kap. 3 wörtlich. */
  lead: "Südlich von München bis Augsburg, Landsberg am Lech und zum Tegernsee — der gesamte Alpenrand mit kurzen Anfahrtswegen. Mit eigenem Fuhrpark und eigener Technik ist AlpenDry in diesem Gebiet schneller vor Ort als jeder überregionale Anbieter.",
  /**
   * Orte aus Kap. 3 + Firmensitz. Garmisch-Partenkirchen und Füssen auf
   * Kundenwunsch ergänzt — sie speisen auch `areaServed` im LocalBusiness-
   * JSON-LD und damit das lokale Ranking.
   */
  places: [
    "München",
    "Augsburg",
    "Landsberg am Lech",
    "Tegernsee",
    "Garmisch-Partenkirchen",
    "Füssen",
    "Murnau a. Staffelsee",
    "Alpenvorland",
  ],
  /** Kap. 1: „echte regionale Expertise — vom Staffelsee bis ins Alpenvorland." */
  /**
   * Kap. 1: „echte regionale Expertise — vom Staffelsee bis ins Alpenvorland."
   * Garmisch-Partenkirchen und Füssen auf Kundenwunsch ergänzt — der Business
   * Case nennt sie nicht, sie gehören aber zum Einsatzgebiet.
   */
  note: "Echte regionale Expertise — vom Staffelsee über Garmisch-Partenkirchen und Füssen bis ins Alpenvorland.",
} as const;

// ─────────────────────────────────────────────────────────────────────
// Ablauf — Kap. 12 (6 Schritte, wörtlich)
// ─────────────────────────────────────────────────────────────────────

export const process = {
  eyebrow: "Der Ablauf",
  h2: "Vom Anruf bis zur Übergabe",
  /** Kap. 12 wörtlich. */
  lead: "Ein klar definierter Prozess ist das Rückgrat der Qualität. So läuft jeder Auftrag bei AlpenDry.",
  steps: [
    {
      title: "Der Anruf",
      body: "Erreichbar rund um die Uhr. Aufnahme der Schadensituation, erste Hinweise zur Schadensbegrenzung noch am Telefon, verbindliche Zusage zum Eintreffen.",
    },
    {
      title: "Sofortmaßnahmen vor Ort",
      body: "Schnellstmögliche Anfahrt. Wasser stoppen, betroffene Bereiche sichern, Folgeschäden begrenzen — noch bevor die eigentliche Sanierung beginnt.",
    },
    {
      title: "Analyse & Feuchtemessung",
      body: "Systematische Messung aller betroffenen Bauteile, Fotodokumentation, schriftliche Ersteinschätzung. Der Kunde weiß noch am selben Tag, woran er ist.",
    },
    {
      title: "Sanierungsplan & Freigabe",
      body: "Klarer Maßnahmenplan mit Zeitrahmen und Kosten. Bei Versicherungsfällen: direkte Abstimmung mit der Schadenabteilung, damit der Kunde nicht zwischen den Stühlen sitzt.",
    },
    {
      title: "Trocknung & Sanierung",
      body: "Aufbau der Trocknungstechnik, laufende Überwachung, dokumentierter Trocknungsverlauf. Bei Bedarf Schimmelsanierung und Wiederherstellung.",
    },
    {
      title: "Abnahme & Übergabe",
      body: "Abschlussmessung, Abnahmeprotokoll, vollständiger digitaler Bericht an Kunde und Versicherung. Der Schaden ist erledigt — nachweisbar.",
    },
  ],
  /** Kap. 12 wörtlich. */
  pullquote:
    "Der Kunde erlebt keinen Handwerkereinsatz. Er erlebt, wie ein Problem verschwindet.",
} as const;

// ─────────────────────────────────────────────────────────────────────
// Vertrauen — Kap. 9 + Kap. 2
// ─────────────────────────────────────────────────────────────────────

export const trust = {
  eyebrow: "Vertrauen",
  h2: "Warum Kunden AlpenDry rufen",
  /** Kap. 9 „Der Presseartikel — der Ritterschlag": Siegel-Wortlaut exakt. */
  pressSeal: "Bekannt aus der Presse.",
  /**
   * TODO(freigabe): Das Pressesiegel darf laut Kap. 9 erst erscheinen, WENN der
   * Artikel platziert ist („ab diesem Moment darf die Website das Siegel tragen").
   * Steht daher auf `false`. Nach Erscheinen des Artikels auf `true` setzen und
   * `pressArticleUrl` mit der Quelle füllen — ein Siegel ohne Beleg ist
   * wettbewerbsrechtlich angreifbar (§ 5 UWG, Irreführung).
   */
  pressSealActive: false,
  pressArticleUrl: "",
  /**
   * TODO(freigabe): Bewertungszahl und Schnitt sind PLATZHALTER.
   * Kap. 9 beschreibt den Aufbau von Google-Bewertungen, nennt aber keine Zahlen.
   * Vor Livegang mit den echten Werten aus dem Google-Unternehmensprofil füllen
   * — oder `reviewsActive: false` setzen, bis Bewertungen vorliegen.
   * Erfundene Bewertungszahlen sind irreführende Werbung.
   */
  reviewsActive: false,
  reviews: {
    rating: 0,
    count: 0,
    label: "Google-Bewertungen",
    href: "",
  },
  /** Kap. 2 / Kap. 9 — belegte Fakten. */
  badges: [
    {
      /** Jahreszahl auf Kundenwunsch 25 — siehe Hinweis bei `positioning.pillars`. */
      title: "25 Jahre Erfahrung",
      body: "25 Jahre Berufserfahrung am Bau — Erfahrung statt Theorie.",
    },
    {
      title: "Zertifizierter Schimmelexperte",
      body: "Schimmelsanierung fachgerecht, dokumentiert und mit Nachkontrolle.",
    },
    {
      title: "24/7-Notdienst",
      body: "Erreichbar rund um die Uhr — auch nachts, am Wochenende und an Feiertagen.",
    },
    {
      /** Siehe Faktenkorrektur bei `services.fleet` — keine Subunternehmer-Absage mehr. */
      title: "Eigene Technik, eine Regie",
      body: "Eigene Maschinen für Trocknung und Messtechnik. Spezialgewerke über feste Partner — organisiert und verantwortet von uns.",
    },
  ],
} as const;

// ─────────────────────────────────────────────────────────────────────
// FAQ — Fragen aus Kap. 8 (AEO). Antworten aus belegten Fakten abgeleitet.
// ─────────────────────────────────────────────────────────────────────

/**
 * WICHTIG: Kap. 8 nennt die Leitfragen („Was tun bei einem Wasserschaden?",
 * „Wer zahlt die Trocknung?"), beantwortet sie aber NICHT. Die Antworten unten
 * sind ausschließlich aus belegten Aussagen anderer Kapitel gebaut — Quelle je
 * Antwort annotiert. Keine Preise, keine Fristen, keine erfundenen Zusagen.
 * Bitte fachlich prüfen und freigeben.
 */
export const faq = {
  eyebrow: "Häufige Fragen",
  h2: "Was Sie jetzt wissen müssen",
  items: [
    {
      /** @freigabe — abgeleitet aus Kap. 12 Schritt 1 + 2. */
      q: "Was tun bei einem Wasserschaden?",
      a: "Zuerst die Wasserzufuhr stoppen und, wenn gefahrlos möglich, den Strom in den betroffenen Bereichen abschalten. Dann rufen Sie uns an — wir sind rund um die Uhr erreichbar und geben Ihnen noch am Telefon die ersten Hinweise zur Schadensbegrenzung, dazu eine verbindliche Zusage zum Eintreffen. Vor Ort stoppen wir das Wasser, sichern die betroffenen Bereiche und begrenzen Folgeschäden, noch bevor die eigentliche Sanierung beginnt.",
    },
    {
      /**
       * @freigabe — abgeleitet aus Kap. 2 + Kap. 4 „Die Versicherung zahlt"
       * und Kap. 3 „Zielgruppe 1".
       * Beantwortet beide Fälle: Privatkunde mit Versicherungsschaden und
       * Auftrag direkt vom Versicherer/Schadensteuerer. Vorher nur der erste.
       */
      q: "Wer zahlt die Trocknung?",
      a: "Bei einem versicherten Leitungswasserschaden übernimmt in der Regel die Gebäude- oder Hausratversicherung die Kosten — wir rechnen direkt mit ihr ab und übernehmen Schadensmeldung, Dokumentation und die Abstimmung mit dem Sachverständigen. Sie haben einen festen Ansprechpartner und müssen sich um nichts kümmern. Kommt der Auftrag direkt von einer Versicherung oder einem Schadensteuerer, rechnen wir nach deren Vorgaben ab und liefern die Dokumentation für die Schadenakte gleich mit. Ist ein Schaden nicht gedeckt, sagen wir das offen und erstellen vorab einen nachvollziehbaren Kostenvoranschlag.",
    },
    {
      /** @freigabe — abgeleitet aus Kap. 4 „Technische Trocknung" (wörtlich belegt). */
      q: "Kann ich während der Trocknung in der Wohnung bleiben?",
      a: "Ja. Wir arbeiten mit eigenen, besonders leisen Maschinen — Sie können während der Trocknung normal wohnen und arbeiten.",
    },
    {
      /**
       * @freigabe — abgeleitet aus Kap. 4 („zerstörungsarm, mit modernster
       * Messtechnik", wörtlich belegt) und AGB § 8 (Öffnungen können nötig
       * werden, nur im erforderlichen Umfang).
       *
       * Die Antwort beginnt auf Kundenwunsch OHNE Verneinung — kein „Nein, in
       * aller Regel nicht" voran. Sie erklärt direkt das Vorgehen; das „nicht
       * aufreißen" ergibt sich daraus.
       *
       * Wortlaut mit der Fassung in services-pages.ts abgestimmt halten: Es ist
       * dieselbe Frage an zwei Orten (Startseiten-FAQ und Leistungsseite).
       */
      q: "Muss für die Leckageortung die Wand aufgerissen werden?",
      a: "Wir messen zuerst und finden das Leck, ohne die Wand zu öffnen — auch dann, wenn nichts zu sehen ist. Erst wenn wir wissen, wo genau es sitzt, öffnen wir gezielt diese eine Stelle. Aufstemmen auf Verdacht gibt es bei uns nicht.",
    },
    {
      /** @freigabe — abgeleitet aus Kap. 3 (wörtlich belegt). */
      q: "In welchem Gebiet sind Sie im Einsatz?",
      a: "Südlich von München bis Augsburg, Landsberg am Lech und zum Tegernsee — der gesamte Alpenrand mit kurzen Anfahrtswegen. Mit eigenem Fuhrpark und eigener Technik sind wir in diesem Gebiet schneller vor Ort als überregionale Anbieter.",
    },
    {
      /** @freigabe — abgeleitet aus Kap. 4 „Schimmelsanierung" (wörtlich belegt). */
      q: "Warum kommt der Schimmel immer wieder?",
      a: "Weil die Feuchtequelle bleibt. Überstreichen beseitigt das Symptom, nicht die Ursache. Wir messen, finden die Ursache und sanieren fachgerecht durch den zertifizierten Schimmelexperten — mit Nachkontrolle.",
    },
  ],
} as const;

// ─────────────────────────────────────────────────────────────────────
// Kontakt — Kap. 7
// ─────────────────────────────────────────────────────────────────────

export const contactSection = {
  eyebrow: "Kontakt",
  h2: "Drei Wege zu uns",
  /** Kap. 7 wörtlich (leicht gekürzt auf Kundensicht). */
  lead: "Das Telefon für den Akutfall, WhatsApp für den schnellen Draht, das Formular für die strukturierte Anfrage. Alle direkt, alle ohne Umwege.",
  /** Kap. 7 wörtlich. */
  formTitle: "Ausgefüllt in unter einer Minute",
  formLead:
    "Im Notfall füllt niemand zehn Felder aus. Wir fragen nur ab, was für eine schnelle Reaktion nötig ist.",
  /** Kap. 7, Feldbeschriftungen + Begründungen wörtlich. */
  fields: {
    name: { label: "Name", help: "" },
    phone: { label: "Telefonnummer", help: "Für den sofortigen Rückruf" },
    place: { label: "Ort / Postleitzahl", help: "Für Einsatzplanung und Anfahrtszeit" },
    damage: {
      label: "Art des Schadens",
      /** Kap. 7 wörtlich: „akuter Wasserschaden · Lecksuche · Schimmel · Sonstiges" */
      options: ["Akuter Wasserschaden", "Leckageortung", "Schimmel", "Sonstiges"],
    },
    description: {
      label: "Kurzbeschreibung",
      help: "Ein Bild vom Schaden sagt mehr als jede Beschreibung",
    },
    photo: { label: "Foto anhängen", help: "Optional · JPG, PNG oder HEIC · max. 10 MB" },
    consent: {
      /** DSGVO Art. 6 Abs. 1 lit. a — Einwilligung. @freigabe (Rechtstext) */
      label:
        "Ich habe die Datenschutzerklärung gelesen und stimme der Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage zu.",
    },
  },
  submit: "Anfrage senden",
  submitting: "Wird gesendet …",
  /** @freigabe (Micro-Copy) */
  success: "Danke — Ihre Anfrage ist bei uns. Wir melden uns umgehend zurück.",
  error:
    "Das hat leider nicht geklappt. Bitte rufen Sie uns direkt an — wir sind rund um die Uhr erreichbar.",
  /** Kap. 7 „Der WhatsApp-Button" */
  whatsapp: {
    title: "Der direkte Draht",
    body: "Ein Klick öffnet den Chat direkt beim persönlichen Ansprechpartner — mit vorbereiteter Nachricht. Kein Callcenter, keine Warteschleife, kein Umweg. Fotos und Videos direkt im Chat: Der Techniker sieht den Schaden, bevor er losfährt.",
  },
  phoneCard: {
    title: "Notruf — rund um die Uhr",
    body: "Im Akutfall zählt jede Minute. Ein Anruf genügt.",
  },
} as const;

// ─────────────────────────────────────────────────────────────────────
// Navigation & Footer
// ─────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────
// Exit-Banner
// ─────────────────────────────────────────────────────────────────────

/**
 * @freigabe — Micro-Copy. Bewusst ohne Anreiz/Rabatt: Der Business Case nennt
 * keine solche Zusage, und eine erfundene wäre geschäftlich bindend.
 * Greift stattdessen den belegten Kernsatz aus Kap. 2 auf.
 */
export const exitBanner = {
  eyebrow: "Bevor Sie gehen",
  title: "Wasserschaden? Jede Minute zählt.",
  body: "Im Akutfall entscheidet die Reaktionszeit über den Folgeschaden. Wir sind rund um die Uhr erreichbar — ein Anruf genügt.",
} as const;

/**
 * Die Hauptnavigation steht in lib/nav.ts — sie führt Seitenstruktur und
 * Leistungsseiten zusammen, was hier einen Import-Zirkel erzeugen würde
 * (services-pages liest bereits aus content).
 */

export const footer = {
  /** Kap. 1 wörtlich. */
  tagline:
    "AlpenDry ist der Spezialist für Wasserschadensanierung und Leckageortung am Alpenrand.",
  legal: [
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
    { label: "AGB", href: "/agb" },
    { label: "Cookies", href: "/cookies" },
  ],
  copyright: `© ${new Date().getFullYear()} AlpenDry GmbH`,
} as const;
