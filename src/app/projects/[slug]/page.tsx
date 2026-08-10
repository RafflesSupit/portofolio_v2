import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ProjectGallery } from "@/components/project-gallery";
import { CaseStudyHeroImage } from "@/components/case-study-hero-image";
import { Button } from "@/components/ui/button";
import { SpecLabel } from "@/components/ui/spec-label";
import { RegistrationMark } from "@/components/ui/registration-mark";
import { Reveal } from "@/components/ui/reveal";
import { getProfile, getProjectBySlug, getProjectCount } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: `${project.title} - Case Study`,
    description: project.description,
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [profile, project, projectCount] = await Promise.all([
    getProfile(),
    getProjectBySlug(slug),
    getProjectCount(),
  ]);

  if (!project || !project.hasCaseStudy) notFound();

  const story = [
    { index: 1, label: "Challenge", text: project.challenge },
    { index: 2, label: "Solution", text: project.solution },
    { index: 3, label: "Result", text: project.result },
  ].filter((s): s is { index: number; label: string; text: string } => Boolean(s.text));

  return (
    <>
      <Nav profile={profile} projectCount={projectCount} />
      <main id="main-content" className="flex-1">
        <div className="relative">
          <CaseStudyHeroImage src={project.image} alt={project.title} />
          <RegistrationMark position="top-right" className="text-hero-ink" />
          <div className="absolute inset-x-0 bottom-0 px-6 pb-10 md:px-8 md:pb-16">
            <div className="mx-auto max-w-[1400px]">
              <SpecLabel inverse>{`${project.type} · ${project.role} · ${project.year}`}</SpecLabel>
              <h1 className="text-display-xl mt-4 max-w-[20ch] text-hero-ink">{project.title}</h1>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-8 md:py-28">
          <div className="grid gap-12 md:grid-cols-[280px_1fr] md:gap-16">
            <aside className="space-y-8 md:sticky md:top-28 md:h-fit">
              <Reveal>
                <p className="text-caption text-text-3">Overview</p>
                <p className="mt-3 text-body text-text-2">{project.description}</p>
              </Reveal>

              <Reveal delay={0.05}>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-caption rounded-full border border-border bg-surface-2 px-2.5 py-1 text-text-2"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <Button href={project.href} target="_blank" rel="noreferrer" variant="solid">
                  View live / repo
                </Button>
              </Reveal>
            </aside>

            <div className="space-y-20 md:space-y-28">
              {story.map((section) => (
                <Reveal key={section.label}>
                  <SpecLabel index={section.index}>{section.label}</SpecLabel>
                  <p className="mt-4 max-w-[65ch] text-h4 font-normal text-text-2">{section.text}</p>
                </Reveal>
              ))}

              {project.highlights.length > 0 ? (
                <Reveal>
                  <SpecLabel index={story.length + 1}>Highlights</SpecLabel>
                  <ul className="mt-4 space-y-3">
                    {project.highlights.map((h, i) => (
                      <li key={i} className="flex gap-3 text-body text-text-2">
                        <span className="mt-1 font-mono text-caption text-accent-ink">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : null}
            </div>
          </div>
        </div>

        {project.gallery.length > 0 ? (
          <section className="border-t border-border px-6 py-20 md:px-8 md:py-28">
            <div className="mx-auto max-w-[1400px]">
              <SpecLabel index={story.length + (project.highlights.length > 0 ? 2 : 1)} className="mb-6">
                Gallery
              </SpecLabel>
              <ProjectGallery images={project.gallery} alt={project.title} />
            </div>
          </section>
        ) : null}
      </main>
      <Footer profile={profile} />
    </>
  );
}
