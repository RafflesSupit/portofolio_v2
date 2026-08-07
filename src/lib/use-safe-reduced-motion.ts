"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Same as framer-motion's `useReducedMotion`, but safe to use for branching
 * between different element trees (e.g. animated vs. static markup). The
 * underlying value resolves from `window.matchMedia` on the client only, so
 * branching on it directly during the first render mismatches whatever the
 * server rendered. This always reports `false` until after mount, matching
 * the server's assumption, then swaps in the real value.
 */
export function useSafeReducedMotion() {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted && !!shouldReduceMotion;
}
