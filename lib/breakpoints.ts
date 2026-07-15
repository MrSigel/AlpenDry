/**
 * Wann läuft der scroll-getriebene 3D-Hero?
 *
 * Diese Bedingung steht bewusst an EINER Stelle, weil zwei Systeme sie brauchen:
 *   - Tailwind (`hero-3d:` Variante) → die HÖHE des Hero-Containers. CSS, gültig
 *     ab dem ersten Byte, deshalb ohne Layout-Sprung.
 *   - HeroScene (matchMedia) → ob Canvas und Overlay-Blende überhaupt laufen.
 *
 * Liefen die beiden auseinander, entstünde genau der Fehler, den sie verhindern
 * sollen: eine 250vh lange Scroll-Strecke, in der sich nichts bewegt.
 *
 * Die drei Teile:
 *   min-width: 1024px   — darunter ist der Berg nur noch ein Fleck hinter dem
 *                         Titel; die Kamerafahrt erzählt dort nichts mehr.
 *   pointer: fine       — Maus/Trackpad. Schließt Tablets im Querformat aus, die
 *                         die Breite hätten, aber nicht die GPU.
 *   prefers-reduced-motion: no-preference
 *                       — Nutzerpräferenz. Ersetzt die frühere JS-Sonderlocke:
 *                         ohne Bewegung braucht es auch keine Scroll-Strecke.
 *
 * Trifft eines davon nicht zu, ist der Hero ein ruhiges Standbild in genau einer
 * Bildschirmhöhe — und three.js (≈1,1 MB) wird nie geladen.
 */
export const HERO_3D_QUERY =
  "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
