"use client";

import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";

/**
 * Next.js remounts `template.tsx` on every navigation (unlike layout.tsx),
 * giving a hook for a page-transition cross-fade. Opacity + a slight scale
 * only — same safety rule as the rest of the motion system.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useSafeReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
