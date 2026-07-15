import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/content";
import { palette } from "@/lib/palette";

/**
 * Open-Graph-Bild (Vorschau in WhatsApp, LinkedIn, Slack …).
 *
 * Generiert statt als Bilddatei gepflegt: So bleibt es automatisch an
 * Wortmarke und Farbtokens gekoppelt — eine statische PNG würde beim ersten
 * Markenwechsel unbemerkt veralten.
 *
 * Bewusst ohne Fremdschrift: `next/og` müsste die Schriftdatei sonst bei jedem
 * Rendern einlesen. Die Systemschrift genügt für eine Vorschaukachel.
 */
export const alt = `${site.legalName} — ${site.subtitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  /**
   * Dieselbe Bergkette wie im Header (aus dem echten Logo freigestellt).
   * Als data-URI eingebettet, weil next/og keine relativen Pfade auflöst —
   * und weil eine zweite Quelle für die Marke sofort auseinanderliefe.
   */
  const mark = await readFile(join(process.cwd(), "public/brand/mark.png"));
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: palette.ink,
          padding: 80,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markSrc} alt="" width={264} height={100} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>
            <span style={{ color: palette.snow }}>{site.wordmark.first}</span>
            <span style={{ color: palette.glacier }}>{site.wordmark.second}</span>
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 30,
              color: palette.frost,
              letterSpacing: 1,
            }}
          >
            Wasserschadensanierung · Trocknung · Leckageortung
          </div>
          <div style={{ marginTop: 36, display: "flex", alignItems: "center" }}>
            <div style={{ width: 60, height: 3, background: palette.glacier }} />
            <div style={{ marginLeft: 20, fontSize: 26, color: palette.glacier, fontStyle: "italic" }}>
              {site.claim}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
