# AlpenDry — Website

Wasserschadensanierung, Lecksuche und Schimmelsanierung am Alpenrand.
Next.js (App Router) · TypeScript · Tailwind · React Three Fiber · Framer Motion.

## Entwicklung

```bash
npm install
cp .env.example .env.local   # Resend-Key und Adressen eintragen
npm run dev
```

## Vor dem Livegang — offene Punkte

Diese Stellen sind bewusst markiert und brauchen eine Entscheidung:

| Was | Wo | Warum offen |
|---|---|---|
| **Google-Bewertungen** | `lib/content.ts` → `trust.reviewsActive` | Steht auf `false`. Erst mit echten Zahlen aus dem Unternehmensprofil aktivieren — erfundene Bewertungen sind irreführende Werbung. |
| **Presse-Siegel** | `lib/content.ts` → `trust.pressSealActive` | Steht auf `false`. Darf laut Business Case Kap. 9 erst erscheinen, wenn der Artikel wirklich veröffentlicht ist (sonst § 5 UWG). |
| **FAQ-Antworten** | `lib/content.ts` → `faq` | Mit `@freigabe` markiert: aus belegten Fakten abgeleitet, im Business Case aber nicht wörtlich beantwortet. Fachlich prüfen. |
| **Vercel: Domain + ENV** | Vercel → Settings | ⚠️ **Vor Livegang.** DNS allein genügt nicht: Die Domain muss im Vercel-Projekt eingetragen sein (`www.alpendry.de` als primär — der Code nutzt sie in `site.url`), und `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO` gehören in die Environment Variables **von Vercel**, nicht ins IONOS-Panel. Details unter „E-Mail-Versand (Resend)". |
| **AV-Verträge** | resend.com, vercel.com | ⚠️ Bei **Resend** (Settings → Legal → DPA) und bei **Vercel** (vercel.com/legal/dpa) abschließen. Die Datenschutzerklärung (§§ 7, 8) behauptet beide bereits — ohne Vertrag ist die Verarbeitung formal unzulässig und der Text unrichtig. |
| **Resend-Region ist USA** | — | Die Domain wurde in `us-east-1` verifiziert (erkennbar am MX-Wert). Nachträglich **nicht umstellbar**. Für EU-Verarbeitung müsste sie in einem Konto mit `eu-west-1` neu verifiziert werden — dann ändern sich MX und DKIM, und § 8 muss zurück auf EU. Entscheidung der Kundin bzw. der Anwältin. |
| **Markennamen auf den KI-Bildern** | `lib/works.ts`, `public/arbeiten/` | ⚠️ **Entscheidung nötig.** Die KI hat echte Herstellernamen auf die Geräte gerendert, teils verzerrt: **„CORROVENTA CTR 1000XT" und „TROTEC"** (trocknung — in der Kachel klar lesbar), **„SEWERIN AQUAPHON"** (leckageortung), **„LGR 7000 XLI"**. Fremde Marken in der eigenen Werbung können den Eindruck einer Partnerschaft erwecken, die es nicht gibt — und die Geräte gehören dem Betrieb nicht. Drei Wege: (a) Bilder ohne Markennamen neu generieren (sauberste Lösung), (b) die Stellen wegretuschieren, (c) juristisch abklären lassen. |
| **KI-Bilder ohne Kennzeichnung** | `lib/works.ts`, `app/arbeiten/page.tsx` | ⚠️ Alle sechs Bilder auf /arbeiten sind KI-generiert und tragen auf Kundenwunsch **keine** Kennzeichnung mehr. Der Hinweis steht nur noch im Bildnachweis des Impressums. Zu bedenken: **Art. 50 Abs. 4 KI-VO (EU 2024/1689) gilt ab 02.08.2026** und verlangt die Kennzeichnung fotorealistischer KI-Bilder beim ersten Ansehen — ein Impressumshinweis genügt dafür nicht. Dazu § 5 UWG: Auf einer Seite mit der Überschrift „Bisherige Arbeiten" lesen sich unbeschriftete Bilder als eigene Einsätze. Reaktivieren ist eine Zeile: `works.symbolLabel` wieder in die `figcaption` einsetzen. Die echte Vorher/Nachher-Aufnahme (Wasserschaden.jpg) wird nicht mehr verwendet — sie war das einzige Bild, das etwas belegte. |
| **Einsatzfotos fehlen** | `lib/photos.ts` | Die drei gelieferten Fotos zeigen die **Region**, keinen Einsatz — kein Team, keine Technik, keine Baustelle. Sie stehen deshalb nur dort, wo es ums Gebiet und um Wasser geht. Business Case Kap. 6 verlangt „echte Bilder von Team und Einsätzen": dafür braucht es Fotos von der Baustelle. Drei Leistungsseiten haben bewusst kein Bild, statt ein beliebiges zu tragen. |
| **Orte auf den Fotos** | `lib/photos.ts` | Die Bildunterschriften beschreiben, was zu sehen ist, statt Orte zu behaupten. Der See mit der Insel könnte der Staffelsee sein — unbestätigt. Sobald die Kundin die Orte nennt, dürfen die Unterschriften konkret werden. |
| **Rechtstexte** | `lib/legal.ts`, `lib/agb.ts` | Von einer Anwältin/einem Anwalt geliefert. **Drei Abweichungen**, alle gegenzulesen: (1) **§ 7 Hoster** — die Vorlage nannte Wix.com Ltd. (alter Auftritt), zwischenzeitlich stand dort IONOS; beides falsch. Der A-Record zeigt auf Vercel, Inc., jetzt korrigiert samt USA-Hinweis. IONOS bleibt in § 6 fürs Postfach. (2) **§ 8 Resend** neu — Auftragsverarbeiter, Region USA. (3) **Bildnachweis** im Impressum neu (KI-Herkunft, § 5 UWG + § 13 UrhG). |
| **Google Analytics** | `lib/consent.ts` | Consent-Unterbau steht, GA ist noch nicht eingebunden. Mess-ID ergänzen; es lädt ausschließlich nach Einwilligung. |

## Hosting

Läuft auf **Vercel** (A-Record `216.198.79.1`, www-CNAME auf `vercel-dns`).
Kein statischer Export möglich: `/api/kontakt` versendet das Kontaktformular
serverseitig.

**IONOS ist nicht der Hoster**, sondern nur Domain-/DNS-Anbieter und Betreiber
des Postfachs `info@alpendry.de`. Die beiden zu verwechseln war ein Fehler in
einer früheren Fassung der Datenschutzerklärung — § 7 nennt jetzt Vercel, § 6
weiterhin IONOS fürs Postfach.

Alle Umgebungsvariablen gehören deshalb ins **Vercel-Projekt**
(Settings → Environment Variables), nicht ins IONOS-Panel.

## E-Mail-Versand (Resend)

Das Kontaktformular verschickt über **Resend**, nicht mehr über das
IONOS-Postfach. Grund: Eine Mail, die ein Webserver im Namen der Domain
verschickt, landet ohne sauberes SPF/DKIM schnell im Spam — und niemand merkt
es. Resend signiert per DKIM auf der eigenen Domain und protokolliert jede
Zustellung. Das kostenlose Paket reicht (3.000 Mails/Monat, 100/Tag).

Die Domain ist bereits in Resend angelegt — **Region `us-east-1`** (erkennbar am
MX-Wert). Die Region ist nachträglich **nicht umstellbar**; für EU-Verarbeitung
müsste die Domain in einem Konto mit `eu-west-1` neu verifiziert werden, dann
ändern sich MX und DKIM. Die Datenschutzerklärung (§ 8) nennt deshalb die USA.

### DNS-Einträge — an die Kundin zu übergeben

| Typ | Host | Wert | Zweck |
|---|---|---|---|
| A | `@` | `216.198.79.1` | Domain → Vercel |
| CNAME | `www` | `30829f72a3837b00.vercel-dns-017.com.` | www → Vercel |
| TXT | `resend._domainkey` | `p=MIGfMA0…` (langer Schlüssel) | DKIM-Signatur |
| MX | `send` | `feedback-smtp.us-east-1.amazonses.com`, Priorität `10` | Bounces |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | SPF |

**Das Postfach bleibt unberührt** — der wichtigste Punkt für die Kundin: Die
Resend-Einträge hängen an der Subdomain `send.` bzw. an einem eigenen
DKIM-Selektor. Der **MX der Hauptdomain wird nicht angefasst**, Mails an
`info@alpendry.de` kommen weiter bei IONOS an, und es entsteht **kein zweiter
SPF-Eintrag auf demselben Namen** (das machte beide ungültig).

### DNS allein genügt nicht — drei Schritte fehlen

1. **Domain im Vercel-Projekt eintragen** (Settings → Domains). Die DNS zeigt
   sonst auf Vercel, aber Vercel weiß nicht, welches Projekt gemeint ist.
   `www.alpendry.de` als primär setzen — der Code nutzt diese Adresse für
   Canonicals, Sitemap und JSON-LD (`site.url`); `alpendry.de` leitet dorthin um.
2. **Umgebungsvariablen in Vercel setzen** (Settings → Environment Variables):
   `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO`. Ohne sie antwortet das
   Formular mit einem Fehler.
3. **AV-Verträge abschließen** — bei Resend (Settings → Legal → DPA) und bei
   Vercel (vercel.com/legal/dpa). Die Datenschutzerklärung behauptet beide
   bereits.

### Danach prüfen

- **Resend**: Domain muss auf `Verified` stehen (kann nach dem DNS-Eintrag
  einige Minuten dauern).
- **Formular**: Eine echte Testanfrage senden und kontrollieren, dass sie im
  Postfach der Kundin ankommt — nicht im Spam. Resend zeigt jede Mail unter
  „Logs"; steht sie dort als `delivered`, aber nichts im Postfach, liegt es am
  Spamfilter, nicht am Code.

## Architekturentscheidungen

Nicht offensichtliche Punkte, die beim Anfassen leicht kaputtgehen:

- **Tailwind ist auf v3 gepinnt.** `tailwind.config.ts` ist eine verbindliche
  Vorgabe in v3-Syntax; v4 wäre CSS-first ohne Config-Datei.
- **Der 3D-Hero läuft nur auf dem Desktop.** Die Bedingung steht in
  `lib/breakpoints.ts` (`HERO_3D_QUERY`: ab 1024px, Maus, keine reduzierte
  Bewegung) und wird von ZWEI Seiten gelesen: Tailwind macht daraus die Variante
  `hero-3d:` für die Container-Höhe, `HeroScene` liest sie per `matchMedia` für
  Canvas und Textblende. Das muss zusammenbleiben — die 250vh sind reine
  Scroll-Strecke für die Kamerafahrt. Ohne Fahrt wischt man auf dem Handy
  zweieinhalb Bildschirme durch ein Standbild. Sonst: eine Bildschirmhöhe,
  Poster als Hintergrund, kein WebGL (gemessen 414 KB statt 767 KB).
- **Der 3D-Hero lädt auch dort erst bei Interaktion.** three.js + drei +
  postprocessing sind ≈1,1 MB und kosten beim Aufbau rund eine Sekunde
  Hauptthread. Wer nicht scrollt, sieht das Poster und lädt kein WebGL.
- **`quality` (high/low) ist reine Leistung** — dpr, Antialiasing, Bloom,
  Polycount. Die Bildkomposition hängt am Seitenverhältnis (`Atmosphere`,
  `IcebergRig`). Früher steuerte `quality` beides, weil „low" gleichbedeutend mit
  „Handy" war; seit der Canvas nur noch auf dem Desktop läuft, bekäme ein
  4-Kern-Rechner sonst die Hochformat-Komposition.
- **Die Hero-Poster sind generiert, nicht gemalt:** `npm run poster` (bei
  laufendem `npm start`) rendert sie aus der echten Szene. Nach jeder Änderung an
  Palette, Kamera oder Geometrie neu erzeugen — sonst zeigt das Standbild etwas
  anderes als der Canvas, über den es blendet.
- **Der Canvas rendert on demand**, nicht mit 60fps. Frames entstehen nur durch
  `invalidate()` — bei Scroll und solange die Dämpfung nachschwingt. Eine
  permanente Eigenbewegung (z. B. Wellen-Drift) würde das aushebeln.
- **Farben ausschließlich aus `tailwind.config.ts`.** Zwei Stellen weichen
  begründet ab (im Code kommentiert), weil `steel` auf `ink` nur 2,84:1
  Kontrast erreicht und damit unter dem WCAG-Minimum liegt.
- **Alle Texte in `lib/content.ts`**, keine Strings in Komponenten. Jede Passage
  trägt ihre Kapitel-Referenz aus dem Business Case.
- **Die Brotkrumen sind bewusst einzeilig** (`whitespace-nowrap`). Die
  Mono-Schrift lädt nachrangig; brach die Brotkrume im Fallback um und sprang
  beim Swap auf eine Zeile zurück, schob das die ganze Unterseite 21 px nach oben
  — gemessen CLS 0,144, jetzt 0,0002. Auf der Startseite fiel das nie auf, weil
  die Eyebrow dort absolut im Hero liegt. Mobil steht statt des vollen Pfads ein
  Rücksprung („Alle Leistungen"): „Start · Leistungen · Wasserschadensanierung"
  braucht 358 px und war auf jedem gängigen Handy abgeschnitten.
- **Fotos werden nicht eingefärbt.** `components/ui/Photo.tsx` fasst sie in
  Hairline-Rahmen und einen ink-Verlauf, der sie an die Seitenfläche bindet und
  die Bildunterschrift trägt. Kein Duotone, kein Blaustich: Die Farbe ist der
  Grund, warum die Fotos da sind (Kundenwunsch). Sie werden gefasst, nicht
  retuschiert.

## Qualitätsstand

Lighthouse (Produktionsbuild, echte Drosselung):

| | Performance | A11y | Best Practices | SEO |
|---|---|---|---|---|
| Desktop | 100 | 100 | 100 | 100 |
| Mobil | 90 | 100 | 100 | 100 |

Geprüft: 5 Viewport-Breiten (320–1920px) × 16 Seiten, kein horizontaler
Überlauf, keine JS-Fehler, je genau ein `h1`.

`robots.txt` und `sitemap.xml` werden aus Code erzeugt (`app/robots.ts`,
`app/sitemap.ts`) — die Sitemap zieht die Leistungsseiten aus `servicePages`,
eine neue Leistung steht dadurch automatisch drin. Sie listet die 12
indexierbaren Seiten; die vier Rechtsseiten fehlen bewusst, sie stehen auf
`noindex` (eine Sitemap, die `noindex`-Seiten anmeldet, meldet Google als
Fehler). `robots.txt` sperrt nur `/api/` — die Rechtsseiten NICHT: `disallow`
verbietet das Crawlen, nicht das Indexieren; Google sähe ihr `noindex` dann nie.
