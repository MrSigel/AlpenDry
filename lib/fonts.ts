import localFont from "next/font/local";
import { Inter, Geist_Mono } from "next/font/google";

/**
 * Typo-Rollen laut tailwind.config.ts.
 * Alle Fonts werden self-hosted ausgeliefert — kein CDN-Call zur Laufzeit
 * (plan.md §1). next/font/google lädt zur Build-Zeit und hostet lokal.
 */

/** Display — General Sans (Fontshare, FFL). Variable 200–700 + Italic für den Claim. */
export const display = localFont({
  src: [
    {
      path: "../public/fonts/GeneralSans-Variable.woff2",
      weight: "200 700",
      style: "normal",
    },
    {
      path: "../public/fonts/GeneralSans-VariableItalic.woff2",
      weight: "200 700",
      style: "italic",
    },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

/** Body — hochlesbare neutrale Sans. */
export const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/**
 * Mono — Utility für PLZ/Telefon/Eyebrow-Labels.
 *
 * `preload: false`: Diese Schrift setzt nur Kleinstflächen (Eyebrows, die
 * Telefonnummer). Preloaded würde sie 23 KB im kritischen Pfad belegen und mit
 * der Display-Schrift konkurrieren, die das h1 trägt — und genau das h1 ist das
 * LCP-Element. Sie lädt jetzt nachrangig; bis dahin greift der Mono-Fallback.
 *
 * `display: "swap"`: Die Schrift SOLL sichtbar werden — sie trägt die
 * Telefonnummer und die Eyebrow-Labels, ein Stück Markenanmutung. „optional"
 * hätte sie Erstbesuchern meist vorenthalten. Der Layout-Shift, den ihr später
 * Swap auf den Unterseiten auslöste (die Brotkrume brach im Fallback zweizeilig
 * um und sprang beim Laden auf eine Zeile), ist an der Quelle gelöst: Die
 * Brotkrume läuft jetzt einzeilig (Header der Unterseiten-Route) und kann ihre
 * Zeilenzahl gar nicht mehr ändern.
 */
export const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

export const fontVariables = `${display.variable} ${body.variable} ${mono.variable}`;
