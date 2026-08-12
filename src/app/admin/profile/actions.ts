"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { uploadToR2 } from "@/lib/r2";
import { isConnectionError, SAVE_UNAVAILABLE_MESSAGE } from "@/lib/db-retry";
import { syncProfile } from "@/lib/sync-replica";

const profileSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  eyebrow: z.string().min(1),
  headline: z.string().min(1),
  subhead: z.string().min(1),
  valueProposition: z.string().min(1),
  bio: z.string().min(1),
  email: z.string().email(),
  githubUrl: z.string().url(),
  linkedinUrl: z.string().url(),
  location: z.string().min(1),
  resumeUrl: z.string().min(1),
  showreelUrl: z.string().optional(),
  focusText: z.string().min(1),
  currentlyText: z.string().min(1),
  openToText: z.string().min(1),
});

export type ProfileFormState = { error?: string; success?: boolean };

export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const parsed = profileSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const bio = parsed.data.bio
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  let resumeUrl = parsed.data.resumeUrl;
  const resumeFile = formData.get("resume");
  if (resumeFile instanceof File && resumeFile.size > 0) {
    resumeUrl = await uploadToR2(resumeFile, "resume");
  }

  let showreelUrl: string | null = parsed.data.showreelUrl?.trim() || null;
  const showreelFile = formData.get("showreel");
  if (showreelFile instanceof File && showreelFile.size > 0) {
    showreelUrl = await uploadToR2(showreelFile, "showreel");
  }

  const data = { ...parsed.data, bio, resumeUrl, showreelUrl };

  let profile;
  try {
    const existing = await prisma.profile.findFirst();
    profile = existing
      ? await prisma.profile.update({ where: { id: existing.id }, data })
      : await prisma.profile.create({ data });
  } catch (error) {
    if (isConnectionError(error)) {
      return { error: SAVE_UNAVAILABLE_MESSAGE };
    }
    throw error;
  }

  await syncProfile(profile);

  revalidatePath("/");
  revalidatePath("/admin/profile");
  return { success: true };
}
