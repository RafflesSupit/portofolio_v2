"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export function ProjectGallery({ images, alt }: { images: string[]; alt: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function scrollToIndex(index: number) {
    const scroller = scrollerRef.current;
    const child = scroller?.children[index] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  function handleScroll() {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const children = Array.from(scroller.children) as HTMLElement[];
    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    let closest = 0;
    let closestDist = Infinity;
    children.forEach((child, i) => {
      const dist = Math.abs(child.offsetLeft + child.clientWidth / 2 - center);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setActive(closest);
  }

  if (images.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        tabIndex={0}
        role="region"
        aria-label={`${alt} image gallery`}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {images.map((src, i) => (
          <div
            key={src}
            className="relative aspect-video w-[85%] shrink-0 snap-center overflow-hidden rounded-lg border border-border sm:w-[70%]"
          >
            <Image
              src={src}
              alt={`${alt} screenshot ${i + 1}`}
              fill
              sizes="(min-width: 640px) 70vw, 85vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {images.length > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => scrollToIndex(Math.max(0, active - 1))}
            className="tap-target inline-flex items-center justify-center rounded-full border border-border bg-surface text-ink"
          >
            ‹
          </button>
          <div role="tablist" aria-label="Gallery position" className="flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-label={`Go to image ${i + 1}`}
                aria-selected={active === i}
                onClick={() => scrollToIndex(i)}
                className={`rounded-full transition-all ${
                  active === i ? "h-2 w-4 bg-ink" : "h-1.5 w-1.5 bg-border-strong"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => scrollToIndex(Math.min(images.length - 1, active + 1))}
            className="tap-target inline-flex items-center justify-center rounded-full border border-border bg-surface text-ink"
          >
            ›
          </button>
        </div>
      ) : null}
    </div>
  );
}
