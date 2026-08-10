"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { uploadToR2 } from "@/lib/r2";
import { extractFormValues } from "@/lib/form-values";

const projectSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda -"),
  title: z.string().min(1),
  type: z.string().min(1),
  role: z.string().min(1),
  year: z.string().min(1),
  description: z.string().min(1),
  highlights: z.string().min(1),
  tags: z.string().min(1),
  href: z.string().url(),
  published: z.string().optional(),
  hasCaseStudy: z.string().optional(),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  result: z.string().optional(),
});

export type ProjectFormState = {
  error?: string;
  values?: Record<string, string>;
  submittedAt?: number;
};

function parseLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

async function resolveImageUrl(formData: FormData, currentImageUrl?: string): Promise<string> {
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    return uploadToR2(file, "projects");
  }
  if (currentImageUrl) return currentImageUrl;
  throw new Error("Gambar project wajib diisi.");
}

async function resolveGalleryUrls(formData: FormData, currentGallery: string[]): Promise<string[]> {
  const files = formData.getAll("gallery").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return currentGallery;
  return Promise.all(files.map((file) => uploadToR2(file, "projects/gallery")));
}

export async function createProject(
  _prevState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const parsed = projectSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Data tidak valid.",
      values: extractFormValues(formData),
      submittedAt: Date.now(),
    };
  }

  let imageUrl: string;
  let gallery: string[];
  try {
    imageUrl = await resolveImageUrl(formData);
    gallery = await resolveGalleryUrls(formData, []);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Upload gambar gagal.",
      values: extractFormValues(formData),
      submittedAt: Date.now(),
    };
  }

  const max = await prisma.project.aggregate({ _max: { order: true } });

  try {
    await prisma.project.create({
      data: {
        slug: parsed.data.slug,
        title: parsed.data.title,
        type: parsed.data.type,
        role: parsed.data.role,
        year: parsed.data.year,
        description: parsed.data.description,
        highlights: parseLines(parsed.data.highlights),
        tags: parseTags(parsed.data.tags),
        href: parsed.data.href,
        imageUrl,
        published: parsed.data.published === "on",
        hasCaseStudy: parsed.data.hasCaseStudy === "on",
        challenge: parsed.data.challenge || null,
        solution: parsed.data.solution || null,
        result: parsed.data.result || null,
        gallery,
        order: (max._max.order ?? -1) + 1,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        error: "Slug sudah dipakai project lain.",
        values: extractFormValues(formData),
        submittedAt: Date.now(),
      };
    }
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProject(
  id: string,
  _prevState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const parsed = projectSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Data tidak valid.",
      values: extractFormValues(formData),
      submittedAt: Date.now(),
    };
  }

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Project tidak ditemukan.", values: extractFormValues(formData), submittedAt: Date.now() };
  }

  let imageUrl: string;
  let gallery: string[];
  try {
    imageUrl = await resolveImageUrl(formData, existing.imageUrl);
    gallery = await resolveGalleryUrls(formData, existing.gallery);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Upload gambar gagal.",
      values: extractFormValues(formData),
      submittedAt: Date.now(),
    };
  }

  try {
    await prisma.project.update({
      where: { id },
      data: {
        slug: parsed.data.slug,
        title: parsed.data.title,
        type: parsed.data.type,
        role: parsed.data.role,
        year: parsed.data.year,
        description: parsed.data.description,
        highlights: parseLines(parsed.data.highlights),
        tags: parseTags(parsed.data.tags),
        href: parsed.data.href,
        imageUrl,
        published: parsed.data.published === "on",
        hasCaseStudy: parsed.data.hasCaseStudy === "on",
        challenge: parsed.data.challenge || null,
        solution: parsed.data.solution || null,
        result: parsed.data.result || null,
        gallery,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        error: "Slug sudah dipakai project lain.",
        values: extractFormValues(formData),
        submittedAt: Date.now(),
      };
    }
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function reorderProjects(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.project.update({ where: { id }, data: { order: index } })),
  );
  revalidatePath("/");
  revalidatePath("/admin/projects");
}
