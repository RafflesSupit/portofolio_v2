"use client";

import Link from "next/link";
import { SortableList } from "@/components/admin/sortable-list";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteSkillCategory, reorderSkillCategories } from "./actions";

type SkillCategoryItem = {
  id: string;
  category: string;
  items: string[];
};

export function SkillsList({ categories }: { categories: SkillCategoryItem[] }) {
  return (
    <SortableList
      items={categories}
      onReorder={reorderSkillCategories}
      renderItem={(cat) => (
        <div className="rounded-lg border border-border bg-bg p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-h4 text-ink">{cat.category}</h2>
              <p className="mt-1 text-body-sm text-text-2">{cat.items.join(", ")}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-body-sm">
              <Link href={`/admin/skills/${cat.id}/edit`} className="text-text-2 hover:text-ink">
                Edit
              </Link>
              <form action={deleteSkillCategory}>
                <input type="hidden" name="id" value={cat.id} />
                <DeleteButton confirmMessage={`Hapus kategori "${cat.category}"?`} />
              </form>
            </div>
          </div>
        </div>
      )}
    />
  );
}
