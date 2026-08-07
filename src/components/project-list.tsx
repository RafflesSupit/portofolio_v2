"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import type { ProjectData } from "@/lib/queries";
import { Reveal } from "@/components/ui/reveal";
import { Card, CardBody, CardMedia } from "@/components/ui/card";
import { toThumbnailUrl } from "@/lib/image-url";

export function ProjectList({ projects }: { projects: ProjectData[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 22, stiffness: 260, mass: 0.6 });
  const springY = useSpring(y, { damping: 22, stiffness: 260, mass: 0.6 });

  function handleMove(e: React.MouseEvent) {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  }

  const active = projects.find((p) => p.slug === hovered) ?? null;

  return (
    <div ref={stageRef} onMouseMove={handleMove} className="relative">
      <div className="hover-image-stage pointer-events-none absolute inset-0">
        <AnimatePresence>
          {active ? (
            <motion.div
              key={active.slug}
              className="absolute z-10 h-64 w-48 overflow-hidden rounded-lg shadow-[var(--shadow-strong)] sm:h-72 sm:w-56"
              style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <HoverPreviewImage src={active.image} />
              <div
                className="absolute inset-0"
                style={{ background: "rgba(14, 124, 134, 0.35)", mixBlendMode: "color" }}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.05}>
            <ProjectCard
              project={project}
              onEnter={() => setHovered(project.slug)}
              onLeave={() => setHovered((cur) => (cur === project.slug ? null : cur))}
            />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/**
 * Uses the small `-thumb` variant uploadToR2 generates instead of the full
 * ~1920px project image, since this preview only ever renders at 224px.
 * Falls back to the full image on error for projects uploaded before
 * thumbnails existed, which have no `-thumb` companion file in R2.
 */
function HoverPreviewImage({ src }: { src: string }) {
  const [thumbFailed, setThumbFailed] = useState(false);

  return (
    <Image
      src={thumbFailed ? src : toThumbnailUrl(src)}
      alt=""
      fill
      sizes="224px"
      className="object-cover"
      style={{ filter: "grayscale(1) contrast(1.05)" }}
      onError={() => setThumbFailed(true)}
    />
  );
}

function ProjectCard({
  project,
  onEnter,
  onLeave,
}: {
  project: ProjectData;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const monogram = project.title
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  const linkProps = project.hasCaseStudy
    ? { href: `/projects/${project.slug}` }
    : { href: project.href, target: "_blank" as const, rel: "noreferrer" };

  return (
    <Card {...linkProps} onMouseEnter={onEnter} onMouseLeave={onLeave} data-cursor-hover>
      <CardMedia monogram={monogram} />

      <CardBody>
        <p className="text-meta text-text-3">
          {project.type}
          <span className="mx-1.5" aria-hidden="true">
            ·
          </span>
          {project.role}
          <span className="mx-1.5" aria-hidden="true">
            ·
          </span>
          {project.year}
        </p>

        <h3 className="mt-2 line-clamp-2 text-h3 text-ink transition-colors duration-150 group-hover:text-accent-ink">
          {project.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-body-sm text-text-2">{project.description}</p>

        <ul className="mt-5 space-y-2">
          {project.highlights.map((h, i) => (
            <li key={i} className="flex gap-2.5 text-body-sm text-text-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <span>{h}</span>
            </li>
          ))}
        </ul>

        <ul className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="text-caption rounded-full border border-border bg-surface-2 px-2.5 py-1 text-text-2"
            >
              {tag}
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
