# plan.md — AlpenDry Website

> Umsetzungsplan für Claude Code. Erst lesen, dann bauen. Reihenfolge einhalten.
> Verbindliche Referenz: `claude-code-prompt.md` (Master-Briefing) + dieses Dokument.

---

## 0. Design-Direktive (nicht verhandelbar)

**Zielbild:** Ultra-professionell, elegant, ruhig, premium. Kein „AI-Template"-Look,
kein Vibe-Coding-Design. Die Website soll aussehen wie von einem Studio, das für
einen hochpreisigen Handwerksbetrieb eine eigenständige visuelle Identität baut.

**Wo die Boldness sitzt:** ausschließlich im 3D-Eisberg-Hero. Alles drumherum ist
diszipliniert, ruhig, viel „Schwarzraum", präzise Typografie. Chanel-Regel: ein
Signature-Element, der Rest zurückhaltend.

**Verboten:**
- Generische Gradient-Blobs, Glow-Overkill, bunte Icon-Sets, Emoji als Deko.
- Andere Farben als die im Logo definierten (siehe `theme` / `tailwind.config`).
- „Cards mit Schlagschatten überall"-Ästhetik. Tiefe entsteht über Farbe & Kanten,
  nicht über weiche graue Shadows.
- Übertriebene Scroll-Effekte. Motion ist dezent, orchestriert, zweckdienlich.
- Stockfoto-Vibes. Bildplatzhalter klar als Platzhalter markieren.

---

## 1. Tech-Stack & Setup

- Next.js 14+ (App Router), TypeScript (strict), Tailwind CSS.
- 3D: `@react-three/fiber`, `@react-three/drei`, `three`, `@react-three/postprocessing`.
- Motion: `framer-motion` (Scroll-Reveals, Micro-Interactions).
- Fonts über `next/font` (kein externer CDN-Call zur Laufzeit).
- Deployment-Ready für IONOS (statischer/serverseitiger Export je nach Formular-Backend).
- ESLint + Prettier, saubere Ordnerstruktur.

```
/app
  layout.tsx            → Fonts, Metadata, JSON-LD (LocalBusiness), StickyCTA
  page.tsx              → Startseite: Sektionen in Reihenfolge
  impressum/page.tsx
  datenschutz/page.tsx
  /api/kontakt/route.ts → Formular-Handler (E-Mail an info@alpendry.de)
/components
  hero/Iceberg.tsx      → 3D-Mesh (Eis, Wasser, Nebel, Licht)
  hero/HeroScene.tsx    → Canvas + ScrollControls + Kamera-Orbit-Logik
  hero/HeroOverlay.tsx  → H1, Sub, CTAs, Claim (über Canvas)
  layout/Header.tsx
  layout/StickyCTA.tsx  → Desktop-Kopfzeile + Mobile-Bottom-Bar
  layout/Footer.tsx
  sections/Positioning.tsx
  sections/Services.tsx
  sections/Region.tsx
  sections/Process.tsx      → 6-Schritte-Stepper
  sections/Trust.tsx        → Bewertungen + „Bekannt aus der Presse"
  sections/Faq.tsx          → Accordion + FAQ-JSON-LD
  sections/Contact.tsx      → Formular + WhatsApp + Telefon
  ui/CTAButton.tsx
  ui/SectionLabel.tsx       → Eyebrow-Label
  ui/Reveal.tsx             → Framer-Motion Scroll-Reveal-Wrapper
/lib
  seo.ts               → Metadata-Helper
  jsonld.ts            → LocalBusiness, FAQPage, BreadcrumbList
  content.ts           → ALLE Texte zentral (aus Business Case, wörtlich)
/styles
  globals.css          → CSS-Variablen (Farbtokens), Basistypografie
/public
  /brand               → Logo (SVG rekonstruiert), Favicon
  /placeholders        → klar markierte Bildplatzhalter
```

---

## 2. Baureihenfolge (Phasen)

**Phase A — Fundament**
1. Projekt-Setup, Tailwind-Theme mit Farbtokens (siehe `tailwind.config.ts`).
2. `globals.css`: CSS-Variablen, Typo-Basis, Fokus-Styles, `prefers-reduced-motion`.
3. Fonts einbinden (Display + Body + Mono/Utility).
4. Layout-Grundgerüst: Header, Footer, StickyCTA (Desktop + Mobile-Bottom-Bar).
5. `content.ts` mit allen Texten befüllen (aus Business Case).

**Phase B — Signature (3D-Hero)**
6. `Iceberg.tsx`: Eis-Mesh (transluzentes PBR-Material), Wasserebene, Fog, Licht.
7. `HeroScene.tsx`: Canvas, `ScrollControls`, Kamera-Orbit + Damping.
8. `HeroOverlay.tsx`: Text/CTAs über Canvas, Lesbarkeits-Overlay.
9. Reduced-Motion-Fallback: schönes Standbild statt Rotation.
10. Mobile-Performance: reduziertes Polycount/Postprocessing, `<Suspense>`.

**Phase C — Sektionen** (Texte aus `content.ts`, Blickführung Problem→Lösung→Kontakt)
11. Positioning („Die Spitze des Eisbergs").
12. Services (Alles aus einer Hand) + Technik/Fuhrpark + Versicherung.
13. Region (Einsatzgebiet, stilisiert).
14. Process (6-Schritte-Stepper).
15. Trust (Bewertungen + Presse-Siegel).
16. FAQ (Accordion + Schema).
17. Contact (Formular exakt nach Spec + WhatsApp + Telefon).
18. Footer + Impressum/Datenschutz-Platzhalter.

**Phase D — SEO / AEO / GEO & Feinschliff**
19. Metadata pro Seite, Open Graph, Titles/Descriptions.
20. JSON-LD: LocalBusiness (24/7, Adresse, Geo, Tel), FAQPage, BreadcrumbList.
21. Lighthouse-Pass: Performance, A11y, Best Practices, SEO.
22. Farb-Audit: jede Komponente gegen die erlaubte Palette prüfen.
23. Selbstkritik-Pass (siehe §6).

---

## 3. Das 3D-Hero im Detail

**Metapher (Business Case, Kap. 2):** Der Eisberg. Über Wasser = sichtbare
Sanierung/Trocknung. Unter Wasser = volles Leistungsspektrum. Beim Scrollen
umrundet die Kamera den Eisberg und taucht leicht ab.

**Szene**
- Eis-Mesh: verfeinertes Icosahedron mit Displacement ODER GLB. Material PBR,
  leicht transluzent (`transmission`/`roughness`), getönt `steel-blue → silver`.
  Unter Wasser dunkler (`navy`/`black-2`).
- Wasserfläche: Ebene mit Reflexion/Refraktion, `black-2`, sanfte Wellen.
- Fog: volumetrischer Nebel `navy`/`steel-blue` (Berg-im-Nebel-Stimmung).
- Licht: kühles Key-Light oben (silbrig-weiß), Rim-Light `royal-blue` an Eiskanten,
  Ambient sehr dunkel.

**Scroll-Steuerung**
- `useScroll` (drei) oder Framer-Scroll-Progress.
- Kamera-Azimut 0° → ~120° (sanft, `damp`/lerp, kein Ruckeln).
- Kamera senkt sich, Wasserlinie wandert nach oben → Untersicht auf Eismasse.
- Dezenter Bloom auf Royalblau-Kanten.

**Qualität**
- 60fps Desktop, stabile fps Mobile. Kein Layout-Shift.
- `prefers-reduced-motion` → statisches Standbild.
- Text/CTA immer lesbar: dunkler Verlauf von unten (`black`).

---

## 4. Pflicht-Bausteine (aus Business Case)

- **Sticky-CTA:** Notruf + WhatsApp im ersten Sichtfeld, auf jeder Seite.
  Mobile: fixierte Bottom-Bar (Anrufen | WhatsApp), wandert beim Scrollen mit.
  Jeder Abschnitt endet mit derselben Aufforderung.
- **Kontaktformular (exakt, nicht mehr Felder):** Name & Tel · Ort/PLZ ·
  Art des Schadens (akuter Wasserschaden · Lecksuche · Schimmel · Sonstiges) ·
  Kurzbeschreibung & Foto-Upload · DSGVO-Häkchen. In < 1 Min ausfüllbar.
- **WhatsApp-Button:** öffnet Chat mit vorbereiteter Nachricht beim Ansprechpartner.
- **6-Schritte-Ablauf:** Anruf → Sofortmaßnahmen → Analyse/Feuchtemessung →
  Sanierungsplan/Freigabe → Trocknung/Sanierung → Abnahme/Übergabe.
- **Vertrauen:** Google-Bewertungen (Sterne in Royalblau/Silber, nicht Gold),
  Siegel „Bekannt aus der Presse.", 20 Jahre Erfahrung, zertifizierter Schimmelexperte.

---

## 5. SEO / AEO / GEO

- Saubere Semantik (genau ein h1, sinnvolle h2/h3).
- Regionale Keywords: Wasserschaden, Lecksuche, Schimmel + München/Augsburg/
  Landsberg/Tegernsee/Murnau.
- Metadata pro Seite, Open Graph, sprechende Titles/Descriptions.
- JSON-LD: LocalBusiness (Adresse, Geo, `openingHours` 24/7, `telephone`),
  FAQPage, BreadcrumbList.
- AEO: Frage-Antwort-Blöcke (Was tun bei Wasserschaden? Wer zahlt die Trocknung?).
- Performance/CWV: optimierte Assets, blitzschnelle Ladezeit.

---

## 6. Selbstkritik-Checkliste (vor „fertig")

- [ ] Sieht der Hero aus wie ein bewusst gebautes Signature-Element — nicht wie ein
      Standard-Three.js-Demo?
- [ ] Nur die erlaubten Farben? (Komponente für Komponente prüfen.)
- [ ] Ruhe & Weißraum gewahrt, keine Deko ohne Funktion?
- [ ] Typografie mit klarer Hierarchie, Display mit Zurückhaltung eingesetzt?
- [ ] CTA nach jedem Abschnitt, Sticky-CTA auf jeder Seite, Mobile-Bottom-Bar da?
- [ ] Formular exakt nach Spec, DSGVO-konform, < 1 Min?
- [ ] `prefers-reduced-motion` respektiert, Tastatur-Fokus sichtbar, mobil einwandfrei?
- [ ] Lighthouse: Performance/A11y/SEO im grünen Bereich?
- [ ] Ein Accessoire zu viel? → entfernen.
