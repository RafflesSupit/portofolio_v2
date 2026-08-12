"use client";

import { useEffect } from "react";

/**
 * The navbar's #experience/#faq/#contact links are plain <a> tags, so
 * clicking one from any other page triggers a full page load to `/#id`.
 * The browser jumps to that target the instant it appears in the initial
 * HTML — before hydration, before web fonts swap in, before images finish
 * loading. Anything above the target that still changes height after that
 * point (font metrics shifting on swap, images reserving no space until
 * they load) drags the target out from under that jump, so the page lands
 * in the wrong spot. Re-running the scroll once fonts are ready and once
 * more on full load corrects for that drift without needing a refresh.
 */
export function HashScrollFix() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;

    let cancelled = false;
    function scrollToTarget() {
      if (cancelled) return;
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    }

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    fontsReady.then(() => {
      requestAnimationFrame(() => requestAnimationFrame(scrollToTarget));
    });

    if (document.readyState === "complete") {
      scrollToTarget();
    } else {
      window.addEventListener("load", scrollToTarget, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", scrollToTarget);
    };
  }, []);

  return null;
}
