"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const skillSchema = z.object({
  category: z.string().min(1),
  items: z.string().min(1),
});

export type SkillFormState = { error?: string };

function parseItems(items: string) {
  return items
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function createSkillCategory(
  _prevState: SkillFormState,
  formData: FormData,
): Promise<SkillFormState> {
  const parsed = skillSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: "Data tidak valid." };

  const max = await prisma.skillCategory.aggregate({ _max: { order: true } });
  await prisma.skillCategory.create({
    data: {
      category: parsed.data.category,
      items: parseItems(parsed.data.items),
      order: (max._max.order ?? -1) + 1,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/skills");
  redirect("/admin/skills");
}

export async function updateSkillCategory(
  id: string,
  _prevState: SkillFormState,
  formData: FormData,
): Promise<SkillFormState> {
  const parsed = skillSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: "Data tidak valid." };

  await prisma.skillCategory.update({
    where: { id },
    data: { category: parsed.data.category, items: parseItems(parsed.data.items) },
  });

  revalidatePath("/");
  revalidatePath("/admin/skills");
  redirect("/admin/skills");
}

export async function deleteSkillCategory(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.skillCategory.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/skills");
}

export async function reorderSkillCategories(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.skillCategory.update({ where: { id }, data: { order: index } })),
  );
  revalidatePath("/");
  revalidatePath("/admin/skills");
}
