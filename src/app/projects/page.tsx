import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SpecLabel } from "@/components/ui/spec-label";
import { RegistrationMark } from "@/components/ui/registration-mark";
import { ProjectsExplorer } from "@/components/projects-explorer";
import { getProfile, getProjects } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Work - Raffles Supit",
  description: "Backend-first builds — systems, APIs, and services shipped end to end.",
};

export default async function ProjectsIndexPage() {
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);

  return (
    <>
      <Nav profile={profile} projectCount={projects.length} />
      <main id="main-content" className="relative flex-1 px-6 pb-20 pt-28 md:px-8 md:pt-36">
        <RegistrationMark position="top-right" className="text-text-3" />
        <div className="mx-auto max-w-[1180px]">
          <SpecLabel index={1}>Work</SpecLabel>
          <h1 className="text-display-l mt-4 max-w-[20ch] text-ink">
            Systems I&apos;ve designed and shipped.
          </h1>

          {projects.length === 0 ? (
            <p className="mt-10 text-body text-text-2">
              No published projects yet — check back soon.
            </p>
          ) : (
            <div className="mt-12">
              <ProjectsExplorer projects={projects} />
            </div>
          )}
        </div>
      </main>

      <Footer profile={profile} />
    </>
  );
}
