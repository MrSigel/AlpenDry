import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

/**
 * robots.txt — erzeugt statt in public/ abgelegt, damit die Sitemap-URL aus
 * derselben Quelle kommt wie überall sonst (`site.url`). Eine hartkodierte
 * Domain wäre die Stelle, die beim Umzug vergessen wird.
 *
 * BEWUSST NICHTS VERBOTEN.
 * Die Versuchung ist groß, hier /impressum & Co. per `disallow` auszusperren —
 * das wäre ein Fehler: `disallow` verbietet das CRAWLEN, nicht das Indexieren.
 * Google darf die Seite dann nicht mehr lesen, sieht ihr `noindex` also nie
 * und kann sie trotzdem in den Index nehmen, wenn irgendwo ein Link darauf
 * zeigt — nur eben ohne Beschreibung. Die Rechtstexte tragen ihr `noindex` im
 * Head (siehe die jeweilige page.tsx); dafür muss der Crawler hinein dürfen.
 *
 * `/api/` bleibt draußen: Dort liegt nur der Formular-Endpunkt, der auf GET
 * ohnehin nichts liefert. Ihn crawlen zu lassen kostet nur Budget.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
