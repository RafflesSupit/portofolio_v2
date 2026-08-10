"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HeroVisual } from "@/components/hero-visual";
import { Button } from "@/components/ui/button";
import { Showreel } from "@/components/showreel";
import { SpecLabel } from "@/components/ui/spec-label";
import { RegistrationMark } from "@/components/ui/registration-mark";
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

const headlineContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.08 } },
};

const headlineWord = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Hero({ profile }: { profile: ProfileData }) {
  const shouldReduceMotion = useSafeReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-scrubbed exit: progress runs 0 -> 1 across exactly one viewport
  // height of scroll (from page load to the moment the hero has fully
  // scrolled past). Plain numeric transforms only (opacity/scale/y) — the
  // same proven-reliable technique already shipped in journey.tsx.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const visualOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative isolate flex min-h-dvh items-center overflow-hidden bg-hero-bg px-6 pb-20 pt-28 text-hero-ink md:px-8 md:pb-28 md:pt-36"
    >
      <RegistrationMark position="top-left" className="text-hero-text-2" />
      <RegistrationMark position="bottom-right" className="text-hero-text-2" />

      <motion.div
        className="absolute inset-0"
        style={shouldReduceMotion ? undefined : { opacity: visualOpacity, scale: visualScale }}
      >
        <HeroVisual />
      </motion.div>

      <div className="absolute right-4 top-4 hidden md:right-6 md:top-6 lg:block">
        <SpecLabel inverse>{`REV ${new Date().getFullYear()}`}</SpecLabel>
      </div>

      <motion.div
        className="relative mx-auto w-full max-w-[1180px]"
        style={
          shouldReduceMotion
            ? undefined
            : { opacity: contentOpacity, scale: contentScale, y: contentY }
        }
      >
        <motion.div
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
            variants={headlineContainer}
            className="text-display-xl max-w-[15ch] text-hero-ink"
          >
            {shouldReduceMotion ? (
              profile.headline
            ) : (
              <span className="flex flex-wrap gap-x-[0.28em]">
                {profile.headline.split(" ").map((word, i) => (
                  <span key={i} className="overflow-hidden">
                    <motion.span variants={headlineWord} className="inline-block">
                      {word}
                    </motion.span>
                  </span>
                ))}
              </span>
            )}
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
            <Showreel videoUrl={profile.showreelUrl} variant="prominent" />
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-t border-white/10 pt-6 font-mono text-[11px] uppercase tracking-wide"
          >
            {[
              { label: "Focus", value: profile.quickFacts.focus },
              { label: "Currently", value: profile.quickFacts.currently },
              { label: "Based in", value: profile.quickFacts.basedIn },
              { label: "Open to", value: profile.quickFacts.openTo },
            ].map((fact) => (
              <div key={fact.label} className="flex items-baseline gap-1.5">
                <dt className="text-hero-text-2">{fact.label}</dt>
                <dd className="text-hero-ink">{fact.value}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </motion.div>

      <motion.a
        href="#approach"
        aria-label="Scroll to Approach section"
        data-cursor-hover
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-hero-text-2 transition-colors hover:text-hero-ink"
        animate={shouldReduceMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-caption hidden sm:inline">Scroll to discover</span>
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
