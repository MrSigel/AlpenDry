"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Color, FogExp2 } from "three";
import { palette } from "@/lib/palette";

/**
 * Feste Kamera + Atmosphäre.
 *
 * Die Kamera bewegt sich bewusst NICHT: Die Fahrt entsteht allein aus Drehung
 * und Hub des Eisbergs (siehe IcebergRig). Das ist ruhiger zu lesen, spart die
 * Fog-Umschaltung an der Wasserlinie und kostet keine Frames.
 *
 * Ihre STANDPOSITION steht ausschließlich hier — der Canvas gibt nur noch Optik
 * (fov/near/far) vor. Zwei Stellen wären eine Wahrheit zu viel.
 *
 * Wichtig: Die Clear-Color MUSS der Fog-Farbe entsprechen. Sonst steht die
 * Kante der Wasserebene als harte helle Linie vor schwarzem Himmel im Bild.
 * Mit identischer Farbe läuft der Horizont nahtlos in den Hintergrund aus.
 */

/**
 * Standpunkt je Bildformat.
 *
 * Der Blickwinkel (fov 45°) gilt VERTIKAL — im Hochformat bleibt die sichtbare
 * Höhe damit gleich, die Breite schrumpft aber auf ein Fünftel. Der Berg misst
 * rund 4 Einheiten und füllte aus 10.5 Einheiten Abstand exakt die volle Breite:
 * eine Wand statt eines Hintergrunds. Aus 15 Einheiten bleibt er darunter, und
 * der Nebel (quadratisch mit der Distanz) legt sich zusätzlich über ihn — genau
 * das Zurücktreten, das ein Hintergrund braucht.
 *
 * `tall` tritt nur beim Rendern des Mobil-Posters auf: Im Browser läuft der
 * Canvas ausschließlich unter HERO_3D_QUERY, also im Querformat.
 */
const CAMERA: Record<"wide" | "tall", readonly [number, number, number]> = {
  wide: [0, 2, 10.5],
  tall: [0, 2.2, 15],
};

const FOG_COLOR = palette.deep;
/**
 * Dichte bewusst niedrig: FogExp2 wächst quadratisch mit der Distanz, und der
 * Berg steht rund 11 Einheiten von der Kamera entfernt. Bei 0.062 lagen dort
 * schon ~39 % Nebel auf dem Eis und zogen es sichtbar ins Dunkle. 0.042
 * lässt das Eis klar und verschluckt die 120er-Wasserebene trotzdem lange
 * vor ihrer Kante (Sichtweite ~24 Einheiten).
 */
const FOG_DENSITY = 0.042;

export function Atmosphere({
  lookAtX = 0,
  lookAtY = 1.4,
}: {
  lookAtX?: number;
  lookAtY?: number;
}) {
  const { scene, camera, gl, size } = useThree();

  useEffect(() => {
    // react-hooks/immutability greift hier nicht: `scene` ist kein React-State,
    // sondern der three.js-Szenengraph. Ihn zu mutieren IST dessen API — R3F
    // gibt bewusst dieselbe Instanz zurück.
    /* eslint-disable react-hooks/immutability */
    scene.fog = new FogExp2(FOG_COLOR, FOG_DENSITY);
    scene.background = null;
    /* eslint-enable react-hooks/immutability */
    gl.setClearColor(new Color(FOG_COLOR), 1);

    camera.position.set(...CAMERA[size.height > size.width ? "tall" : "wide"]);
    camera.lookAt(lookAtX, lookAtY, 0);
    camera.updateProjectionMatrix();

    return () => {
      scene.fog = null;
    };
  }, [scene, camera, gl, lookAtX, lookAtY, size]);

  return null;
}
