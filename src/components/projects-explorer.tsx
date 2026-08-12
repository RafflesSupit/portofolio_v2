"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectList } from "@/components/project-list";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { EmptyState } from "@/components/ui/empty-state";
import { toThumbnailUrl } from "@/lib/image-url";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";
import { cn } from "@/lib/cn";
import type { ProjectData } from "@/lib/queries";

type View = "grid" | "list";

/**
 * Categories are derived from each project's real `tags` (tech stack, e.g.
 * "Laravel", "Microservices") rather than fixed design-agency categories —
 * this is a backend portfolio, not a design studio, so the filter
 * dimension that actually exists in the data is stack/tag, not "Brand
 * Design" / "UX Design".
 */
export function ProjectsExplorer({ projects }: { projects: ProjectData[] }) {
  const categoryOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      for (const tag of project.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    const tags = Array.from(counts.keys()).sort();
    return [
      { value: "all", label: "All", count: projects.length },
      ...tags.map((tag) => ({ value: tag, label: tag, count: counts.get(tag) ?? 0 })),
    ];
  }, [projects]);

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [view, setView] = useState<View>("grid");

  const filtered =
    activeCategory === "all" ? projects : projects.filter((p) => p.tags.includes(activeCategory));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <CategoryFilter options={categoryOptions} active={activeCategory} onChange={setActiveCategory} />

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
          <EmptyState label="0 results" message="No projects tagged this way yet — try All." />
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

type CategoryOption = { value: string; label: string; count: number };

/**
 * Reference-driven: a trigger button opens a floating panel — vertical
 * list, active option marked with a dot + bold text, counts in
 * parens — rather than a row of filter chips.
 */
function CategoryFilter({
  options,
  active,
  onChange,
}: {
  options: CategoryOption[];
  active: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useSafeReducedMotion();
  const activeOption = options.find((o) => o.value === active);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="true"
        aria-expanded={open}
        className="tap-target inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 font-mono text-caption uppercase tracking-[0.1em] text-ink transition-colors hover:border-border-strong"
      >
        {activeOption?.label ?? "All"}
        <ChevronIcon className={cn("transition-transform duration-200", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="menu"
              aria-label="Filter by category"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-border bg-surface/95 py-5 shadow-[var(--shadow-strong)] backdrop-blur-xl"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close filter"
                className="tap-target absolute right-3 top-3 inline-flex items-center justify-center text-text-3 transition-colors hover:text-ink"
              >
                <CloseIcon />
              </button>

              <div className="mt-3 flex flex-col items-center">
                {options.map((option) => {
                  const isActive = option.value === active;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="menuitemradio"
                      aria-checked={isActive}
                      onClick={() => {
                        onChange(option.value);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-2 px-6 py-2.5 font-mono text-caption uppercase tracking-[0.1em] transition-colors",
                        isActive ? "font-semibold text-ink" : "text-text-3 hover:text-ink",
                      )}
                    >
                      {isActive ? <span className="h-1.5 w-1.5 rounded-full bg-ink" aria-hidden="true" /> : null}
                      {option.label}
                      <sup className="text-[9px] font-normal text-text-3">({option.count})</sup>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
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

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
