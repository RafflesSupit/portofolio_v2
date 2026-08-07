"use client";

import Link from "next/link";
import { SortableList } from "@/components/admin/sortable-list";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteFaqItem, reorderFaqItems } from "./actions";

type FaqListItem = {
  id: string;
  question: string;
  answer: string;
};

export function FaqList({ items }: { items: FaqListItem[] }) {
  return (
    <SortableList
      items={items}
      onReorder={reorderFaqItems}
      renderItem={(item) => (
        <div className="rounded-lg border border-border bg-bg p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-h4 text-ink">{item.question}</h2>
              <p className="mt-1 text-body-sm text-text-2">{item.answer}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-body-sm">
              <Link href={`/admin/faq/${item.id}/edit`} className="text-text-2 hover:text-ink">
                Edit
              </Link>
              <form action={deleteFaqItem}>
                <input type="hidden" name="id" value={item.id} />
                <DeleteButton confirmMessage={`Hapus FAQ "${item.question}"?`} />
              </form>
            </div>
          </div>
        </div>
      )}
    />
  );
}
