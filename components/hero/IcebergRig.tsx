"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, type Group } from "three";
import { Iceberg } from "./Iceberg";
import { palette } from "@/lib/palette";

/**
 * Bewegung des Eisbergs (plan.md §3 — Metapher „Die Spitze des Eisbergs").
 *
 * Der Berg dreht sich beim Scrollen und STEIGT dabei. Die Wasserebene bleibt
 * fest bei y = 0, also wandert die Wasserlinie an ihm herunter: aus der
 * sichtbaren Spitze (Sanierung/Trocknung) schiebt sich die verborgene Masse
 * ins Bild (volles Leistungsspektrum).
 *
 * Die Kamera steht dabei still (siehe Atmosphere) — ruhiger zu lesen als eine
 * Kamerafahrt und deutlich billiger.
 *
 * Gedämpft wird gegen ein Ziel, nie direkt gesetzt: dadurch bleibt die Bewegung
 * weich, auch wenn ruckartig gescrollt wird (Trackpad-Sprünge, Wheel-Rasten).
 * `MathUtils.damp` ist framerate-unabhängig.
 */

/** Drehung über die volle Scroll-Strecke — eine Vierteldrehung plus. */
const ROTATION_END = MathUtils.degToRad(120);

/**
 * Hub des Bergs. Geometrie: Spitze bei +1.33, Grund bei -6.07 (lokal).
 *   0 → Wasserlinie exakt auf Höhe der Geometrie-Wasserlinie: genau die
 *       18 % Spitze ragen heraus. Tiefer angesetzt schrumpft der Zipfel so
 *       weit, dass ihn Distanz und Nebel zu grauem Fels dämpfen.
 *
 * Endhub: die Wasserlinie liegt dann bei lokal -RISE_TO, die Masse steht frei
 * im Bild, der Fuß bleibt getaucht (kein schwebender Felsen).
 * Im Hochformat weniger: dort ist der sichtbare Ausschnitt schmaler, bei vollem
 * Hub liefe die Spitze oben aus dem Bild.
 */
const RISE_FROM = 0;
const RISE_TO = { wide: 3.6, tall: 1.9 } as const;

/** Dämpfungsstärke — höher = strafferes Folgen. */
const LAMBDA = 3.4;

/** Ruhiges Ein-/Ausgleiten der Gesamtbewegung. */
function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function IcebergRig({
  progressRef,
  animated,
  quality,
  staticProgress = 0.16,
  registerInvalidate,
}: {
  progressRef: RefObject<number>;
  animated: boolean;
  quality: "high" | "low";
  /** Position für den Reduced-Motion-Standbild-Fall. */
  staticProgress?: number;
  /**
   * Reicht das `invalidate` der Szene nach außen. HeroScene ruft es bei jedem
   * Scroll-Schritt — nur so entstehen bei frameloop="demand" überhaupt Frames.
   */
  registerInvalidate?: (fn: () => void) => void;
}) {
  /** Trägt Position + die mitwandernden Lampen — dreht sich nicht. */
  const group = useRef<Group>(null);
  /** Trägt nur die Drehung des Bergs. */
  const spin = useRef<Group>(null);
  const { viewport, size, invalidate } = useThree();

  /**
   * Quer- oder Hochformat? Das ENTSCHEIDET über die Bildkomposition — nicht
   * `quality`, das nur noch die Rechenlast beschreibt (Begründung in
   * IcebergCanvas). Aus `size` statt aus einer Media Query: Maßgeblich ist die
   * Fläche, die der Canvas tatsächlich bekommt.
   */
  const format = size.height > size.width ? "tall" : "wide";

  /**
   * Horizontal nach rechts, aus der Textspalte heraus.
   * Aus der Viewport-Breite in Weltmaßen abgeleitet, damit der Versatz auf
   * jedem Seitenverhältnis gleich „sitzt" statt fix in Weltmetern zu kleben.
   * Im Hochformat steht der Berg mittig — dort ist keine Spalte, an der er
   * vorbei müsste; der Text liegt darunter.
   */
  const bergX = format === "tall" ? 0 : Math.min(viewport.width * 0.23, 3.6);

  /**
   * Setzt Drehung und Hub. Gibt zurück, ob die Dämpfung noch nachschwingt —
   * daran hängt, ob ein weiterer Frame angefordert werden muss.
   */
  const apply = (p: number, dt: number, damp: boolean): boolean => {
    const g = group.current;
    const s = spin.current;
    if (!g || !s) return false;

    const e = easeInOut(MathUtils.clamp(p, 0, 1));
    const wantRotation = e * ROTATION_END;
    const wantY = MathUtils.lerp(RISE_FROM, RISE_TO[format], e);

    if (damp) {
      s.rotation.y = MathUtils.damp(s.rotation.y, wantRotation, LAMBDA, dt);
      g.position.y = MathUtils.damp(g.position.y, wantY, LAMBDA, dt);
    } else {
      s.rotation.y = wantRotation;
      g.position.y = wantY;
    }
    g.position.x = bergX;

    // Noch spürbar vom Ziel entfernt? Dann muss weiter gerendert werden.
    return (
      Math.abs(s.rotation.y - wantRotation) > 0.0005 ||
      Math.abs(g.position.y - wantY) > 0.0005
    );
  };

  // invalidate nach außen geben, damit der Scroll Frames anfordern kann.
  useEffect(() => {
    registerInvalidate?.(invalidate);
  }, [registerInvalidate, invalidate]);

  // Reduced Motion: einmal die schönste Position setzen und stehen lassen.
  // Mehrfaches invalidate(), damit Environment und Reflector-Buffer ihren
  // einen Frame bekommen.
  useEffect(() => {
    if (animated) return;
    apply(staticProgress, 0, false);
    invalidate();
    const t1 = setTimeout(invalidate, 120);
    const t2 = setTimeout(invalidate, 400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animated, staticProgress, invalidate, bergX]);

  /**
   * Render-on-demand: Der Canvas läuft auf frameloop="demand". Jeder Frame
   * entsteht durch ein invalidate() — entweder vom Scroll (HeroScene) oder
   * von hier, solange die Dämpfung noch nachschwingt. Steht der Berg still,
   * wird kein einziger Frame gerendert.
   */
  useFrame(() => {
    if (!animated) return;
    // dt NICHT aus useFrame: bei frameloop="demand" liegen zwischen zwei
    // Frames beliebige Pausen, das delta wäre unbrauchbar groß. Stattdessen
    // ein fester Schritt — die Dämpfung bleibt dadurch gleichmäßig.
    const moving = apply(progressRef.current ?? 0, 1 / 60, true);
    if (moving) invalidate();
  });

  return (
    <group ref={group} position={[bergX, RISE_FROM, 0]}>
      <group ref={spin}>
        <Iceberg quality={quality} />
      </group>

      {/* Backlight hinter dem Berg — zeichnet die Kanten frei und hält die
          Facetten hell. Der Unterschied zwischen „Eis" und „Fels".
          Sitzt in dieser Gruppe, wandert also mit dem Berg mit, dreht sich
          aber nicht mit ihm. */}
      <pointLight
        position={[-0.5, 2.2, -4]}
        intensity={26}
        distance={18}
        decay={1.6}
        color={palette.frost}
      />

      {/* Fill von vorn-unten — hebt die Masse unterhalb der Wasserlinie an,
          damit sie beim Auftauchen nicht als schwarzer Block liest. */}
      <pointLight
        position={[1.2, -2.4, 3]}
        intensity={14}
        distance={14}
        decay={1.6}
        color={palette.steel}
      />
    </group>
  );
}
