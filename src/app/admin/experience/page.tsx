import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ExperienceList } from "./experience-list";

export default async function AdminExperiencePage() {
  const items = await prisma.experienceItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-h2 text-ink">Experience</h1>
        <Link
          href="/admin/experience/new"
          className="rounded-md bg-ink px-4 py-2 text-body-sm font-medium text-bg"
        >
          + Tambah experience
        </Link>
      </div>

      <div className="mt-6">
        {items.length === 0 ? (
          <p className="text-body-sm text-text-2">Belum ada experience.</p>
        ) : (
          <ExperienceList items={items} />
        )}
      </div>
    </div>
  );
}
