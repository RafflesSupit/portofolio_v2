"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { extractFormValues } from "@/lib/form-values";

const achievementSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
  date: z.string().min(1),
  url: z.string().url().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

export type AchievementFormState = {
  error?: string;
  values?: Record<string, string>;
  submittedAt?: number;
};

export async function createAchievement(
  _prevState: AchievementFormState,
  formData: FormData,
): Promise<AchievementFormState> {
  const parsed = achievementSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Data tidak valid.", values: extractFormValues(formData), submittedAt: Date.now() };
  }

  const max = await prisma.achievement.aggregate({ _max: { order: true } });
  await prisma.achievement.create({
    data: {
      title: parsed.data.title,
      issuer: parsed.data.issuer,
      date: parsed.data.date,
      url: parsed.data.url || null,
      description: parsed.data.description || null,
      order: (max._max.order ?? -1) + 1,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/achievements");
  redirect("/admin/achievements");
}

export async function updateAchievement(
  id: string,
  _prevState: AchievementFormState,
  formData: FormData,
): Promise<AchievementFormState> {
  const parsed = achievementSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Data tidak valid.", values: extractFormValues(formData), submittedAt: Date.now() };
  }

  await prisma.achievement.update({
    where: { id },
    data: {
      title: parsed.data.title,
      issuer: parsed.data.issuer,
      date: parsed.data.date,
      url: parsed.data.url || null,
      description: parsed.data.description || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/achievements");
  redirect("/admin/achievements");
}

export async function deleteAchievement(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.achievement.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/achievements");
}

export async function reorderAchievements(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.achievement.update({ where: { id }, data: { order: index } })),
  );
  revalidatePath("/");
  revalidatePath("/admin/achievements");
}
