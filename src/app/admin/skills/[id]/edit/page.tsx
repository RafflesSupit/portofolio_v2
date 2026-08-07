import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SkillForm } from "../../skill-form";

export default async function EditSkillCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.skillCategory.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div>
      <h1 className="text-h2 text-ink">Edit kategori skill</h1>
      <div className="mt-6">
        <SkillForm
          mode="edit"
          id={category.id}
          defaultCategory={category.category}
          defaultItems={category.items.join(", ")}
        />
      </div>
    </div>
  );
}
