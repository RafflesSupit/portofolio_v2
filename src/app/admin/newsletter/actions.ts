"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function deleteSubscriber(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.newsletterSubscriber.delete({ where: { id } });
  revalidatePath("/admin/newsletter");
}
