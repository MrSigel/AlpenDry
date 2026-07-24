import type { Metadata } from "next";
import { impressum } from "@/lib/legal";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = buildMetadata({
  title: "Impressum — AlpenDry GmbH",
  description: "Impressum und Anbieterkennzeichnung der AlpenDry GmbH, Murnau a. Staffelsee.",
  path: "/impressum",
  noIndex: true,
});

export default function ImpressumPage() {
  return (
    <LegalPage
      title={impressum.title}
      updated={impressum.updated}
      blocks={impressum.blocks}
    />
  );
}
