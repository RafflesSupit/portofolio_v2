"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isRateLimited } from "@/lib/rate-limit";

const newsletterSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
});

export type NewsletterFormState = { error?: string; success?: boolean };

export async function subscribeToNewsletter(
  _prevState: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  // Honeypot: real users never see or fill this field; bots that fill every
  // input do. Pretend success so the bot doesn't learn to avoid it.
  if (String(formData.get("company") ?? "").length > 0) {
    return { success: true };
  }

  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(`newsletter:${ip}`)) {
    return { error: "Terlalu banyak percobaan. Coba lagi dalam beberapa menit." };
  }

  const parsed = newsletterSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Isi nama depan, nama belakang, dan email dengan benar." };
  }

  try {
    await prisma.newsletterSubscriber.create({ data: parsed.data });
  } catch (err) {
    // Unique email constraint — already subscribed. Treat as success so
    // resubmitting doesn't look like an error to the visitor.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { success: true };
    }
    throw err;
  }

  return { success: true };
}
