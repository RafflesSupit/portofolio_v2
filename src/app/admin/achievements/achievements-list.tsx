"use client";

import Link from "next/link";
import { SortableList } from "@/components/admin/sortable-list";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteAchievement, reorderAchievements } from "./actions";

type AchievementListItem = {
  id: string;
  title: string;
  issuer: string;
  date: string;
};

export function AchievementsList({ items }: { items: AchievementListItem[] }) {
  return (
    <SortableList
      items={items}
      onReorder={reorderAchievements}
      renderItem={(item) => (
        <div className="rounded-lg border border-border bg-bg p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-meta text-text-3">{item.date}</p>
              <h2 className="text-h4 text-ink">{item.title}</h2>
              <p className="text-body-sm text-accent-ink">{item.issuer}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-body-sm">
              <Link href={`/admin/achievements/${item.id}/edit`} className="text-text-2 hover:text-ink">
                Edit
              </Link>
              <form action={deleteAchievement}>
                <input type="hidden" name="id" value={item.id} />
                <DeleteButton confirmMessage={`Hapus achievement "${item.title}"?`} />
              </form>
            </div>
          </div>
        </div>
      )}
    />
  );
}
