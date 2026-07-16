import { contact, contactSection, whatsappHref } from "@/lib/content";
import { Section, SectionHead, type SectionHeading } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "./ContactForm";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

/**
 * Kontakt — „Drei Wege zu uns" (Business Case Kap. 7).
 * Telefon (Akutfall) · WhatsApp (schneller Draht) · Formular (strukturiert).
 */
export function Contact({ headingAs: H = "h2" }: SectionHeading) {
  /**
   * Die Karten-Überschriften wandern mit: Steht die Sektion auf ihrer eigenen
   * Seite (H = h1), sind die Karten eine Ebene darunter (h2); auf der
   * Startseite (H = h2) bleiben sie h3.
   *
   * Ohne das übersprang /kontakt die Ebene h2 — h1 direkt gefolgt von h3.
   * Screenreader navigieren über genau diese Reihenfolge; eine Lücke lässt sie
   * eine fehlende Überschrift vermuten. Lighthouse hat es als heading-order
   * gemeldet (A11y 98 statt 100).
   */
  const Card = H === "h1" ? "h2" : "h3";

  return (
    <Section id="kontakt" tone="ink">
      <SectionHead>
        <Reveal>
          <SectionLabel>{contactSection.eyebrow}</SectionLabel>
          <H className="mt-6 text-2xl md:text-3xl">{contactSection.h2}</H>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-6 font-body text-base text-frost md:text-lg">
            {contactSection.lead}
          </p>
        </Reveal>
      </SectionHead>

      {/* Zwei gleich breite Spalten. `items-stretch` (Grid-Default) gibt beiden
          dieselbe Höhe; links teilen sich die Karten über `flex-1` die Höhe des
          Formulars, sodass die Spalten oben UND unten bündig abschließen. */}
      <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-2 lg:gap-6">
        {/* Direktkontakt: Telefon + WhatsApp */}
        <div className="flex flex-col gap-6">
          <Reveal className="flex flex-1 flex-col justify-center rounded-sm border border-hairline bg-abyss p-7">
            {/* Display-Schrift wie JEDE andere Kartenüberschrift im Projekt
                (Formular nebenan, Seitenspalte der Leistungsseiten). Vorher
                stand hier die kleine Mono-Eyebrow — direkt neben „Ausgefüllt in
                unter einer Minute" in der Display-Schrift. Zwei Karten
                nebeneinander, zwei Schriften.
                Als Überschrift statt <span>: Es IST die Überschrift dieser
                Karte. Die Ebene liefert `Card` — sie hängt daran, ob die
                Sektion auf der Startseite oder auf /kontakt steht. */}
            <Card className="font-display text-xl font-semibold text-snow">
              {contactSection.phoneCard.title}
            </Card>
            {/*
             * Der Notruf als gefüllter signal-Button — exakt das Muster, das
             * Hero, Header und die Leistungsseiten schon verwenden.
             *
             * Vorher stand die Nummer hier als 44px-Text. Sie war damit das
             * EINZIGE Vorkommen der Telefonnummer auf der ganzen Seite, das
             * nicht der Button-Fassung folgte — und die Karte trug vier
             * verschiedene Schriftgrößen (19/44/14/11 px), während die
             * WhatsApp-Karte direkt darunter mit zwei auskam. Zwei Karten
             * übereinander, zwei Bauweisen.
             *
             * Der Button verliert nichts an Dominanz: signal ist laut
             * tailwind.config.ts die einzige Farbe, die leuchten darf, und sie
             * führt das Auge zuverlässiger als reine Schriftgröße.
             */}
            <a
              href={contact.phoneHref}
              className="mt-5 inline-flex w-fit items-center gap-2.5 rounded-sm bg-signal px-5 py-3.5 font-display text-sm font-semibold text-ink transition-colors duration-300 ease-glide hover:bg-glacier"
              aria-label={`Notruf ${contact.phone} — rund um die Uhr erreichbar`}
            >
              <PhoneIcon className="h-4 w-4 shrink-0" />
              <span className="font-mono">{contact.phone}</span>
            </a>
            <p className="mt-4 font-body text-sm text-frost-dim">
              {contactSection.phoneCard.body}
            </p>
            {/* Gleiche Größe und Schrift wie der Fließtext darüber. Vorher
                text-2xs in Versalien-Mono — dieselbe Rolle (unterstützende
                Information), aber die halbe Größe und eine andere Schrift. */}
            <p className="mt-3 font-body text-sm text-frost-dim">
              {contact.availability}
            </p>
          </Reveal>

          <Reveal
            delay={0.05}
            className="flex flex-1 flex-col justify-center rounded-sm border border-hairline bg-abyss p-7"
          >
            {/* Baugleich zur Telefon-Karte darüber: gleiche Überschrift, gleicher
                Button-Zuschnitt, gleiche Abstände, gleiche Textgröße. Die beiden
                stehen untereinander — jeder Unterschied liest sich als Fehler.
                Nur die Button-FARBE trennt sie, und zwar mit Absicht: gefülltes
                signal für den Notruf, Outline für den zweiten Weg. */}
            <Card className="font-display text-xl font-semibold text-snow">
              {contactSection.whatsapp.title}
            </Card>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-fit items-center gap-2.5 rounded-sm border border-hairline px-5 py-3.5 font-display text-sm font-semibold text-snow transition-all duration-300 ease-glide hover:border-glacier hover:bg-glacier-glow"
            >
              <WhatsAppIcon className="h-4 w-4 text-glacier" />
              WhatsApp öffnen
            </a>
            <p className="mt-4 font-body text-sm text-frost-dim">
              {contactSection.whatsapp.body}
            </p>
          </Reveal>

        </div>

        {/* Formular */}
        <Reveal delay={0.05} className="h-full">
          <ContactForm headingAs={Card} />
        </Reveal>
      </div>
    </Section>
  );
}
