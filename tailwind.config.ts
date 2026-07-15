import type { Config } from "tailwindcss";

/**
 * AlpenDry — Design Tokens
 * ------------------------------------------------------------------
 * FARBEN: ausschließlich aus dem AlpenDry-Logo entnommen.
 * KEINE anderen Farben im gesamten Projekt verwenden.
 *
 * Denkmodell für die Blau-Sequenz (Temperatur „Tiefsee → Eiskante"):
 *   ink      → tiefstes Schwarzblau, Grund unter allem
 *   abyss    → Sektions-Hintergrund, Wasser unter dem Eisberg
 *   deep     → Panels/Cards, Tiefe
 *   steel    → gedämpftes Stahlblau (Bergsymbol, Sub-Headline, ruhige Akzente)
 *   glacier  → Royalblau aus „Dry" — PRIMÄRER Marken-Akzent
 *   signal   → helles Signalblau — nur für CTAs / augenführende Elemente
 *   frost    → Silbergrau (Blitzsymbol, sekundäre Schrift, feine Linien)
 *   snow     → Weiß (Headlines, „Alpen", primäre Schrift)
 *
 * EINSATZ-REGELN (Disziplin = Eleganz):
 *   - Flächen: ink / abyss / deep.
 *   - Text primär: snow. Text sekundär: frost. Text gedämpft: steel.
 *   - Marken-Akzent (Linien, Labels, aktive Zustände): glacier — sparsam.
 *   - CTA / „jetzt handeln": signal — das EINZIGE Element, das leuchten darf.
 *   - Sterne, Siegel, Icons: glacier/frost — niemals Gold, niemals Fremdfarbe.
 */

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    // Bewusst KEIN Erweitern der Default-Palette — wir ersetzen sie,
    // damit versehentliche Fremdfarben (bg-red-500 o. Ä.) gar nicht existieren.
    colors: {
      transparent: "transparent",
      current: "currentColor",

      ink: "#05070C",
      abyss: "#0A0F1A",
      deep: "#111B2E",
      steel: "#2E5A8C",
      glacier: "#1E6FE8",
      signal: "#2E86FF",
      frost: "#C9D4E2",
      snow: "#FFFFFF",

      // Feine Abstufungen NUR aus obigen Tönen abgeleitet (Transparenz),
      // keine neuen Farbwerte:
      "frost-dim": "rgba(201, 212, 226, 0.62)", // sekundärtext gedämpft
      "frost-faint": "rgba(201, 212, 226, 0.14)", // hairline-linien
      "glacier-glow": "rgba(30, 111, 232, 0.28)", // dezenter akzent-schimmer
      "ink-scrim": "rgba(5, 7, 12, 0.78)", // lesbarkeits-overlay über 3D
    },

    // Typo-Rollen (konkrete Fonts via next/font in layout.tsx zuweisen):
    //   display → charaktervolle, ruhige Grotesk mit enger Laufweite
    //             (Vorschlag: „Clash Display" oder „General Sans" —
    //              als Alternative die Logo-Anmutung: humanistische Sans)
    //   body    → hochlesbare neutrale Sans (Vorschlag: „Inter")
    //   mono    → Utility für PLZ/Telefon/Labels (Vorschlag: „Geist Mono")
    fontFamily: {
      display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
      body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      mono: ["var(--font-mono)", "ui-monospace", "monospace"],
    },

    // Bewusst großzügige, disziplinierte Typo-Skala (Perfect-Fourth-nah).
    fontSize: {
      "2xs": ["0.6875rem", { lineHeight: "1.2", letterSpacing: "0.14em" }], // eyebrow-labels
      xs: ["0.75rem", { lineHeight: "1.5" }],
      sm: ["0.875rem", { lineHeight: "1.55" }],
      base: ["1rem", { lineHeight: "1.65" }],
      lg: ["1.1875rem", { lineHeight: "1.6" }],
      xl: ["1.5rem", { lineHeight: "1.35" }],
      "2xl": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      "3xl": ["2.75rem", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
      "4xl": ["3.75rem", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
      "5xl": ["5rem", { lineHeight: "0.98", letterSpacing: "-0.03em" }], // hero-H1
    },

    extend: {
      letterSpacing: {
        eyebrow: "0.16em", // logo-untertitel-anmutung (WASSERSCHADENSANIERUNG)
      },
      maxWidth: {
        prose: "38rem", // ruhige, gut lesbare Textspalte
        shell: "76rem", // globaler Content-Rahmen
      },
      spacing: {
        section: "8.5rem", // vertikaler Rhythmus zwischen Sektionen (Desktop)
        "section-sm": "5rem", // mobil
      },
      borderColor: {
        hairline: "rgba(201, 212, 226, 0.14)", // = frost-faint, für feine Trennlinien
      },
      transitionTimingFunction: {
        // ruhige, „schwere" Kurve — nichts hüpft, alles gleitet
        glide: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "line-grow": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "line-grow": "line-grow 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
