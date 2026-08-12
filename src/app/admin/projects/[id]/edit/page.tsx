import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { prismaReplica } from "@/lib/prisma-replica";
import { withFallback } from "@/lib/db-retry";
import { ProjectForm } from "../../project-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await withFallback(
    () => prisma.project.findUnique({ where: { id } }),
    () => prismaReplica!.project.findUnique({ where: { id } }),
    null,
  );
  if (!project) notFound();

  return (
    <div>
      <h1 className="text-h2 text-ink">Edit project</h1>
      <div className="mt-6">
        <ProjectForm
          mode="edit"
          id={project.id}
          slug={project.slug}
          title={project.title}
          type={project.type}
          role={project.role}
          year={project.year}
          description={project.description}
          highlights={project.highlights.join("\n")}
          tags={project.tags.join(", ")}
          href={project.href}
          imageUrl={project.imageUrl}
          published={project.published}
          hasCaseStudy={project.hasCaseStudy}
          challenge={project.challenge ?? ""}
          solution={project.solution ?? ""}
          result={project.result ?? ""}
          gallery={project.gallery}
        />
      </div>
    </div>
  );
}
