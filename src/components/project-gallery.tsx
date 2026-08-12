"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { SpecLabel } from "@/components/ui/spec-label";
import { RegistrationMark } from "@/components/ui/registration-mark";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";
import { cn } from "@/lib/cn";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 400;

/**
 * Drag-to-swipe viewer — replaces an earlier scroll-pinned version that
 * forced ~100vh of dedicated scroll per photo, which felt heavy
 * specifically on mobile (scrolling is the primary navigation gesture
 * there, so hijacking it for a gallery fought the user rather than
 * helping). Swipe is the natural mobile gesture and Framer's `drag`
 * handles touch and mouse identically, so the same interaction works on
 * both without a separate mobile path.
 */
export function ProjectGallery({
  images,
  alt,
  index,
}: {
  images: string[];
  alt: string;
  index: number;
}) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const shouldReduceMotion = useSafeReducedMotion();

  if (images.length === 0) return null;

  function goTo(step: 1 | -1) {
    setDirection(step);
    setActive((current) => (current + step + images.length) % images.length);
  }

  function handleDragEnd(_event: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) {
      goTo(1);
    } else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) {
      goTo(-1);
    }
  }

  return (
    <div className="px-6 py-20 md:px-8 md:py-28">
      <SpecLabel index={index} className="mb-8">
        Gallery
      </SpecLabel>

      <div className="relative mx-auto max-w-[900px]">
        <RegistrationMark position="top-left" className="text-text-3" />
        <RegistrationMark position="bottom-right" className="text-text-3" />

        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-surface-2 sm:aspect-video">
          <AnimatePresence initial={false}>
            <motion.div
              key={active}
              drag={images.length > 1 && !shouldReduceMotion ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.65}
              onDragEnd={handleDragEnd}
              initial={shouldReduceMotion ? undefined : { opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, x: direction * -60 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="absolute inset-0 touch-pan-y active:cursor-grabbing"
              style={{ cursor: images.length > 1 ? "grab" : "default" }}
            >
              <Image
                src={images[active]}
                alt={`${alt} screenshot ${active + 1}`}
                fill
                sizes="900px"
                className="pointer-events-none object-cover"
                draggable={false}
                priority={active === 0}
              />
            </motion.div>
          </AnimatePresence>

          <span className="pointer-events-none absolute right-4 top-4 rounded-md border border-white/20 bg-black/50 px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-md">
            {`§ ${pad(active + 1)} / ${pad(images.length)}`}
          </span>
        </div>

        {images.length > 1 ? (
          <div className="mt-5 flex items-center justify-between gap-4">
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => goTo(-1)}
              className="tap-target inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-border-strong"
            >
              <ArrowIcon className="rotate-180" />
            </button>

            <div className="flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to image ${i + 1}`}
                  aria-current={active === i}
                  onClick={() => {
                    setDirection(i > active ? 1 : -1);
                    setActive(i);
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    active === i ? "w-6 bg-ink" : "w-1.5 bg-border-strong",
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Next image"
              onClick={() => goTo(1)}
              className="tap-target inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-border-strong"
            >
              <ArrowIcon />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
