import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSection } from "@/lib/content";

/**
 * Kontaktformular-Handler (plan.md, Ordnerstruktur).
 *
 * Versendet jede Anfrage per Resend an das Postfach der Kundin. Foto (falls
 * angehängt) geht als Attachment mit.
 *
 * WARUM RESEND STATT SMTP
 * Vorher lief der Versand über nodemailer und das IONOS-Postfach. Das
 * funktioniert, hat aber zwei Schwächen, die bei einem Notdienst-Formular
 * teuer sind:
 *   1. Zustellbarkeit — eine Mail, die ein Webserver im Namen der Domain
 *      verschickt, landet ohne sauberes SPF/DKIM schnell im Spam. Genau die
 *      Anfrage, auf die es ankommt, sieht dann niemand.
 *   2. Kein Feedback — schlägt der SMTP-Versand fehl oder bounct die Mail,
 *      erfährt es niemand. Resend protokolliert jede Zustellung im Dashboard.
 * Resend signiert per DKIM auf der eigenen Domain und macht Zustellung
 * nachvollziehbar. Das kostenlose Paket reicht: 3.000 Mails/Monat, 100/Tag —
 * ein Notdienst-Formular liegt weit darunter.
 *
 * Umgebungsvariablen (nie im Code):
 *   RESEND_API_KEY   aus dem Resend-Dashboard (API Keys → Create)
 *   CONTACT_FROM     Absender, MUSS auf der in Resend verifizierten Domain
 *                    liegen — sonst weist die API die Mail ab.
 *                    Vorgesehen: "AlpenDry Kontaktformular <formular@alpendry.de>"
 *   CONTACT_TO       Zieladresse, z. B. info@alpendry.de
 *
 * DNS: Die Domain muss in Resend verifiziert sein. Welche Einträge die Kundin
 * setzen muss und warum das IONOS-Postfach dabei NICHT kaputtgeht, steht im
 * README unter „E-Mail-Versand (Resend)".
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

  /**
   * Optionales Foto als Anhang.
   *
   * Resend erwartet den Inhalt als Base64-String oder Buffer. Base64 bläht die
   * Nutzlast um rund ein Drittel auf — bei den erlaubten 10 MB sind das ~13 MB,
   * weit unter Resends 40-MB-Grenze.
   */
  const attachments: { filename: string; content: Buffer }[] = [];
  const photo = form.get("photo");
  if (photo instanceof File && photo.size > 0) {
    if (photo.size > MAX_PHOTO_BYTES) {
      return NextResponse.json({ ok: false, error: "photo_too_large" }, { status: 413 });
    }
    const buf = Buffer.from(await photo.arrayBuffer());
    attachments.push({ filename: photo.name || "schaden.jpg", content: buf });
  }

  const { RESEND_API_KEY, CONTACT_FROM, CONTACT_TO } = process.env;

  /**
   * Kein Default für Absender und Ziel — bewusst.
   *
   * Vorher stand hier `CONTACT_TO || "glowreel.enrico@gmail.com"`. Ein solcher
   * Fallback ist gefährlich: Fehlt die Variable auf dem Server, läuft alles
   * scheinbar normal weiter, und die Anfragen gehen still an die falsche
   * Adresse — bei einem Notdienst-Formular sind das verlorene Aufträge, die
   * niemandem auffallen. Ohne Konfiguration soll es hörbar krachen (Log +
   * Fehler), statt leise das Falsche zu tun.
   */
  if (!RESEND_API_KEY || !CONTACT_FROM || !CONTACT_TO) {
    console.error(
      "[kontakt] Nicht konfiguriert — es fehlt:",
      [
        !RESEND_API_KEY && "RESEND_API_KEY",
        !CONTACT_FROM && "CONTACT_FROM",
        !CONTACT_TO && "CONTACT_TO",
      ]
        .filter(Boolean)
        .join(", "),
    );
    return NextResponse.json({ ok: false, error: "mail_unconfigured" }, { status: 500 });
  }

  const lines = [
    "Neue Anfrage über das Kontaktformular alpendry.de",
    "",
    `Name:             ${name}`,
    `Telefon:          ${phone}`,
    `Ort / PLZ:        ${place}`,
    `Art des Schadens: ${damage}`,
    "",
    "Kurzbeschreibung:",
    description || "—",
    "",
    attachments.length ? "Ein Foto ist angehängt." : "Kein Foto angehängt.",
  ];

  try {
    const { data, error } = await new Resend(RESEND_API_KEY).emails.send({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      subject: `Wasserschaden-Anfrage: ${damage} — ${place}`,
      text: lines.join("\n"),
      // Rückruf direkt aus der Mail heraus: Antwort geht nicht an den Kunden
      // (E-Mail wird nicht erfasst), daher kein Reply-To. Die Telefonnummer
      // steht prominent im Text.
      attachments,
    });

    /**
     * Resend wirft NICHT bei einem API-Fehler, sondern liefert `{ error }`.
     * Ohne diese Prüfung liefe der Handler in `ok: true` — der Kunde sähe
     * „Danke", und die Anfrage wäre weg. Genau der Fehler, den ein
     * Notdienst-Formular nicht machen darf.
     */
    if (error) {
      console.error("[kontakt] Resend hat abgelehnt:", error);
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }
    console.info("[kontakt] Gesendet, Resend-ID:", data?.id);
  } catch (err) {
    console.error("[kontakt] Versand fehlgeschlagen:", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
