"use client";

import { type RefObject } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";

/** Thin fixed bar tracking scroll progress through a specific article, not the whole document. */
export function ReadingProgressBar({ target }: { target: RefObject<HTMLElement | null> }) {
  const shouldReduceMotion = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 300, damping: 40, restDelta: 0.001 });

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-40 h-[2px] origin-left bg-accent-ink"
      style={{ scaleX: progress }}
    />
  );
}
