"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { process } from "@/lib/content";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * 6-Schritte-Ablauf als Serpentine (Desktop).
 *
 * Die Schritte laufen als Schlangenlinie: 01→02→03 nach rechts, Wendekurve,
 * 04→05→06 zurück nach links. Ein Strich verbindet sie und zeichnet sich beim
 * Scrollen; jeder Punkt schaltet auf aktiv, sobald die Linie ihn erreicht.
 * Die Beschreibung des aktiven Schritts steht unter der Schlange und wechselt
 * mit — dadurch bleibt die Linie frei von Textwüsten.
 *
 * Die Bühne klebt `sticky`, bis alle sechs Punkte durchlaufen sind, danach
 * gibt sie den Scroll wieder frei (natives Scrollen, kein Hijacking).
 *
 * GEOMETRIE — Warum Titel oben/unten und nicht neben den Punkten:
 * Die Wendekurve rechts braucht den Raum zwischen den beiden Reihen. Stünden
 * die Titel unter Reihe 1, liefe die Kurve mitten durch sie hindurch. Deshalb:
 * Reihe 1 Titel ÜBER den Punkten, Reihe 2 Titel DARUNTER — der Korridor
 * zwischen den Reihen gehört allein der Linie.
 *
 * Das SVG nutzt preserveAspectRatio="none" und füllt den Container. Die Punkte
 * sind in Prozent derselben viewBox positioniert — dadurch sitzen sie bei jeder
 * Breite exakt auf der Linie, auch wenn die Kurve dabei leicht staucht.
 */

const VB = { w: 1000, h: 380 };

/** Punkte in viewBox-Koordinaten. Reihe 2 läuft rückwärts (Serpentine). */
const POINTS = [
  { x: 140, y: 110 }, // 01
  { x: 500, y: 110 }, // 02
  { x: 860, y: 110 }, // 03
  { x: 860, y: 270 }, // 04
  { x: 500, y: 270 }, // 05
  { x: 140, y: 270 }, // 06
];

const PATH_D =
  "M 140 110 L 860 110 C 970 110, 970 270, 860 270 L 140 270";

/** Länge der beiden geraden Segmente (140→860). Die Kurve kommt gemessen dazu. */
const STRAIGHT = 720;

/** Die Linie ist etwas vor Scroll-Ende fertig, damit der letzte Text lesbar bleibt. */
const DRAW_UNTIL = 0.88;

export function ProcessSerpentine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  /**
   * Echte Pfadlänge messen statt schätzen. Eine zu kurz geratene Länge lässt
   * `strokeDasharray` das letzte Stück nie zeichnen — die Linie erreicht Punkt
   * 06 dann nicht. getTotalLength() rechnet in viewBox-Einheiten, passt also
   * trotz preserveAspectRatio="none".
   */
  const [len, setLen] = useState(1720);
  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength());
  }, []);

  /**
   * Pfadanteil, an dem der jeweilige Punkt liegt — aus der gemessenen Länge
   * abgeleitet. Damit schaltet ein Punkt exakt dann, wenn der Strich ihn
   * berührt; eine gleichmäßige Verteilung (i/5) läge an der Kurve daneben.
   */
  const stepT = useMemo(() => {
    const curve = Math.max(len - 2 * STRAIGHT, 1);
    return [
      0,
      STRAIGHT / 2 / len,
      STRAIGHT / len,
      (STRAIGHT + curve) / len,
      (STRAIGHT + curve + STRAIGHT / 2) / len,
      1,
    ];
  }, [len]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /** 0…1 — wie weit der Strich gezeichnet ist. */
  const draw = useTransform(scrollYProgress, (v) =>
    Math.min(Math.max(v / DRAW_UNTIL, 0), 1),
  );

  // strokeDashoffset in viewBox-Einheiten. Funktionsform, damit framer-motion
  // das nicht auf eine WAAPI-ScrollTimeline auslagert (die lief hier falsch).
  const dashOffset = useTransform(draw, (v) => len * (1 - v));

  useMotionValueEvent(draw, "change", (v) => {
    let i = 0;
    for (let s = 0; s < stepT.length; s++) if (v >= stepT[s]) i = s;
    setActive(i);
  });

  // Reduced Motion: keine Fahrt, keine Pinnung — alles fertig gezeichnet.
  const allDone = !!reduced;
  const current = process.steps[allDone ? process.steps.length - 1 : active];

  return (
    <div
      ref={containerRef}
      className={allDone ? "relative" : "relative h-[300vh]"}
    >
      <div
        className={
          allDone
            ? ""
            : "sticky top-0 flex h-svh flex-col justify-center py-24"
        }
      >
        <div className="mx-auto w-full max-w-shell px-6 md:px-10">
          <header className="max-w-prose">
            <SectionLabel>{process.eyebrow}</SectionLabel>
            <h2 className="mt-6 text-2xl md:text-3xl">{process.h2}</h2>
          </header>

          {/* Die Schlange zeigt immer nur die aktive Beschreibung — als
              Vorlesetext wäre das lückenhaft. Sie ist deshalb rein visuell;
              den vollständigen Ablauf trägt die sr-only-Liste am Ende. */}
          <div aria-hidden="true">
            {/* ── Serpentine ────────────────────────────────────────── */}
            <div className="relative mt-14 h-[380px] w-full">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox={`0 0 ${VB.w} ${VB.h}`}
              preserveAspectRatio="none"
              aria-hidden="true"
              fill="none"
            >
              {/* Grundlinie — der noch nicht gelaufene Weg */}
              <path d={PATH_D} stroke="var(--frost-faint)" strokeWidth={1.2} />
              {/* Gezeichneter Weg.
                  KEIN vectorEffect="non-scaling-stroke": das lässt den Browser
                  strokeDasharray in Gerätepixeln statt in viewBox-Einheiten
                  rechnen. Zusammen mit preserveAspectRatio="none" (der Pfad wird
                  horizontal gestreckt) reicht die Dash-Länge dann nicht bis zum
                  Ende — die Linie erreicht Punkt 06 nie, trotz dashOffset 0.
                  Ohne den Effekt skaliert die Strichstärke minimal mit (1.5 vs
                  ~1.8 an den vertikalen Abschnitten), was bei dieser Stärke
                  nicht auffällt. */}
              <motion.path
                ref={pathRef}
                d={PATH_D}
                stroke="var(--glacier)"
                strokeWidth={1.5}
                strokeDasharray={len}
                style={allDone ? { strokeDashoffset: 0 } : { strokeDashoffset: dashOffset }}
              />
            </svg>

            {process.steps.map((step, i) => {
              const p = POINTS[i];
              const on = allDone || i <= active;
              const isRow1 = p.y < VB.h / 2;

              return (
                <div
                  key={step.title}
                  className="absolute w-[13rem] -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${(p.x / VB.w) * 100}%`,
                    top: `${(p.y / VB.h) * 100}%`,
                  }}
                >
                  {/* Titel: Reihe 1 darüber, Reihe 2 darunter — der Korridor
                      zwischen den Reihen bleibt für die Wendekurve frei. */}
                  <span
                    className={`absolute inset-x-0 text-center font-display text-sm font-semibold transition-colors duration-500 ease-glide ${
                      isRow1 ? "bottom-[calc(50%+2.25rem)]" : "top-[calc(50%+2.25rem)]"
                    } ${on ? "text-snow" : "text-frost-dim"}`}
                  >
                    {step.title}
                  </span>

                  {/* Punkt.
                      Die Ziffer trägt snow bzw. frost-dim statt glacier/steel:
                      bei 14px verlangt WCAG 4.5:1, glacier erreicht auf ink nur
                      4.31:1 und steel 2.83:1. Die Aktivierung zeigt jetzt der
                      Ring (border-glacier) — der ist als Grafik nur an 3:1
                      gebunden und erfüllt das. */}
                  <span
                    className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full border font-mono text-sm transition-colors duration-500 ease-glide ${
                      on
                        ? "border-glacier bg-ink text-snow"
                        : "border-hairline bg-ink text-frost-dim"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>

            {/* ── Beschreibung des aktiven Schritts ─────────────────── */}
            <div className="mt-10 min-h-[6rem] max-w-prose">
              {allDone ? (
                // Ohne Motion ergibt ein wechselnder Text keinen Sinn — dann
                // stehen alle sechs Beschreibungen untereinander.
                <ol className="space-y-4">
                  {process.steps.map((s, i) => (
                    <li key={s.title} className="flex gap-4">
                      <span className="font-mono text-2xs text-frost-dim">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="font-body text-sm text-frost-dim">{s.body}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-display text-lg font-semibold text-snow">
                    {current.title}
                  </p>
                  <p className="mt-2 font-body text-sm text-frost-dim">
                    {current.body}
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          <ProcessA11yList />
        </div>
      </div>
    </div>
  );
}

/**
 * Alle Schritte als reiner Text — unsichtbar, aber im DOM.
 * Die Serpentine zeigt immer nur die aktive Beschreibung; damit Crawler und
 * Screenreader trotzdem den vollständigen Ablauf bekommen, steht er hier.
 */
function ProcessA11yList() {
  return (
    <ol className="sr-only">
      {process.steps.map((s, i) => (
        <li key={s.title}>
          {i + 1}. {s.title}: {s.body}
        </li>
      ))}
    </ol>
  );
}
