"use client";

import { useState } from "react";
import type { ProjectData } from "@/lib/queries";
import { Reveal } from "@/components/ui/reveal";
import { Card, CardBody, CardMedia } from "@/components/ui/card";
import { toThumbnailUrl } from "@/lib/image-url";

export function ProjectList({
  projects,
  numbered = false,
}: {
  projects: ProjectData[];
  /** Shows a "01", "02"... badge on each card — the editorial-studio grid pattern. */
  numbered?: boolean;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((project, i) => (
        <Reveal key={project.slug} delay={i * 0.05}>
          <ProjectCard project={project} number={numbered ? i + 1 : undefined} />
        </Reveal>
      ))}
    </div>
  );
}

/**
 * Renders the `-thumb` variant uploadToR2 generates (see lib/r2.ts) instead
 * of the full ~1920px project image, since the grid only ever displays this
 * at roughly card width (~half the 1180px container). Falls back to the
 * full image on error for projects uploaded before thumbnails existed.
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
  const [thumbFailed, setThumbFailed] = useState(false);
  const src = thumbFailed ? project.image : toThumbnailUrl(project.image);

  return (
    <CardMedia
      key={src}
      src={src}
      alt=""
      monogram={monogram}
      grayscaleHover
      onError={() => setThumbFailed(true)}
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
    <Card {...linkProps} data-cursor-hover data-cursor-label="View">
      <ProjectMedia project={project} monogram={monogram} number={number} />

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
