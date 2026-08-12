import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { prismaReplica } from "@/lib/prisma-replica";
import { withFallback } from "@/lib/db-retry";
import { FaqList } from "./faq-list";

export default async function AdminFaqPage() {
  const items = await withFallback(
    () => prisma.faqItem.findMany({ orderBy: { order: "asc" } }),
    () => prismaReplica!.faqItem.findMany({ orderBy: { order: "asc" } }),
    [],
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-h2 text-ink">FAQ</h1>
        <Link href="/admin/faq/new" className="rounded-md bg-ink px-4 py-2 text-body-sm font-medium text-bg">
          + Tambah FAQ
        </Link>
      </div>

      <div className="mt-6">
        {items.length === 0 ? (
          <p className="text-body-sm text-text-2">Belum ada FAQ.</p>
        ) : (
          <FaqList items={items} />
        )}
      </div>
    </div>
  );
}
