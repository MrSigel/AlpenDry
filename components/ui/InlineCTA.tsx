import { contact, whatsappHref } from "@/lib/content";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

/**
 * Handlungsaufforderung im Lesefluss.
 *
 * Business Case Kap. 6: „Konsequent wiederholt — jeder Abschnitt der Seite endet
 * mit derselben klaren Aufforderung" und „Ein Besucher darf nie überlegen
 * müssen, was er tun soll."
 *
 * Deshalb steht dieser Block MITTEN im Text, nicht erst am Seitenende: Wer nach
 * zwei Abschnitten überzeugt ist, soll nicht bis unten scrollen müssen.
 *
 * Bewusst zurückhaltend gebaut — Hairline-Rahmen, eine Zeile, ein Satz. Der
 * dritte auffällige Kasten auf einer Seite ist keine Führung mehr, sondern
 * Lärm; die Signalfarbe trägt hier nur der eigentliche Notruf. Genau ein
 * Element darf leuchten (tailwind.config.ts).
 */
export function InlineCTA({ text }: { text: string }) {
  return (
    <aside className="rounded-sm border border-hairline bg-abyss p-6 md:p-7">
      <p className="font-display text-base text-snow md:text-lg">{text}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <a
          href={contact.phoneHref}
          className="inline-flex items-center gap-2.5 rounded-sm bg-signal px-5 py-3 font-display text-sm font-semibold text-ink transition-colors duration-300 ease-glide hover:bg-glacier"
          aria-label={`Notruf ${contact.phone} — rund um die Uhr erreichbar`}
        >
          <PhoneIcon className="h-4 w-4" />
          <span className="font-mono">{contact.phone}</span>
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-sm border border-hairline px-5 py-3 font-display text-sm font-semibold text-snow transition-all duration-300 ease-glide hover:border-glacier hover:bg-glacier-glow"
        >
          <WhatsAppIcon className="h-4 w-4 text-glacier" />
          WhatsApp
        </a>
      </div>
    </aside>
  );
}
