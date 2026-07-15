import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Handlungsaufforderung.
 *
 * Farbdisziplin (tailwind.config.ts):
 *   primary   → `signal`. Das EINZIGE Element im Projekt, das leuchten darf.
 *               Business Case Kap. 6: „Farblich dominant — eine Signalfarbe,
 *               die sich klar vom restlichen Design abhebt."
 *   secondary → Kontur in frost-faint, Text snow. Ordnet sich unter.
 *   quiet     → reiner Text-Link mit Hairline.
 *
 * Tiefe entsteht über Kante und Farbe, nicht über weiche Schatten (plan.md §0).
 */

type Variant = "primary" | "secondary" | "quiet";

const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-sm font-display text-sm font-semibold leading-none transition-all duration-300 ease-glide";

const variants: Record<Variant, string> = {
  primary: "bg-signal px-6 py-4 text-ink hover:bg-glacier active:bg-glacier",
  secondary:
    "border border-hairline bg-transparent px-6 py-4 text-snow hover:border-glacier hover:bg-glacier-glow",
  quiet: "text-frost hover:text-snow",
};

export function CTAButton({
  href,
  variant = "primary",
  children,
  className = "",
  icon,
  external = false,
  "aria-label": ariaLabel,
}: {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  external?: boolean;
  "aria-label"?: string;
}) {
  const cls = `${base} ${variants[variant]} ${className}`;

  // tel:, mailto: und wa.me verlassen die App — kein Client-Routing.
  const isPlainAnchor =
    external || /^(tel:|mailto:|https?:)/.test(href);

  if (isPlainAnchor) {
    return (
      <a
        href={href}
        className={cls}
        aria-label={ariaLabel}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {icon}
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {icon}
      {children}
    </Link>
  );
}
