# AlpenDry — Website

Wasserschadensanierung, Lecksuche und Schimmelsanierung am Alpenrand.
Next.js (App Router) · TypeScript · Tailwind · React Three Fiber · Framer Motion.

## Entwicklung

```bash
npm install
cp .env.example .env.local   # SMTP-Zugangsdaten eintragen
npm run dev
```

## Vor dem Livegang — offene Punkte

Diese Stellen sind bewusst markiert und brauchen eine Entscheidung:

| Was | Wo | Warum offen |
|---|---|---|
| **Geo-Koordinaten** | `lib/content.ts` → `contact.geo` | Zeigen aufs Ortszentrum Murnau, nicht auf Neu-Egling 33. Falsche Koordinaten schaden dem lokalen Ranking. |
| **Google-Bewertungen** | `lib/content.ts` → `trust.reviewsActive` | Steht auf `false`. Erst mit echten Zahlen aus dem Unternehmensprofil aktivieren — erfundene Bewertungen sind irreführende Werbung. |
| **Presse-Siegel** | `lib/content.ts` → `trust.pressSealActive` | Steht auf `false`. Darf laut Business Case Kap. 9 erst erscheinen, wenn der Artikel wirklich veröffentlicht ist (sonst § 5 UWG). |
| **FAQ-Antworten** | `lib/content.ts` → `faq` | Mit `@freigabe` markiert: aus belegten Fakten abgeleitet, im Business Case aber nicht wörtlich beantwortet. Fachlich prüfen. |
| **Mail-Ziel** | `.env` → `CONTACT_TO` | Aktuell eine Testadresse. Vor Livegang auf `info@alpendry.de` umstellen. |
| **Rechtstexte** | `lib/legal.ts`, `lib/agb.ts` | Kein Rechtsrat. Fachkundig prüfen lassen — besonders AGB § 15 (Haftung) und § 19 (Gerichtsstand) gegenüber Verbrauchern. |
| **Google Analytics** | `lib/consent.ts` | Consent-Unterbau steht, GA ist noch nicht eingebunden. Mess-ID ergänzen; es lädt ausschließlich nach Einwilligung. |

## Hosting

Braucht **Node-Hosting** (IONOS Deploy Now oder VPS) — kein statischer Export:
`/api/kontakt` versendet das Kontaktformular serverseitig per SMTP.

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

## Qualitätsstand

Lighthouse (Produktionsbuild, echte Drosselung):

| | Performance | A11y | Best Practices | SEO |
|---|---|---|---|---|
| Desktop | 100 | 100 | 100 | 100 |
| Mobil | 90 | 100 | 100 | 100 |

Geprüft: 7 Viewport-Breiten (320–1920px) × 5 Seiten, kein horizontaler
Überlauf, keine JS-Fehler.
