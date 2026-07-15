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

export default function OgImage() {
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
        {/* Bergmarke — dieselbe Geometrie wie components/brand/Logo.tsx */}
        <svg viewBox="0 0 200 116" width="150" height="87">
          <path d="M4 112 L58 26 L112 112 Z" fill={palette.steel} />
          <path d="M92 112 L140 44 L196 112 Z" fill={palette.steel} opacity="0.72" />
          <path d="M58 26 L79 59 L69 66 L58 54 L47 64 L37 59 Z" fill={palette.snow} />
          <path d="M140 44 L157 70 L148 75 L140 66 L131 74 L123 70 Z" fill={palette.snow} />
          <path d="M150 60 L128 94 L142 94 L124 116 L152 86 L138 86 Z" fill={palette.frost} />
        </svg>

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
