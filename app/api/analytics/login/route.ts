import { NextResponse } from "next/server";
import { AUTH_COOKIE, passwordMatches, tokenForCurrentPassword } from "@/lib/analytics-auth";

/**
 * Login für /analytics. Nimmt das Passwort aus dem Formular (funktioniert ohne
 * JavaScript), setzt bei Erfolg den Auth-Cookie und leitet zurück.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const password = form?.get("password");

  // Hinter Vercels Proxy kann req.url die interne Adresse tragen; der echte
  // Host steht in den Forwarded-Headern. Sonst landet der Redirect ins Leere.
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const origin = host ? `${proto}://${host}` : new URL(req.url).origin;

  if (typeof password !== "string" || !passwordMatches(password)) {
    // Kein Hinweis, WAS falsch war. Kurze Verzögerung gegen Durchprobieren.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.redirect(`${origin}/analytics?fehler=1`, { status: 303 });
  }

  const res = NextResponse.redirect(`${origin}/analytics`, { status: 303 });
  res.cookies.set(AUTH_COOKIE, tokenForCurrentPassword()!, {
    httpOnly: true, // für Client-JS unlesbar
    secure: process.env.NODE_ENV === "production", // lokal über http sonst nicht setzbar
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 Tage
  });
  return res;
}
