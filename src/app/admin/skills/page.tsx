import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SkillsList } from "./skills-list";

export default async function AdminSkillsPage() {
  const categories = await prisma.skillCategory.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-h2 text-ink">Skills</h1>
        <Link
          href="/admin/skills/new"
          className="rounded-md bg-ink px-4 py-2 text-body-sm font-medium text-bg"
        >
          + Tambah kategori
        </Link>
      </div>

      <div className="mt-6">
        {categories.length === 0 ? (
          <p className="text-body-sm text-text-2">Belum ada kategori skill.</p>
        ) : (
          <SkillsList categories={categories} />
        )}
      </div>
    </div>
  );
}
