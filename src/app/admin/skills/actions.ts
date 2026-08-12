"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { extractFormValues } from "@/lib/form-values";
import { isConnectionError, SAVE_UNAVAILABLE_MESSAGE } from "@/lib/db-retry";
import {
  syncSkillCategory,
  deleteSkillCategory as deleteSkillCategoryFromReplica,
  syncSkillCategoryOrder,
} from "@/lib/sync-replica";

const skillSchema = z.object({
  category: z.string().min(1),
  items: z.string().min(1),
});

export type SkillFormState = {
  error?: string;
  values?: Record<string, string>;
  submittedAt?: number;
};

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
  if (!parsed.success) {
    return { error: "Data tidak valid.", values: extractFormValues(formData), submittedAt: Date.now() };
  }

  let category;
  try {
    const max = await prisma.skillCategory.aggregate({ _max: { order: true } });
    category = await prisma.skillCategory.create({
      data: {
        category: parsed.data.category,
        items: parseItems(parsed.data.items),
        order: (max._max.order ?? -1) + 1,
      },
    });
  } catch (error) {
    if (isConnectionError(error)) {
      return { error: SAVE_UNAVAILABLE_MESSAGE, values: extractFormValues(formData), submittedAt: Date.now() };
    }
    throw error;
  }

  await syncSkillCategory(category);

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
  if (!parsed.success) {
    return { error: "Data tidak valid.", values: extractFormValues(formData), submittedAt: Date.now() };
  }

  let category;
  try {
    category = await prisma.skillCategory.update({
      where: { id },
      data: { category: parsed.data.category, items: parseItems(parsed.data.items) },
    });
  } catch (error) {
    if (isConnectionError(error)) {
      return { error: SAVE_UNAVAILABLE_MESSAGE, values: extractFormValues(formData), submittedAt: Date.now() };
    }
    throw error;
  }

  await syncSkillCategory(category);

  revalidatePath("/");
  revalidatePath("/admin/skills");
  redirect("/admin/skills");
}

export async function deleteSkillCategory(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.skillCategory.delete({ where: { id } });
  await deleteSkillCategoryFromReplica(id);
  revalidatePath("/");
  revalidatePath("/admin/skills");
}

export async function reorderSkillCategories(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.skillCategory.update({ where: { id }, data: { order: index } })),
  );
  await syncSkillCategoryOrder(orderedIds);
  revalidatePath("/");
  revalidatePath("/admin/skills");
}
