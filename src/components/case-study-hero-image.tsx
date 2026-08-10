"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";

/** Full-bleed case-study hero image with a subtle scroll-scrubbed zoom-out. */
export function CaseStudyHeroImage({ src, alt }: { src: string; alt: string }) {
  const shouldReduceMotion = useSafeReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

  return (
    <div ref={ref} className="relative h-[70dvh] w-full overflow-hidden md:h-[85dvh]">
      <motion.div
        className="absolute inset-0"
        style={shouldReduceMotion ? undefined : { scale }}
      >
        <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" priority />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
    </div>
  );
}
