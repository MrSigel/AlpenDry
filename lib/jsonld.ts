import { contact, faq, region, services, site, social } from "./content";

/**
 * Strukturierte Daten (plan.md §5).
 * Alle Werte stammen aus `content.ts` — keine doppelte Wahrheit.
 */

const BUSINESS_ID = `${site.url}/#business`;

/**
 * LocalBusiness mit 24/7-Öffnungszeiten, Adresse, Geo und Telefon.
 *
 * `HomeAndConstructionBusiness` statt des generischen `LocalBusiness`:
 * spezifischerer Typ, den Google für Handwerks- und Sanierungsbetriebe
 * auswertet. Kein `priceRange` — der Business Case nennt keine Preise,
 * und erfundene Preisangaben wären irreführend.
 */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": BUSINESS_ID,
    name: site.legalName,
    alternateName: site.name,
    description:
      "Spezialist für Wasserschadensanierung, Trocknung, Leckageortung und Schimmelsanierung am Alpenrand. 24/7-Notdienst für Privatkunden und Versicherungen.",
    url: site.url,
    telephone: contact.phoneRaw,
    email: contact.email,
    /**
     * Bestätigte Profile. Google nutzt sie, um das Unternehmen als real
     * einzuordnen und Website, Unternehmensprofil und Social Media zu
     * derselben Einheit zu verknüpfen — ein Signal für das lokale Ranking
     * (Business Case Kap. 8).
     */
    sameAs: social.map((s) => s.href),
    // Von app/opengraph-image.tsx erzeugt; app/icon.svg ist das Favicon.
    image: `${site.url}/opengraph-image`,
    logo: `${site.url}/icon.svg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.street,
      postalCode: contact.postalCode,
      addressLocality: contact.city,
      addressRegion: contact.region,
      addressCountry: contact.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: contact.geo.lat,
      longitude: contact.geo.lng,
    },
    // 24/7 — Business Case Kap. 4: „rund um die Uhr"
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    areaServed: region.places.map((place) => ({
      "@type": "City",
      name: place,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Leistungen",
      itemListElement: services.items.map((item) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: item.title,
          description: item.body,
        },
      })),
    },
    /**
     * Bewusst mit allen drei Leck-Varianten: `knowsAbout` ist strukturierte
     * Information für Suchmaschinen, kein sichtbarer Text. Sichtbar heißt es
     * „Leckageortung" (Kundenwunsch), gesucht wird aber überwiegend nach
     * „Lecksuche" — hier dürfen beide stehen, ohne die Seite zu verwässern.
     */
    knowsAbout: [
      "Wasserschadensanierung",
      "Leckageortung",
      "Lecksuche",
      "Leckortung",
      "Schimmelsanierung",
      "Technische Trocknung",
      "Hochwasser-Prävention",
    ],
  };
}

/** FAQPage — speist Googles Antwortboxen (AEO, plan.md §5). */
export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

/**
 * Service-Schema für eine Leistungsseite.
 * `provider` verweist per @id auf das LocalBusiness aus dem Layout — kein
 * zweiter Eintrag, sonst hält Google zwei Betriebe für möglich.
 */
export function serviceJsonLd(page: {
  slug: string;
  h1: string;
  lead: string;
  metaDescription: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.h1,
    description: page.metaDescription,
    url: `${site.url}/leistungen/${page.slug}`,
    provider: { "@id": BUSINESS_ID },
    areaServed: region.places.map((place) => ({ "@type": "City", name: place })),
    serviceType: page.h1,
  };
}

/** FAQPage für die Fragen einer Leistungsseite (AEO). */
export function serviceFaqJsonLd(page: {
  faq: readonly { q: string; a: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbJsonLd(
  trail: ReadonlyArray<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${site.url}${crumb.path}`,
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.legalName,
    inLanguage: "de-DE",
    publisher: { "@id": BUSINESS_ID },
  };
}
