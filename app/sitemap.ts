import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
import { servicePages } from "@/lib/services-pages";

/**
 * Sitemap — erzeugt, nicht gepflegt.
 *
 * Die Leistungsseiten kommen aus `servicePages`, also aus derselben Quelle, aus
 * der auch Navigation, Footer und die Routen selbst entstehen. Eine neue
 * Leistung steht dadurch automatisch drin. Eine handgeschriebene sitemap.xml
 * wäre beim ersten Zuwachs veraltet — und eine Sitemap, die Seiten verschweigt
 * oder tote URLs nennt, ist schlechter als keine.
 *
 * WAS FEHLT UND WARUM: Impressum, Datenschutz, AGB und Cookies stehen auf
 * `noIndex` (siehe die jeweilige page.tsx). Sie hier zu listen wäre ein
 * Widerspruch — man bittet Google, etwas aufzunehmen, das man ihm gleichzeitig
 * verbietet. Google meldet das in der Search Console als Fehler.
 *
 * `priority` und `changeFrequency` wertet Google seit Jahren nicht mehr aus.
 * Sie stehen trotzdem drin, weil andere Crawler (Bing) sie noch lesen — und
 * weil sie hier ehrlich sind: Die Startseite ist die Zielseite der Anzeigen
 * (Business Case Kap. 6), die Rechtstexte ändern sich nie.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  /*
   * Ein fester Zeitstempel statt `new Date()`.
   *
   * Bei einer statisch gebauten Seite liefe `new Date()` einmal beim Build und
   * behauptete danach für alle Zeit, jede Seite sei an genau diesem Tag geändert
   * worden — auch die, die seit Monaten unverändert ist. Crawler lernen, dass
   * das Datum nichts bedeutet, und ignorieren es.
   */
  const lastModified = new Date("2026-07-16");

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, priority: 1, changeFrequency: "weekly" },
    { url: `${site.url}/leistungen`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${site.url}/arbeiten`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${site.url}/einsatzgebiet`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${site.url}/ablauf`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${site.url}/fragen`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${site.url}/kontakt`, priority: 0.9, changeFrequency: "monthly" },
  ];

  const services: MetadataRoute.Sitemap = servicePages.map((page) => ({
    url: `${site.url}/leistungen/${page.slug}`,
    priority: 0.9,
    changeFrequency: "monthly" as const,
  }));

  return [...staticPages, ...services].map((entry) => ({ ...entry, lastModified }));
}
