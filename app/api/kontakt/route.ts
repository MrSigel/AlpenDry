import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { contactSection } from "@/lib/content";

/**
 * Kontaktformular-Handler (plan.md, Ordnerstruktur).
 *
 * Versendet die Anfrage per SMTP an das Postfach info@alpendry.de — die Kundin
 * erhält jede Anfrage direkt als E-Mail, ohne Website-Backend zu pflegen.
 * Foto (falls angehängt) geht als Attachment mit.
 *
 * Zugangsdaten kommen ausschließlich aus Umgebungsvariablen (.env, nie im Code):
 *   SMTP_HOST      z. B. smtp.ionos.de
 *   SMTP_PORT      587 (STARTTLS) oder 465 (SSL)
 *   SMTP_USER      das IONOS-Postfach (Login)
 *   SMTP_PASSWORD  das Postfach-Passwort
 *   SMTP_FROM      Absenderadresse (i. d. R. = SMTP_USER)
 *   CONTACT_TO     Zieladresse (Default: info@alpendry.de)
 *
 * nodemailer braucht die Node-Runtime — kein Edge, kein statischer Export.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

/**
 * Erlaubte Werte für „Art des Schadens" — direkt aus content.ts, NICHT als
 * eigene Liste. Vorher stand sie hier dupliziert: Wer das Dropdown umbenennt,
 * hätte die Server-Whitelist übersehen und jede Anfrage dieser Kategorie wäre
 * kommentarlos als ungültig abgelehnt worden.
 */
const DAMAGE_OPTIONS: readonly string[] = contactSection.fields.damage.options;

/** Zeilenumbrüche/Steuerzeichen aus Kopfzeilen-Feldern entfernen (Header-Injection). */
function clean(v: FormDataEntryValue | null, maxLen = 500): string {
  if (typeof v !== "string") return "";
  return v.replace(/[\r\n\t]+/g, " ").trim().slice(0, maxLen);
}

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_form" }, { status: 400 });
  }

  const name = clean(form.get("name"), 120);
  const phone = clean(form.get("phone"), 60);
  const place = clean(form.get("place"), 120);
  const damage = clean(form.get("damage"), 60);
  const description = clean(form.get("description"), 4000);
  const consent = form.get("consent");

  // Serverseitige Pflichtfeldprüfung — dem Client nicht vertrauen.
  if (!name || !phone || !place || !damage) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  if (!DAMAGE_OPTIONS.includes(damage)) {
    return NextResponse.json({ ok: false, error: "invalid_damage" }, { status: 400 });
  }
  if (consent !== "on" && consent !== "true") {
    return NextResponse.json({ ok: false, error: "consent_required" }, { status: 400 });
  }

  // Optionales Foto als Anhang.
  const attachments: { filename: string; content: Buffer }[] = [];
  const photo = form.get("photo");
  if (photo instanceof File && photo.size > 0) {
    if (photo.size > MAX_PHOTO_BYTES) {
      return NextResponse.json({ ok: false, error: "photo_too_large" }, { status: 413 });
    }
    const buf = Buffer.from(await photo.arrayBuffer());
    attachments.push({ filename: photo.name || "schaden.jpg", content: buf });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;
  /**
   * Zieladresse. Aktuell auf Wunsch glowreel.enrico@gmail.com (zum Testen);
   * über CONTACT_TO in der .env ohne Code-Änderung umstellbar — vor Livegang
   * auf info@alpendry.de setzen.
   *
   * Hinweis: Solange die Anfragen an ein Gmail-Postfach gehen, verarbeitet
   * Google die Kundendaten inklusive Schadenfotos. Die Datenschutzerklärung
   * nennt derzeit nur IONOS als E-Mail-Dienstleister.
   */
  const to = process.env.CONTACT_TO || "glowreel.enrico@gmail.com";

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    // Fehlkonfiguration soll im Log auffallen, dem Nutzer aber nichts verraten.
    console.error("[kontakt] SMTP-Umgebungsvariablen fehlen — E-Mail nicht gesendet.");
    return NextResponse.json({ ok: false, error: "mail_unconfigured" }, { status: 500 });
  }

  const port = Number(SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  const lines = [
    "Neue Anfrage über das Kontaktformular alpendry.de",
    "",
    `Name:            ${name}`,
    `Telefon:         ${phone}`,
    `Ort / PLZ:       ${place}`,
    `Art des Schadens: ${damage}`,
    "",
    "Kurzbeschreibung:",
    description || "—",
    "",
    attachments.length ? "Ein Foto ist angehängt." : "Kein Foto angehängt.",
  ];

  try {
    await transporter.sendMail({
      from: SMTP_FROM || SMTP_USER,
      to,
      subject: `Wasserschaden-Anfrage: ${damage} — ${place}`,
      text: lines.join("\n"),
      // Rückruf direkt aus der Mail heraus: Antwort geht nicht an den Kunden
      // (E-Mail wird nicht erfasst), daher kein Reply-To. Die Telefonnummer
      // steht prominent im Text.
      attachments,
    });
  } catch (err) {
    console.error("[kontakt] Versand fehlgeschlagen:", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
