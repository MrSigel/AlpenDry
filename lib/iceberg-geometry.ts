import {
  BufferAttribute,
  Color,
  IcosahedronGeometry,
  MathUtils,
  type BufferGeometry,
} from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { fbm } from "./noise";
import { palette } from "./palette";

/**
 * Berg-Geometrie — prozedural, deterministisch, ohne externes Asset.
 *
 * SIEHT AUS WIE EIN BERG, VERHÄLT SICH WIE EIN EISBERG.
 * Auf Kundenwunsch ein echter Alpengipfel — Fels und Schnee statt eines
 * verspielten Eiskristalls (die Anmutung der Visitenkarte: fast blauschwarzer
 * Fels, weiße Schneefelder). Die Masse unter der Wasserlinie bleibt, denn sie
 * IST die Metapher (Business Case Kap. 2, „Nur die Spitze des Eisbergs") und
 * trägt die gesamte Hero-Choreografie.
 *
 * Die Form:
 *   Über der Wasserlinie (y = 0) ein scharfer Hauptgipfel mit Nebengraten —
 *   die sichtbare Sanierung und Trocknung.
 *   Darunter die eigentliche Masse: bauchig knapp unter der Oberfläche, dann in
 *   die Tiefe zulaufend — das volle Leistungsspektrum.
 *
 * ZUR LOGO-KONTUR: Der Berg dreht sich beim Scrollen. Die exakte Silhouette der
 * Wort-Bild-Marke wäre deshalb nur aus genau einem Blickwinkel zu sehen — und
 * aus allen anderen ein Zufallsprofil. Übernommen ist stattdessen ihr CHARAKTER:
 * ein dominanter Gipfel, davon abfallende Grate, Nebengipfel als Schultern. Das
 * liest sich aus jeder Drehung als dieselbe Marke.
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
/** Höher als in der Eis-Fassung (1.15): ein Gipfel ist schlanker als ein Brocken. */
const PEAK_SCALE = 1.42;
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
 *           der Fels von einer Kartoffel unterscheidet
 * `rock`  — zweite Gratoktave: Felsstruktur in mittlerem Maßstab
 * `fine`  — feine Kantenunruhe
 *
 * Gegenüber der Eis-Fassung deutlich mehr Grat und mehr Feinstruktur: Ein
 * Alpengipfel ist zerklüftet, ein Eiswürfel glatt. Das ist möglich, seit die
 * Facetten weg sind (smooth shading, siehe Iceberg.tsx) — vorher wurde jede
 * kleine Störung zu einer eigenen Facette und die Form las sich als
 * Tannenzapfen. Jetzt trägt die Schattierung die Struktur.
 */
function radiusAt(x: number, y: number, z: number): number {
  const base = fbm(x * 1.35, y * 1.35, z * 1.35, 4);
  const ridge = 1 - Math.abs(fbm(x * 2.6, y * 2.6, z * 2.6, 3));
  const rock = 1 - Math.abs(fbm(x * 5.2, y * 5.2, z * 5.2, 3));
  /*
   * Feine Oktave bewusst schwach. Sie darf die NORMALEN nicht aufrauen: Auf
   * ihnen sitzt die Schneeverteilung (applyRockAndSnow liest die Neigung).
   * Mit 0.028 sprang die Neigung von Vertex zu Vertex und der Schnee fiel als
   * Salz-und-Pfeffer-Sprenkel aus statt als zusammenhängendes Feld.
   * Die Felsstruktur trägt die mittlere Oktave (`rock`), die grob genug ist,
   * um die Normalen zusammenhängend zu lassen.
   */
  const fine = fbm(x * 11.0, y * 11.0, z * 11.0, 2);

  return (
    1 + 0.3 * base + 0.2 * (ridge - 0.5) + 0.06 * (rock - 0.5) + 0.009 * fine
  );
}

/**
 * Grate, die vom Gipfel abfallen — der Charakter der Wort-Bild-Marke.
 *
 * Echte Berge haben Arête-Grate, die sternförmig vom Hauptgipfel weglaufen;
 * das Logo zeigt genau das (ein dominanter Gipfel, davon abfallende Kanten,
 * seitliche Nebengipfel). `cos(3·θ)` legt drei solche Grate um den Berg — aus
 * jeder Drehung sieht man deshalb einen Hauptgipfel mit Schultern statt eines
 * beliebigen Klumpens.
 *
 * Nur über Wasser und nach oben auslaufend (`1 - t`): Am Gipfel selbst laufen
 * die Grate zusammen, sonst bekäme die Spitze einen dreiblättrigen Stern.
 */
function aretes(x: number, z: number, t: number): number {
  const theta = Math.atan2(z, x);
  return 1 + 0.17 * Math.cos(3 * theta + 0.6) * (1 - t);
}

/**
 * Vertikales Profil — verwandelt die verrauschte Kugel in einen Berg.
 * Arbeitet in-place auf (x, y, z) und gibt das Ergebnis als Tupel zurück.
 */
function profile(x: number, y: number, z: number): [number, number, number] {
  if (y >= 0) {
    /*
     * Über Wasser: nach oben verjüngen → Gipfel statt Kuppel.
     *
     * Schärfer als in der Eis-Fassung (dort 0.55 / Exponent 1.3): Der niedrige
     * Exponent zieht die Verjüngung schon knapp über der Wasserlinie an, die
     * Flanken laufen dadurch gerade nach oben zusammen statt sich erst spät
     * einzuschnüren — ein Horn wie im Logo, keine Kuppel.
     */
    const t = Math.min(y, 1);
    const taper = 1 - 0.72 * Math.pow(t, 1.05);
    const w = taper * aretes(x, z, t);
    return [x * w, y * PEAK_SCALE, z * w];
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
  const raw = new IcosahedronGeometry(1, detail);
  const pos = raw.attributes.position;

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

  /*
   * PFLICHT für die weiche Schattierung — nicht optional.
   *
   * IcosahedronGeometry ist non-indexed: Jedes Dreieck bringt eigene Eckpunkte
   * mit, auch wenn Nachbarn exakt dieselbe Position haben. computeVertexNormals
   * mittelt dann nur über EIN Dreieck und liefert Flächennormalen — die
   * Geometrie sieht facettiert aus, selbst ohne `flatShading`. Genau daran lag
   * es, dass der Berg nach dem Entfernen des Flags immer noch wie ein
   * geschliffener Kristall wirkte.
   *
   * mergeVertices() verschweißt die Dubletten zu indizierter Geometrie; erst
   * dann mittelt computeVertexNormals über alle angrenzenden Dreiecke und der
   * Fels bekommt echte weiche Normalen. Läuft einmal beim Aufbau (useMemo),
   * kostet zur Laufzeit nichts — und spart nebenbei rund zwei Drittel der
   * Vertices.
   *
   * Sicher, weil das Displacement rein aus der normalisierten Position folgt:
   * Deckungsgleiche Vertices liegen auch nach der Verformung deckungsgleich.
   */
  const geometry = mergeVertices(raw);
  raw.dispose();

  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  geometry.computeBoundingBox();

  // Erst nach computeVertexNormals(): die Schneeverteilung liest die Neigung.
  applyRockAndSnow(geometry);

  return geometry;
}

/**
 * Fels und Schnee als Vertex-Farben.
 *
 * DAS ist der Unterschied zwischen Eiskristall und Alpengipfel — mehr noch als
 * die Form. Vorbild ist die Visitenkarte der Kundin: fast blauschwarzer Fels,
 * weiße Schneefelder, kühles Licht.
 *
 * Wo liegt Schnee? Auf einem echten Berg an zwei Bedingungen geknüpft:
 *   HÖHE  — unterhalb der Schneegrenze bleibt der Fels frei.
 *   NEIGUNG — auf steilen Flanken hält kein Schnee, er rutscht ab. Deshalb
 *             zeichnen sich an einem verschneiten Berg die Grate und Steilstufen
 *             dunkel ab. Genau dieses Wechselspiel macht ihn lesbar.
 * `normal.y` liefert die Neigung: 1 = waagerecht nach oben, 0 = senkrecht.
 * Beides zusammen erzeugt Schneefelder, die der Form folgen, statt einer
 * gleichmäßig weißen Zuckerglasur.
 *
 * Unter Wasser gibt es weder Schnee noch Sonne: Dort läuft der Fels ins Dunkle,
 * Blaue aus — das zahlt auf die Metapher ein (die verborgene Masse liegt kühler
 * und tiefer als die sichtbare Spitze) und lässt ihn sauber in den Nebel gehen.
 *
 * ALLE Töne stammen aus der Logo-Palette: deep/steel für Fels, frost/snow für
 * Schnee, abyss für die Tiefe. Keine Fremdfarbe (tailwind.config.ts).
 *
 * `vertexColors` multipliziert diese Farbe mit `material.color`; das Material
 * bleibt deshalb auf snow (Weiß = neutraler Multiplikator).
 *
 * Braucht die Normalen — also erst NACH computeVertexNormals() aufrufen.
 */
function applyRockAndSnow(geometry: BufferGeometry) {
  const pos = geometry.attributes.position;
  const nor = geometry.attributes.normal;
  const box = geometry.boundingBox!;
  const maxY = box.max.y;
  const minY = box.min.y;

  /*
   * Fels: DUNKLER als der Nebel (der ist `deep`, siehe Atmosphere).
   *
   * Erster Versuch war `deep` — also exakt die Nebelfarbe. Der Berg hatte dann
   * keinen Kontrast zum Hintergrund und versank als graublauer Fleck darin.
   * Die Visitenkarte macht es richtig: fast schwarzer Fels vor hellerem Himmel,
   * die Helligkeit trägt der Schnee. `abyss` liegt eine Stufe unter dem Nebel
   * und gibt genau diese Silhouette.
   */
  const rockDark = new Color(palette.abyss);
  const rockLit = new Color(palette.steel);
  /** Schnee: nie ganz rein — reines Weiß frisst die Form auf. */
  const snowTone = new Color(palette.snow);
  const snowShade = new Color(palette.frost);
  /** Tiefe: läuft in die Fläche aus, damit der Fuß im Nebel verschwindet. */
  const abyssTone = new Color(palette.ink);

  const c = new Color();
  const rock = new Color();
  const snow = new Color();
  const colors = new Float32Array(pos.count * 3);

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const slope = MathUtils.clamp(nor.getY(i), 0, 1);

    if (y >= 0) {
      /** 0 an der Wasserlinie, 1 am Gipfel. */
      const h = MathUtils.clamp(y / maxY, 0, 1);

      // Fels: unten dunkel, nach oben aufklarend (Luftperspektive).
      rock.copy(rockDark).lerp(rockLit, Math.pow(h, 1.2) * 0.7);

      /*
       * Die Schneegrenze verläuft nicht auf einer Höhenlinie — sie franst aus:
       * In Mulden und Rinnen liegt Schnee tiefer, auf sonnigen Rippen höher.
       * Eine grobe Rauschoktave verschiebt sie deshalb pro Region um ±0.1.
       * Ohne das zieht sich ein sichtbar gleichmäßiger Ring um den Berg.
       */
      const drift = 0.1 * fbm(x * 1.8, y * 1.8, z * 1.8, 2);

      /*
       * Schneegrenze bewusst tief und die Neigungsschwelle großzügig: Der Berg
       * steht klein im Bild, und Schnee ist das Einzige, was hier wirklich
       * hell ist — er trägt die Lesbarkeit der Form. Mit den ersten,
       * „realistischeren" Werten (0.3/0.65 und 0.42/0.78) blieben nur ein paar
       * Sprenkel am Gipfel und der Berg las sich als dunkler Klumpen.
       */
      const heightMask = MathUtils.smoothstep(h + drift, 0.12, 0.44);
      // Hält ab ~45° Neigung, sicher auf allem Flacheren.
      const slopeMask = MathUtils.smoothstep(slope, 0.28, 0.68);
      const cover = heightMask * slopeMask;

      // Schnee im Schatten bläulich, auf der Fläche weiß.
      snow.copy(snowShade).lerp(snowTone, MathUtils.smoothstep(slope, 0.6, 0.95));
      c.copy(rock).lerp(snow, cover);
    } else {
      // Unter Wasser: vom Fels an der Linie ins Abyss der Tiefe.
      const d = MathUtils.clamp(y / minY, 0, 1);
      c.copy(rockDark).lerp(abyssTone, Math.pow(d, 0.7));
    }

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
