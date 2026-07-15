import { site } from "@/lib/content";

/**
 * AlpenDry — Wort-Bild-Marke, aus dem Original rekonstruiert.
 *
 * Die Bergkette ist der Marke nachgezeichnet: ein spitzer Hauptgipfel mit
 * gezacktem Grat, ein Vorgipfel links, ein silberner Nebengipfel rechts,
 * dazu die charakteristischen Schneefelder als helle Facetten. Die Basis
 * läuft nach beiden Seiten flach aus.
 *
 * Farben aus der Palette: Das Original steht auf Weiß und arbeitet mit
 * dunklem Navy; hier steht die Marke auf ink, deshalb sind die Werte
 * invertiert — steel für die Flanken, snow für Schnee/Grate, frost für den
 * Nebengipfel (im Original das Grau).
 *
 * Die Wortmarke ist echter Text in der Display-Schrift — dadurch immer
 * gestochen scharf und typografisch identisch mit den Headlines.
 */

/** Nur die Bergkette — auch als Favicon/OG-Mark nutzbar. */
export function AlpenDryMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 120"
      // Dekorativ: Der Markenname steht direkt daneben als Text.
      aria-hidden="true"
      className={className}
      fill="none"
    >
      {/* Silberner Nebengipfel rechts — im Original das Grau.
          Liegt hinter dem Hauptmassiv und schaut rechts hervor. */}
      <path
        d="M132 120 L170 52 L179 61 L188 44 L200 63 L208 55 L240 120 Z"
        fill="var(--frost)"
        opacity="0.42"
      />

      {/* Hauptmassiv — gezackter Grat, Gipfel leicht links der Mitte */}
      <path
        d="M0 120
           L38 78 L45 85 L56 68 L64 75 L82 46 L91 54
           L112 14 L118 6
           L127 22 L135 15 L143 36 L153 29 L168 57 L177 50 L196 82 L206 74 L240 120 Z"
        fill="var(--steel)"
      />

      {/* Schneefelder — helle Facetten unter dem Hauptgipfel */}
      <path d="M118 6 L131 30 L124 36 L118 24 L110 34 L103 27 Z" fill="var(--snow)" />
      <path d="M82 46 L93 64 L87 69 L82 60 L75 68 L69 63 Z" fill="var(--snow)" opacity="0.9" />
      <path d="M143 36 L152 52 L147 57 L143 49 L137 56 L132 51 Z" fill="var(--snow)" opacity="0.75" />

      {/* Kantenlicht auf dem Hauptgrat — Tiefe über Kante, nicht über Schatten */}
      <path d="M118 6 L112 14 L82 46 L64 75 L56 68 L45 85 L38 78 L0 120 L8 120 L40 84 L47 91 L58 74 L66 81 L84 52 L93 60 L118 14 Z" fill="var(--snow)" opacity="0.14" />
    </svg>
  );
}

/** Vollständige Wort-Bild-Marke für Header und Footer. */
export function Logo({
  className = "",
  showSubtitle = true,
}: {
  className?: string;
  showSubtitle?: boolean;
}) {
  return (
    /**
     * Aufbau: Bergkette · AlpenDry · Bergkette, darunter der Untertitel.
     * Die rechte Kette ist gespiegelt (`-scale-x-100`) — beide Massive neigen
     * sich dadurch zur Wortmarke hin, statt in dieselbe Richtung zu kippen.
     * Eine unbearbeitete Kopie sähe wie ein Duplikat aus, keine Rahmung.
     */
    <span className={`inline-flex flex-col items-center ${className}`}>
      <span className="flex items-end gap-2.5">
        <AlpenDryMark className="h-7 w-auto shrink-0" />
        <span className="font-display text-xl font-semibold leading-none tracking-tight">
          <span className="text-snow">{site.wordmark.first}</span>
          <span className="text-glacier">{site.wordmark.second}</span>
        </span>
        <AlpenDryMark className="h-7 w-auto shrink-0 -scale-x-100" />
      </span>
      {showSubtitle && (
        <span className="mt-1.5 font-mono text-[0.5rem] uppercase leading-none tracking-eyebrow text-frost-dim">
          {site.subtitle}
        </span>
      )}
    </span>
  );
}
