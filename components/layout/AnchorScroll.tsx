"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Beim Seitenwechsel auf einen Anker: springen, nicht fahren.
 *
 * DAS PROBLEM
 * `html { scroll-behavior: smooth }` (globals.css) gilt für JEDEN Scroll — auch
 * für den, den Next nach einem Routenwechsel selbst auslöst. Wer auf
 * /leistungen/trocknung im Menü „Einsatzgebiet" wählt, landet auf der
 * Startseite und sieht danach die komplette Seite an sich vorbeifliegen:
 * gemessen 4675 px in 20 Schritten über 613 ms. Der Abschnitt, den man wollte,
 * kommt erst am Ende dieser Reise an.
 *
 * DIE UNTERSCHEIDUNG
 * Auf DERSELBEN Seite ist die sanfte Fahrt richtig: Sie zeigt, wo der Abschnitt
 * relativ zum aktuellen Standpunkt liegt — räumlicher Zusammenhang, den man
 * beim Springen verliert.
 * Nach einem SEITENWECHSEL gibt es diesen Zusammenhang nicht. Man kam von einer
 * anderen Seite; die Strecke dorthin ist bedeutungslos und kostet nur Zeit.
 *
 * DIE UMSETZUNG
 * Beim Klick auf einen Anker-Link, der auf eine ANDERE Route zeigt, wird
 * `scroll-behavior` kurz auf `auto` gesetzt. Nach dem Wechsel (Pathname-Änderung
 * + zwei Frames, damit Nexts eigener Sprung durch ist) wird es wieder
 * freigegeben.
 *
 * Der Listener hängt am document in der CAPTURE-Phase: So greift er für jeden
 * Anker — Kopfnavigation, mobiles Menü, Footer, Querverweise — ohne dass jede
 * einzelne Stelle etwas davon wissen muss. Ein `<Link>`, das jemand später
 * hinzufügt, ist automatisch mit abgedeckt.
 */
export function AnchorScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Nur einfache Linksklicks — Strg/Cmd/Shift öffnen einen neuen Tab,
      // dort scrollt ohnehin nichts.
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      const href = anchor?.getAttribute("href");
      if (!href?.includes("#")) return;

      const target = new URL(href, window.location.href);
      if (target.origin !== window.location.origin) return;
      // Gleiche Seite → sanfte Fahrt behalten.
      if (target.pathname === window.location.pathname) return;

      document.documentElement.style.scrollBehavior = "auto";
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    /*
     * Zwei Frames warten, bevor wieder freigegeben wird: Nexts Sprung zum Anker
     * passiert nach dem Rendern der neuen Seite. Gäben wir sofort frei, wäre
     * `smooth` zurück, bevor gesprungen wurde — und die Fahrt liefe wieder.
     */
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = "";
      });
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner); // 0 ist ein No-op, falls nie geplant
    };
  }, [pathname]);

  return null;
}
