import { SectionHeader } from "@/components/ui/section-header";
import { ProjectList } from "@/components/project-list";
import type { ProjectData } from "@/lib/queries";

export function Projects({ projects }: { projects: ProjectData[] }) {
  return (
    <section id="projects" className="border-t border-border bg-surface-2/40 px-6 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeader
          label="Projects"
          heading="Systems I've designed and shipped."
          description="Two backend-first builds, both structured as independent services rather than a single monolith. Hover a project to preview it."
        />

        <ProjectList projects={projects} />
      </div>
    </section>
  );
}
