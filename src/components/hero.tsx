"use client";

import { motion } from "framer-motion";
import { HeroVisual } from "@/components/hero-visual";
import { Button } from "@/components/ui/button";
import type { ProfileData } from "@/lib/queries";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function Hero({ profile }: { profile: ProfileData }) {
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-hero-bg px-6 pb-20 pt-28 text-hero-ink md:px-8 md:pb-28 md:pt-36"
    >
      <HeroVisual />
      <motion.div
        className="relative mx-auto max-w-[1180px]"
        initial={shouldReduceMotion ? undefined : "hidden"}
        animate={shouldReduceMotion ? undefined : "visible"}
        variants={container}
      >
        <motion.div
          variants={item}
          className="mb-6 inline-flex items-center gap-2.5 text-meta text-hero-text-2"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          {profile.eyebrow}
        </motion.div>

        <motion.h1
          variants={item}
          className="text-display-xl max-w-[15ch] text-hero-ink"
        >
          {profile.headline}
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-[58ch] text-body-lg text-hero-text-2"
        >
          {profile.subhead}
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
          <Button href="#projects" variant="solid-inverse">
            View projects
          </Button>
          <Button href="#contact" variant="ghost-inverse">
            Get in touch
          </Button>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll to About section"
        data-cursor-hover
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-hero-text-2 transition-colors hover:text-hero-ink sm:block"
        animate={shouldReduceMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 4v15M12 19l-6-6M12 19l6-6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.a>
    </section>
  );
}
