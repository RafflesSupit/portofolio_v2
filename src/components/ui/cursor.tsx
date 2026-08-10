"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

const HOVER_SELECTOR = "a, button, [data-cursor-hover]";

/**
 * Site-wide custom cursor. Follows the mouse 1:1 (no lag), grows on
 * hover, and can show a short label via `data-cursor-label` on the
 * hovered element (e.g. "View").
 *
 * Disables itself automatically for touch input and respects
 * `prefers-reduced-motion`, including hybrid devices that switch
 * between mouse and touch mid-session.
 */
export function Cursor() {
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedMotionQuery.matches;

    function applyActive(next: boolean) {
      setActive(next);
      document.documentElement.classList.toggle("custom-cursor", next);
    }

    function handleMove(e: PointerEvent) {
      const shouldBeActive = e.pointerType === "mouse" && !reduced;
      applyActive(shouldBeActive);
      if (!shouldBeActive) return;

      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      const hoverEl = target?.closest(HOVER_SELECTOR) as HTMLElement | null;
      setHovering(!!hoverEl);
      setLabel(hoverEl?.dataset.cursorLabel ?? null);
    }
    function handleDown(e: PointerEvent) {
      if (e.pointerType === "mouse") setPressed(true);
    }
    function handleUp() {
      setPressed(false);
    }
    function handleLeaveWindow() {
      x.set(-100);
      y.set(-100);
    }
    function handleReducedMotionChange(e: MediaQueryListEvent) {
      reduced = e.matches;
      if (reduced) applyActive(false);
    }

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    document.addEventListener("mouseleave", handleLeaveWindow);
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);

    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      document.removeEventListener("mouseleave", handleLeaveWindow);
      reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
    };
  }, [x, y]);

  if (!active) return null;

  const size = label ? 72 : hovering ? 44 : 18;

  return (
    // Position tracking (x/y, in px) and size/centering are split across
    // two elements on purpose. Both `marginLeft: -size/2` and a static
    // `translateX(-50%)` were tried on the single tracking element and
    // both stayed slightly off during the resize animation, because each
    // is a JS-derived value chasing the *target* size, not the box's
    // actual rendered size on that frame — so it could only ever match
    // width/height exactly at rest, not mid-spring. A percentage
    // transform recomputes from the real current box size every frame
    // (browser-native, not JS math), so it can't drift no matter how the
    // size animates — but it needs a `transform` slot of its own, which
    // this element's `x`/`y` (mouse position) already occupies. Hence:
    // outer div owns x/y, inner div owns the percentage centering + size.
    <motion.div
      aria-hidden="true"
      className="cursor-follower pointer-events-none fixed left-0 top-0 z-[200]"
      style={{ x, y }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full"
        style={{
          x: "-50%",
          y: "-50%",
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: "#ffffff",
          backgroundColor: label ? "rgba(11, 11, 13, 0.75)" : "transparent",
          backdropFilter: label ? "blur(4px)" : "none",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.35)",
        }}
        animate={{ width: size, height: size, scale: pressed ? 0.88 : 1 }}
        transition={{ type: "spring", damping: 24, stiffness: 320, mass: 0.6 }}
      >
        {label ? (
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-white">
            {label}
          </span>
        ) : null}
      </motion.div>
    </motion.div>
  );
}
