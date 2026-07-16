/**
 * Echtes Foto im Markenrahmen.
 *
 * WARUM ES DIESE KOMPONENTE GIBT
 * Die Fotos stammen von der Kundin (eigene Aufnahmen aus dem Einsatzgebiet) und
 * sind sommerlich-grün — die Seite ist dunkelblau. Ungefasst würde jedes davon
 * wie ein aufgeklebtes Stockfoto wirken; genau das verbietet plan.md §0, und der
 * Business Case (Kap. 6) verlangt ausdrücklich „echte Bilder … statt
 * austauschbarer Stockfotos".
 *
 * Die Fassung macht drei Dinge — bewusst wenig, aber konsequent:
 *   1. Hairline-Rahmen wie bei jeder Card: das Foto sitzt IM Raster, nicht daneben.
 *   2. Ein Verlauf aus `ink` von unten. Er bindet das Bild an die Seitenfläche,
 *      statt es als hellen Block darauf schweben zu lassen — dieselbe Mechanik
 *      wie beim Hero-Scrim, und er trägt zugleich die Bildunterschrift.
 *   3. Eine Bildunterschrift. Ein Foto ohne Aussage ist Deko; mit Aussage ist es
 *      Information. plan.md §0: „keine Deko ohne Funktion".
 *
 * KEIN Duotone, kein Blaustich-Filter: Die Farbe ist der Grund, warum die Fotos
 * hier sind. Sie wird gefasst, nicht wegretuschiert.
 *
 * Bewusst `<img srcset>` statt next/image: Die Dateien liegen bereits in genau
 * den zwei Breiten vor, die vorkommen (1× und 2×) — konsistent mit HeroPoster.
 * Eine Laufzeit-Optimierung würde sie ein zweites Mal durch die Mangel drehen.
 *
 * `width`/`height` sind Pflicht: Ohne sie hat das Bild vor dem Laden keine Höhe
 * und schiebt beim Eintreffen das halbe Layout nach unten (CLS).
 */
export function Photo({
  src,
  srcWide,
  width,
  height,
  alt,
  caption,
  className = "",
  priority = false,
  sizes,
}: {
  /** Kleinere Fassung. Die Breite in Pixeln muss dem Dateinamen entsprechen. */
  src: string;
  /** Größere Fassung — für breite Spalten und Retina. */
  srcWide: string;
  /** Intrinsische Maße der GRÖSSEREN Fassung (Seitenverhältnis, gegen CLS). */
  width: number;
  height: number;
  /** Was auf dem Bild zu sehen ist — für Screenreader und wenn es nicht lädt. */
  alt: string;
  /** Sichtbare Bildunterschrift. Macht aus Deko Information. */
  caption?: string;
  className?: string;
  /** Nur für Bilder im ersten Sichtfeld. Sonst bleibt es bei lazy. */
  priority?: boolean;
  /** Pflicht: Ohne `sizes` nimmt der Browser 100vw an und lädt zu groß. */
  sizes: string;
}) {
  /**
   * Breiten-Deskriptoren (`600w`) statt `1x/2x`.
   *
   * Mit x-Deskriptoren entscheidet allein die Pixeldichte — `sizes` wird
   * ignoriert. Gemessen holte der Browser dadurch die 560-px-Datei in eine
   * 623 px breite Spalte und skalierte sie hoch. Mit w-Deskriptoren rechnet er
   * Layoutbreite × Pixeldichte und trifft die richtige Wahl.
   *
   * Die Breite steckt im Dateinamen (`-700.webp`) — eine Quelle, kein zweites
   * Feld, das man vergessen kann zu pflegen.
   */
  const widthOf = (url: string) => Number(url.match(/-(\d+)\.webp$/)?.[1] ?? 0);
  const srcSet = `${src} ${widthOf(src)}w, ${srcWide} ${widthOf(srcWide)}w`;
  return (
    <figure className={`relative overflow-hidden rounded-sm border border-hairline ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Die Dateien
          liegen bereits als WebP in genau den beiden Breiten vor, die
          vorkommen; next/image würde sie zur Laufzeit ein zweites Mal
          konvertieren. srcset/sizes/width/height liefern hier dasselbe
          Ergebnis. Gleiche Entscheidung wie in HeroPoster und Logo. */}
      <img
        src={srcWide}
        srcSet={srcSet}
        sizes={sizes}
        width={width}
        height={height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className="h-full w-full object-cover"
      />

      {/* Bindeglied zur Seitenfläche + Träger der Unterschrift. Ohne Caption
          bleibt ein schwacher Anschluss nach unten, damit die Bildkante nicht
          hart gegen den Sektionsgrund stößt. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 ${
          caption
            ? "h-2/5 bg-gradient-to-t from-ink via-ink/70 to-transparent"
            : "h-1/4 bg-gradient-to-t from-ink/60 to-transparent"
        }`}
      />

      {caption && (
        <figcaption className="absolute inset-x-0 bottom-0 px-5 py-4 font-mono text-2xs uppercase tracking-eyebrow text-frost md:px-6 md:py-5">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
