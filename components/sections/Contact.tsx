import { contact, contactSection, whatsappHref } from "@/lib/content";
import { Section, SectionHead } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "./ContactForm";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

/**
 * Kontakt — „Drei Wege zu uns" (Business Case Kap. 7).
 * Telefon (Akutfall) · WhatsApp (schneller Draht) · Formular (strukturiert).
 */
export function Contact() {
  return (
    <Section id="kontakt" tone="ink">
      <SectionHead>
        <Reveal>
          <SectionLabel>{contactSection.eyebrow}</SectionLabel>
          <h2 className="mt-6 text-2xl md:text-3xl">{contactSection.h2}</h2>
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
            <span className="font-mono text-2xs uppercase tracking-eyebrow text-frost-dim">
              {contactSection.phoneCard.title}
            </span>
            {/* Die Nummer ist der wichtigste CTA der Seite und trägt hier die
                Fläche — der Platz kommt daher, dass die Spalte die Höhe des
                Formulars füllt. */}
            <a
              href={contact.phoneHref}
              className="mt-5 inline-flex items-center gap-3 font-display text-2xl font-semibold text-snow transition-colors hover:text-signal md:text-3xl"
              aria-label={`Notruf ${contact.phone} — rund um die Uhr erreichbar`}
            >
              <PhoneIcon className="h-7 w-7 shrink-0 text-signal" />
              <span className="font-mono tracking-tight">{contact.phone}</span>
            </a>
            <p className="mt-5 font-body text-sm text-frost-dim">
              {contactSection.phoneCard.body}
            </p>
            <p className="mt-6 font-mono text-2xs uppercase tracking-eyebrow text-frost-dim">
              {contact.availability}
            </p>
          </Reveal>

          <Reveal
            delay={0.05}
            className="flex flex-1 flex-col justify-center rounded-sm border border-hairline bg-abyss p-7"
          >
            <span className="font-mono text-2xs uppercase tracking-eyebrow text-frost-dim">
              {contactSection.whatsapp.title}
            </span>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-fit items-center gap-2.5 rounded-sm border border-hairline px-5 py-3.5 font-display text-sm font-semibold text-snow transition-all duration-300 ease-glide hover:border-glacier hover:bg-glacier-glow"
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
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}
