"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";
import { Reveal } from "@/components/ui/reveal";
import { SpecLabel } from "@/components/ui/spec-label";
import { RegistrationMark } from "@/components/ui/registration-mark";

type Beat = {
  text: string;
  size: "lg" | "xl";
};

/**
 * Placeholder narrative — swap these for the real story beats. Each one
 * gets its own scroll-linked reveal as it crosses the viewport, so keep
 * them short (roughly one line) rather than full paragraphs.
 */
const BEATS: Beat[] = [
  { text: "Replace this line with the first beat of your story.", size: "lg" },
  { text: "The moment something clicked.", size: "xl" },
  { text: "What you built, broke, and learned along the way.", size: "lg" },
  { text: "And here's where it's going next.", size: "xl" },
];

export function Journey() {
  const shouldReduceMotion = useSafeReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const railTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      id="journey"
      aria-label="Journey"
      className="relative bg-hero-bg px-6 py-24 text-hero-ink md:px-8 md:py-32"
    >
      <RegistrationMark position="top-left" className="text-hero-text-2" />
      <RegistrationMark position="bottom-right" className="text-hero-text-2" />

      {/* Progress rail — gives the long scroll through this section a
          persistent sense of motion/position, instead of feeling like dead
          space between beat reveals. */}
      {shouldReduceMotion ? null : (
        <div
          className="absolute inset-y-24 left-6 hidden w-px bg-white/10 md:left-10 md:top-32 md:bottom-32 md:block"
          aria-hidden="true"
        >
          <motion.div
            className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-accent"
            style={{ top: railTop }}
          />
        </div>
      )}

      <div className="mx-auto max-w-[900px]">
        <Reveal>
          <SpecLabel index={2} inverse className="mb-16 md:mb-24">
            Journey
          </SpecLabel>
        </Reveal>
        <div className="flex flex-col gap-[10vh] md:gap-[16vh]">
          {BEATS.map((beat, i) => (
            <JourneyBeat key={i} beat={beat} reduceMotion={shouldReduceMotion} />
          ))}
        </div>
      </div>
    </section>
  );
}

function JourneyBeat({ beat, reduceMotion }: { beat: Beat; reduceMotion: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.35"],
  });

  const sizeClass = beat.size === "xl" ? "text-display-l" : "text-h1";

  if (reduceMotion) {
    return <p className={`${sizeClass} text-hero-ink`}>{beat.text}</p>;
  }

  const words = beat.text.split(" ");

  return (
    <p ref={ref} className={`${sizeClass} flex flex-wrap gap-x-[0.28em] gap-y-1 text-hero-ink`}>
      {words.map((word, i) => (
        <JourneyWord key={i} word={word} index={i} count={words.length} progress={scrollYProgress} />
      ))}
    </p>
  );
}

function JourneyWord({
  word,
  index,
  count,
  progress,
}: {
  word: string;
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  const start = index / count;
  const end = Math.min(1, start + 1.4 / count);
  const opacity = useTransform(progress, [start, end], [0.15, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}
    </motion.span>
  );
}
