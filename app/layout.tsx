import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

import { fontVariables } from "@/lib/fonts";
import { palette } from "@/lib/palette";
import { buildMetadata } from "@/lib/seo";

/**
 * Wurzel-Layout — bewusst MINIMAL.
 *
 * Es liefert nur `<html>`, `<body>`, Schriften und die globalen Metadaten. Der
 * sichtbare Rahmen der Marketing-Seite (Header, Footer, Sticky-CTA, Cookie- und
 * Exit-Banner, Analytics) steckt NICHT hier, sondern in app/(site)/layout.tsx.
 *
 * Der Grund ist /analytics: Diese Seite ist der interne Admin-Bereich der
 * Kundin und darf KEINE Website-Navigation, keinen Footer und kein Tracking
 * tragen. In Next teilen sich alle Routen das Wurzel-Layout — läge das Chrome
 * hier, erschiene es auch im Admin-Bereich. Route-Gruppen lösen das: die
 * öffentlichen Seiten liegen in der Gruppe (site) mit eigenem Layout, /analytics
 * liegt daneben und bekommt nur diesen kargen Rahmen. (Gruppennamen in Klammern
 * ändern die URL nicht.)
 */

export const metadata: Metadata = {
  metadataBase: new URL("https://www.alpendry.de"),
  /**
   * Title trägt den Fachbegriff (Kundenwunsch), die Description beide:
   * „Lecksuche" ist der Begriff mit dem Suchvolumen — Business Case Kap. 10
   * führt dafür eine eigene Ads-Kampagne. Ihn ganz zu streichen würde genau
   * die Suchanfragen verschenken, auf die die Seite optimiert ist.
   */
  ...buildMetadata({
    title: "AlpenDry — Wasserschadensanierung & Leckageortung am Alpenrand",
    description:
      "24/7-Notdienst für Wasserschaden, Leckageortung (Lecksuche) und Schimmel zwischen München, Augsburg, Landsberg und Tegernsee. Für Privatkunden und Versicherungen — 25 Jahre Erfahrung, eigene Technik.",
  }),
  applicationName: "AlpenDry",
  authors: [{ name: "AlpenDry GmbH" }],
  creator: "AlpenDry GmbH",
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  // Muss der Grundfläche entsprechen (palette.ink) — sonst zeigt die mobile
  // Browserleiste eine andere Farbe als die Seite darunter.
  themeColor: palette.ink,
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={fontVariables}>
      <body className="bg-ink text-frost antialiased">{children}</body>
    </html>
  );
}
