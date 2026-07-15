"use client";

import { Suspense, useEffect, type RefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import { IcebergLighting } from "./Iceberg";
import { IcebergRig } from "./IcebergRig";
import { Water } from "./Water";
import { Atmosphere } from "./Atmosphere";
import { palette } from "@/lib/palette";

/**
 * Meldet, sobald die Szene wirklich steht.
 *
 * Sitzt INNERHALB von <Suspense>, läuft also erst, wenn Geometrie und
 * Environment fertig sind. Ein Frame Verzögerung, damit der erste Render
 * durch ist — sonst blendet HeroScene auf einen noch leeren Canvas.
 */
function ReadySignal({ onReady }: { onReady?: () => void }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!onReady) return;
    const id = requestAnimationFrame(() => {
      invalidate();
      requestAnimationFrame(() => onReady());
    });
    return () => cancelAnimationFrame(id);
  }, [onReady, invalidate]);
  return null;
}

/**
 * Nur der WebGL-Teil.
 *
 * Bewusst von HeroScene getrennt: three.js kann nicht serverseitig rendern,
 * dieser Baum wird also mit `ssr: false` nachgeladen. Das h1 und die CTAs
 * liegen im Overlay und bleiben dadurch im SSR-HTML — für Crawler, für
 * Nutzer ohne WebGL und für den ersten Frame.
 *
 * Die Kamera steht fest; bewegt wird ausschließlich der Eisberg (IcebergRig).
 */
export function IcebergCanvas({
  quality,
  animated,
  frameloop,
  progressRef,
  onReady,
  registerInvalidate,
}: {
  quality: "high" | "low";
  animated: boolean;
  /** Von HeroScene gesteuert: pausiert, sobald der Hero aus dem Blick ist. */
  frameloop: "always" | "demand" | "never";
  progressRef: RefObject<number>;
  /** Erster gezeichneter Frame — erst dann blendet HeroScene das Poster weg. */
  onReady?: () => void;
  /** Gibt das `invalidate` der Szene nach außen (Render-on-demand). */
  registerInvalidate?: (fn: () => void) => void;
}) {
  return (
    <Canvas
      style={{ position: "absolute", inset: 0 }}
      // DPR gedeckelt: 2 kostet auf Retina das Vierfache an Pixeln,
      // bei dieser Motivdichte ohne sichtbaren Gewinn.
      dpr={quality === "high" ? [1, 1.5] : [1, 1.2]}
      // Ohne das misst react-use-measure den Container beim Mount nicht und
      // der Canvas bleibt auf den HTML-Defaultmaßen 300×150 stehen, bis
      // zufällig ein Resize kommt.
      resize={{ offsetSize: true, debounce: 0 }}
      gl={{
        antialias: quality === "high",
        alpha: false,
        powerPreference: "high-performance",
      }}
      // Mobil steht die Kamera weiter weg und höher: der Berg kann auf einem
      // schmalen Viewport nicht nach rechts ausweichen, also bekommt er über
      // den tieferen Blickpunkt den freien Raum ÜBER der Textspalte.
      camera={
        quality === "high"
          ? { fov: 45, near: 0.1, far: 60, position: [0, 2, 10.5] }
          : { fov: 45, near: 0.1, far: 60, position: [0, 2.6, 12.5] }
      }
      frameloop={frameloop}
      onCreated={({ gl }) => gl.setClearColor(palette.deep)}
    >
      <Suspense fallback={null}>
        <ReadySignal onReady={onReady} />
        <Atmosphere lookAtY={quality === "high" ? 1.4 : -1.5} />
        <IcebergLighting quality={quality} />
        <IcebergRig
          quality={quality}
          animated={animated}
          progressRef={progressRef}
          registerInvalidate={registerInvalidate}
        />
        <Water quality={quality} />

        {/* Bloom nur auf Desktop und nur auf die hellsten Stellen: die
            glacier-Rim-Kanten. luminanceThreshold hoch halten, sonst glüht
            die ganze Szene — genau der Glow-Overkill, den plan.md §0 verbietet. */}
        {quality === "high" && (
          // multisampling={0}: MSAA auf dem Composer-Target kostet massiv
          // Bandbreite; bei flatShading + Bloom ist der Gewinn unsichtbar.
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.42}
              luminanceThreshold={0.72}
              luminanceSmoothing={0.3}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
