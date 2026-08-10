"use client";

import { useEffect, useRef, useState } from "react";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";

const DIGITS = "0123456789";

/**
 * Settles from random digits into `value` on mount — the "precision/tech"
 * scramble flourish common on Awwwards-tier studio sites (odometer-style
 * reveal). `value` must be honest, real data (a count, a year); this is a
 * decorative *reveal*, not a place to fabricate numbers.
 */
export function ScrambleDigits({
  value,
  className,
  durationMs = 900,
}: {
  value: string;
  className?: string;
  durationMs?: number;
}) {
  const shouldReduceMotion = useSafeReducedMotion();
  const [display, setDisplay] = useState(value);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const start = performance.now();
    const length = value.length;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / durationMs);
      const settledCount = Math.floor(progress * length);

      let next = "";
      for (let i = 0; i < length; i++) {
        const char = value[i];
        if (!/[0-9]/.test(char)) {
          next += char;
        } else if (i < settledCount) {
          next += char;
        } else {
          next += DIGITS[Math.floor(Math.random() * DIGITS.length)];
        }
      }
      setDisplay(next);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);
    };
  }, [value, durationMs, shouldReduceMotion]);

  return (
    <span className={className} aria-hidden="true">
      {shouldReduceMotion ? value : display}
    </span>
  );
}
