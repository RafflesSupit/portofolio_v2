"use client";

import Link from "next/link";
import { SortableList } from "@/components/admin/sortable-list";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProject, reorderProjects } from "./actions";

type ProjectListItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  published: boolean;
};

export function ProjectsList({ projects }: { projects: ProjectListItem[] }) {
  return (
    <SortableList
      items={projects}
      onReorder={reorderProjects}
      renderItem={(project) => (
        <div className="flex items-center gap-4 rounded-lg border border-border bg-bg p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.imageUrl} alt="" className="h-16 w-16 shrink-0 rounded-md object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-h4 text-ink">{project.title}</h2>
              {!project.published ? (
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-caption text-text-3">Draft</span>
              ) : null}
            </div>
            <p className="mt-1 truncate text-body-sm text-text-2">{project.description}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-body-sm">
            <Link href={`/admin/projects/${project.id}/edit`} className="text-text-2 hover:text-ink">
              Edit
            </Link>
            <form action={deleteProject}>
              <input type="hidden" name="id" value={project.id} />
              <DeleteButton confirmMessage={`Hapus project "${project.title}"?`} />
            </form>
          </div>
        </div>
      )}
    />
  );
}
