import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { prismaReplica } from "@/lib/prisma-replica";
import { withFallback } from "@/lib/db-retry";
import { AchievementsList } from "./achievements-list";

export default async function AdminAchievementsPage() {
  const items = await withFallback(
    () => prisma.achievement.findMany({ orderBy: { order: "asc" } }),
    () => prismaReplica!.achievement.findMany({ orderBy: { order: "asc" } }),
    [],
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-h2 text-ink">Achievements</h1>
        <Link
          href="/admin/achievements/new"
          className="rounded-md bg-ink px-4 py-2 text-body-sm font-medium text-bg"
        >
          + Tambah achievement
        </Link>
      </div>

      <div className="mt-6">
        {items.length === 0 ? (
          <p className="text-body-sm text-text-2">Belum ada achievement.</p>
        ) : (
          <AchievementsList items={items} />
        )}
      </div>
    </div>
  );
}
