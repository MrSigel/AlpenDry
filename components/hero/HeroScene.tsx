"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";

import { HERO_3D_QUERY } from "@/lib/breakpoints";

import { HeroOverlay } from "./HeroOverlay";
import { HeroPoster } from "./HeroPoster";

/**
 * Der 3D-Hero (plan.md §3, Phase B).
 *
 * ZWEI AUSPRÄGUNGEN — Kundenwunsch, und aus demselben Grund auch technisch
 * richtig:
 *
 *   Desktop (HERO_3D_QUERY, siehe lib/breakpoints.ts)
 *     Ein 250vh hoher Container gibt die Scroll-Strecke vor; Canvas und Overlay
 *     kleben `sticky` im Viewport. Die Bewegung entsteht aus nativem Scrollen —
 *     kein Scroll-Hijacking und kein eigener Scroll-Container.
 *
 *   Mobil / Touch / reduzierte Bewegung
 *     Genau eine Bildschirmhöhe, Standbild als Hintergrund, kein WebGL.
 *
 * Warum die 250vh mobil NICHT stehen bleiben dürfen: Sie sind reine
 * Scroll-Strecke für die Kamerafahrt. Ohne die Fahrt wischt man zweieinhalb
 * Bildschirme durch ein unbewegtes Bild, während der Text bei 26 % ausblendet —
 * gemessen ein toter Bildschirm mit einem verlorenen Berg darin. Die Höhe hängt
 * deshalb an derselben Bedingung wie die Animation.
 *
 * Die Höhe kommt aus CSS (`hero-3d:h-[250vh]`), nicht aus JS: Sie steht damit ab
 * dem ersten Byte fest und kann nach der Hydration nicht springen.
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

/**
 * Läuft hier der scroll-getriebene Hero? Muss dieselbe Query lesen, aus der die
 * Tailwind-Variante `hero-3d:` entsteht — sonst driften Höhe und Bewegung.
 *
 * Server-Snapshot `false`: Das Gerät ist beim Rendern unbekannt, und die
 * ruhige Variante ist die sichere Annahme. Ein Desktop-Client korrigiert das
 * bei der Hydration OHNE sichtbaren Sprung — bei progress = 0 zeigt die
 * Scroll-Variante exakt dasselbe Bild wie die statische (Ebene 1 opacity 1,
 * Ebene 2 opacity 0). Die Container-Höhe kommt ohnehin aus CSS.
 */
function subscribeToHero3d(onChange: () => void) {
  const mq = window.matchMedia(HERO_3D_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getHero3dSnapshot(): boolean {
  return window.matchMedia(HERO_3D_QUERY).matches;
}

function getHero3dServerSnapshot(): boolean {
  return false;
}

function useHero3d(): boolean {
  return useSyncExternalStore(
    subscribeToHero3d,
    getHero3dSnapshot,
    getHero3dServerSnapshot,
  );
}

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const quality = useQuality();
  /** Scroll-getriebener 3D-Hero — oder ruhiges Standbild? */
  const hero3d = useHero3d();

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
   * Außerhalb von HERO_3D_QUERY (mobil, Touch, reduzierte Bewegung) wird gar
   * nicht erst zugehört: Dort gibt es keine Kamerafahrt, also auch keinen Grund,
   * 1,1 MB WebGL auf eine Mobilfunkverbindung zu legen.
   */
  useEffect(() => {
    if (!hero3d) return;

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
  }, [hero3d]);

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

  /**
   * Darf sich überhaupt etwas bewegen? HERO_3D_QUERY enthält
   * `prefers-reduced-motion` bereits — das hier bleibt nur, weil der Canvas die
   * Angabe als eigene prop führt.
   */
  const animated = !reducedMotion;

  const showCanvas = hero3d && mayLoad && animated && quality !== null;

  return (
    /*
     * Die Scroll-Strecke NUR dort, wo sie auch etwas bewegt (Begründung im
     * Kopf dieser Datei). Sonst genau eine Bildschirmhöhe.
     *
     * h-svh statt h-screen: 100vh ragt bei eingeblendeter mobiler URL-Leiste
     * unter den sichtbaren Bereich — Claim/CTAs wären abgeschnitten.
     */
    <div ref={containerRef} className="relative h-svh hero-3d:h-[250vh]">
      <div
        ref={stageRef}
        className="sticky top-0 h-svh w-full overflow-hidden bg-ink"
      >
        <HeroPoster />

        {/*
         * Ohne Kamerafahrt ist das Standbild reiner Hintergrund — dann darf es
         * nicht mit der Headline konkurrieren. Gemessen stand der Berg mobil
         * mitten hinter „Wasserschaden? Wir sind da."; genau die Wirkung, die
         * auf dem Desktop bewusst vermieden wurde, indem er nach rechts rückt.
         * Mobil fehlt der Platz dafür, also tritt er per Abdunklung zurück.
         *
         * Per CSS, nicht per JS: an `!hero3d` gebunden würde die Abdunklung auf
         * dem Desktop im ersten Frame liegen und nach der Hydration sichtbar
         * wegblitzen.
         */}
        <div
          className="absolute inset-0 bg-ink/55 hero-3d:hidden"
          aria-hidden="true"
        />

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

        <HeroOverlay progress={scrollYProgress} scrollDriven={hero3d} />
      </div>
    </div>
  );
}
