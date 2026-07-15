import {
  BufferAttribute,
  Color,
  IcosahedronGeometry,
  MathUtils,
  type BufferGeometry,
} from "three";
import { fbm } from "./noise";
import { palette } from "./palette";

/**
 * Eisberg-Geometrie — prozedural, deterministisch, ohne externes Asset.
 *
 * Die Form IST die Metapher (Business Case Kap. 2):
 *   Über der Wasserlinie (y = 0) ragt eine schmale, gezackte Spitze —
 *   die sichtbare Sanierung und Trocknung. Sie zitiert bewusst die Gipfel
 *   der Wort-Bild-Marke.
 *   Darunter liegt die eigentliche Masse: bauchig direkt unter der Oberfläche,
 *   dann in die Tiefe zulaufend — das volle Leistungsspektrum.
 *
 * Proportion: ~18 % über Wasser. Physikalisch korrekt wären ~11 %, aber dann
 * verschwindet die Spitze im Bild. 18 % liest sich als „Spitze des Eisbergs"
 * und bleibt gleichzeitig sichtbar.
 */

/**
 * Streckungsfaktoren, KEINE Weltkoordinaten — der Radius schwankt durch das
 * Rauschen um ±0.26, die tatsächliche Ausdehnung liegt also darüber.
 * Die echten Maße liefert `getIcebergBounds()` aus der Bounding Box.
 */
const PEAK_SCALE = 1.15;
const DEPTH_SCALE = 5.2;

/**
 * Auflösungsstufen. Facetten = 20·(detail+1)².
 * Mobile bekommt ~1/5 der Facetten — bei der dortigen Bildgröße nicht
 * unterscheidbar, aber deutlich billiger (plan.md §2, Punkt 10).
 */
export const ICEBERG_DETAIL = {
  desktop: 32, // 21.780 Faces
  mobile: 14, //   4.500 Faces
} as const;

/**
 * Radiusmodulation.
 * `base`  — grobe, unregelmäßige Silhouette
 * `ridge` — ridged noise (1 - |n|) erzeugt Grate statt Wellen: der Trick,
 *           der Eis und Fels von einer Kartoffel unterscheidet
 * `fine`  — feine Kantenunruhe
 */
function radiusAt(x: number, y: number, z: number): number {
  // Große, ruhige Grundform + moderate Grate. Die feine Oktave bewusst niedrig:
  // mit flatShading wird jede kleine Störung zu einer Facette, zu viel davon
  // liest sich als „Tannenzapfen" statt als Eismasse (plan.md §0: Ruhe).
  const base = fbm(x * 1.35, y * 1.35, z * 1.35, 4);
  const ridge = 1 - Math.abs(fbm(x * 2.6, y * 2.6, z * 2.6, 3));
  const fine = fbm(x * 6.0, y * 6.0, z * 6.0, 2);

  return 1 + 0.3 * base + 0.14 * (ridge - 0.5) + 0.022 * fine;
}

/**
 * Vertikales Profil — verwandelt die verrauschte Kugel in einen Eisberg.
 * Arbeitet in-place auf (x, y, z) und gibt das Ergebnis als Tupel zurück.
 */
function profile(x: number, y: number, z: number): [number, number, number] {
  if (y >= 0) {
    // Über Wasser: nach oben verjüngen → Gipfel statt Kuppel.
    const t = Math.min(y, 1);
    const taper = 1 - 0.55 * Math.pow(t, 1.3);
    return [x * taper, y * PEAK_SCALE, z * taper];
  }

  // Unter Wasser: Bauch knapp unter der Oberfläche, dann in die Tiefe zulaufend.
  const t = Math.min(-y, 1);
  const bulge = 1 + 0.45 * Math.sin(t * Math.PI * 0.85);
  const taperDown = 1 - 0.5 * Math.pow(t, 2.5);
  const w = bulge * taperDown;

  return [x * w, y * DEPTH_SCALE, z * w];
}

/**
 * Baut die Geometrie.
 *
 * ACHTUNG `detail`: three unterteilt PolyhedronGeometry linear, nicht rekursiv.
 * Die Facettenzahl ist 20·(detail+1)² — NICHT 20·4^detail.
 *   detail=32 → 21.780 Faces (Desktop)
 *   detail=14 →  4.500 Faces (Mobile)
 *   detail=5  →     720 Faces — viel zu grob, sichtbarer Klumpen.
 *
 * PolyhedronGeometry liefert non-indexed Vertices. Das Displacement leitet sich
 * allein aus der normalisierten Position ab, also verschieben sich doppelt
 * vorhandene Vertices identisch — keine Risse an den Facettengrenzen.
 */
export function createIcebergGeometry(
  detail: number = ICEBERG_DETAIL.desktop,
): BufferGeometry {
  const geometry = new IcosahedronGeometry(1, detail);
  const pos = geometry.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const px = pos.getX(i);
    const py = pos.getY(i);
    const pz = pos.getZ(i);

    // Auf die Einheitskugel normalisieren — eindeutige Richtung pro Vertex.
    const len = Math.hypot(px, py, pz) || 1;
    const nx = px / len;
    const ny = py / len;
    const nz = pz / len;

    const r = radiusAt(nx, ny, nz);
    const [x, y, z] = profile(nx * r, ny * r, nz * r);

    pos.setXYZ(i, x, y, z);
  }

  pos.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  geometry.computeBoundingBox();

  applyDepthTint(geometry);

  return geometry;
}

/**
 * Tönung „steel-blue → silver" (plan.md §3) als Vertex-Farben.
 *
 * Statt teurer Transmission mit Attenuation wird der Verlauf einmalig in die
 * Geometrie gebacken: unten (Tiefe) stahlblau, oben (Gipfel) silbrig-frost.
 * Kostet zur Laufzeit nichts und zahlt auf die Metapher ein — die verborgene
 * Masse liest sich kühler und tiefer als die sichtbare Spitze.
 *
 * `vertexColors` multipliziert diese Farbe mit `material.color`; das Material
 * bleibt deshalb auf snow (Weiß = neutraler Multiplikator).
 */
function applyDepthTint(geometry: BufferGeometry) {
  const pos = geometry.attributes.position;
  const box = geometry.boundingBox!;
  const minY = box.min.y;
  const maxY = box.max.y;

  /**
   * Wichtig: Vertex-Farben wirken MULTIPLIKATIV auf das Albedo. Reines `steel`
   * (ein dunkler Ton) unten würde das Eis nicht tönen, sondern absaufen lassen.
   * Der tiefste Ton ist deshalb steel, nur zu 55 % in frost eingemischt — ein
   * klarer Blaustich bei hoher Helligkeit.
   */
  const deepTone = new Color(palette.frost).lerp(new Color(palette.steel), 0.55);
  const midTone = new Color(palette.frost);
  const peakTone = new Color(palette.snow);
  const c = new Color();

  const colors = new Float32Array(pos.count * 3);

  for (let i = 0; i < pos.count; i++) {
    const t = MathUtils.clamp((pos.getY(i) - minY) / (maxY - minY), 0, 1);

    // Tiefe → Wasserlinie: stahlblau → silber. Der Exponent hält den Blaustich
    // unten und lässt ihn erst nach oben hin aufklaren.
    c.copy(deepTone).lerp(midTone, Math.pow(t, 0.85));
    // Nur die obersten ~20 % bekommen den letzten Stich Richtung Weiß.
    const peak = MathUtils.clamp((t - 0.8) / 0.2, 0, 1);
    c.lerp(peakTone, peak * 0.75);

    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geometry.setAttribute("color", new BufferAttribute(colors, 3));
}

/**
 * Tatsächliche Ausdehnung der erzeugten Geometrie.
 * Kamera-Framing, Fog-Grenzen und die Wasserlinie richten sich danach —
 * nicht nach den Streckungsfaktoren oben.
 */
export function getIcebergBounds(geometry: BufferGeometry) {
  const box = geometry.boundingBox;
  if (!box) {
    throw new Error("Bounding Box fehlt — createIcebergGeometry() zuerst aufrufen.");
  }
  return {
    peakY: box.max.y,
    depthY: box.min.y,
    radius: Math.max(box.max.x, box.max.z, -box.min.x, -box.min.z),
    /** Anteil der Masse über der Wasserlinie — die Metapher in Zahlen. */
    aboveWaterRatio: box.max.y / (box.max.y - box.min.y),
  };
}
