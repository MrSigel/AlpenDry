import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

import { fontVariables } from "@/lib/fonts";
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
  ...buildMetadata({
    title: "AlpenDry — Wasserschadensanierung & Lecksuche am Alpenrand",
    description:
      "24/7-Notdienst für Wasserschaden, Lecksuche und Schimmel zwischen München, Augsburg, Landsberg und Tegernsee. Eigene Technik, 25 Jahre Erfahrung — in der Regel zahlt die Versicherung.",
  }),
  applicationName: "AlpenDry",
  authors: [{ name: "AlpenDry GmbH" }],
  creator: "AlpenDry GmbH",
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  themeColor: "#05070C",
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
