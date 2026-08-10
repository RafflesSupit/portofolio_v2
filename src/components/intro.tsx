"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { TextLink } from "@/components/ui/text-link";
import { SpecLabel } from "@/components/ui/spec-label";
import { RegistrationMark } from "@/components/ui/registration-mark";
import { CurtainReveal } from "@/components/ui/curtain-reveal";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";
import type { ProfileData } from "@/lib/queries";

/**
 * Pinned (sticky) section — the giant statement stays centered in the
 * viewport while the user scrolls through it, releasing into Featured Work
 * once the extra scroll room (80vh) runs out. Folds in a short About teaser
 * so the full bio+skills only lives at /about (no duplication).
 */
export function Intro({ profile }: { profile: ProfileData }) {
  const shouldReduceMotion = useSafeReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0.7, 1], [1, 0.5]);

  return (
    <div id="approach" ref={wrapperRef} className="relative h-[180dvh] border-b border-border">
      <div className="relative sticky top-0 flex min-h-dvh items-center px-6 py-28 md:px-8">
        <RegistrationMark position="top-left" className="text-text-3" />
        <RegistrationMark position="bottom-right" className="text-text-3" />

        <motion.div
          className="mx-auto w-full max-w-[1180px]"
          style={shouldReduceMotion ? undefined : { scale, opacity }}
        >
          <Reveal>
            <SpecLabel index={1}>Approach</SpecLabel>
          </Reveal>

          <CurtainReveal className="mt-4" direction="left">
            <h2 className="text-display-huge max-w-[13ch] text-ink">
              Backend systems built to hold up.
            </h2>
          </CurtainReveal>

          <Reveal delay={0.1} className="mt-6 max-w-[65ch]">
            <p className="text-body-lg text-text-2">{profile.valueProposition}</p>
          </Reveal>

          <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center gap-6">
            {/* <TextLink href="#projects">View projects</TextLink> */}
            <TextLink href="/about">Read the full story</TextLink>
          </Reveal>
        </motion.div>
      </div>
    </div>
  );
}
