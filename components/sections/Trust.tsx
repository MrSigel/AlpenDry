import { trust } from "@/lib/content";
import { Section, SectionHead } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { StarIcon } from "@/components/ui/Icons";
import { CTABanner } from "@/components/ui/CTABanner";

/**
 * Vertrauen (Business Case Kap. 9 + Kap. 2, plan.md §4).
 *
 * Sterne, Siegel und Icons ausschließlich in glacier/frost — niemals Gold
 * (tailwind.config.ts, ausdrückliche Regel).
 *
 * Zwei Elemente sind bewusst hinter Flags in content.ts geschaltet:
 *   - reviews (reviewsActive): erscheint erst mit echten Google-Zahlen.
 *     Erfundene Bewertungen wären irreführende Werbung.
 *   - pressSeal (pressSealActive): darf laut Kap. 9 erst erscheinen, wenn der
 *     Presseartikel wirklich veröffentlicht ist. Vorher ist „Bekannt aus der
 *     Presse." nach § 5 UWG angreifbar.
 * Solange beide false sind, tragen die vier belegten Badges den Abschnitt.
 */

/** Fünf Sterne in glacier — der Rating-Wert steuert Voll/Halb/Leer. */
function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-1 text-glacier" role="img" aria-label={`${rating} von 5 Sternen`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const v = rating - i;
        const variant = v >= 1 ? "full" : v >= 0.5 ? "half" : "empty";
        return <StarIcon key={i} className="h-5 w-5" variant={variant} />;
      })}
    </span>
  );
}

export function Trust() {
  return (
    <Section id="vertrauen" tone="ink">
      <SectionHead>
        <Reveal>
          <SectionLabel>{trust.eyebrow}</SectionLabel>
          <h2 className="mt-6 text-2xl md:text-3xl">{trust.h2}</h2>
        </Reveal>
      </SectionHead>

      {/* Bewertungen + Pressesiegel — nur wenn belegt/freigegeben */}
      {(trust.reviewsActive || trust.pressSealActive) && (
        <Reveal
          delay={0.05}
          className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6"
        >
          {trust.reviewsActive && (
            <a
              href={trust.reviews.href || undefined}
              target={trust.reviews.href ? "_blank" : undefined}
              rel={trust.reviews.href ? "noopener noreferrer" : undefined}
              className="flex items-center gap-4"
            >
              <StarRating rating={trust.reviews.rating} />
              <span className="font-body text-sm text-frost">
                <span className="font-mono text-snow">
                  {trust.reviews.rating.toFixed(1)}
                </span>{" "}
                aus {trust.reviews.count} {trust.reviews.label}
              </span>
            </a>
          )}
          {trust.pressSealActive && (
            <a
              href={trust.pressArticleUrl || undefined}
              target={trust.pressArticleUrl ? "_blank" : undefined}
              rel={trust.pressArticleUrl ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-3 rounded-sm border border-hairline px-5 py-3"
            >
              <span className="font-mono text-2xs uppercase tracking-eyebrow text-frost-dim">
                {trust.pressSeal}
              </span>
            </a>
          )}
        </Reveal>
      )}

      {/* Belegte Vertrauensbadges */}
      <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-sm border border-hairline bg-frost-faint sm:grid-cols-2 lg:grid-cols-4">
        {trust.badges.map((badge) => (
          <RevealItem key={badge.title} className="bg-ink p-8">
            <h3 className="font-display text-base font-semibold text-snow">
              {badge.title}
            </h3>
            <p className="mt-3 font-body text-sm text-frost-dim">{badge.body}</p>
          </RevealItem>
        ))}
      </RevealGroup>

      <div className="mt-16 md:mt-20">
        <CTABanner />
      </div>
    </Section>
  );
}
