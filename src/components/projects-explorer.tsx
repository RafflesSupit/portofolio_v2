"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ProjectList } from "@/components/project-list";
import { FilterChip } from "@/components/ui/filter-chip";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { toThumbnailUrl } from "@/lib/image-url";
import { cn } from "@/lib/cn";
import type { ProjectData } from "@/lib/queries";

type View = "grid" | "list";

/**
 * Category chips are derived from each project's real `tags` (tech stack,
 * e.g. "Laravel", "Microservices") rather than fixed design-agency
 * categories — this is a backend portfolio, not a design studio, so the
 * filter dimension that actually exists in the data is stack/tag, not
 * "Brand Design" / "UX Design".
 */
export function ProjectsExplorer({ projects }: { projects: ProjectData[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const project of projects) {
      for (const tag of project.tags) set.add(tag);
    }
    return Array.from(set).sort();
  }, [projects]);

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [view, setView] = useState<View>("grid");

  const filtered =
    activeCategory === "all" ? projects : projects.filter((p) => p.tags.includes(activeCategory));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
          <FilterChip active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>
            All
          </FilterChip>
          {categories.map((category) => (
            <FilterChip
              key={category}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </FilterChip>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-md border border-border p-1" role="group" aria-label="View">
          <ViewToggleButton active={view === "grid"} onClick={() => setView("grid")} label="Grid view">
            <GridIcon />
          </ViewToggleButton>
          <ViewToggleButton active={view === "list"} onClick={() => setView("list")} label="List view">
            <ListIcon />
          </ViewToggleButton>
        </div>
      </div>

      <p className="mt-6 font-mono text-caption text-text-3">
        {String(filtered.length).padStart(2, "0")} {filtered.length === 1 ? "project" : "projects"}
      </p>

      <div className="mt-6">
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-body text-text-2">No projects match this filter.</p>
        ) : view === "grid" ? (
          <ProjectList projects={filtered} numbered />
        ) : (
          <div className="divide-y divide-border border-y border-border">
            {filtered.map((project, i) => (
              <ListRow key={project.slug} project={project} number={i + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ViewToggleButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        "tap-target inline-flex items-center justify-center rounded transition-colors",
        active ? "bg-surface-2 text-ink" : "text-text-3 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function ListRow({ project, number }: { project: ProjectData; number: number }) {
  const [hovered, setHovered] = useState(false);

  const linkProps = project.hasCaseStudy
    ? { href: `/projects/${project.slug}` }
    : { href: project.href, target: "_blank" as const, rel: "noreferrer" };

  return (
    <a
      {...linkProps}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor-hover
      data-cursor-label="View"
      className="group relative flex items-center justify-between gap-6 py-6"
    >
      <div className="flex items-center gap-6">
        <span className="font-mono text-caption text-text-3">{String(number).padStart(2, "0")}</span>
        <h3 className="text-h3 text-ink transition-colors duration-150 group-hover:text-accent-ink">
          {project.title}
        </h3>
      </div>

      <div className="hidden items-center gap-4 sm:flex">
        <span className="text-meta text-text-3">{project.tags.slice(0, 2).join(" · ")}</span>
        <ArrowIcon className="text-text-3 transition-transform duration-200 group-hover:translate-x-1" />
      </div>

      <div
        className={cn(
          "pointer-events-none absolute right-12 top-1/2 z-10 hidden h-28 w-40 -translate-y-1/2 overflow-hidden rounded-lg border border-border shadow-[var(--shadow-strong)] transition-opacity duration-300 md:block",
          hovered ? "opacity-100" : "opacity-0",
        )}
        aria-hidden="true"
      >
        <Image src={toThumbnailUrl(project.image)} alt="" fill sizes="160px" className="object-cover" />
      </div>
    </a>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="4" y="13" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="13" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
