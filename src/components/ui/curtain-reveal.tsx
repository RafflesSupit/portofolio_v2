"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";

const ORIGIN = {
  left: "left center",
  right: "right center",
  top: "center top",
  bottom: "center bottom",
} as const;

type Direction = keyof typeof ORIGIN;

/**
 * Wipe/curtain reveal: a decorative panel covers `children`, then scales
 * away via `transform` (never `clip-path` — that produced a stuck-hidden
 * regression once already, since Framer failed to interpolate mismatched
 * `inset()` units). `children` render at `opacity: 1` from first paint and
 * are never themselves hidden — the panel is a separate, `aria-hidden`,
 * `pointer-events-none` layer, so a broken panel animation can only fail to
 * *cover* content, never fail to *reveal* it.
 */
export function CurtainReveal({
  children,
  direction = "left",
  delay = 0,
  className,
  panelClassName,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
  panelClassName?: string;
}) {
  const shouldReduceMotion = useSafeReducedMotion();
  const axis = direction === "left" || direction === "right" ? "scaleX" : "scaleY";

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      {shouldReduceMotion ? null : (
        <motion.div
          aria-hidden="true"
          className={cn("pointer-events-none absolute inset-0 bg-hero-bg", panelClassName)}
          style={{ transformOrigin: ORIGIN[direction] }}
          initial={{ [axis]: 1 }}
          whileInView={{ [axis]: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay, ease: [0.83, 0, 0.17, 1] }}
        />
      )}
    </div>
  );
}
