import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProjectsList } from "./projects-list";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-h2 text-ink">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="rounded-md bg-ink px-4 py-2 text-body-sm font-medium text-bg"
        >
          + Tambah project
        </Link>
      </div>

      <div className="mt-6">
        {projects.length === 0 ? (
          <p className="text-body-sm text-text-2">Belum ada project.</p>
        ) : (
          <ProjectsList projects={projects} />
        )}
      </div>
    </div>
  );
}
