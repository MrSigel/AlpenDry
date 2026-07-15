/**
 * Standbild des Eisbergs — das, was der 3D-Canvas in seiner Startposition zeigt.
 *
 * Zweck (zwei Fliegen):
 *  1. Es steht sofort im Bild, während three.js (≈1,1 MB) noch gar nicht
 *     geladen ist. Ohne das wäre der Hero anfangs eine leere dunkle Fläche und
 *     der Berg würde später sichtbar „hineinpoppen".
 *  2. Bei `prefers-reduced-motion` ist es die EINZIGE Darstellung — dann wird
 *     der komplette WebGL-Stack nie geladen. plan.md §3 fordert dort ohnehin
 *     nur ein Standbild.
 *
 * Bewusst `<picture>` statt next/image: Desktop und Mobil brauchen
 * unterschiedliche Motive (die Kamera steht anders, siehe IcebergCanvas), und
 * `media` löst das ohne Layout-Tricks. Die Dateien sind bereits als WebP
 * optimiert (je ~54 KB), eine Laufzeitoptimierung bringt hier nichts mehr.
 *
 * Rein dekorativ — die Aussage des Heros trägt das h1. Das leere `alt` nimmt
 * es aus dem Accessibility-Tree; `aria-hidden` gehört ans <img>, nicht ans
 * <picture> (das trägt keine ARIA-Attribute).
 */
export function HeroPoster() {
  return (
    <picture>
      <source media="(max-width: 899px)" srcSet="/brand/hero-mobile.webp" />
      <img
        src="/brand/hero-desktop.webp"
        alt=""
        aria-hidden="true"
        // Kein lazy: Das Bild steht im ersten Sichtfeld und ist der
        // sichtbare Inhalt, solange der Canvas fehlt.
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </picture>
  );
}
