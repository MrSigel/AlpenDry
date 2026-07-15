/**
 * Rendert strukturierte Daten als <script type="application/ld+json">.
 * Die Objekte kommen aus lib/jsonld.ts und speisen sich ausschließlich aus
 * content.ts — kein User-Input, daher ist dangerouslySetInnerHTML hier sicher.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
