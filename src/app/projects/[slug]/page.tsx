import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ProjectGallery } from "@/components/project-gallery";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { getProfile, getProjectBySlug } from "@/lib/queries";

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
  const [profile, project] = await Promise.all([getProfile(), getProjectBySlug(slug)]);

  if (!project || !project.hasCaseStudy) notFound();

  return (
    <>
      <Nav profile={profile} />
      <main id="main-content" className="flex-1">
        <section className="px-6 pb-16 pt-28 md:px-8 md:pt-36">
          <div className="mx-auto max-w-[1180px]">
            <SectionLabel>{`${project.type} · ${project.role} · ${project.year}`}</SectionLabel>
            <h1 className="text-display-l mt-4 max-w-[20ch] text-ink">{project.title}</h1>
            <p className="mt-5 max-w-[65ch] text-body-lg text-text-2">{project.description}</p>

            <div className="mt-8 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-caption rounded-full border border-border bg-surface-2 px-2.5 py-1 text-text-2"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <Button href={project.href} target="_blank" rel="noreferrer" variant="solid">
                View live / repo
              </Button>
            </div>
          </div>
        </section>

        <div className="px-6 md:px-8">
          <div className="relative mx-auto aspect-video max-w-[1180px] overflow-hidden rounded-lg border border-border">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(min-width: 1180px) 1180px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {project.challenge || project.solution || project.result ? (
          <section className="border-t border-border px-6 py-20 md:px-8 md:py-28">
            <div className="mx-auto grid max-w-[1180px] gap-12 md:grid-cols-3">
              {project.challenge ? (
                <div>
                  <p className="text-caption text-text-3">Challenge</p>
                  <p className="mt-3 text-body text-text-2">{project.challenge}</p>
                </div>
              ) : null}
              {project.solution ? (
                <div>
                  <p className="text-caption text-text-3">Solution</p>
                  <p className="mt-3 text-body text-text-2">{project.solution}</p>
                </div>
              ) : null}
              {project.result ? (
                <div>
                  <p className="text-caption text-text-3">Result</p>
                  <p className="mt-3 text-body text-text-2">{project.result}</p>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {project.highlights.length > 0 ? (
          <section className="border-t border-border px-6 py-20 md:px-8 md:py-28">
            <div className="mx-auto max-w-[1180px]">
              <p className="text-caption text-text-3">Highlights</p>
              <ul className="mt-4 space-y-2.5">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex gap-3 text-body text-text-2">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {project.gallery.length > 0 ? (
          <section className="border-t border-border px-6 py-20 md:px-8 md:py-28">
            <div className="mx-auto max-w-[1180px]">
              <p className="text-caption mb-6 text-text-3">Gallery</p>
              <ProjectGallery images={project.gallery} alt={project.title} />
            </div>
          </section>
        ) : null}
      </main>
      <Footer profile={profile} />
    </>
  );
}
