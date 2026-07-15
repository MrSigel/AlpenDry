/**
 * Eyebrow-Label im Logo-Untertitel-Stil.
 * Mono, gesperrt — plus wachsende Hairline als einziges Ornament.
 *
 * BEWUSST OHNE `whitespace-nowrap`: Bei den kurzen Labels („Leistungen",
 * „Kontakt") fiel das nie auf, aber ein längeres wie „Für Versicherungen &
 * Schadensteuerer" sprengte mit der 0.16em-Sperrung ein 320px-Display —
 * der Text lief aus seiner Box, ohne dass ein Element sichtbar zu breit war.
 * `min-w-0` erlaubt dem Flex-Kind zu schrumpfen, `shrink` gibt der Hairline
 * nach.
 */
export function SectionLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="eyebrow min-w-0">{children}</span>
      <span
        className="hairline w-full min-w-0 max-w-[7rem] shrink origin-left"
        aria-hidden="true"
      />
    </div>
  );
}
