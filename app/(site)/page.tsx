import { HeroScene } from "@/components/hero/HeroScene";
import { Positioning } from "@/components/sections/Positioning";
import { Services } from "@/components/sections/Services";
import { Region } from "@/components/sections/Region";
import { Process } from "@/components/sections/Process";
import { Trust } from "@/components/sections/Trust";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { StickyCTASpacer } from "@/components/layout/StickyCTA";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";

export default function Home() {
  return (
    <>
      <HeroScene />
      <Positioning />
      <Services />
      <Region />
      <Process />
      <Trust />
      <Faq />
      <Contact />

      {/* Abstand, damit die mobile Bottom-Bar nichts überdeckt */}
      <StickyCTASpacer />

      <JsonLd
        data={[
          faqJsonLd(),
          breadcrumbJsonLd([{ name: "Start", path: "/" }]),
        ]}
      />
    </>
  );
}
