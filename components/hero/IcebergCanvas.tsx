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
      /*
       * Nur Optik — WO die Kamera steht, entscheidet Atmosphere (dort hängt es
       * am Seitenverhältnis, das erst innerhalb des Canvas bekannt ist).
       *
       * Vorher hing die Kamera an `quality`, weil „low" gleichbedeutend mit
       * „Handy" war. Seit der Canvas nur noch unter HERO_3D_QUERY läuft
       * (Desktop, Maus), heißt „low" nur noch „schwache CPU" — ein 4-Kern-Desktop
       * bekam dadurch die Handy-Komposition und damit ein anderes Bild als das
       * Poster, über das er blendet: ein sichtbarer Sprung.
       *
       * `quality` steuert ab hier ausschließlich Leistung: dpr, Antialiasing,
       * Bloom, Polycount.
       */
      camera={{ fov: 45, near: 0.1, far: 60 }}
      frameloop={frameloop}
      onCreated={({ gl }) => gl.setClearColor(palette.deep)}
    >
      <Suspense fallback={null}>
        <ReadySignal onReady={onReady} />
        {/* Blickpunkt knapp über der Wasserlinie — der Horizont bleibt dadurch
            im Bild. Der frühere Sonderwert für „low" (-1.5) kippte die Kamera so
            weit nach unten, dass der Horizont herausfiel und der Berg an einer
            harten Kante endete; im Mobil-Poster war genau das zu sehen. */}
        <Atmosphere />
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
