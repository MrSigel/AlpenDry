import { site } from "@/lib/content";

/**
 * AlpenDry — Wort-Bild-Marke, aus dem Original rekonstruiert.
 *
 * Aufbau wie im Logo:
 *   Bergkette (steel, facettiert) mit Schneefeldern (snow),
 *   Blitz (frost) diagonal durch die rechte Flanke,
 *   Wortmarke „Alpen" (snow) + „Dry" (glacier),
 *   Untertitel WASSERSCHADENSANIERUNG, gesperrt.
 *
 * Die Wortmarke ist echter Text in der Display-Schrift — dadurch immer
 * gestochen scharf und typografisch identisch mit den Headlines.
 */

/** Nur das Bergsymbol — auch als Favicon/OG-Mark nutzbar. */
export function AlpenDryMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 116"
      // Dekorativ: Der Markenname steht direkt daneben als Text. Ein eigenes
      // Label würde ihn für Screenreader nur verdoppeln.
      aria-hidden="true"
      className={className}
      fill="none"
    >
      {/* Bergflanken — gedämpftes Stahlblau */}
      <path d="M4 112 L58 26 L112 112 Z" fill="var(--steel)" />
      <path d="M92 112 L140 44 L196 112 Z" fill="var(--steel)" opacity="0.72" />

      {/* Schneefelder — facettiert, wie im Original */}
      <path d="M58 26 L79 59 L69 66 L58 54 L47 64 L37 59 Z" fill="var(--snow)" />
      <path d="M140 44 L157 70 L148 75 L140 66 L131 74 L123 70 Z" fill="var(--snow)" />

      {/* Kantenlicht auf den Graten — Tiefe über Kante, nicht über Schatten */}
      <path d="M4 112 L58 26 L62 33 L14 112 Z" fill="var(--frost)" opacity="0.16" />
      <path d="M92 112 L140 44 L144 51 L102 112 Z" fill="var(--frost)" opacity="0.1" />

      {/* Blitz — Silbergrau, durch die rechte Flanke */}
      <path
        d="M150 60 L128 94 L142 94 L124 116 L152 86 L138 86 Z"
        fill="var(--frost)"
      />
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
     * Aufbau: Bergsymbol · AlpenDry · Bergsymbol, darunter der Untertitel.
     * Das rechte Symbol ist gespiegelt (`-scale-x-100`) — beide Gipfelgruppen
     * neigen sich dadurch zur Wortmarke hin, statt in dieselbe Richtung zu
     * kippen. Eine unbearbeitete Kopie sähe wie ein Duplikat aus, keine
     * Rahmung.
     */
    <span className={`inline-flex flex-col items-center ${className}`}>
      <span className="flex items-end gap-2.5">
        <AlpenDryMark className="h-6 w-auto shrink-0" />
        <span className="font-display text-xl font-semibold leading-none tracking-tight">
          <span className="text-snow">{site.wordmark.first}</span>
          <span className="text-glacier">{site.wordmark.second}</span>
        </span>
        <AlpenDryMark className="h-6 w-auto shrink-0 -scale-x-100" />
      </span>
      {showSubtitle && (
        <span className="mt-1.5 font-mono text-[0.5rem] uppercase leading-none tracking-eyebrow text-frost-dim">
          {site.subtitle}
        </span>
      )}
    </span>
  );
}
