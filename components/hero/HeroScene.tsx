"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";

import { HeroOverlay } from "./HeroOverlay";
import { HeroPoster } from "./HeroPoster";

/**
 * Der 3D-Hero (plan.md §3, Phase B).
 *
 * Aufbau:
 *   Ein 250vh hoher Container gibt die Scroll-Strecke vor; Canvas und Overlay
 *   kleben `sticky` im Viewport. Die Bewegung entsteht aus nativem Scrollen —
 *   kein Scroll-Hijacking und kein eigener Scroll-Container.
 *
 * LADESTRATEGIE — der Grund für die drei Zustände:
 *   three.js + drei + postprocessing sind zusammen ≈1,1 MB. Würde der Canvas
 *   sofort starten, konkurriert sein Aufbau (Geometrie, Environment-Bake,
 *   erster Render) direkt mit dem Seitenaufbau und blockiert den Hauptthread.
 *   Deshalb:
 *     1. Poster (WebP, ~54 KB) steht sofort im Bild.
 *     2. Der Canvas wird erst geladen, wenn der Browser idle ist.
 *     3. Ist er bereit, blendet er über das Poster.
 *   Bei `prefers-reduced-motion` bleibt es beim Poster — der WebGL-Stack wird
 *   dann nie geladen.
 *
 * Kein Layout-Shift: Der Container hat seine Höhe vom ersten Byte an, Poster
 * und Canvas liegen deckungsgleich darin.
 */

/** three.js kann nicht serverseitig rendern — nur der Canvas wird nachgeladen. */
const IcebergCanvas = dynamic(
  () => import("./IcebergCanvas").then((m) => m.IcebergCanvas),
  { ssr: false },
);

/**
 * Qualitätsstufe. Bewusst grob: Wir raten das Gerät nicht, wir prüfen die
 * Merkmale, die die teuren Effekte (Reflektor, Bloom, Polycount) wirklich
 * belasten — Zeigergerät, Viewport, Kernzahl.
 *
 * useSyncExternalStore statt useEffect+setState: Das Gerät ist ein externer
 * Zustand. Die Stufe folgt dadurch auch einer Rotation (Portrait→Landscape
 * ändert innerWidth). Da der Snapshot primitiv ist, löst nur ein echter
 * Wechsel low↔high ein Re-Render aus — die Geometrie wird nicht bei jedem
 * Resize neu gebaut.
 */
function subscribeToViewport(onChange: () => void) {
  const mq = window.matchMedia("(pointer: coarse)");
  window.addEventListener("resize", onChange);
  mq.addEventListener("change", onChange);
  return () => {
    window.removeEventListener("resize", onChange);
    mq.removeEventListener("change", onChange);
  };
}

function getQualitySnapshot(): "high" | "low" {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 900;
  const cores = navigator.hardwareConcurrency ?? 4;
  return coarse || narrow || cores <= 4 ? "low" : "high";
}

/** Auf dem Server ist das Gerät unbekannt — dann rendert der Canvas noch nicht. */
function getQualityServerSnapshot(): null {
  return null;
}

function useQuality(): "high" | "low" | null {
  return useSyncExternalStore(
    subscribeToViewport,
    getQualitySnapshot,
    getQualityServerSnapshot,
  );
}

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const quality = useQuality();

  /** Darf der schwere WebGL-Stack geladen werden? (erst wenn der Browser Luft hat) */
  const [mayLoad, setMayLoad] = useState(false);
  /** Hat der Canvas seinen ersten Frame gezeichnet? Erst dann überblenden. */
  const [canvasReady, setCanvasReady] = useState(false);

  /**
   * Rendert der Hero gerade sichtbar?
   *
   * Ohne das läuft der Canvas mit 60fps weiter, auch wenn der Nutzer längst
   * bei den Sektionen ist: verschenkte Akkulaufzeit, und die Framerate der
   * restlichen Seite leidet — inklusive der Scroll-Reveals.
   */
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /**
   * WANN der WebGL-Stack geladen wird — erst bei echter Interaktion.
   *
   * Begründung: three.js + drei + postprocessing sind ≈1,1 MB, und ihr Aufbau
   * kostet auf gedrosselter CPU rund eine Sekunde Hauptthread (gemessen: 978 ms
   * Long Task; davon nur ~137 ms die Geometrie, der Rest ist three.js-Init).
   * Der Berg BEWEGT sich aber ausschließlich beim Scrollen — wer nicht scrollt,
   * sieht das Poster und braucht kein WebGL. Im Notfall zählt der Notruf, nicht
   * die Animation.
   *
   * Bewusst KEIN Zeit-Fallback: Ein Timer würde den Stack auch Nutzern
   * aufzwingen, die nur die Nummer suchen. Wer scrollt, bekommt ihn — und das
   * Poster überbrückt die Ladezeit nahtlos.
   *
   * Bei `prefers-reduced-motion` wird gar nicht geladen (plan.md §3 fordert
   * dort ohnehin nur ein Standbild).
   */
  useEffect(() => {
    if (reducedMotion) return;

    const load = () => setMayLoad(true);
    const opts = { passive: true, once: true } as const;

    window.addEventListener("scroll", load, opts);
    window.addEventListener("wheel", load, opts);
    window.addEventListener("touchstart", load, opts);
    window.addEventListener("pointerdown", load, opts);
    window.addEventListener("keydown", load, opts);

    return () => {
      window.removeEventListener("scroll", load);
      window.removeEventListener("wheel", load);
      window.removeEventListener("touchstart", load);
      window.removeEventListener("pointerdown", load);
      window.removeEventListener("keydown", load);
    };
  }, [reducedMotion]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /** invalidate der 3D-Szene — vom Canvas hereingereicht. */
  const invalidateRef = useRef<(() => void) | null>(null);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    // Render-on-demand: Ohne diesen Anstoß bliebe das Bild beim Scrollen stehen.
    // Nur rendern, wenn der Hero auch zu sehen ist.
    if (inView) invalidateRef.current?.();
  });

  /** Darf sich überhaupt etwas bewegen? (Nutzerpräferenz) */
  const animated = !reducedMotion;

  const showCanvas = mayLoad && animated && quality !== null;

  return (
    <div ref={containerRef} className="relative h-[250vh]">
      {/* h-svh statt h-screen: 100vh ragt bei eingeblendeter mobiler URL-Leiste
          unter den sichtbaren Bereich — Claim/CTAs wären abgeschnitten. */}
      <div
        ref={stageRef}
        className="sticky top-0 h-svh w-full overflow-hidden bg-ink"
      >
        <HeroPoster />

        {showCanvas && (
          <div
            className={`absolute inset-0 transition-opacity duration-700 ease-glide ${
              canvasReady ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* frameloop="demand": Der Berg bewegt sich ausschließlich beim
                Scrollen — dauerhafte 60fps wären reine Verschwendung und
                blockieren auf schwacher CPU den Hauptthread. Frames entstehen
                nur noch durch invalidate() (Scroll + Nachschwingen der
                Dämpfung). */}
            <IcebergCanvas
              quality={quality}
              animated={animated}
              frameloop="demand"
              progressRef={progressRef}
              onReady={() => setCanvasReady(true)}
              registerInvalidate={(fn) => {
                invalidateRef.current = fn;
              }}
            />
          </div>
        )}

        {/* Lesbarkeits-Scrim von unten (globals.css) */}
        <div
          className="hero-scrim pointer-events-none absolute inset-0"
          aria-hidden="true"
        />

        <HeroOverlay progress={scrollYProgress} />
      </div>
    </div>
  );
}
