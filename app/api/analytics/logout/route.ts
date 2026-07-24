import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/analytics-auth";

/** Abmelden von /analytics — Cookie löschen, zurück zur Passwortabfrage. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const origin = host ? `${proto}://${host}` : new URL(req.url).origin;
  const res = NextResponse.redirect(`${origin}/analytics`, { status: 303 });
  res.cookies.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
