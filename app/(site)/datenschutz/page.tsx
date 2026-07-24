import type { Metadata } from "next";
import { datenschutz } from "@/lib/legal";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = buildMetadata({
  title: "Datenschutzerklärung — AlpenDry GmbH",
  description:
    "Informationen zur Verarbeitung personenbezogener Daten auf der Website der AlpenDry GmbH.",
  path: "/datenschutz",
  noIndex: true,
});

export default function DatenschutzPage() {
  return (
    <LegalPage
      title={datenschutz.title}
      updated={datenschutz.updated}
      intro={datenschutz.intro}
      blocks={datenschutz.blocks}
    />
  );
}
