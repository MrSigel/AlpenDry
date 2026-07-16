"use client";

import { useMemo } from "react";
import { DoubleSide } from "three";
import { Environment, Lightformer } from "@react-three/drei";
import { createIcebergGeometry, ICEBERG_DETAIL } from "@/lib/iceberg-geometry";
import { palette } from "@/lib/palette";

/**
 * Das Berg-Mesh (plan.md §3).
 *
 * AUF KUNDENWUNSCH FELS STATT EIS: „realistisch, nicht verspielt". Die
 * vorherige Fassung war transluzentes Eis mit Facetten (flatShading, ior 1.31,
 * clearcoat) — technisch korrekt für einen Eisberg, gelesen aber als
 * geschliffener Kristall. Jetzt ein Alpengipfel in der Anmutung der
 * Visitenkarte: matter, blauschwarzer Fels, weiße Schneefelder.
 *
 * Die drei Hebel, in dieser Reihenfolge wirksam:
 *   1. Farbe — Fels/Schnee nach Höhe UND Neigung (lib/iceberg-geometry.ts).
 *      Der mit Abstand größte Effekt.
 *   2. Schattierung — weiche Normalen statt Facetten.
 *   3. Material — matt (roughness 0.82) statt speckig.
 *
 * Die Masse unter Wasser bleibt: Sie trägt die Metapher (Business Case Kap. 2).
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
        // Weiß = neutraler Multiplikator. Fels- und Schneetöne liegen als
        // Vertex-Farben in der Geometrie (lib/iceberg-geometry.ts).
        color={palette.snow}
        vertexColors
        /*
         * Fels ist matt. 0.34 (die alte Eis-Fassung) ließ die ganze Masse
         * speckig glänzen — genau der „verspielte" Kristall-Look, der weg
         * sollte. 0.82 schluckt die Spiegelung; die Form trägt jetzt allein
         * das Licht.
         */
        roughness={0.82}
        metalness={0}
        /*
         * KEIN flatShading mehr. Die Facetten waren der Grund, warum das Objekt
         * wie ein geschliffener Kristall aussah und nicht wie Fels. Mit weichen
         * Normalen trägt die Schattierung die Struktur — deshalb darf die
         * Geometrie jetzt auch deutlich mehr Grat und Feinstruktur haben
         * (radiusAt), was vorher zu „Tannenzapfen" geführt hätte.
         */
        side={DoubleSide}
        /*
         * Sehr schwaches Eigenleuchten in Stahlblau: hält den Fels dort lesbar,
         * wo weder Key- noch Rim-Light hinkommt. Halbiert gegenüber der
         * Eis-Fassung (0.18) — Fels leuchtet nicht von innen, und bei matter
         * Oberfläche fällt jedes Eigenleuchten stärker auf.
         */
        emissive={palette.steel}
        emissiveIntensity={0.09}
        // BEWUSST KEIN `transmission`: das rendert die komplette Szene pro
        // Frame ein zweites Mal in einen Puffer und war der größte Ruckler
        // der Fahrt. Fels ist ohnehin undurchsichtig — anders als Eis verliert
        // er dadurch nichts.
        // Ebenso bewusst OPAK: alpha-blending auf selbstüberlappender
        // Geometrie erzeugt Sortier-Flackern während der Bewegung.
        envMapIntensity={0.7}
        {...(quality === "high"
          ? // Kein clearcoat: Das ist eine Lackschicht — auf Fels falsch.
            { specularIntensity: 0.35 }
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
