"use client";

import { useMemo, useRef } from "react";
import {
  DataTexture,
  DoubleSide,
  RGBAFormat,
  RepeatWrapping,
  LinearFilter,
  type Mesh,
} from "three";
import { MeshReflectorMaterial } from "@react-three/drei";

import { fbm } from "@/lib/noise";
import { palette } from "@/lib/palette";

/**
 * Erzeugt eine kachelbare Wellen-Normalmap prozedural.
 * Kein externes Asset (plan.md §1) — dieselbe Noise-Quelle wie die Geometrie.
 *
 * Kachelbar durch Sampling auf einem Torus: die 2D-Fläche wird auf zwei
 * Kreise abgebildet, dadurch stoßen die Ränder nahtlos aneinander.
 */
function useWaveTexture(size = 128) {
  return useMemo(() => {
    const data = new Uint8Array(size * size * 4);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const u = (x / size) * Math.PI * 2;
        const v = (y / size) * Math.PI * 2;

        // Torus-Sampling → nahtlose Kachel
        const nx = Math.cos(u) * 0.6;
        const ny = Math.sin(u) * 0.6;
        const nz = Math.cos(v) * 0.6;
        const nw = Math.sin(v) * 0.6;

        const n = fbm(nx + nw * 0.5, ny + nz * 0.5, nz, 3);
        const h = (n + 1) * 0.5; // 0..1

        const i = (y * size + x) * 4;
        // Flache Normale mit leichter Störung — Wellen, kein Ozean
        data[i] = 128 + h * 40; // r → x
        data[i + 1] = 128 + h * 40; // g → y
        data[i + 2] = 255; // b → z, überwiegend nach oben
        data[i + 3] = 255;
      }
    }

    const tex = new DataTexture(data, size, size, RGBAFormat);
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.minFilter = tex.magFilter = LinearFilter;
    tex.repeat.set(4, 4);
    tex.needsUpdate = true;
    return tex;
  }, [size]);
}

/**
 * Wasserfläche bei y = 0 (plan.md §3).
 *
 * Reflexion über MeshReflectorMaterial — rendert die Szene ein zweites Mal in
 * eine Textur. Zusammen mit `transmission` am Eis ist das der zweite teure
 * Posten; auf Mobile daher ein schlichtes, aber ebenfalls dunkles Material.
 *
 * DoubleSide ist Absicht: sobald die Kamera abtaucht, wird die Fläche zur
 * dunklen „Decke" über dem Betrachter — genau das trägt die Metapher.
 */
export function Water({ quality = "high" }: { quality?: "high" | "low" }) {
  const waves = useWaveTexture(quality === "high" ? 128 : 64);
  const meshRef = useRef<Mesh>(null);

  /**
   * BEWUSST OHNE Wellen-Drift.
   *
   * Eine permanente Eigenbewegung zwingt den Canvas zu 60fps rund um die Uhr —
   * auch wenn niemand scrollt und der Berg still steht. Auf gedrosselter CPU
   * wird dann jeder einzelne Frame zu einem Long Task; gemessen waren das
   * 5,5 s Total Blocking Time allein dafür.
   *
   * Ohne die Drift rendert die Szene nur noch bei Scroll (frameloop="demand",
   * siehe IcebergRig). Die Wellen bleiben als statische Normalmap sichtbar —
   * der Verlust ist bei dieser Wasserfläche kaum wahrnehmbar, der Gewinn
   * erheblich.
   */

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[120, 120]} />
      {quality === "high" ? (
        <MeshReflectorMaterial
          // 320px reicht: die Reflexion ist weichgezeichnet und dunkel getönt,
          // höhere Auflösung kostet einen vollen Szenen-Render pro Frame extra.
          resolution={320}
          mirror={0.45}
          mixBlur={8}
          mixStrength={1.4}
          blur={[220, 80]}
          roughness={0.85}
          depthScale={1.2}
          minDepthThreshold={0.3}
          maxDepthThreshold={1.4}
          depthToBlurRatioBias={0.25}
          color={palette.abyss}
          metalness={0.55}
          normalMap={waves}
          normalScale={[0.12, 0.12]}
          side={DoubleSide}
        />
      ) : (
        <meshStandardMaterial
          color={palette.abyss}
          roughness={0.7}
          metalness={0.6}
          normalMap={waves}
          normalScale={[0.1, 0.1]}
          side={DoubleSide}
        />
      )}
    </mesh>
  );
}
