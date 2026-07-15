import { contact, cta, whatsappHref } from "@/lib/content";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Wiederkehrender Handlungsaufruf nach jedem Abschnitt.
 * Business Case Kap. 6: „Konsequent wiederholt — jeder Abschnitt der Seite
 * endet mit derselben klaren Aufforderung."
 *
 * Bewusst zurückhaltend gerahmt (Hairline, keine Fläche), damit die Wiederholung
 * nicht schreit — nur `signal` am Notruf-Button trägt die Farbe.
 */
export function CTABanner({ variant = "line" }: { variant?: "line" | "panel" }) {
  return (
    <Reveal
      className={
        variant === "panel"
          ? "flex flex-col items-start gap-6 rounded-sm border border-hairline bg-abyss px-7 py-8 sm:flex-row sm:items-center sm:justify-between"
          : "flex flex-col items-start gap-6 border-t border-hairline pt-10 sm:flex-row sm:items-center sm:justify-between"
      }
    >
      <p className="font-display text-lg text-snow md:text-xl">{cta.repeat}</p>
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={contact.phoneHref}
          className="inline-flex items-center gap-2.5 rounded-sm bg-signal px-5 py-3.5 font-display text-sm font-semibold text-ink transition-colors duration-300 ease-glide hover:bg-glacier"
          aria-label={`Notruf ${contact.phone} — rund um die Uhr erreichbar`}
        >
          <PhoneIcon className="h-4 w-4" />
          <span className="font-mono">{contact.phone}</span>
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-sm border border-hairline px-5 py-3.5 font-display text-sm font-semibold text-snow transition-all duration-300 ease-glide hover:border-glacier hover:bg-glacier-glow"
        >
          <WhatsAppIcon className="h-4 w-4 text-glacier" />
          WhatsApp
        </a>
      </div>
    </Reveal>
  );
}
