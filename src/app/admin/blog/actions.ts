"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { uploadToR2 } from "@/lib/r2";
import { extractFormValues } from "@/lib/form-values";
import { notifySubscribersOfNewPost } from "@/lib/newsletter-broadcast";
import { isConnectionError, SAVE_UNAVAILABLE_MESSAGE } from "@/lib/db-retry";
import { syncPost, deletePost as deletePostFromReplica } from "@/lib/sync-replica";

const postSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda -"),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  tags: z.string().optional(),
  published: z.string().optional(),
});

export type PostFormState = {
  error?: string;
  values?: Record<string, string>;
  submittedAt?: number;
};

function parseTags(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

async function resolveCoverImageUrl(
  formData: FormData,
  current?: string | null,
): Promise<string | null> {
  const file = formData.get("coverImage");
  if (file instanceof File && file.size > 0) {
    return uploadToR2(file, "blog");
  }
  return current ?? null;
}

export async function createPost(
  _prevState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const parsed = postSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Data tidak valid.",
      values: extractFormValues(formData),
      submittedAt: Date.now(),
    };
  }

  const coverImageUrl = await resolveCoverImageUrl(formData);
  const published = parsed.data.published === "on";

  let post;
  try {
    post = await prisma.post.create({
      data: {
        slug: parsed.data.slug,
        title: parsed.data.title,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        tags: parseTags(parsed.data.tags),
        coverImageUrl,
        published,
        publishedAt: published ? new Date() : null,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        error: "Slug sudah dipakai post lain.",
        values: extractFormValues(formData),
        submittedAt: Date.now(),
      };
    }
    if (isConnectionError(error)) {
      return { error: SAVE_UNAVAILABLE_MESSAGE, values: extractFormValues(formData), submittedAt: Date.now() };
    }
    throw error;
  }

  await syncPost(post);

  if (published) {
    await notifySubscribersOfNewPost({
      slug: parsed.data.slug,
      title: parsed.data.title,
      excerpt: parsed.data.excerpt,
    });
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updatePost(
  id: string,
  _prevState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const parsed = postSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Data tidak valid.",
      values: extractFormValues(formData),
      submittedAt: Date.now(),
    };
  }

  let existing;
  try {
    existing = await prisma.post.findUnique({ where: { id } });
  } catch (error) {
    if (isConnectionError(error)) {
      return { error: SAVE_UNAVAILABLE_MESSAGE, values: extractFormValues(formData), submittedAt: Date.now() };
    }
    throw error;
  }
  if (!existing) {
    return { error: "Post tidak ditemukan.", values: extractFormValues(formData), submittedAt: Date.now() };
  }

  const coverImageUrl = await resolveCoverImageUrl(formData, existing.coverImageUrl);
  const published = parsed.data.published === "on";
  const publishedAt = published ? (existing.publishedAt ?? new Date()) : existing.publishedAt;

  let post;
  try {
    post = await prisma.post.update({
      where: { id },
      data: {
        slug: parsed.data.slug,
        title: parsed.data.title,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        tags: parseTags(parsed.data.tags),
        coverImageUrl,
        published,
        publishedAt,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        error: "Slug sudah dipakai post lain.",
        values: extractFormValues(formData),
        submittedAt: Date.now(),
      };
    }
    if (isConnectionError(error)) {
      return { error: SAVE_UNAVAILABLE_MESSAGE, values: extractFormValues(formData), submittedAt: Date.now() };
    }
    throw error;
  }

  await syncPost(post);

  // Only broadcast on the transition into "published" — re-saving an
  // already-published post (typo fix, etc.) shouldn't re-notify everyone.
  if (published && !existing.published) {
    await notifySubscribersOfNewPost({
      slug: parsed.data.slug,
      title: parsed.data.title,
      excerpt: parsed.data.excerpt,
    });
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.data.slug}`);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deletePost(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.post.delete({ where: { id } });
  await deletePostFromReplica(id);
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}
