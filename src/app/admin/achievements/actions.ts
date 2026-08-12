"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { extractFormValues } from "@/lib/form-values";
import { isConnectionError, SAVE_UNAVAILABLE_MESSAGE } from "@/lib/db-retry";
import {
  syncAchievement,
  deleteAchievement as deleteAchievementFromReplica,
  syncAchievementOrder,
} from "@/lib/sync-replica";

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

  let achievement;
  try {
    const max = await prisma.achievement.aggregate({ _max: { order: true } });
    achievement = await prisma.achievement.create({
      data: {
        title: parsed.data.title,
        issuer: parsed.data.issuer,
        date: parsed.data.date,
        url: parsed.data.url || null,
        description: parsed.data.description || null,
        order: (max._max.order ?? -1) + 1,
      },
    });
  } catch (error) {
    if (isConnectionError(error)) {
      return { error: SAVE_UNAVAILABLE_MESSAGE, values: extractFormValues(formData), submittedAt: Date.now() };
    }
    throw error;
  }

  await syncAchievement(achievement);

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

  let achievement;
  try {
    achievement = await prisma.achievement.update({
      where: { id },
      data: {
        title: parsed.data.title,
        issuer: parsed.data.issuer,
        date: parsed.data.date,
        url: parsed.data.url || null,
        description: parsed.data.description || null,
      },
    });
  } catch (error) {
    if (isConnectionError(error)) {
      return { error: SAVE_UNAVAILABLE_MESSAGE, values: extractFormValues(formData), submittedAt: Date.now() };
    }
    throw error;
  }

  await syncAchievement(achievement);

  revalidatePath("/");
  revalidatePath("/admin/achievements");
  redirect("/admin/achievements");
}

export async function deleteAchievement(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.achievement.delete({ where: { id } });
  await deleteAchievementFromReplica(id);
  revalidatePath("/");
  revalidatePath("/admin/achievements");
}

export async function reorderAchievements(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.achievement.update({ where: { id }, data: { order: index } })),
  );
  await syncAchievementOrder(orderedIds);
  revalidatePath("/");
  revalidatePath("/admin/achievements");
}
