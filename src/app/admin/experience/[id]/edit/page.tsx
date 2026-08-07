import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ExperienceForm } from "../../experience-form";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.experienceItem.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-h2 text-ink">Edit experience</h1>
      <div className="mt-6">
        <ExperienceForm
          mode="edit"
          id={item.id}
          defaultRole={item.role}
          defaultOrg={item.org}
          defaultPeriod={item.period}
          defaultPoints={item.points.join("\n")}
        />
      </div>
    </div>
  );
}
