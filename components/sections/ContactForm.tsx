"use client";

import { useRef, useState } from "react";
import { contactSection } from "@/lib/content";
import { ArrowRightIcon } from "@/components/ui/Icons";

/**
 * Kontaktformular — exakt nach Spec (Business Case Kap. 7, plan.md §4):
 *   Name & Tel · Ort/PLZ · Art des Schadens · Kurzbeschreibung & Foto · DSGVO.
 * Keine weiteren Felder — „in unter einer Minute ausfüllbar".
 *
 * Versand serverseitig an /api/kontakt (E-Mail ins Postfach info@alpendry.de).
 * Multipart, weil ein Foto mitgeht. Pflichtfelder werden nativ (required) und
 * zusätzlich vor dem Senden geprüft; Fehlerfälle verweisen aufs Telefon.
 */

const F = contactSection.fields;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024; // 10 MB, siehe Foto-Hilfetext

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({ headingAs: H = "h3" }: { headingAs?: "h2" | "h3" }) {
  const [status, setStatus] = useState<Status>("idle");
  const [photoError, setPhotoError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    const data = new FormData(form);

    // Foto-Größe clientseitig prüfen, bevor wir hochladen.
    const photo = data.get("photo");
    if (photo instanceof File && photo.size > 0) {
      if (photo.size > MAX_PHOTO_BYTES) {
        setPhotoError("Das Foto ist größer als 10 MB. Bitte ein kleineres wählen.");
        return;
      }
    }
    setPhotoError(null);
    setStatus("submitting");

    try {
      const res = await fetch("/api/kontakt", { method: "POST", body: data });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex h-full min-h-[24rem] flex-col items-start justify-center rounded-sm border border-hairline bg-abyss p-8"
      >
        <span className="font-mono text-2xs uppercase tracking-eyebrow text-glacier">
          Gesendet
        </span>
        <p className="mt-5 max-w-prose font-display text-xl text-snow">
          {contactSection.success}
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      // BEWUSST OHNE noValidate: die native Constraint-Validierung blockiert
      // das Absenden leerer Pflichtfelder und meldet sie direkt am Feld —
      // lokalisiert und barrierefrei. Mit noValidate ging das leere Formular
      // an den Server und der Nutzer bekam nur die generische Fehlermeldung.
      className="h-full rounded-sm border border-hairline bg-abyss p-7 md:p-8"
    >
      <H className="font-display text-xl font-semibold text-snow">
        {contactSection.formTitle}
      </H>
      <p className="mt-3 font-body text-sm text-frost-dim">{contactSection.formLead}</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field id="name" label={F.name.label} required>
          <input {...inputProps} id="name" name="name" type="text" autoComplete="name" required />
        </Field>

        <Field id="phone" label={F.phone.label} help={F.phone.help} required>
          <input
            {...inputProps}
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
          />
        </Field>

        <Field id="place" label={F.place.label} help={F.place.help} required className="sm:col-span-2">
          <input
            {...inputProps}
            id="place"
            name="place"
            type="text"
            autoComplete="postal-code"
            required
          />
        </Field>

        <Field id="damage" label={F.damage.label} required className="sm:col-span-2">
          <select {...inputProps} id="damage" name="damage" required defaultValue="">
            <option value="" disabled>
              Bitte wählen …
            </option>
            {F.damage.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id="description"
          label={F.description.label}
          help={F.description.help}
          className="sm:col-span-2"
        >
          <textarea {...inputProps} id="description" name="description" rows={4} />
        </Field>

        {/* Foto-Upload */}
        <div className="sm:col-span-2">
          <label
            htmlFor="photo"
            className="mb-2 block font-display text-sm font-medium text-frost"
          >
            {F.photo.label}
          </label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/png,image/jpeg,image/heic,image/heif"
            className="block w-full font-body text-sm text-frost-dim file:mr-4 file:cursor-pointer file:rounded-sm file:border file:border-hairline file:bg-ink file:px-4 file:py-2.5 file:font-display file:text-sm file:font-semibold file:text-snow hover:file:border-glacier"
          />
          <p className="mt-2 font-body text-xs text-frost-dim">{F.photo.help}</p>
          {photoError && (
            <p role="alert" className="mt-2 font-body text-xs text-signal">
              {photoError}
            </p>
          )}
        </div>

        {/* DSGVO */}
        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="consent"
              required
              className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-signal"
            />
            <span className="font-body text-sm text-frost-dim">{F.consent.label}</span>
          </label>
        </div>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-6 font-body text-sm text-signal">
          {contactSection.error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-8 inline-flex items-center gap-2.5 rounded-sm bg-signal px-6 py-4 font-display text-sm font-semibold text-ink transition-colors duration-300 ease-glide hover:bg-glacier disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? contactSection.submitting : contactSection.submit}
        {status !== "submitting" && <ArrowRightIcon className="h-4 w-4" />}
      </button>
    </form>
  );
}

/** Gemeinsame Feld-Optik. */
const inputProps = {
  className:
    "w-full rounded-sm border border-hairline bg-ink px-4 py-3 font-body text-base text-snow placeholder:text-steel transition-colors duration-200 focus:border-glacier focus:outline-none",
} as const;

function Field({
  id,
  label,
  help,
  required = false,
  className = "",
  children,
}: {
  id: string;
  label: string;
  help?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block font-display text-sm font-medium text-frost">
        {label}
        {required && <span className="ml-1 text-glacier" aria-hidden="true">*</span>}
      </label>
      {children}
      {help && <p className="mt-2 font-body text-xs text-frost-dim">{help}</p>}
    </div>
  );
}
