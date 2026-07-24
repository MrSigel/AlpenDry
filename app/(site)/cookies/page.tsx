import type { Metadata } from "next";
import { cookies } from "@/lib/legal";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/layout/LegalPage";
import { ConsentControls } from "@/components/layout/ConsentControls";

export const metadata: Metadata = buildMetadata({
  title: "Cookies — AlpenDry GmbH",
  description:
    "Übersicht der auf alpendry.de eingesetzten Cookies und Möglichkeit zum Widerruf der Einwilligung.",
  path: "/cookies",
  noIndex: true,
});

export default function CookiesPage() {
  return (
    <LegalPage
      title={cookies.title}
      updated={cookies.updated}
      intro={cookies.intro}
      blocks={cookies.blocks}
    >
      <ConsentControls />
    </LegalPage>
  );
}
