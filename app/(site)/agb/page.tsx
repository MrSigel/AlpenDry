import type { Metadata } from "next";
import { agb } from "@/lib/agb";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = buildMetadata({
  title: "AGB — AlpenDry GmbH",
  description:
    "Allgemeine Geschäftsbedingungen der AlpenDry GmbH für Schadensanierung, Trocknung, Leckortung und Gerätevermietung.",
  path: "/agb",
  noIndex: true,
});

export default function AgbPage() {
  return <LegalPage title={agb.title} updated={agb.updated} blocks={agb.blocks} />;
}
