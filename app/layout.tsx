import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

import { fontVariables } from "@/lib/fonts";
import { palette } from "@/lib/palette";
import { buildMetadata } from "@/lib/seo";
import { localBusinessJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/JsonLd";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyCTA } from "@/components/layout/StickyCTA";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { ExitBanner } from "@/components/layout/ExitBanner";

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
      <body className="bg-ink text-frost antialiased">
        {/* Sprungmarke — erster fokussierbarer Punkt für Tastatur und Screenreader */}
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:rounded-sm focus:bg-signal focus:px-4 focus:py-3 focus:font-display focus:text-sm focus:font-semibold focus:text-ink"
        >
          Zum Inhalt springen
        </a>

        <Header />
        <main id="inhalt">{children}</main>
        <Footer />
        <StickyCTA />
        <CookieBanner />
        <ExitBanner />

        <JsonLd data={[localBusinessJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
