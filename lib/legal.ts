import { contact, site } from "./content";

/**
 * Rechtstexte — Impressum, Datenschutz, AGB, Cookies.
 *
 * Bewusst getrennt von content.ts: andere Quelle (Mandant/Anwalt statt
 * Business Case) und anderer Lebenszyklus.
 *
 * Alle Texte stammen aus der Zulieferung der Kundin (Stand 2026).
 *
 * ⚠️ ABWEICHUNGEN VON DER ZULIEFERUNG — bitte gegenlesen:
 *
 * 1. HOSTING (Datenschutz §7): Die anwaltliche Vorlage nannte „Wix.com Ltd.,
 *    Tel Aviv, Israel" — sie entstand für den alten Wix-Auftritt. Diese Website
 *    läuft auf Next.js bei IONOS; von der Kundin bestätigt. Ein falsch
 *    benannter Hoster samt erfundener Drittlandübermittlung nach Israel wäre
 *    eine unrichtige Pflichtangabe und abmahnbar. Ersetzt durch IONOS SE.
 *    ERLEDIGT — hier nur noch als Historie, damit niemand den Wix-Absatz aus
 *    der alten Vorlage „zurückrepariert".
 *
 * 2. GOOGLE ANALYTICS (§9) / MAPS (§10): Beide sind derzeit NICHT eingebunden.
 *    Die Abschnitte bleiben stehen, weil der Consent-Unterbau vorbereitet ist
 *    und beide nach Einwilligung nachgerüstet werden sollen. Solange keine
 *    Mess-ID hinterlegt ist, findet keine Verarbeitung statt.
 *
 * 3. BILDNACHWEIS (Impressum): neu ergänzt, stand nicht in der Zulieferung.
 *    Nötig geworden, weil auf „Bisherige Arbeiten" KI-Bilder stehen — ab
 *    02.08.2026 greift dafür Art. 50 Abs. 4 KI-VO (EU 2024/1689). Die
 *    Kennzeichnung sitzt zusätzlich an jedem Bild selbst; die Verordnung
 *    verlangt sie beim ersten Ansehen, nicht versteckt im Impressum.
 *
 * 4. Rechtstexte sind kein Rechtsrat. Vor Livegang von fachkundiger Stelle
 *    prüfen lassen — insbesondere die AGB-Klauseln zu Haftung und
 *    Gerichtsstand gegenüber Verbrauchern.
 */

export type LegalBlock = {
  readonly h: string;
  readonly body: ReadonlyArray<
    { readonly t: "p"; readonly text: string } | { readonly t: "ul"; readonly items: readonly string[] }
  >;
};

const ADDRESS = [site.legalName, contact.street, `${contact.postalCode} ${contact.city}`];

// ─────────────────────────────────────────────────────────────────────
// Impressum
// ─────────────────────────────────────────────────────────────────────

export const impressum = {
  title: "Impressum",
  updated: "Stand: 2026",
  blocks: [
    {
      h: "Angaben gemäß § 5 DDG",
      body: [
        { t: "p", text: site.legalName },
        { t: "p", text: contact.street },
        { t: "p", text: `${contact.postalCode} ${contact.city}` },
      ],
    },
    {
      h: "Vertreten durch die Geschäftsführer",
      body: [{ t: "p", text: "Kathrin Horn, Markus Sedlak" }],
    },
    {
      h: "Kontakt",
      body: [
        { t: "p", text: `Telefon: ${contact.phone}` },
        { t: "p", text: `E-Mail: ${contact.email}` },
      ],
    },
    {
      h: "Registereintrag",
      body: [
        { t: "p", text: "Eingetragen im Handelsregister." },
        { t: "p", text: "Registergericht: Amtsgericht München" },
        { t: "p", text: "Registernummer: HRB 313716" },
      ],
    },
    {
      h: "Umsatzsteuer-Identifikationsnummer",
      body: [
        { t: "p", text: "Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:" },
        { t: "p", text: "DE463436069" },
      ],
    },
    {
      h: "Gerichtsstand",
      body: [{ t: "p", text: "Amtsgericht München" }],
    },
    {
      h: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
      body: [
        { t: "p", text: "Kathrin Horn, Markus Sedlak" },
        { t: "p", text: contact.street },
        { t: "p", text: `${contact.postalCode} ${contact.city}` },
      ],
    },
    {
      h: "Verbraucherstreitbeilegung",
      body: [
        {
          t: "p",
          text: "Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
        },
      ],
    },
    /**
     * BILDNACHWEIS — neu, stand nicht in der anwaltlichen Zulieferung.
     *
     * Nötig geworden, weil die Seite „Bisherige Arbeiten" KI-Bilder zeigt. Er
     * leistet zweierlei:
     *
     * 1. § 5 UWG — er sagt offen, dass die Bilder keinen konkreten Auftrag
     *    zeigen. Ohne das läsen sie sich auf einer Seite dieses Namens als
     *    eigene Einsätze.
     *
     * 2. § 13 UrhG — er benennt die Herkunft der übrigen Bilder (Fotos der
     *    Kundin, eigens berechnetes Bergrendering), damit kein fremdes Werk
     *    vermutet wird.
     *
     * ⚠️ DIES IST DIE EINZIGE KI-OFFENLEGUNG DER SEITE.
     * Die Kennzeichnung an den Bildern selbst wurde auf Kundenwunsch entfernt.
     * Art. 50 Abs. 4 KI-VO (EU 2024/1689) gilt ab 02.08.2026 und verlangt sie
     * beim ersten Ansehen — ein Impressumshinweis genügt dafür nicht. Der
     * Absatz hier ist die Ergänzung, nicht der Ersatz. Reaktivieren:
     * `works.symbolLabel` zurück in die figcaption (app/arbeiten/page.tsx).
     *
     * ⚠️ Ebenfalls offen: die Markennamen auf den KI-Bildern (CORROVENTA,
     * TROTEC, SEWERIN, LGR — siehe lib/works.ts). Bleiben sie, gehört ein Satz
     * zu Fremdmarken hierher.
     */
    {
      h: "Bildnachweis",
      body: [
        {
          t: "p",
          text: "Die Fotos aus dem Einsatzgebiet (Alpenpanorama, See, Wasserlauf) stammen von der AlpenDry GmbH.",
        },
        {
          t: "p",
          text: 'Die Abbildungen auf der Seite „Bisherige Arbeiten" wurden mit Künstlicher Intelligenz erzeugt. Sie zeigen typische Situationen unserer Arbeit — keinen konkreten Auftrag und keine tatsächlich vorhandenen Geräte oder Räume.',
        },
        {
          t: "p",
          text: "Die dreidimensionale Bergdarstellung auf der Startseite wurde eigens für diese Website berechnet.",
        },
      ],
    },
  ] satisfies readonly LegalBlock[],
} as const;

// ─────────────────────────────────────────────────────────────────────
// Datenschutzerklärung
// ─────────────────────────────────────────────────────────────────────

export const datenschutz = {
  title: "Datenschutzerklärung",
  updated: "Stand: 2026",
  intro:
    "Der Schutz Ihrer persönlichen Daten ist uns wichtig. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften, insbesondere der Datenschutz-Grundverordnung (DSGVO) und dem Bundesdatenschutzgesetz (BDSG).",
  blocks: [
    {
      h: "1. Datenschutz auf einen Blick",
      body: [
        {
          t: "p",
          text: "Diese Datenschutzerklärung informiert Sie darüber, welche personenbezogenen Daten wir bei Nutzung unserer Website und im Rahmen unserer Dienstleistungen verarbeiten.",
        },
      ],
    },
    {
      h: "2. Verantwortlicher",
      body: [
        {
          t: "p",
          text: "Verantwortlicher für die Verarbeitung personenbezogener Daten gemäß Art. 4 Nr. 7 DSGVO ist:",
        },
        ...ADDRESS.map((l) => ({ t: "p" as const, text: l })),
        { t: "p", text: `E-Mail: ${contact.email}` },
      ],
    },
    {
      h: "3. Verarbeitung personenbezogener Daten bei Kontaktaufnahme",
      body: [
        {
          t: "p",
          text: "Wenn Sie mit uns per E-Mail, Telefon oder über unser Kontaktformular Kontakt aufnehmen, verarbeiten wir die von Ihnen übermittelten Daten zur Bearbeitung Ihrer Anfrage. Dies können insbesondere sein:",
        },
        {
          t: "ul",
          items: [
            "Name",
            "Telefonnummer",
            "E-Mail-Adresse",
            "Anschrift",
            "Informationen zum Schadenfall",
            "übermittelte Bilder oder Dokumente",
          ],
        },
        {
          t: "p",
          text: "Die Verarbeitung erfolgt zur Bearbeitung Ihrer Anfrage, zur Angebotserstellung sowie gegebenenfalls zur Durchführung eines Vertragsverhältnisses.",
        },
        { t: "p", text: "Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO." },
      ],
    },
    {
      h: "4. Datenverarbeitung im Rahmen unserer Leistungen",
      body: [
        { t: "p", text: "Im Rahmen unserer Tätigkeiten im Bereich:" },
        {
          t: "ul",
          items: [
            "Wasserschadensanierung",
            "technische Trocknung",
            "Leckortung",
            "Thermographie",
            "Schadensaufnahme",
            "Wiederherstellungsarbeiten",
            "Vermietung technischer Geräte",
          ],
        },
        { t: "p", text: "verarbeiten wir erforderliche Kunden- und Objektdaten. Dazu können gehören:" },
        {
          t: "ul",
          items: [
            "Kundendaten",
            "Objektinformationen",
            "Schadendaten",
            "technische Messwerte",
            "Dokumentationen und Fotos",
          ],
        },
        {
          t: "p",
          text: "Die Verarbeitung erfolgt zur Durchführung und Dokumentation unserer beauftragten Leistungen.",
        },
        { t: "p", text: "Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO." },
      ],
    },
    {
      h: "5. Schadensfotos und Dokumentationen",
      body: [
        {
          t: "p",
          text: "Bei Schadensfällen können Fotos, Messwerte und technische Dokumentationen erstellt werden. Diese dienen ausschließlich:",
        },
        {
          t: "ul",
          items: [
            "der Schadensermittlung",
            "der Dokumentation unserer Arbeiten",
            "der Abstimmung mit Versicherungen und Sachverständigen",
            "der Nachweisführung gegenüber Auftraggebern",
          ],
        },
        {
          t: "p",
          text: "Eine Veröffentlichung oder Nutzung zu Werbezwecken erfolgt nur mit ausdrücklicher Zustimmung.",
        },
      ],
    },
    {
      h: "6. E-Mail-Kommunikation über IONOS",
      body: [
        { t: "p", text: "Unsere geschäftliche Kommunikation erfolgt über:" },
        { t: "p", text: "IONOS SE, Elgendorfer Straße 57, 56410 Montabaur" },
        {
          t: "p",
          text: "Bei Kontaktaufnahme per E-Mail werden die übermittelten Daten zur Bearbeitung Ihrer Anfrage und zur Kommunikation verarbeitet.",
        },
      ],
    },
    {
      /**
       * KORRIGIERT: Die Vorlage nannte hier Wix.com Ltd. (Tel Aviv, Israel).
       * Diese Website läuft auf Next.js bei IONOS — der Wix-Absatz stammt vom
       * alten Auftritt. Falscher Hoster = unrichtige Pflichtangabe.
       */
      h: "7. Hosting der Website",
      body: [
        { t: "p", text: "Unsere Website wird bereitgestellt über:" },
        { t: "p", text: "IONOS SE, Elgendorfer Straße 57, 56410 Montabaur" },
        {
          t: "p",
          text: "Beim Besuch unserer Website können technische Daten verarbeitet werden, insbesondere:",
        },
        {
          t: "ul",
          items: [
            "IP-Adresse",
            "Datum und Uhrzeit des Zugriffs",
            "Browserinformationen",
            "Betriebssystem",
            "technische Nutzungsdaten",
          ],
        },
        {
          t: "p",
          text: "Die Verarbeitung erfolgt zur sicheren Bereitstellung und technischen Verbesserung unserer Website. Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren Betrieb (Art. 6 Abs. 1 lit. f DSGVO). Mit dem Hoster besteht ein Vertrag zur Auftragsverarbeitung.",
        },
      ],
    },
    {
      h: "8. Cookies",
      body: [
        {
          t: "p",
          text: "Unsere Website verwendet Cookies und vergleichbare Technologien. Technisch notwendige Cookies ermöglichen die ordnungsgemäße Funktion unserer Website.",
        },
        {
          t: "p",
          text: "Analyse- und weitere nicht notwendige Cookies werden nur nach Ihrer ausdrücklichen Einwilligung über unser Cookie-Banner aktiviert. Ihre Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.",
        },
        {
          t: "p",
          text: "Eine Übersicht der eingesetzten Cookies sowie die Möglichkeit zum Widerruf finden Sie auf unserer Seite „Cookies“.",
        },
      ],
    },
    {
      h: "9. Google Analytics",
      body: [
        { t: "p", text: "Wir verwenden Google Analytics, einen Webanalysedienst der:" },
        { t: "p", text: "Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland" },
        {
          t: "p",
          text: "Google Analytics verwendet Cookies, um die Nutzung unserer Website auszuwerten. Dabei können insbesondere folgende Daten verarbeitet werden:",
        },
        {
          t: "ul",
          items: [
            "besuchte Seiten",
            "Nutzungsdauer",
            "technische Informationen zum Endgerät",
            "Browserinformationen",
            "ungefähre Standortdaten",
          ],
        },
        {
          t: "p",
          text: "Die Nutzung erfolgt ausschließlich nach Ihrer Einwilligung über unser Cookie-Consent-System. Ohne Einwilligung werden keine Analyse-Cookies gesetzt und keine Daten an Google übertragen.",
        },
        { t: "p", text: "Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO." },
      ],
    },
    {
      h: "10. Google Maps",
      body: [
        {
          t: "p",
          text: "Sofern auf unserer Website Google Maps eingebunden ist, nutzen wir diesen Dienst zur Darstellung unseres Standortes.",
        },
        { t: "p", text: "Anbieter: Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland" },
        {
          t: "p",
          text: "Durch die Nutzung können technische Daten an Google übertragen werden. Die Aktivierung erfolgt nur nach Ihrer Einwilligung über das Cookie-Banner.",
        },
      ],
    },
    {
      h: "11. Weitergabe von Daten",
      body: [
        {
          t: "p",
          text: "Eine Weitergabe personenbezogener Daten erfolgt nur, wenn dies erforderlich ist. Dies kann insbesondere erfolgen an:",
        },
        {
          t: "ul",
          items: [
            "Versicherungen",
            "Schadenregulierer",
            "Sachverständige",
            "beteiligte Fachunternehmen",
            "Behörden",
            "Dienstleister, die uns bei der Vertragsabwicklung unterstützen",
          ],
        },
        { t: "p", text: "Eine Weitergabe zu Werbezwecken erfolgt nicht." },
      ],
    },
    {
      h: "12. Speicherdauer",
      body: [
        {
          t: "p",
          text: "Wir speichern personenbezogene Daten nur so lange, wie dies für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen. Aufbewahrungspflichten können sich insbesondere aus handels- und steuerrechtlichen Vorschriften ergeben.",
        },
      ],
    },
    {
      h: "13. Ihre Rechte",
      body: [
        { t: "p", text: "Sie haben nach der DSGVO folgende Rechte:" },
        {
          t: "ul",
          items: [
            "Auskunft über Ihre gespeicherten Daten",
            "Berichtigung unrichtiger Daten",
            "Löschung Ihrer Daten",
            "Einschränkung der Verarbeitung",
            "Widerspruch gegen die Verarbeitung",
            "Datenübertragbarkeit",
          ],
        },
        {
          t: "p",
          text: "Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.",
        },
      ],
    },
    {
      h: "14. Beschwerderecht",
      body: [
        {
          t: "p",
          text: "Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.",
        },
      ],
    },
    {
      h: "15. Datensicherheit",
      body: [
        {
          t: "p",
          text: "Wir setzen geeignete technische und organisatorische Maßnahmen ein, um Ihre Daten vor Verlust, Missbrauch oder unberechtigtem Zugriff zu schützen.",
        },
      ],
    },
    {
      h: "16. Aktualisierung dieser Datenschutzerklärung",
      body: [
        {
          t: "p",
          text: "Wir behalten uns vor, diese Datenschutzerklärung anzupassen, wenn sich gesetzliche Anforderungen, technische Änderungen unserer Website oder Änderungen unserer Datenverarbeitung ergeben. Es gilt die jeweils aktuelle Version dieser Datenschutzerklärung auf unserer Website.",
        },
      ],
    },
  ] satisfies readonly LegalBlock[],
} as const;

// ─────────────────────────────────────────────────────────────────────
// Cookie-Übersicht
// ─────────────────────────────────────────────────────────────────────

export const cookies = {
  title: "Cookies",
  updated: "Stand: 2026",
  intro:
    "Diese Seite informiert darüber, welche Cookies und vergleichbaren Technologien wir einsetzen und wie Sie Ihre Entscheidung jederzeit ändern können.",
  blocks: [
    {
      h: "Technisch notwendige Cookies",
      body: [
        {
          t: "p",
          text: "Diese sind für den Betrieb der Website erforderlich und werden ohne Einwilligung gesetzt. Sie speichern ausschließlich Ihre Auswahl im Cookie-Banner, damit wir Sie nicht bei jedem Besuch erneut fragen.",
        },
        {
          t: "ul",
          items: [
            "alpendry_consent — speichert Ihre Cookie-Entscheidung. Speicherdauer: 6 Monate. Wird lokal in Ihrem Browser abgelegt und nicht an uns übertragen.",
          ],
        },
      ],
    },
    {
      h: "Analyse-Cookies (nur mit Einwilligung)",
      body: [
        {
          t: "p",
          text: "Diese helfen uns zu verstehen, wie die Website genutzt wird. Sie werden ausschließlich gesetzt, wenn Sie im Banner zugestimmt haben. Lehnen Sie ab, werden keine Analyse-Cookies gesetzt und keine Daten an Dritte übertragen.",
        },
        {
          t: "ul",
          items: [
            "Google Analytics (Google Ireland Limited) — Auswertung der Websitenutzung. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO.",
          ],
        },
      ],
    },
    {
      h: "Einwilligung widerrufen",
      body: [
        {
          t: "p",
          text: "Sie können Ihre Entscheidung jederzeit mit Wirkung für die Zukunft ändern. Nutzen Sie dazu die Schaltfläche unten — das Banner erscheint danach erneut.",
        },
      ],
    },
  ] satisfies readonly LegalBlock[],
} as const;
