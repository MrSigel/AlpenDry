/**
 * Icons — bewusst handgezeichnet und minimal.
 * Keine Icon-Library (plan.md §0: keine bunten Icon-Sets, keine Deko ohne Funktion).
 * Alle erben `currentColor`, damit die Farbdisziplin an der Komponente hängt.
 */

type IconProps = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function PhoneIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        {...stroke}
        d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z"
      />
    </svg>
  );
}

/**
 * Mail — Umschlag.
 *
 * Gleiche Bauweise wie PhoneIcon: 24er-Raster, `stroke`-Preset, currentColor.
 * Die Klappe ist nur angedeutet (drei Linien statt eines geschlossenen
 * Dreiecks) — bei 16 px liefe eine vollständige Klappe zu.
 */
export function MailIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect {...stroke} x="3" y="5" width="18" height="14" rx="2" />
      <path {...stroke} d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

/**
 * WhatsApp — offizielles Glyph (Sprechblase mit Hörer).
 *
 * Bewusst der originale Pfad statt einer Eigenzeichnung: eine nachgebaute
 * Marke liest sich sofort als „falsch" und beschädigt das Vertrauen, das der
 * Button eigentlich herstellen soll.
 *
 * Monochrom über `currentColor` statt im WhatsApp-Grün: Die Farbdisziplin aus
 * tailwind.config.ts erlaubt keine Fremdfarben — und die WhatsApp-Richtlinien
 * lassen die einfarbige Wiedergabe des Glyphs ausdrücklich zu.
 */
export function WhatsAppIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.99 2.898 9.83 9.83 0 0 1 2.892 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export function ChevronIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path {...stroke} d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ArrowRightIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path {...stroke} d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  );
}

/**
 * Stern für Bewertungen.
 * NIEMALS Gold — Füllung kommt über currentColor (glacier/frost).
 * `half` für gebrochene Schnitte.
 */
export function StarIcon({
  className = "h-4 w-4",
  variant = "full",
}: IconProps & { variant?: "full" | "half" | "empty" }) {
  const d =
    "M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.9Z";
  const id = `half-${variant}`;

  if (variant === "half") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d={d}
          fill={`url(#${id})`}
          stroke="currentColor"
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d={d}
        fill={variant === "full" ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
    </svg>
  );
}
