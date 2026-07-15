import type { LegalBlock } from "./legal";

/**
 * Allgemeine Geschäftsbedingungen — Zulieferung der Kundin, Stand 2026.
 *
 * Wörtlich übernommen. Kein Rechtsrat: Vor Livegang fachkundig prüfen lassen,
 * insbesondere § 15 (Haftungsbeschränkungen) und § 19 (Gerichtsstand) im
 * Verhältnis zu Verbrauchern.
 *
 * Eigene Datei, weil die 25 Paragraphen legal.ts sonst unnavigierbar machen.
 */
export const agb = {
  title: "Allgemeine Geschäftsbedingungen",
  updated: "Stand: 2026",
  blocks: [
    {
      h: "§ 1 Geltungsbereich",
      body: [
        {
          t: "p",
          text: "(1) Diese Allgemeinen Geschäftsbedingungen gelten für sämtliche Verträge der AlpenDry GmbH (nachfolgend „AlpenDry“) mit ihren Auftraggebern über die Durchführung von Schadensanierungsleistungen, insbesondere Wasserschadensanierung, Brandschadensanierung, technische Trocknung, Leckortung, Thermographie, Rückbau-, Renovierungs- und Wiederherstellungsarbeiten sowie die Vermietung technischer Geräte.",
        },
        {
          t: "p",
          text: "(2) Die AGB gelten gegenüber Verbrauchern gemäß § 13 BGB, Unternehmern gemäß § 14 BGB, Versicherungen sowie sonstigen Auftraggebern, soweit keine zwingenden gesetzlichen Vorschriften entgegenstehen.",
        },
        {
          t: "p",
          text: "(3) Abweichende Bedingungen des Auftraggebers gelten nur, wenn AlpenDry ihrer Geltung ausdrücklich schriftlich zugestimmt hat.",
        },
      ],
    },
    {
      h: "§ 2 Vertragsschluss und Auftragsumfang",
      body: [
        {
          t: "p",
          text: "(1) Angebote der AlpenDry GmbH sind freibleibend, sofern sie nicht ausdrücklich als verbindlich bezeichnet werden.",
        },
        {
          t: "p",
          text: "(2) Ein Vertrag kommt durch schriftliche Auftragsbestätigung, Annahme eines Angebotes, Auftragserteilung oder spätestens durch Beginn der Ausführung der Arbeiten zustande.",
        },
        {
          t: "p",
          text: "(3) Grundlage der Leistung ist ausschließlich der vereinbarte Auftrag beziehungsweise das Angebot der AlpenDry GmbH.",
        },
        {
          t: "p",
          text: "(4) Während der Durchführung der Arbeiten können zusätzliche Schäden, verdeckte Schadensursachen oder technisch notwendige Maßnahmen festgestellt werden. Erforderliche Zusatzarbeiten werden nach vorheriger Abstimmung mit dem Auftraggeber durchgeführt und entsprechend berechnet.",
        },
        {
          t: "p",
          text: "(5) Sollte eine sofortige Maßnahme zur Schadenbegrenzung erforderlich sein, ist AlpenDry berechtigt, notwendige Sicherungs- und Schutzmaßnahmen auch ohne vorherige ausdrückliche Zustimmung auszuführen, soweit dies zur Vermeidung größerer Schäden erforderlich erscheint.",
        },
      ],
    },
    {
      h: "§ 3 Leistungsumfang und Durchführung der Arbeiten",
      body: [
        {
          t: "p",
          text: "(1) AlpenDry führt die beauftragten Leistungen nach den anerkannten Regeln der Technik und mit der erforderlichen fachlichen Sorgfalt aus.",
        },
        { t: "p", text: "(2) Zum Leistungsumfang können insbesondere gehören:" },
        {
          t: "ul",
          items: [
            "Schadensaufnahme und Dokumentation",
            "technische Trocknungsmaßnahmen",
            "Aufstellung und Betreuung von Trocknungsgeräten",
            "Feuchtigkeitsmessungen",
            "Leckortung",
            "Thermographie",
            "Rückbau beschädigter Bauteile",
            "Sanierungs- und Wiederherstellungsarbeiten",
            "Renovierungsarbeiten",
            "Vermietung technischer Geräte",
          ],
        },
        { t: "p", text: "(3) Art und Umfang der Leistungen ergeben sich aus dem jeweiligen Angebot oder Auftrag." },
        {
          t: "p",
          text: "(4) AlpenDry ist berechtigt, zur Durchführung der Arbeiten geeignete Fachunternehmen oder Erfüllungsgehilfen einzusetzen.",
        },
      ],
    },
    {
      h: "§ 4 Schadensaufnahme und Dokumentation",
      body: [
        {
          t: "p",
          text: "(1) AlpenDry ist berechtigt, den Schaden sowie den Zustand der betroffenen Bereiche vor, während und nach der Durchführung der Arbeiten durch Fotos, Messwerte und Dokumentationen festzuhalten.",
        },
        {
          t: "p",
          text: "(2) Die Dokumentation dient insbesondere der technischen Bewertung, Nachweisführung, Qualitätssicherung sowie – soweit erforderlich – der Kommunikation mit Versicherungen, Sachverständigen oder sonstigen Beteiligten.",
        },
        {
          t: "p",
          text: "(3) Die Verarbeitung personenbezogener Daten erfolgt ausschließlich im Rahmen der geltenden datenschutzrechtlichen Vorschriften.",
        },
      ],
    },
    {
      h: "§ 5 Mitwirkungspflichten des Auftraggebers",
      body: [
        {
          t: "p",
          text: "(1) Der Auftraggeber verpflichtet sich, AlpenDry bei der Durchführung der Arbeiten angemessen zu unterstützen. Hierzu gehören insbesondere:",
        },
        {
          t: "ul",
          items: [
            "Zugang zu den betroffenen Räumen zu ermöglichen",
            "Arbeitsbereiche frei zugänglich zu halten",
            "erforderliche Informationen über Gebäude, Leitungen und Installationen mitzuteilen",
            "vorhandene Unterlagen, soweit vorhanden, bereitzustellen",
            "Strom- und Wasseranschlüsse zur Verfügung zu stellen",
          ],
        },
        {
          t: "p",
          text: "(2) Der Auftraggeber hat AlpenDry insbesondere auf bekannte Leitungen, Fußbodenheizungen, besondere bauliche Gegebenheiten oder Gefahrenquellen hinzuweisen.",
        },
        {
          t: "p",
          text: "(3) Werden erforderliche Informationen oder Mitwirkungshandlungen nicht bereitgestellt, können hierdurch entstehende Verzögerungen oder zusätzliche Aufwendungen gesondert berechnet werden, soweit diese vom Auftraggeber zu vertreten sind.",
        },
      ],
    },
    {
      h: "§ 6 Technische Trocknung",
      body: [
        {
          t: "p",
          text: "(1) Bei technischen Trocknungsmaßnahmen stellt AlpenDry geeignete Geräte entsprechend dem Schadensbild und den technischen Erfordernissen auf.",
        },
        {
          t: "p",
          text: "(2) Die tatsächliche Trocknungsdauer hängt von zahlreichen Faktoren ab, insbesondere von:",
        },
        {
          t: "ul",
          items: [
            "Bauweise",
            "Materialbeschaffenheit",
            "Durchfeuchtungsgrad",
            "Raumklima",
            "Nutzung der Räume",
            "äußeren Bedingungen",
          ],
        },
        {
          t: "p",
          text: "Eine bestimmte Trocknungsdauer oder ein bestimmter Erfolg kann daher nur garantiert werden, wenn dies ausdrücklich schriftlich vereinbart wurde.",
        },
        { t: "p", text: "(3) Der Auftraggeber verpflichtet sich:" },
        {
          t: "ul",
          items: [
            "die Geräte nicht eigenmächtig umzusetzen oder auszuschalten",
            "Störungen unverzüglich mitzuteilen",
            "Zugang für Kontrolle, Wartung und Abholung zu ermöglichen",
          ],
        },
        {
          t: "p",
          text: "(4) Stromkosten für den Betrieb der Geräte trägt der Auftraggeber, sofern keine abweichende Vereinbarung getroffen wurde.",
        },
        {
          t: "p",
          text: "(5) Wird der Trocknungsvorgang durch vom Auftraggeber zu vertretende Umstände verlängert, können zusätzliche Kosten entstehen.",
        },
      ],
    },
    {
      h: "§ 7 Gerätevermietung",
      body: [
        {
          t: "p",
          text: "(1) Die AlpenDry GmbH vermietet technische Geräte, insbesondere Trocknungsgeräte, Heizgeräte, Messgeräte und Zubehör, entsprechend der jeweiligen Vereinbarung.",
        },
        {
          t: "p",
          text: "(2) Der Mietzeitraum beginnt mit Übergabe beziehungsweise Aufstellung der Geräte und endet mit Rückgabe oder Abholung durch AlpenDry, sofern nichts Abweichendes vereinbart wurde.",
        },
        { t: "p", text: "(3) Der Mieter verpflichtet sich:" },
        {
          t: "ul",
          items: [
            "die Geräte ausschließlich bestimmungsgemäß zu verwenden",
            "die Bedienhinweise einzuhalten",
            "die Geräte vor Beschädigung und unbefugter Nutzung zu schützen",
            "Störungen oder Schäden unverzüglich mitzuteilen",
          ],
        },
        {
          t: "p",
          text: "(4) Eine Weitergabe der Geräte an Dritte oder eine Verlagerung an einen anderen Einsatzort ist nur mit vorheriger Zustimmung der AlpenDry GmbH zulässig.",
        },
        {
          t: "p",
          text: "(5) Der Mieter haftet für Schäden an den überlassenen Geräten, die durch unsachgemäße Behandlung, vorsätzliche oder fahrlässige Beschädigung, Verlust oder Diebstahl entstehen, soweit er dies zu vertreten hat.",
        },
        { t: "p", text: "(6) Normale Abnutzung durch vertragsgemäßen Gebrauch ist von der Haftung ausgenommen." },
        {
          t: "p",
          text: "(7) Der Mieter stellt sicher, dass die technischen Voraussetzungen für den Betrieb der Geräte vorhanden sind. Hierzu gehören insbesondere geeignete Stromanschlüsse sowie die Einhaltung erforderlicher Sicherheitsvorschriften.",
        },
      ],
    },
    {
      h: "§ 8 Leckortung und Thermographie",
      body: [
        {
          t: "p",
          text: "(1) Leckortungen und thermographische Untersuchungen werden nach dem aktuellen Stand der Technik und mit geeigneten Messverfahren durchgeführt.",
        },
        {
          t: "p",
          text: "(2) Aufgrund baulicher Gegebenheiten, verdeckter Leitungsverläufe, Materialeigenschaften und technischer Grenzen der Messverfahren kann kein bestimmter Untersuchungserfolg garantiert werden.",
        },
        {
          t: "p",
          text: "(3) Ziel der Untersuchung ist die fachgerechte Eingrenzung und Lokalisierung möglicher Schadensursachen.",
        },
        {
          t: "p",
          text: "(4) Zur Schadensfeststellung können technische Öffnungen, Freilegungen oder weitere Untersuchungen erforderlich sein. Diese erfolgen nur im erforderlichen Umfang und werden, soweit nicht anders vereinbart, gesondert berechnet.",
        },
        {
          t: "p",
          text: "(5) Sollte eine Öffnung aufgrund vorhandener baulicher Gegebenheiten erforderlich werden und sich anschließend herausstellen, dass sich die Schadstelle nicht exakt an dieser Stelle befindet, stellt dies keinen Mangel der Untersuchungsleistung dar, sofern die Untersuchung fachgerecht durchgeführt wurde.",
        },
      ],
    },
    {
      h: "§ 9 Rückbau-, Sanierungs- und Wiederherstellungsarbeiten",
      body: [
        {
          t: "p",
          text: "(1) Bei Rückbau- und Sanierungsarbeiten kann es aufgrund der Schadensart zu weiteren Erkenntnissen über die Beschaffenheit von Bauteilen kommen.",
        },
        {
          t: "p",
          text: "(2) Nicht erkennbare Vorschäden, versteckte Mängel, ungeeignete Materialien oder vorhandene Beschädigungen können zusätzliche Maßnahmen erforderlich machen.",
        },
        {
          t: "p",
          text: "(3) AlpenDry informiert den Auftraggeber über wesentliche zusätzliche Arbeiten. Diese werden, soweit möglich, vor Ausführung abgestimmt.",
        },
        {
          t: "p",
          text: "(4) Bei Arbeiten an beschädigten oder vorgeschädigten Bauteilen können Farbabweichungen, Materialunterschiede oder optische Veränderungen auftreten. Eine vollständige Wiederherstellung des ursprünglichen Zustandes kann nur geschuldet sein, wenn dies ausdrücklich vereinbart wurde.",
        },
      ],
    },
    {
      h: "§ 10 Arbeiten im Versicherungsfall",
      body: [
        { t: "p", text: "(1) Die Beauftragung der AlpenDry GmbH erfolgt grundsätzlich durch den Auftraggeber." },
        {
          t: "p",
          text: "(2) Eine Kostenübernahme durch eine Versicherung berührt das Vertragsverhältnis zwischen AlpenDry und dem Auftraggeber nicht.",
        },
        {
          t: "p",
          text: "(3) Soweit AlpenDry im Auftrag des Kunden mit einer Versicherung, einem Sachverständigen oder einem Schadenregulierer kommuniziert, erfolgt dies ausschließlich zur Unterstützung der Schadenabwicklung.",
        },
        {
          t: "p",
          text: "(4) Der Auftraggeber bleibt Vertragspartner und verpflichtet, die vereinbarten Leistungen zu bezahlen, soweit keine andere verbindliche Zahlungsvereinbarung getroffen wurde.",
        },
        {
          t: "p",
          text: "(5) Kürzungen oder Ablehnungen durch Versicherungen haben grundsätzlich keinen Einfluss auf die Zahlungspflicht des Auftraggebers gegenüber AlpenDry.",
        },
      ],
    },
    {
      h: "§ 11 Vergütung und Zahlungsbedingungen",
      body: [
        { t: "p", text: "(1) Es gelten die im Angebot, Auftrag oder der Auftragsbestätigung vereinbarten Preise." },
        {
          t: "p",
          text: "(2) Sämtliche Preise verstehen sich zuzüglich der gesetzlichen Mehrwertsteuer, sofern diese anfällt.",
        },
        {
          t: "p",
          text: "(3) Rechnungen sind, sofern keine abweichende Vereinbarung getroffen wurde, innerhalb von 14 Tagen nach Zugang ohne Abzug zahlbar.",
        },
        {
          t: "p",
          text: "(4) AlpenDry ist berechtigt, bei umfangreichen oder länger andauernden Arbeiten angemessene Abschlagszahlungen entsprechend dem Leistungsfortschritt zu verlangen.",
        },
        {
          t: "p",
          text: "(5) Zusatzleistungen und nicht vorhersehbare, technisch erforderliche Arbeiten werden nach vorheriger Information des Auftraggebers zusätzlich berechnet.",
        },
        { t: "p", text: "(6) Bei Zahlungsverzug gelten die gesetzlichen Vorschriften." },
      ],
    },
    {
      h: "§ 12 Abnahme von Leistungen",
      body: [
        {
          t: "p",
          text: "(1) Soweit gesetzlich vorgesehen oder vertraglich vereinbart, erfolgt nach Abschluss der Arbeiten eine Abnahme.",
        },
        { t: "p", text: "(2) Der Auftraggeber ist verpflichtet, die Leistung nach Fertigstellung zu prüfen." },
        { t: "p", text: "(3) Offensichtliche Mängel sind möglichst unverzüglich mitzuteilen." },
        { t: "p", text: "(4) Die gesetzlichen Rechte des Auftraggebers bei Mängeln bleiben unberührt." },
      ],
    },
    {
      h: "§ 13 Termine und Verzögerungen",
      body: [
        { t: "p", text: "(1) Vereinbarte Termine werden nach Möglichkeit eingehalten." },
        {
          t: "p",
          text: "(2) Verzögerungen aufgrund von Umständen, die AlpenDry nicht zu vertreten hat, insbesondere höhere Gewalt, Lieferengpässe, fehlende Mitwirkung des Auftraggebers oder unvorhersehbare Schadensumstände, verlängern vereinbarte Fristen angemessen.",
        },
        {
          t: "p",
          text: "(3) Bei Sanierungsarbeiten können insbesondere verdeckte Schäden oder zusätzliche technische Anforderungen zu Anpassungen des Zeitplans führen.",
        },
      ],
    },
    {
      h: "§ 14 Gewährleistung und Mängelrechte",
      body: [
        {
          t: "p",
          text: "(1) Für die von AlpenDry GmbH erbrachten Leistungen gelten die gesetzlichen Gewährleistungsrechte, soweit nachfolgend nichts Abweichendes geregelt ist.",
        },
        {
          t: "p",
          text: "(2) Der Auftraggeber hat erkennbare Mängel nach Feststellung möglichst unverzüglich mitzuteilen, damit AlpenDry die Möglichkeit zur Prüfung und gegebenenfalls zur Nachbesserung erhält.",
        },
        {
          t: "p",
          text: "(3) AlpenDry ist berechtigt, bei berechtigten Mängeln zunächst eine angemessene Möglichkeit zur Nacherfüllung zu erhalten.",
        },
        {
          t: "p",
          text: "(4) Eine Gewährleistung ist ausgeschlossen, soweit Schäden oder Beeinträchtigungen darauf beruhen, dass:",
        },
        {
          t: "ul",
          items: [
            "der Auftraggeber Bedienungs- oder Nutzungshinweise nicht beachtet hat",
            "technische Geräte unsachgemäß verwendet oder eigenmächtig verändert wurden",
            "erforderliche Mitwirkungshandlungen unterblieben sind",
            "äußere Umstände außerhalb des Verantwortungsbereichs von AlpenDry die Leistung beeinflusst haben",
          ],
        },
        { t: "p", text: "(5) Die gesetzlichen Rechte des Auftraggebers bei Mängeln bleiben hiervon unberührt." },
      ],
    },
    {
      h: "§ 15 Haftung",
      body: [
        {
          t: "p",
          text: "(1) Die AlpenDry GmbH haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit sowie für Schäden, die auf vorsätzlichem oder grob fahrlässigem Verhalten der AlpenDry GmbH, ihrer gesetzlichen Vertreter oder Erfüllungsgehilfen beruhen.",
        },
        {
          t: "p",
          text: "(2) Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) haftet die AlpenDry GmbH nur für den vertragstypischen und vorhersehbaren Schaden. Wesentliche Vertragspflichten sind solche Verpflichtungen, deren Erfüllung die ordnungsgemäße Durchführung des Vertrages überhaupt erst ermöglicht und auf deren Einhaltung der Auftraggeber regelmäßig vertrauen darf.",
        },
        {
          t: "p",
          text: "(3) Im Übrigen ist die Haftung der AlpenDry GmbH für leicht fahrlässig verursachte Schäden ausgeschlossen, soweit dies gesetzlich zulässig ist.",
        },
        {
          t: "p",
          text: "(4) Die AlpenDry GmbH haftet nicht für Schäden, die auf Umständen beruhen, die außerhalb ihres Verantwortungsbereichs liegen, insbesondere:",
        },
        {
          t: "ul",
          items: [
            "unrichtigen oder fehlenden Angaben des Auftraggebers",
            "nicht bekannten Leitungsverläufen",
            "verdeckten baulichen Gegebenheiten",
            "vorhandenen Vorschäden",
            "ungeeigneten oder beschädigten Bausubstanzen",
            "fehlenden technischen Voraussetzungen am Einsatzort",
          ],
        },
        { t: "p", text: "Dies gilt nur, soweit keine gesetzliche Haftung der AlpenDry GmbH entgegensteht." },
        {
          t: "p",
          text: "(5) Bei Leckortungen, Thermographie und technischen Messverfahren schuldet AlpenDry die fachgerechte Durchführung der Untersuchung nach dem anerkannten Stand der Technik. Eine Garantie für das Auffinden jeder Schadstelle oder für einen bestimmten Untersuchungserfolg wird nicht übernommen, sofern dies nicht ausdrücklich schriftlich vereinbart wurde.",
        },
        {
          t: "p",
          text: "(6) Werden im Rahmen der Schadenaufnahme oder Schadensbeseitigung Öffnungen, Bohrungen oder Freilegungen erforderlich, stellen diese keinen Mangel dar, sofern sie technisch erforderlich und fachgerecht durchgeführt wurden.",
        },
        {
          t: "p",
          text: "(7) Die vorstehenden Haftungsbeschränkungen gelten auch zugunsten der gesetzlichen Vertreter, Mitarbeiter und Erfüllungsgehilfen der AlpenDry GmbH.",
        },
        {
          t: "p",
          text: "(8) Die Haftung nach dem Produkthaftungsgesetz sowie aufgrund zwingender gesetzlicher Vorschriften bleibt unberührt.",
        },
      ],
    },
    {
      h: "§ 16 Eigentumsvorbehalt",
      body: [
        {
          t: "p",
          text: "(1) Gelieferte Materialien und Gegenstände bleiben bis zur vollständigen Bezahlung sämtlicher Forderungen aus dem Vertragsverhältnis Eigentum der AlpenDry GmbH, soweit ein Eigentumsvorbehalt gesetzlich möglich ist.",
        },
        {
          t: "p",
          text: "(2) Der Auftraggeber verpflichtet sich, die unter Eigentumsvorbehalt stehenden Gegenstände bis zur vollständigen Zahlung pfleglich zu behandeln.",
        },
      ],
    },
    {
      h: "§ 17 Datenschutz",
      body: [
        {
          t: "p",
          text: "(1) AlpenDry GmbH verarbeitet personenbezogene Daten des Auftraggebers ausschließlich zur Durchführung des Vertragsverhältnisses und zur Erfüllung gesetzlicher Verpflichtungen.",
        },
        {
          t: "p",
          text: "(2) Eine Weitergabe erfolgt nur, soweit dies zur Vertragsdurchführung erforderlich ist, beispielsweise an Versicherungen, Sachverständige, Partnerunternehmen oder Behörden.",
        },
        {
          t: "p",
          text: "(3) Die Verarbeitung erfolgt nach den geltenden Datenschutzbestimmungen, insbesondere der Datenschutz-Grundverordnung (DSGVO).",
        },
      ],
    },
    {
      h: "§ 18 Verbraucherstreitbeilegung",
      body: [
        {
          t: "p",
          text: "Die AlpenDry GmbH ist nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
        },
      ],
    },
    {
      h: "§ 19 Gerichtsstand und anwendbares Recht",
      body: [
        { t: "p", text: "(1) Es gilt das Recht der Bundesrepublik Deutschland." },
        { t: "p", text: "(2) Gegenüber Verbrauchern gelten die gesetzlichen Gerichtsstandsregelungen." },
        {
          t: "p",
          text: "(3) Ist der Auftraggeber Kaufmann, eine juristische Person des öffentlichen Rechts oder ein öffentlich-rechtliches Sondervermögen, wird als Gerichtsstand – soweit gesetzlich zulässig – der Sitz der AlpenDry GmbH vereinbart.",
        },
      ],
    },
    {
      h: "§ 20 Aufrechnung und Zurückbehaltungsrecht",
      body: [
        {
          t: "p",
          text: "(1) Der Auftraggeber kann nur mit solchen Gegenforderungen aufrechnen, die rechtskräftig festgestellt, unbestritten oder von AlpenDry GmbH anerkannt sind.",
        },
        {
          t: "p",
          text: "(2) Ein Zurückbehaltungsrecht kann der Auftraggeber nur geltend machen, soweit es auf demselben Vertragsverhältnis beruht.",
        },
      ],
    },
    {
      h: "§ 21 Zusatzleistungen und Nachträge",
      body: [
        {
          t: "p",
          text: "(1) Bei Schadensanierungsarbeiten können während der Ausführung weitere Schäden oder technisch notwendige Maßnahmen festgestellt werden, die bei Auftragserteilung nicht erkennbar waren.",
        },
        {
          t: "p",
          text: "(2) AlpenDry wird den Auftraggeber über zusätzliche erforderliche Arbeiten und die daraus entstehenden Kosten informieren, soweit dies nach den Umständen möglich und zumutbar ist.",
        },
        {
          t: "p",
          text: "(3) Arbeiten, die zur Vermeidung weiterer Schäden oder zur Sicherstellung einer fachgerechten Sanierung dringend erforderlich sind, dürfen nach Abstimmung mit dem Auftraggeber ausgeführt werden.",
        },
        {
          t: "p",
          text: "(4) Zusatzleistungen werden entsprechend der vereinbarten Preise oder, soweit keine Vereinbarung besteht, nach den üblichen Vergütungssätzen von AlpenDry berechnet.",
        },
      ],
    },
    {
      h: "§ 22 Besondere Bedingungen für technische Trocknungsmaßnahmen",
      body: [
        {
          t: "p",
          text: "(1) Der Auftraggeber verpflichtet sich, die für die Durchführung der Trocknung erforderlichen Voraussetzungen sicherzustellen. Hierzu gehören insbesondere:",
        },
        {
          t: "ul",
          items: [
            "ausreichende Stromversorgung",
            "Zugang zu den Geräten für Kontrolle und Wartung",
            "bestimmungsgemäße Nutzung der Geräte",
            "unverzügliche Meldung von Störungen",
          ],
        },
        { t: "p", text: "(2) Die Geräte dürfen nicht eigenmächtig ausgeschaltet, umgesetzt oder verändert werden." },
        {
          t: "p",
          text: "(3) Eine Unterbrechung der Trocknungsmaßnahmen durch den Auftraggeber oder durch Dritte kann zu einer Verlängerung der Trocknungszeit führen. Hierdurch entstehende zusätzliche Kosten können dem Auftraggeber berechnet werden.",
        },
        {
          t: "p",
          text: "(4) Die tatsächliche Trocknungsdauer hängt von den individuellen Gegebenheiten des Schadens ab und kann nicht pauschal garantiert werden.",
        },
      ],
    },
    {
      h: "§ 23 Eingebrachte Geräte und Arbeitsmittel",
      body: [
        {
          t: "p",
          text: "(1) Von AlpenDry eingebrachte Geräte, Maschinen und Arbeitsmittel bleiben Eigentum der AlpenDry GmbH.",
        },
        {
          t: "p",
          text: "(2) Der Auftraggeber hat dafür Sorge zu tragen, dass die Geräte vor Beschädigung, Verlust oder unbefugter Nutzung geschützt werden.",
        },
        {
          t: "p",
          text: "(3) Schäden an Geräten, die durch den Auftraggeber, dessen Mitarbeiter, Bewohner, Besucher oder sonstige Dritte verursacht werden, werden nach den gesetzlichen Vorschriften geltend gemacht.",
        },
        {
          t: "p",
          text: "(4) Der Auftraggeber informiert AlpenDry unverzüglich über Verlust, Beschädigung oder Funktionsstörungen.",
        },
      ],
    },
    {
      h: "§ 24 Forderungsabtretung und Abrechnung mit Dritten",
      body: [
        {
          t: "p",
          text: "(1) AlpenDry ist berechtigt, Forderungen aus Vertragsverhältnissen abzutreten oder zur Abwicklung an geeignete Dienstleister weiterzugeben, soweit gesetzliche Vorschriften dem nicht entgegenstehen.",
        },
        {
          t: "p",
          text: "(2) Eine Kommunikation mit Versicherungen, Sachverständigen oder sonstigen Dritten erfolgt ausschließlich zur Unterstützung der Schadenabwicklung.",
        },
        {
          t: "p",
          text: "(3) Die Verpflichtung des Auftraggebers zur Zahlung der vereinbarten Vergütung bleibt hiervon unberührt, sofern keine abweichende schriftliche Vereinbarung getroffen wurde.",
        },
      ],
    },
    {
      h: "§ 25 Schlussbestimmungen",
      body: [
        {
          t: "p",
          text: "(1) Änderungen und Ergänzungen des Vertrages bedürfen der vereinbarten Form, soweit gesetzlich keine strengere Form vorgeschrieben ist.",
        },
        {
          t: "p",
          text: "(2) Sollten einzelne Bestimmungen dieser Allgemeinen Geschäftsbedingungen unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Regelungen unberührt.",
        },
        { t: "p", text: "(3) Anstelle der unwirksamen Regelung gelten die gesetzlichen Vorschriften." },
      ],
    },
  ] satisfies readonly LegalBlock[],
} as const;
