"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { extractFormValues } from "@/lib/form-values";
import { isConnectionError, SAVE_UNAVAILABLE_MESSAGE } from "@/lib/db-retry";
import {
  syncExperienceItem,
  deleteExperienceItem as deleteExperienceItemFromReplica,
  syncExperienceItemOrder,
} from "@/lib/sync-replica";

const experienceSchema = z.object({
  role: z.string().min(1),
  org: z.string().min(1),
  period: z.string().min(1),
  points: z.string().min(1),
});

export type ExperienceFormState = {
  error?: string;
  values?: Record<string, string>;
  submittedAt?: number;
};

function parsePoints(points: string) {
  return points
    .split("\n")
    .map((point) => point.trim())
    .filter(Boolean);
}

export async function createExperienceItem(
  _prevState: ExperienceFormState,
  formData: FormData,
): Promise<ExperienceFormState> {
  const parsed = experienceSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Data tidak valid.", values: extractFormValues(formData), submittedAt: Date.now() };
  }

  let item;
  try {
    const max = await prisma.experienceItem.aggregate({ _max: { order: true } });
    item = await prisma.experienceItem.create({
      data: {
        role: parsed.data.role,
        org: parsed.data.org,
        period: parsed.data.period,
        points: parsePoints(parsed.data.points),
        order: (max._max.order ?? -1) + 1,
      },
    });
  } catch (error) {
    if (isConnectionError(error)) {
      return { error: SAVE_UNAVAILABLE_MESSAGE, values: extractFormValues(formData), submittedAt: Date.now() };
    }
    throw error;
  }

  await syncExperienceItem(item);

  revalidatePath("/");
  revalidatePath("/admin/experience");
  redirect("/admin/experience");
}

export async function updateExperienceItem(
  id: string,
  _prevState: ExperienceFormState,
  formData: FormData,
): Promise<ExperienceFormState> {
  const parsed = experienceSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Data tidak valid.", values: extractFormValues(formData), submittedAt: Date.now() };
  }

  let item;
  try {
    item = await prisma.experienceItem.update({
      where: { id },
      data: {
        role: parsed.data.role,
        org: parsed.data.org,
        period: parsed.data.period,
        points: parsePoints(parsed.data.points),
      },
    });
  } catch (error) {
    if (isConnectionError(error)) {
      return { error: SAVE_UNAVAILABLE_MESSAGE, values: extractFormValues(formData), submittedAt: Date.now() };
    }
    throw error;
  }

  await syncExperienceItem(item);

  revalidatePath("/");
  revalidatePath("/admin/experience");
  redirect("/admin/experience");
}

export async function deleteExperienceItem(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.experienceItem.delete({ where: { id } });
  await deleteExperienceItemFromReplica(id);
  revalidatePath("/");
  revalidatePath("/admin/experience");
}

export async function reorderExperienceItems(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.experienceItem.update({ where: { id }, data: { order: index } })),
  );
  await syncExperienceItemOrder(orderedIds);
  revalidatePath("/");
  revalidatePath("/admin/experience");
}
