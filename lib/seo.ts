import type { Metadata } from "next";
import { site } from "./content";

/**
 * Metadata-Helper (plan.md §5).
 * Regionale Keywords stecken in Title und Description, nicht in einem
 * `keywords`-Tag — den wertet Google seit Jahren nicht mehr aus.
 */

export const BASE_URL = site.url;

export function buildMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${BASE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    /**
     * Bewusst OHNE `images`: Das Vorschaubild kommt aus
     * app/opengraph-image.tsx. Next erzeugt daraus die og:image- und
     * twitter:image-Tags samt Maßen selbst. Würden wir hier eine URL setzen,
     * überschriebe sie die generierte — und zeigte auf eine Datei, die es
     * nicht gibt.
     */
    openGraph: {
      type: "website",
      locale: site.locale,
      url,
      siteName: site.legalName,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
