"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { contact, hero, whatsappHref } from "@/lib/content";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

/**
 * Stückweise lineare Interpolation über Stützstellen.
 *
 * Bewusst als Funktion, NICHT als useTransform(value, inputRange, outputRange):
 * die numerische Array-Form kompiliert framer-motion v12 zu WAAPI-Keyframes und
 * beschleunigt sie auf eine ScrollTimeline. Dieser Pfad blieb hier auf 0 stehen
 * (Opacity klebte bei 1), während der Transform korrekt lief — Opacity und
 * Transform liefen auseinander. Die Funktionsform lässt sich nicht vorkompilieren
 * und bleibt damit deterministisch auf dem Main-Thread.
 */
function piecewise(v: number, stops: number[], values: number[]): number {
  if (v <= stops[0]) return values[0];
  const last = stops.length - 1;
  if (v >= stops[last]) return values[last];
  for (let i = 0; i < last; i++) {
    if (v <= stops[i + 1]) {
      const t = (v - stops[i]) / (stops[i + 1] - stops[i]);
      return values[i] + t * (values[i + 1] - values[i]);
    }
  }
  return values[last];
}

/**
 * Text und CTAs über dem Canvas (plan.md §2, Punkt 8).
 *
 * Zwei Ebenen, die der Kamerafahrt folgen — die Metapher wird dadurch
 * gelesen, nicht nur gesehen:
 *   über Wasser  → Ansprache, Notruf, WhatsApp (die sichtbare Leistung)
 *   unter Wasser → „Nur die Spitze des Eisbergs." (das volle Spektrum)
 *
 * Das h1 ist das einzige der Seite. Es wird per opacity ausgeblendet, nie per
 * display:none — es bleibt im Accessibility-Tree und für Crawler sichtbar.
 *
 * Bei `prefers-reduced-motion` entfällt die Blende: Ebene 1 steht dauerhaft,
 * Ebene 2 wird gar nicht erst gerendert.
 */
export function HeroOverlay({ progress }: { progress: MotionValue<number> }) {
  const reduced = useReducedMotion();

  // Ebene 1 verabschiedet sich, bevor die Wasserlinie durchs Bild wandert.
  const aboveOpacity = useTransform(progress, (v) => piecewise(v, [0, 0.26], [1, 0]));
  const aboveY = useTransform(progress, (v) => piecewise(v, [0, 0.26], [0, -28]));

  // Ebene 2 kommt erst, wenn die Kamera wirklich unten ist.
  const belowOpacity = useTransform(progress, (v) =>
    piecewise(v, [0.52, 0.72, 0.96, 1], [0, 1, 1, 0.9]),
  );
  const belowY = useTransform(progress, (v) => piecewise(v, [0.52, 0.72], [24, 0]));

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="mx-auto flex h-full w-full max-w-shell flex-col justify-end px-6 pb-24 md:px-10 md:pb-28">
        {/* ── Über Wasser ─────────────────────────────────────────── */}
        <motion.div
          style={reduced ? undefined : { opacity: aboveOpacity, y: aboveY }}
          className="max-w-2xl"
        >
          <p className="eyebrow">{hero.eyebrow}</p>

          <h1 className="mt-5 text-3xl md:text-4xl lg:text-5xl">{hero.h1}</h1>

          <p className="mt-6 max-w-prose font-body text-base text-frost md:text-lg">
            {hero.sub}
          </p>

          {/* Claim — kursiv, glacier, unterstrichen (Markenvorgabe).
              Ab text-xl (24px = 18pt) greift die 3:1-Schwelle, die glacier auf
              ink mit 4.31:1 erfüllt; bei text-lg (19px) wären 4.5:1 nötig
              gewesen. Deshalb hier keine kleinere Stufe. */}
          <p className="mt-7 font-display text-xl italic text-glacier underline decoration-glacier/40 underline-offset-[6px] md:text-2xl">
            {hero.claim}
          </p>

          {/* CTAs im ersten Sichtfeld. Auf Mobil trägt sie die Bottom-Bar,
              hier würden sie mit ihr kollidieren. */}
          <div className="pointer-events-auto mt-9 hidden flex-wrap items-center gap-3 md:flex">
            <a
              href={contact.phoneHref}
              className="inline-flex items-center gap-2.5 rounded-sm bg-signal px-6 py-4 font-display text-sm font-semibold text-ink transition-colors duration-300 ease-glide hover:bg-glacier"
              aria-label={`Notruf ${contact.phone} — rund um die Uhr erreichbar`}
            >
              <PhoneIcon className="h-4 w-4" />
              <span className="font-mono">{contact.phone}</span>
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-sm border border-hairline px-6 py-4 font-display text-sm font-semibold text-snow transition-all duration-300 ease-glide hover:border-glacier hover:bg-glacier-glow"
            >
              <WhatsAppIcon className="h-4 w-4 text-glacier" />
              WhatsApp schreiben
            </a>
          </div>
        </motion.div>

        {/* ── Unter Wasser ────────────────────────────────────────── */}
        {!reduced && (
          <motion.div
            style={{ opacity: belowOpacity, y: belowY }}
            className="absolute inset-x-6 bottom-24 max-w-xl md:inset-x-10 md:bottom-28"
            aria-hidden="true"
          >
            <p className="font-display text-2xl text-snow md:text-3xl">
              {hero.underwater.line}
            </p>
            <p className="mt-4 max-w-prose font-body text-base text-frost">
              {hero.underwater.sub}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
