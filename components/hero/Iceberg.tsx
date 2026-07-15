"use client";

import { useMemo } from "react";
import { DoubleSide } from "three";
import { Environment, Lightformer } from "@react-three/drei";
import { createIcebergGeometry, ICEBERG_DETAIL } from "@/lib/iceberg-geometry";
import { palette } from "@/lib/palette";

/**
 * Das Eis-Mesh (plan.md §3).
 *
 * Material: MeshPhysicalMaterial, transluzent, getönt steel→frost.
 *   ior 1.31 ist der echte Brechungsindex von Eis — kein Zierwert, er
 *   entscheidet sichtbar über die Kantenbrechung.
 *   flatShading erzeugt die Facetten, die Eis von einer glatten Blase
 *   unterscheiden.
 *
 * `transmission` rendert die Szene in einen zusätzlichen Buffer und ist der
 * teuerste Posten der Szene — auf Mobile daher aus, ersetzt durch schlichte
 * Transparenz. Der Unterschied ist bei Telefon-Bildgröße kaum zu sehen,
 * die fps-Differenz erheblich.
 */
export function Iceberg({ quality = "high" }: { quality?: "high" | "low" }) {
  const geometry = useMemo(
    () =>
      createIcebergGeometry(
        quality === "high" ? ICEBERG_DETAIL.desktop : ICEBERG_DETAIL.mobile,
      ),
    [quality],
  );

  return (
    <mesh geometry={geometry} castShadow={false} receiveShadow={false}>
      <meshPhysicalMaterial
        // Weiß = neutraler Multiplikator. Die eigentliche Tönung
        // „steel-blue → silver" (plan.md §3) liegt als Vertex-Farbverlauf in
        // der Geometrie: unten stahlblau, oben silbrig.
        color={palette.snow}
        vertexColors
        roughness={0.34}
        metalness={0}
        ior={1.31}
        reflectivity={0.45}
        flatShading
        side={DoubleSide}
        // Eigenes, sehr schwaches Leuchten in Stahlblau: hält die Facetten
        // auch dort lesbar, wo weder Key- noch Rim-Light hinkommt — verhindert
        // das „dunkler Fels"-Problem, ohne die Szene zu überstrahlen.
        emissive={palette.steel}
        emissiveIntensity={0.18}
        // BEWUSST KEIN `transmission`: das rendert die komplette Szene pro
        // Frame ein zweites Mal in einen Puffer und war der größte Ruckler
        // der Fahrt. Bei diesen Kameradistanzen ist echte Refraktion ohnehin
        // unsichtbar — den Eis-Look tragen Facetten (flatShading), die
        // Vertex-Tönung, Env-Licht und Rim.
        // Ebenso bewusst OPAK: alpha-blending auf selbstüberlappender
        // Geometrie erzeugt Sortier-Flackern während der Bewegung.
        envMapIntensity={1.15}
        {...(quality === "high"
          ? { clearcoat: 0.7, clearcoatRoughness: 0.28, specularIntensity: 0.9 }
          : {})}
      />
    </mesh>
  );
}

/**
 * Beleuchtung (plan.md §3): kühles Key-Light oben, Rim-Light in glacier an den
 * Eiskanten, sehr dunkles Ambient.
 *
 * Die Environment-Map wird aus eigenen Lightformern gebaut statt über
 * `preset="..."` — ein Preset lädt eine HDRI von einem CDN, und plan.md §1
 * verbietet externe Laufzeit-Calls. `frames={1}` backt sie einmal; sie ist
 * statisch, also kostet sie danach nichts mehr.
 */
export function IcebergLighting({ quality = "high" }: { quality?: "high" | "low" }) {
  return (
    <>
      {/* Ambient — dunkel, aber genug, dass die Schattenseiten als Eis lesbar
          bleiben statt schwarz abzusaufen. Trägt vor allem die Startansicht,
          in der nur die kleine Spitze im Bild steht und die berg-nahen
          Punktlichter sie kaum erreichen. */}
      <ambientLight intensity={0.38} color={palette.frost} />

      {/* Key — kühl, silbrig-weiß, von oben vorne. Modelliert die Gipfelspitze. */}
      <directionalLight position={[3, 7, 4]} intensity={2.6} color={palette.snow} />

      {/* Rim — glacier an den Eiskanten, von hinten. Das ist die Kante,
          die der Bloom aufgreift. */}
      <directionalLight
        position={[-5, 2.5, -6]}
        intensity={3.6}
        color={palette.glacier}
      />

      {/* Back- und Fill-Light hängen NICHT hier, sondern in IcebergRig:
          sie müssen der Position des Bergs folgen (er steht rechts und
          steigt beim Scrollen), sonst laufen sie ihm davon. Die beiden
          Directional-Lights oben sind reine Richtungslichter und daher von
          der Position des Bergs unabhängig. */}

      <Environment resolution={quality === "high" ? 256 : 128} frames={1}>
        {/* Heller Himmel oben — Hauptquelle für die Transmission (leuchtendes Eis) */}
        <Lightformer
          intensity={2.6}
          color={palette.snow}
          position={[0, 7, -1]}
          scale={[14, 14, 1]}
        />
        <Lightformer
          intensity={3}
          color={palette.glacier}
          position={[-6, 2, -6]}
          scale={[8, 8, 1]}
        />
        <Lightformer
          intensity={1.4}
          color={palette.frost}
          position={[6, 1, 4]}
          scale={[6, 10, 1]}
        />
        <Lightformer
          intensity={0.4}
          color={palette.abyss}
          position={[0, -6, 0]}
          scale={[12, 12, 1]}
        />
      </Environment>
    </>
  );
}
