import type { Metadata } from "next";
import { cookies } from "next/headers";

import { buildMetadata } from "@/lib/seo";
import {
  AUTH_COOKIE,
  cookieIsValid,
  isAuthConfigured,
} from "@/lib/analytics-auth";
import { isStoreConfigured, readStats } from "@/lib/analytics-store";

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
    <main className="min-h-svh bg-ink px-6 pb-24 pt-32 md:pt-40">
      <div className="mx-auto w-full max-w-shell">{children}</div>
    </main>
  );
}

function Setup({ title, steps }: { title: string; steps: string[] }) {
  return (
    <Shell>
      <h1 className="text-2xl md:text-3xl">{title}</h1>
      <ol className="mt-8 max-w-prose space-y-4">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-4 font-body text-sm text-frost-dim">
            <span className="font-mono text-2xs text-glacier">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
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

export default async function AnalyticsPage() {
  if (!isAuthConfigured()) {
    return (
      <Setup
        title="Auswertung noch nicht eingerichtet"
        steps={[
          "Im Vercel-Projekt unter Settings → Environment Variables die Variable ANALYTICS_PASSWORD setzen (das gewünschte Passwort).",
          "Einmal neu deployen — Vercel liest Umgebungsvariablen beim Build.",
          "Danach fragt diese Seite das Passwort ab.",
        ]}
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
    return (
      <Setup
        title="Speicher noch nicht verbunden"
        steps={[
          "Im Vercel-Projekt unter Storage einen Redis-/KV-Speicher hinzufügen (Upstash, kostenloses Kontingent).",
          "Die Integration setzt KV_REST_API_URL und KV_REST_API_TOKEN automatisch — nichts von Hand kopieren.",
          "Einmal neu deployen. Ab dann zählt die Seite jeden Aufruf und jeden Klick auf Anrufen, WhatsApp, E-Mail und das Formular.",
          "Die Zahlen wachsen erst ab dem Zeitpunkt der Verbindung — Vergangenes wurde nicht gespeichert.",
        ]}
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
      <p className="mt-3 font-body text-sm text-frost-dim">
        Eigene Zählung, aggregiert und ohne personenbezogene Daten. Ergänzt das
        Vercel-Dashboard, ersetzt es nicht.
      </p>

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
    </Shell>
  );
}
