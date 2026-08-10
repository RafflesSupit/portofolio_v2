"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

const headingContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03 } },
};

const headingWord = {
  hidden: { y: "100%" },
  visible: { y: "0%", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

/**
 * Shared heading block for every content section. The `h2` uses the same
 * per-word mask reveal as the Hero headline (hero.tsx) so the "text appears
 * as you scroll" motion language is consistent across the whole page, not
 * just the hero moment.
 */
export function SectionHeader({
  label,
  heading,
  description,
}: {
  label: string;
  heading: string;
  description?: string;
}) {
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <motion.div
      className="mb-12 grid gap-4 md:grid-cols-[200px_1fr] md:gap-10"
      initial={shouldReduceMotion ? undefined : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.4 }}
      variants={container}
    >
      <motion.div variants={fadeUp}>
        <SectionLabel>{label}</SectionLabel>
      </motion.div>
      <div>
        <motion.h2 variants={headingContainer} className="text-h2 text-ink">
          {shouldReduceMotion ? (
            heading
          ) : (
            <span className="flex flex-wrap gap-x-[0.25em]">
              {heading.split(" ").map((word, i) => (
                <span key={i} className="overflow-hidden">
                  <motion.span variants={headingWord} className="inline-block">
                    {word}
                  </motion.span>
                </span>
              ))}
            </span>
          )}
        </motion.h2>
        {description ? (
          <motion.p variants={fadeUp} className="mt-3 max-w-[60ch] text-body text-text-2">
            {description}
          </motion.p>
        ) : null}
      </div>
    </motion.div>
  );
}
