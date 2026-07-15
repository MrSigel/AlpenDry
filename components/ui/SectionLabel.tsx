/**
 * Eyebrow-Label im Logo-Untertitel-Stil.
 * Mono, gesperrt, steel — plus wachsende Hairline als einziges Ornament.
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
      <span className="eyebrow whitespace-nowrap">{children}</span>
      <span className="hairline w-full max-w-[7rem] origin-left" aria-hidden="true" />
    </div>
  );
}
