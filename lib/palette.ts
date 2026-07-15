/**
 * Farbpalette für den 3D-Canvas.
 *
 * SYNCHRON HALTEN mit styles/globals.css und tailwind.config.ts.
 * three.js kann keine CSS-Variablen lesen, deshalb sind die Werte hier
 * gespiegelt — exakt dieselben Hex-Codes, keine neuen Farben.
 *
 * Wer hier etwas ändert, ändert es auch in globals.css und tailwind.config.ts.
 */
export const palette = {
  // Aufgehellt auf Kundenwunsch — Herleitung in tailwind.config.ts.
  ink: "#0E1626",
  abyss: "#152036",
  deep: "#20304C",
  steel: "#2E5A8C",
  glacier: "#1E6FE8",
  signal: "#2E86FF",
  frost: "#C9D4E2",
  snow: "#FFFFFF",
} as const;

export type PaletteColor = keyof typeof palette;
