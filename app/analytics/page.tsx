import type { Metadata } from "next";
import { cookies } from "next/headers";

import { buildMetadata } from "@/lib/seo";
import {
  AUTH_COOKIE,
  cookieIsValid,
  isAuthConfigured,
} from "@/lib/analytics-auth";
import { isStoreConfigured, readStats } from "@/lib/analytics-store";
import {
  MANAGED_IMAGES,
  getImageOverrides,
  resolveImage,
  isBlobConfigured,
} from "@/lib/managed-images";

/**
 * /analytics — interne Auswertung, passwortgeschützt.
 *
 * Server-Komponente: Das Passwort und die Zahlen bleiben auf dem Server, der
 * Browser bekommt nur das fertige HTML. `force-dynamic` + noindex, weil die
 * Seite nie zwischengespeichert oder indexiert werden darf.
 *
 * Drei Zustände:
 *   1. Passwort nicht gesetzt  → Einrichtungshinweis (ANALYTICS_PASSWORD).
 *   2. Nicht angemeldet        → Passwortabfrage.
 *   3. Angemeldet              → Dashboard (oder Speicher-Einrichtung, wenn KV fehlt).
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Auswertung — AlpenDry",
    description: "Interne Nutzungsauswertung.",
    path: "/analytics",
    noIndex: true,
  }),
};

// ── Bausteine ─────────────────────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-svh bg-ink px-6 pb-24 pt-16 md:pt-20">
      <div className="mx-auto w-full max-w-shell">{children}</div>
    </main>
  );
}

/** Neutrale Zwischenmeldung (nicht verfügbar / wird vorbereitet). Bewusst ohne
 *  technische Details — was einzurichten ist, steht im README, nicht auf der
 *  Seite, die die Kundin sieht. */
function Setup({ title, steps }: { title: string; steps: string[] }) {
  return (
    <Shell>
      <h1 className="text-2xl md:text-3xl">{title}</h1>
      <div className="mt-6 max-w-prose space-y-3">
        {steps.map((s, i) => (
          <p key={i} className="font-body text-sm text-frost-dim">
            {s}
          </p>
        ))}
      </div>
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-sm border border-hairline bg-abyss px-6 py-7">
      <div className="font-display text-3xl font-semibold text-snow md:text-4xl">
        {value.toLocaleString("de-DE")}
      </div>
      <div className="mt-2 font-mono text-2xs uppercase tracking-eyebrow text-frost-dim">
        {label}
      </div>
    </div>
  );
}

function BarRow({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-4">
      <div className="w-40 shrink-0 truncate font-mono text-2xs text-frost" title={label}>
        {label}
      </div>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-frost-faint">
        <div className="h-full rounded-full bg-glacier" style={{ width: `${pct}%` }} />
      </div>
      <div className="w-12 shrink-0 text-right font-mono text-2xs text-frost-dim">
        {count.toLocaleString("de-DE")}
      </div>
    </div>
  );
}

// ── Seite ─────────────────────────────────────────────────────────────

// ── Bildverwaltung ────────────────────────────────────────────────────

/** Kurze Rückmeldung nach Upload/Zurücksetzen (aus ?bild=…). Neutral gehalten. */
const BILD_HINWEIS: Record<string, string> = {
  ok: "Bild gespeichert. Es erscheint in Kürze auf der Website.",
  zurueckgesetzt: "Auf das ursprüngliche Bild zurückgesetzt.",
  fehler: "Das hat nicht geklappt. Bitte erneut versuchen.",
  zugross: "Die Datei ist zu groß (max. 4 MB).",
  falschertyp: "Nur Bilddateien (JPG, PNG, WebP).",
  nichtaktiv: "Die Bildverwaltung ist derzeit nicht verfügbar.",
};

async function ImageManager({ hinweis }: { hinweis?: string }) {
  const blobReady = isBlobConfigured();
  const overrides = await getImageOverrides();

  // Nach Gruppen bündeln, damit die 10 Bilder geordnet erscheinen.
  const groups = MANAGED_IMAGES.reduce<Record<string, typeof MANAGED_IMAGES[number][]>>(
    (acc, img) => ((acc[img.group] ??= []).push(img), acc),
    {},
  );

  return (
    <section id="bilder" className="mt-16 border-t border-hairline pt-14 scroll-mt-8">
      <h2 className="text-2xl md:text-3xl">Bilder ändern</h2>
      <p className="mt-3 max-w-prose font-body text-sm text-frost-dim">
        Bitte Dateien bis 4 MB (JPG, PNG oder WebP) — größere Fotos vorher am
        Handy oder Rechner verkleinern.
      </p>

      {hinweis && (
        <p className="mt-4 rounded-sm border border-hairline bg-abyss px-4 py-3 font-body text-sm text-frost">
          {hinweis}
        </p>
      )}

      {!blobReady && (
        <p className="mt-4 rounded-sm border border-hairline bg-abyss px-4 py-3 font-body text-sm text-frost-dim">
          Die Bildverwaltung ist derzeit nicht verfügbar. Bitte wenden Sie sich
          an Ihren Administrator.
        </p>
      )}

      {Object.entries(groups).map(([group, imgs]) => (
        <div key={group} className="mt-10">
          <h3 className="font-mono text-2xs uppercase tracking-eyebrow text-frost">
            {group}
          </h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {imgs.map((img) => {
              const current = resolveImage(img, overrides);
              const isCustom = Boolean(overrides[img.id]);
              return (
                <div
                  key={img.id}
                  className="flex gap-4 rounded-sm border border-hairline bg-abyss p-4"
                >
                  {/* Aktuelles Bild als Vorschau */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={current.src}
                    alt=""
                    className="h-20 w-28 shrink-0 rounded-sm border border-hairline bg-ink object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 font-display text-sm font-semibold text-snow">
                      <span className="truncate">{img.label}</span>
                      {isCustom && (
                        <span className="shrink-0 font-mono text-[0.5rem] uppercase tracking-eyebrow text-glacier">
                          geändert
                        </span>
                      )}
                    </div>

                    {blobReady && (
                      <form
                        action="/api/analytics/images"
                        method="POST"
                        encType="multipart/form-data"
                        className="mt-3 flex flex-wrap items-center gap-2"
                      >
                        <input type="hidden" name="slotId" value={img.id} />
                        <input
                          type="file"
                          name="file"
                          accept="image/png,image/jpeg,image/webp"
                          required
                          className="max-w-[9rem] shrink font-body text-2xs text-frost-dim file:mr-2 file:rounded-sm file:border-0 file:bg-deep file:px-2 file:py-1 file:font-mono file:text-2xs file:uppercase file:tracking-eyebrow file:text-frost"
                        />
                        <button
                          type="submit"
                          className="rounded-sm bg-signal px-3 py-1.5 font-display text-2xs font-semibold uppercase tracking-eyebrow text-ink transition-colors hover:bg-glacier"
                        >
                          Speichern
                        </button>
                      </form>
                    )}

                    {isCustom && (
                      <form action="/api/analytics/images" method="POST" className="mt-2">
                        <input type="hidden" name="slotId" value={img.id} />
                        <input type="hidden" name="action" value="reset" />
                        <button
                          type="submit"
                          className="font-mono text-2xs uppercase tracking-eyebrow text-frost-dim transition-colors hover:text-snow"
                        >
                          Zurücksetzen
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}

// ── Seite ─────────────────────────────────────────────────────────────

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ bild?: string }>;
}) {
  if (!isAuthConfigured()) {
    // Neutral gehalten: Die Kundin soll hier nicht lesen, WIE und WO die Seite
    // betrieben wird. Die technischen Einrichtungsschritte stehen im README.
    return (
      <Setup
        title="Auswertung noch nicht verfügbar"
        steps={["Dieser Bereich ist noch nicht freigeschaltet. Bitte wenden Sie sich an Ihren Administrator."]}
      />
    );
  }

  const cookieStore = await cookies();
  const authed = cookieIsValid(cookieStore.get(AUTH_COOKIE)?.value);

  if (!authed) {
    return (
      <Shell>
        <h1 className="text-2xl md:text-3xl">Auswertung</h1>
        <p className="mt-4 font-body text-sm text-frost-dim">
          Dieser Bereich ist geschützt.
        </p>
        <form
          action="/api/analytics/login"
          method="POST"
          className="mt-8 flex max-w-sm flex-col gap-3"
        >
          <label htmlFor="pw" className="font-mono text-2xs uppercase tracking-eyebrow text-frost">
            Passwort
          </label>
          <input
            id="pw"
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            className="rounded-sm border border-hairline bg-abyss px-4 py-3 font-body text-sm text-snow outline-none focus:border-glacier"
          />
          <button
            type="submit"
            className="mt-2 inline-flex w-fit items-center rounded-sm bg-signal px-6 py-3 font-display text-sm font-semibold text-ink transition-colors duration-300 ease-glide hover:bg-glacier"
          >
            Anmelden
          </button>
        </form>
      </Shell>
    );
  }

  if (!isStoreConfigured()) {
    // Ebenfalls neutral — kein Hinweis auf Speicher-Anbieter o. Ä. Anleitung im README.
    return (
      <Setup
        title="Auswertung wird vorbereitet"
        steps={["Die Auswertung ist noch nicht aktiv. Sobald sie bereitsteht, erscheinen hier die Zahlen."]}
      />
    );
  }

  const stats = await readStats(14);
  const maxPath = Math.max(1, ...stats.topPaths.map((p) => p.count));
  const maxDay = Math.max(1, ...stats.daily.map((d) => d.count));
  const eventLabels: Record<string, string> = {
    call: "Anruf",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    form_submit: "Formular",
  };

  const bildHinweis = BILD_HINWEIS[(await searchParams).bild ?? ""];

  return (
    <Shell>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl">Auswertung</h1>
        <form action="/api/analytics/logout" method="POST">
          <button
            type="submit"
            className="font-mono text-2xs uppercase tracking-eyebrow text-frost-dim transition-colors hover:text-snow"
          >
            Abmelden
          </button>
        </form>
      </div>

      {/* Kennzahlen */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Seitenaufrufe gesamt" value={stats.totalPageviews} />
        <Stat label="Anruf-Klicks" value={stats.events.call} />
        <Stat label="WhatsApp-Klicks" value={stats.events.whatsapp} />
        <Stat label="E-Mail-Klicks" value={stats.events.email} />
        <Stat label="Formular abgeschickt" value={stats.events.form_submit} />
      </div>

      {/* Verlauf 14 Tage */}
      <section className="mt-14">
        <h2 className="font-mono text-2xs uppercase tracking-eyebrow text-frost">
          Seitenaufrufe · letzte 14 Tage
        </h2>
        <div className="mt-6 flex items-end gap-1.5" style={{ height: 120 }}>
          {stats.daily.map((d) => (
            <div key={d.date} className="group flex flex-1 flex-col items-center justify-end gap-2">
              <div
                className="w-full rounded-sm bg-glacier/70 transition-colors group-hover:bg-glacier"
                style={{ height: `${Math.round((d.count / maxDay) * 100)}%`, minHeight: d.count > 0 ? 2 : 0 }}
                title={`${d.date}: ${d.count}`}
              />
              <span className="font-mono text-[0.5rem] text-frost-dim">{d.date.slice(8)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Meistbesuchte Seiten */}
      <section className="mt-14">
        <h2 className="font-mono text-2xs uppercase tracking-eyebrow text-frost">
          Meistbesuchte Seiten
        </h2>
        <div className="mt-6 space-y-3">
          {stats.topPaths.length === 0 ? (
            <p className="font-body text-sm text-frost-dim">Noch keine Daten.</p>
          ) : (
            stats.topPaths.map((p) => (
              <BarRow key={p.path} label={p.path} count={p.count} max={maxPath} />
            ))
          )}
        </div>
      </section>

      {/* CTA-Klicks je Aktion, kompakt */}
      <section className="mt-14">
        <h2 className="font-mono text-2xs uppercase tracking-eyebrow text-frost">
          Klickverhalten
        </h2>
        <div className="mt-6 space-y-3">
          {(["call", "whatsapp", "email", "form_submit"] as const).map((a) => (
            <BarRow
              key={a}
              label={eventLabels[a]}
              count={stats.events[a]}
              max={Math.max(1, stats.events.call, stats.events.whatsapp, stats.events.email, stats.events.form_submit)}
            />
          ))}
        </div>
      </section>

      <ImageManager hinweis={bildHinweis} />
    </Shell>
  );
}
