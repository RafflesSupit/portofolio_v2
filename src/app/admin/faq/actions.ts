"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { extractFormValues } from "@/lib/form-values";
import { isConnectionError, SAVE_UNAVAILABLE_MESSAGE } from "@/lib/db-retry";
import { syncFaqItem, deleteFaqItem as deleteFaqItemFromReplica, syncFaqItemOrder } from "@/lib/sync-replica";

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export type FaqFormState = {
  error?: string;
  values?: Record<string, string>;
  submittedAt?: number;
};

export async function createFaqItem(
  _prevState: FaqFormState,
  formData: FormData,
): Promise<FaqFormState> {
  const parsed = faqSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Data tidak valid.", values: extractFormValues(formData), submittedAt: Date.now() };
  }

  let item;
  try {
    const max = await prisma.faqItem.aggregate({ _max: { order: true } });
    item = await prisma.faqItem.create({
      data: { question: parsed.data.question, answer: parsed.data.answer, order: (max._max.order ?? -1) + 1 },
    });
  } catch (error) {
    if (isConnectionError(error)) {
      return { error: SAVE_UNAVAILABLE_MESSAGE, values: extractFormValues(formData), submittedAt: Date.now() };
    }
    throw error;
  }

  await syncFaqItem(item);

  revalidatePath("/");
  revalidatePath("/admin/faq");
  redirect("/admin/faq");
}

export async function updateFaqItem(
  id: string,
  _prevState: FaqFormState,
  formData: FormData,
): Promise<FaqFormState> {
  const parsed = faqSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Data tidak valid.", values: extractFormValues(formData), submittedAt: Date.now() };
  }

  let item;
  try {
    item = await prisma.faqItem.update({
      where: { id },
      data: { question: parsed.data.question, answer: parsed.data.answer },
    });
  } catch (error) {
    if (isConnectionError(error)) {
      return { error: SAVE_UNAVAILABLE_MESSAGE, values: extractFormValues(formData), submittedAt: Date.now() };
    }
    throw error;
  }

  await syncFaqItem(item);

  revalidatePath("/");
  revalidatePath("/admin/faq");
  redirect("/admin/faq");
}

export async function deleteFaqItem(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.faqItem.delete({ where: { id } });
  await deleteFaqItemFromReplica(id);
  revalidatePath("/");
  revalidatePath("/admin/faq");
}

export async function reorderFaqItems(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.faqItem.update({ where: { id }, data: { order: index } })),
  );
  await syncFaqItemOrder(orderedIds);
  revalidatePath("/");
  revalidatePath("/admin/faq");
}
