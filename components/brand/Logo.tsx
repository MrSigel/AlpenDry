import { site } from "@/lib/content";

/**
 * AlpenDry — Wort-Bild-Marke.
 *
 * Die Bergkette stammt aus dem echten Logo (Logo.png), nicht mehr aus einer
 * Nachzeichnung: freigestellt und in Palettenfarben umgesetzt
 * (public/brand/mark.png, erzeugt aus dem Original).
 *
 * WARUM NICHT DAS LOGO 1:1:
 * Das Original ist für hellen Grund gebaut — gemessen liegt die Bergspitze bei
 * #051D2C, unser Seitenhintergrund bei #05070C. Der Berg wäre praktisch
 * unsichtbar, „Alpen" (#061C2A) ebenso. Zusätzlich sind die Firnfelder keine
 * eingeschlossenen Flächen, sondern Aussparungen, die den Hintergrund
 * durchscheinen lassen: auf Weiß wirken sie als Schnee, auf ink als dunkle
 * Spalten. Deshalb trägt hier die Form des Originals, während die Farbwerte
 * aus der Palette kommen (steel für das Massiv, frost für den Nebengipfel).
 *
 * Für ein exaktes Ergebnis wäre eine Negativfassung des Logos nötig — die
 * gehört zum Markenpaket und kann die Datei hier jederzeit ersetzen.
 *
 * Die Wortmarke bleibt echter Text in der Display-Schrift: immer gestochen
 * scharf und typografisch identisch mit den Headlines.
 */

/**
 * Nur die Bergkette.
 *
 * Bewusst `<img>` statt next/image: Die Datei ist mit 5,8 KB bereits auf die
 * Anzeigegröße gerechnet (253×96 für 28px Darstellung, also >3× für Retina).
 * Der Image-Optimizer brächte hier nichts mehr, liefe aber bei jedem Aufruf
 * auf jeder Seite — und wird auf Vercel abgerechnet.
 */
export function AlpenDryMark({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/mark.png"
      alt=""
      // Dekorativ — der Markenname steht direkt daneben als Text.
      aria-hidden="true"
      width={253}
      height={96}
      className={className}
    />
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
     * Die rechte Kette ist gespiegelt (`-scale-x-100`), damit sich beide
     * Massive zur Wortmarke hin neigen statt in dieselbe Richtung zu kippen.
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
