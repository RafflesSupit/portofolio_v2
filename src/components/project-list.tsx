"use client";

import type { ProjectData } from "@/lib/queries";
import { Reveal } from "@/components/ui/reveal";
import { Card, CardBody, CardMedia } from "@/components/ui/card";
import { ArrowUpRightIcon } from "@/components/ui/arrow-icon";

export function ProjectList({
  projects,
  numbered = false,
}: {
  projects: ProjectData[];
  /** Shows a "01", "02"... badge on each card — the editorial-studio grid pattern. */
  numbered?: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      {projects.map((project, i) => (
        <Reveal key={project.slug} delay={i * 0.05}>
          <ProjectCard project={project} number={numbered ? i + 1 : undefined} />
        </Reveal>
      ))}
    </div>
  );
}

/**
 * Uses the full ~1920px project image rather than the `-thumb` variant
 * (see lib/r2.ts) — this card is `h-[90vh]` tall, so on most viewports the
 * rendered height alone exceeds the thumb's 640px cap, and object-cover
 * upscales the shortfall into visible blur. The thumb is fine for the much
 * smaller hover-preview usage in projects-explorer.tsx.
 */
function ProjectMedia({
  project,
  monogram,
  number,
}: {
  project: ProjectData;
  monogram: string;
  number?: number;
}) {
  return (
    <CardMedia
      src={project.image}
      alt=""
      monogram={monogram}
      aspect="auto"
      className="h-2/3 shrink-0 border-b border-border md:h-full md:w-[44%] md:border-b-0 md:border-r"
      grayscaleHover
    >
      {number !== undefined ? (
        <span
          aria-hidden="true"
          className="absolute left-4 top-4 font-mono text-caption text-white/80"
        >
          {String(number).padStart(2, "0")}
        </span>
      ) : null}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
        aria-hidden="true"
      >
        <p className="text-meta text-white/90">
          {project.type}
          <span className="mx-1.5">·</span>
          {project.year}
        </p>
      </div>
    </CardMedia>
  );
}

function ProjectCard({ project, number }: { project: ProjectData; number?: number }) {
  const monogram = project.title
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  const linkProps = project.hasCaseStudy
    ? { href: `/projects/${project.slug}` }
    : { href: project.href, target: "_blank" as const, rel: "noreferrer" };

  return (
    <Card
      {...linkProps}
      data-cursor-hover
      data-cursor-label="View"
      className="relative flex h-[90vh] flex-col md:flex-row md:items-stretch"
    >
      <ProjectMedia project={project} monogram={monogram} number={number} />

      <CardBody className="flex h-full flex-col justify-between p-6 md:w-[56%] md:p-12">
        <div className="flex items-baseline gap-3">
          <span className="text-body-sm font-semibold text-ink">{project.year}</span>
          <span className="text-body-sm text-text-3">{project.type}</span>
        </div>

        <h3 className="text-h1 text-ink transition-colors duration-150 group-hover:text-accent-ink">
          {project.title}
        </h3>

        <p className="line-clamp-3 max-w-[45ch] text-body-sm font-medium text-text-2">
          {project.description}
        </p>
      </CardBody>

      <span
        aria-hidden="true"
        className="absolute right-5 top-5 text-ink transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1 md:right-8 md:top-8"
      >
        <ArrowUpRightIcon className="h-8 w-8 md:h-10 md:w-10" />
      </span>
    </Card>
  );
}
