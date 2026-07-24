import { localBusinessJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { Analytics } from "@vercel/analytics/next";
import { JsonLd } from "@/components/ui/JsonLd";
import { AnchorScroll } from "@/components/layout/AnchorScroll";
import { UsageTracker } from "@/components/layout/UsageTracker";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyCTA } from "@/components/layout/StickyCTA";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { ExitBanner } from "@/components/layout/ExitBanner";

/**
 * Rahmen der ÖFFENTLICHEN Website: Header, Footer, Sticky-CTA, Cookie- und
 * Exit-Banner, strukturierte Daten und die Nutzungsmessung.
 *
 * Bewusst hier statt im Wurzel-Layout, damit /analytics (Admin-Bereich) nichts
 * davon erbt — kein Menü, kein Footer, KEIN Tracking. Der Inhaber sieht dort
 * nur die Zahlen, und seine eigenen Besuche verfälschen die Statistik nicht.
 * Herleitung im Wurzel-Layout (app/layout.tsx).
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* Sprungmarke — erster fokussierbarer Punkt für Tastatur und Screenreader */}
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:rounded-sm focus:bg-signal focus:px-4 focus:py-3 focus:font-display focus:text-sm focus:font-semibold focus:text-ink"
      >
        Zum Inhalt springen
      </a>

      {/* Rendert nichts — sorgt dafür, dass Anker-Sprünge über Seitengrenzen
          hinweg springen statt zu fahren. Begründung in der Komponente. */}
      <AnchorScroll />

      <Header />
      <main id="inhalt">{children}</main>
      <Footer />
      <StickyCTA />
      <CookieBanner />
      <ExitBanner />

      <JsonLd data={[localBusinessJsonLd(), websiteJsonLd()]} />

      {/* Seitenaufrufe + Klickverhalten — nur auf der öffentlichen Seite.
          Vercels <Analytics/> zählt Aufrufe fürs Vercel-Dashboard; UsageTracker
          meldet Klicks an Vercel UND an den eigenen Zähler, den /analytics
          ausliest. */}
      <Analytics />
      <UsageTracker />
    </>
  );
}
