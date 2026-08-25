"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { SpecLabel } from "@/components/ui/spec-label";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";
import { cn } from "@/lib/cn";
import type { ProjectData } from "@/lib/queries";

const FEATURED_COUNT = 4;

export function Projects({ projects }: { projects: ProjectData[] }) {
  const featured = projects.slice(0, FEATURED_COUNT);

  return (
    <section id="projects" className="border-t border-border px-6 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeader
          label="Featured work"
          heading="Systems I've designed and shipped."
          description="Two backend-first builds, both structured as independent services rather than a single monolith."
        />

        <div className="mt-16 space-y-20 md:space-y-32">
          {featured.map((project, i) => (
            <FeaturedProjectRow key={project.slug} project={project} index={i} />
          ))}
        </div>

        {projects.length > 0 ? (
          <Reveal className="mt-16 flex justify-center md:mt-24">
            <Button href="/projects" variant="ghost">
              All work
            </Button>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

function FeaturedProjectRow({ project, index }: { project: ProjectData; index: number }) {
  const shouldReduceMotion = useSafeReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1, 1.06]);

  const reversed = index % 2 === 1;
  const linkProps = project.hasCaseStudy
    ? { href: `/projects/${project.slug}` }
    : { href: project.href, target: "_blank" as const, rel: "noreferrer" as const };

  return (
    <div ref={ref} className="grid gap-8 md:grid-cols-2 md:items-center md:gap-16">
      <Reveal
        className={cn(
          "group relative aspect-[4/3] overflow-hidden rounded-lg border border-border",
          reversed && "md:order-2",
        )}
      >
        <motion.div
          className="absolute inset-0"
          style={shouldReduceMotion ? undefined : { scale: imageScale }}
        >
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            // Full ~1920px image, not the -thumb variant — this box can render
            // well past 640px wide on large desktop viewports, and the thumb
            // was visibly blurry once upscaled that far. The blur/scale here
            // is a deliberate at-rest treatment (sharpens on hover), separate
            // from that fix — desktop-only (md:) since touch has no hover to
            // clear it.
            className="object-cover transition-[filter,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:blur-md md:scale-105 md:group-hover:blur-0 md:group-hover:scale-100"
          />
        </motion.div>
      </Reveal>

      <Reveal delay={0.1} className={reversed ? "md:order-1" : undefined}>
        <SpecLabel index={index + 1}>{project.type}</SpecLabel>
        <h3 className="text-display-l mt-3 text-ink">{project.title}</h3>
        <p className="mt-4 max-w-[50ch] text-body text-text-2">{project.description}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag) => (
            <li
              key={tag}
              className="text-caption rounded-full border border-border bg-surface-2 px-2.5 py-1 text-text-2"
            >
              {tag}
            </li>
          ))}
        </ul>
        <TextLink {...linkProps} data-cursor-hover className="mt-6">
          View project
        </TextLink>
      </Reveal>
    </div>
  );
}
