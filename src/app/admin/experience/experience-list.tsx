"use client";

import Link from "next/link";
import { SortableList } from "@/components/admin/sortable-list";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteExperienceItem, reorderExperienceItems } from "./actions";

type ExperienceListItem = {
  id: string;
  role: string;
  org: string;
  period: string;
};

export function ExperienceList({ items }: { items: ExperienceListItem[] }) {
  return (
    <SortableList
      items={items}
      onReorder={reorderExperienceItems}
      renderItem={(item) => (
        <div className="rounded-lg border border-border bg-bg p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-meta text-text-3">{item.period}</p>
              <h2 className="text-h4 text-ink">{item.role}</h2>
              <p className="text-body-sm text-accent-ink">{item.org}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-body-sm">
              <Link href={`/admin/experience/${item.id}/edit`} className="text-text-2 hover:text-ink">
                Edit
              </Link>
              <form action={deleteExperienceItem}>
                <input type="hidden" name="id" value={item.id} />
                <DeleteButton confirmMessage={`Hapus experience "${item.role}"?`} />
              </form>
            </div>
          </div>
        </div>
      )}
    />
  );
}
