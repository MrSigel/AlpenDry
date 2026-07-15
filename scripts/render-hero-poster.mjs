/**
 * Rendert die beiden Hero-Standbilder aus der echten 3D-Szene.
 *
 *   node scripts/render-hero-poster.mjs        (Server muss laufen)
 *   node scripts/render-hero-poster.mjs 4400   (anderer Port)
 *
 * WARUM ES DIESES SKRIPT GIBT
 * Die Poster sind KEINE Handarbeit, sondern ein abgeleitetes Artefakt: Sie
 * zeigen exakt den ersten Frame des Canvas. Ändert sich die Palette, die
 * Geometrie oder die Kamera, sind sie sofort falsch — und mobil sind sie das
 * Einzige, was der Nutzer überhaupt zu sehen bekommt.
 *
 * Beim ersten Mal war das ein Wegwerf-Skript. Der Preis dafür stand danach im
 * Repo: Das Mobil-Poster hatte die „Anrufen/WhatsApp"-Leiste eingebrannt. Sie
 * fiel nicht auf, weil sie genau unter der echten Leiste lag — bis `object-cover`
 * das Bild beschnitt und sie gegen das Original verrutschte.
 *
 * WIE DER ALTE FEHLER VERMIEDEN WIRD
 * Playwrights `element.screenshot()` fotografiert den VIEWPORT und schneidet
 * anschließend auf die Element-Grenzen zu. Alles, was über dem Canvas liegt, ist
 * also mit drin — der Canvas allein zu adressieren genügt NICHT.
 *
 * Deshalb wird vorher aufgeräumt, aber per Whitelist statt per Blacklist: Es
 * bleibt ausschließlich stehen, was der Canvas selbst oder einer seiner
 * Vorfahren ist; alles andere fliegt raus. Eine Aufzählung der Störer (Header,
 * Scrim, Banner, …) ist genau der Ansatz, der die CTA-Leiste übersehen hat —
 * eine Liste, die man pflegen muss, veraltet beim nächsten neuen Element.
 *
 * DER matchMedia-EINGRIFF
 * Der Canvas läuft laut HERO_3D_QUERY nur ab 1024px mit Maus. Für das
 * Mobil-Poster brauchen wir seinen Inhalt aber bei 390px. Deshalb wird die eine
 * Query hier überschrieben. Das ist ein Eingriff im Testtreiber, nicht in der
 * Anwendung: Die Seite selbst kennt keinen Schalter, der das erlauben würde.
 */
import { chromium } from "playwright";
import sharp from "sharp";
import { readFileSync } from "node:fs";

const PORT = process.argv[2] ?? "4400";
const BASE = `http://localhost:${PORT}/`;

// Query aus der Quelle lesen statt sie hier zu wiederholen — sonst wäre dies
// die vierte Stelle, an der sie steht, und die erste, die veraltet.
const HERO_3D_QUERY = readFileSync("lib/breakpoints.ts", "utf8").match(
  /"(\(min-width[^"]+)"/,
)?.[1];
if (!HERO_3D_QUERY) throw new Error("HERO_3D_QUERY nicht aus lib/breakpoints.ts lesbar");

/*
 * Die unterschiedliche Auflösung ist kein Versehen, sondern folgt der Lebensdauer
 * des Bildes:
 *   Desktop — der Canvas blendet nach ~1 s darüber, das Poster überbrückt nur.
 *             1× genügt; 2× kostete gemessen 122 KB statt 13 KB, und das am LCP.
 *   Mobil   — hier gibt es keinen Canvas, das Poster IST der Hero und steht
 *             dauerhaft. 2× (32 KB) ist die Schärfe auf Retina wert.
 */
const TARGETS = [
  { name: "hero-desktop", width: 1440, height: 900, scale: 1, quality: 82 },
  { name: "hero-mobile", width: 390, height: 844, scale: 2, quality: 80 },
];

const browser = await chromium.launch({
  channel: "chromium",
  args: ["--ignore-gpu-blocklist", "--use-angle=default"],
});

for (const t of TARGETS) {
  // hasTouch bleibt false — sonst greift die Query nicht (pointer: fine).
  const ctx = await browser.newContext({
    viewport: { width: t.width, height: t.height },
    deviceScaleFactor: t.scale,
  });

  await ctx.addInitScript((query) => {
    const orig = window.matchMedia.bind(window);
    window.matchMedia = (q) =>
      q === query
        ? { matches: true, media: q, addEventListener() {}, removeEventListener() {} }
        : orig(q);
  }, HERO_3D_QUERY);

  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });

  // Der WebGL-Stack lädt bewusst erst bei echter Interaktion (HeroScene).
  await page.mouse.wheel(0, 1);
  await page.waitForSelector("canvas", { timeout: 30_000 });

  // Auf den ersten echten Frame warten: Ein Canvas im DOM heißt noch nicht,
  // dass Geometrie und Environment fertig sind — sonst wird ein leeres Bild
  // fotografiert.
  await page.waitForFunction(
    () => {
      const c = document.querySelector("canvas");
      return c && c.parentElement && +getComputedStyle(c.parentElement).opacity === 1;
    },
    { timeout: 30_000 },
  );
  await page.waitForTimeout(1200); // Dämpfung ausschwingen lassen

  // Ganz nach oben: Das Poster zeigt die Startposition (progress = 0).
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);

  // Whitelist-Aufräumen (Begründung im Kopf der Datei): Nur der Canvas und seine
  // Vorfahren überleben. Was hier nicht steht, kann nicht ins Poster geraten.
  const removed = await page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    const keep = new Set();
    for (let el = canvas; el; el = el.parentElement) keep.add(el);
    let n = 0;
    for (const el of document.querySelectorAll("body *")) {
      if (!keep.has(el) && !el.contains(canvas)) {
        el.style.setProperty("display", "none", "important");
        n++;
      }
    }
    return n;
  });
  await page.waitForTimeout(300);

  const png = await page.locator("canvas").screenshot();
  const out = `public/brand/${t.name}.webp`;
  await sharp(png).webp({ quality: t.quality, effort: 6 }).toFile(out);

  const kb = readFileSync(out).length / 1024;
  console.log(
    `${out.padEnd(30)} ${t.width}×${t.height} @${t.scale}×  ${kb.toFixed(1)} KB  (${removed} Elemente ausgeblendet)`,
  );
  await ctx.close();
}

await browser.close();
