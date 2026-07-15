"use client";

import { clearConsent, useConsent, writeConsent } from "@/lib/consent";

/**
 * Widerruf und Änderung der Cookie-Entscheidung (Cookie-Seite).
 *
 * Art. 7 Abs. 3 DSGVO: Der Widerruf muss so einfach sein wie die Erteilung.
 * Deshalb hier beide Richtungen direkt schaltbar — nicht nur „Banner erneut
 * zeigen".
 */
export function ConsentControls() {
  const value = useConsent();

  const label =
    value === "granted"
      ? "Sie haben Analyse-Cookies zugestimmt."
      : value === "denied"
        ? "Sie haben Analyse-Cookies abgelehnt. Es werden nur technisch notwendige Cookies gesetzt."
        : "Sie haben noch keine Entscheidung getroffen.";

  return (
    <section className="mt-12 rounded-sm border border-hairline bg-abyss p-7">
      <h2 className="font-display text-lg font-semibold text-snow">
        Ihre aktuelle Entscheidung
      </h2>
      <p className="mt-3 font-body text-sm text-frost-dim" aria-live="polite">
        {label}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => writeConsent("denied")}
          disabled={value === "denied"}
          className="rounded-sm border border-hairline px-5 py-3 font-display text-sm font-semibold text-snow transition-colors duration-300 ease-glide hover:border-glacier disabled:cursor-not-allowed disabled:opacity-40"
        >
          Analyse-Cookies ablehnen
        </button>
        <button
          type="button"
          onClick={() => writeConsent("granted")}
          disabled={value === "granted"}
          className="rounded-sm border border-hairline px-5 py-3 font-display text-sm font-semibold text-snow transition-colors duration-300 ease-glide hover:border-glacier disabled:cursor-not-allowed disabled:opacity-40"
        >
          Analyse-Cookies zulassen
        </button>
        <button
          type="button"
          onClick={() => clearConsent()}
          disabled={value === null}
          className="rounded-sm px-5 py-3 font-display text-sm font-semibold text-frost transition-colors duration-300 ease-glide hover:text-snow disabled:cursor-not-allowed disabled:opacity-40"
        >
          Entscheidung zurücksetzen
        </button>
      </div>
    </section>
  );
}
