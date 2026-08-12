import type { Profile, SkillCategory, Project, ExperienceItem, Achievement, FaqItem, Post } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { prismaReplica } from "@/lib/prisma-replica";
import { describeError } from "@/lib/db-retry";

/**
 * Sync-on-write: after each successful create/update/delete/reorder on the
 * primary database, mirror the same change onto the read-only standby.
 * Every write is `upsert`ed by the row's own `id` (a cuid generated once
 * by Prisma at creation time, not a database auto-increment) — running the
 * same upsert any number of times converges to the same row, so this can
 * never produce duplicates.
 *
 * Deliberately best-effort: a failure here is logged, never thrown. The
 * primary write already succeeded — the standby lagging behind until the
 * next successful sync or a manual full resync is an acceptable trade,
 * whereas failing the admin's save because the *standby* had a hiccup
 * would not be.
 */
async function safeSync(label: string, fn: (client: NonNullable<typeof prismaReplica>) => Promise<unknown>) {
  if (!prismaReplica) return;
  try {
    await fn(prismaReplica);
  } catch (error) {
    console.warn(`[db] replica sync failed (${label}) — ${describeError(error)}`);
  }
}

export function syncProfile(row: Profile) {
  return safeSync("profile", (db) => db.profile.upsert({ where: { id: row.id }, create: row, update: row }));
}

export function syncSkillCategory(row: SkillCategory) {
  return safeSync("skillCategory", (db) =>
    db.skillCategory.upsert({ where: { id: row.id }, create: row, update: row }),
  );
}
export function deleteSkillCategory(id: string) {
  return safeSync("skillCategory delete", (db) => db.skillCategory.delete({ where: { id } }));
}
export function syncSkillCategoryOrder(orderedIds: string[]) {
  return safeSync("skillCategory reorder", (db) =>
    db.$transaction(orderedIds.map((id, i) => db.skillCategory.update({ where: { id }, data: { order: i } }))),
  );
}

export function syncProject(row: Project) {
  return safeSync("project", (db) => db.project.upsert({ where: { id: row.id }, create: row, update: row }));
}
export function deleteProject(id: string) {
  return safeSync("project delete", (db) => db.project.delete({ where: { id } }));
}
export function syncProjectOrder(orderedIds: string[]) {
  return safeSync("project reorder", (db) =>
    db.$transaction(orderedIds.map((id, i) => db.project.update({ where: { id }, data: { order: i } }))),
  );
}

export function syncExperienceItem(row: ExperienceItem) {
  return safeSync("experienceItem", (db) =>
    db.experienceItem.upsert({ where: { id: row.id }, create: row, update: row }),
  );
}
export function deleteExperienceItem(id: string) {
  return safeSync("experienceItem delete", (db) => db.experienceItem.delete({ where: { id } }));
}
export function syncExperienceItemOrder(orderedIds: string[]) {
  return safeSync("experienceItem reorder", (db) =>
    db.$transaction(orderedIds.map((id, i) => db.experienceItem.update({ where: { id }, data: { order: i } }))),
  );
}

export function syncAchievement(row: Achievement) {
  return safeSync("achievement", (db) => db.achievement.upsert({ where: { id: row.id }, create: row, update: row }));
}
export function deleteAchievement(id: string) {
  return safeSync("achievement delete", (db) => db.achievement.delete({ where: { id } }));
}
export function syncAchievementOrder(orderedIds: string[]) {
  return safeSync("achievement reorder", (db) =>
    db.$transaction(orderedIds.map((id, i) => db.achievement.update({ where: { id }, data: { order: i } }))),
  );
}

export function syncFaqItem(row: FaqItem) {
  return safeSync("faqItem", (db) => db.faqItem.upsert({ where: { id: row.id }, create: row, update: row }));
}
export function deleteFaqItem(id: string) {
  return safeSync("faqItem delete", (db) => db.faqItem.delete({ where: { id } }));
}
export function syncFaqItemOrder(orderedIds: string[]) {
  return safeSync("faqItem reorder", (db) =>
    db.$transaction(orderedIds.map((id, i) => db.faqItem.update({ where: { id }, data: { order: i } }))),
  );
}

export function syncPost(row: Post) {
  return safeSync("post", (db) => db.post.upsert({ where: { id: row.id }, create: row, update: row }));
}
export function deletePost(id: string) {
  return safeSync("post delete", (db) => db.post.delete({ where: { id } }));
}

export type ResyncResult = { error?: string; success?: boolean; summary?: string };

/**
 * Manual "sync now" — copies every current row from the primary onto the
 * standby (upsert, so re-running is always safe) and removes any standby
 * row whose id no longer exists on the primary, so deletions that happened
 * while the standby was unreachable don't linger forever.
 */
export async function fullResyncToReplica(): Promise<ResyncResult> {
  if (!prismaReplica) {
    return { error: "Belum ada penyimpanan cadangan yang dikonfigurasi." };
  }

  try {
    const [profile, skills, projects, experience, achievements, faqs, posts] = await Promise.all([
      prisma.profile.findFirst(),
      prisma.skillCategory.findMany(),
      prisma.project.findMany(),
      prisma.experienceItem.findMany(),
      prisma.achievement.findMany(),
      prisma.faqItem.findMany(),
      prisma.post.findMany(),
    ]);

    if (profile) {
      await prismaReplica.profile.upsert({ where: { id: profile.id }, create: profile, update: profile });
    }

    await reconcile(prismaReplica.skillCategory, skills);
    await reconcile(prismaReplica.project, projects);
    await reconcile(prismaReplica.experienceItem, experience);
    await reconcile(prismaReplica.achievement, achievements);
    await reconcile(prismaReplica.faqItem, faqs);
    await reconcile(prismaReplica.post, posts);

    const total = 1 + skills.length + projects.length + experience.length + achievements.length + faqs.length + posts.length;
    return { success: true, summary: `${total} data tersinkron.` };
  } catch (error) {
    console.warn(`[db] full resync failed — ${describeError(error)}`);
    return { error: "Sinkronisasi gagal. Coba lagi dalam beberapa menit." };
  }
}

type IdRow = { id: string };
type ReplicaDelegate<T extends IdRow> = {
  deleteMany: (args: Record<string, never>) => Promise<unknown>;
  createMany: (args: { data: T[] }) => Promise<unknown>;
};

/**
 * Wipe the table on the standby and recreate every row fresh from the
 * primary. Upsert-by-id + orphan cleanup was the first approach here, but
 * it silently assumes every row on the standby *matches its primary
 * counterpart by id* — which breaks if the standby ever picked up a row
 * through any path other than this sync code (e.g. the database was
 * seeded independently when it was first set up), leaving a row with a
 * different id but the same slug. Upsert-by-id then tries to *create* a
 * new row and collides with that leftover on the unique constraint,
 * exactly what happened with the `Project` table here. Deleting
 * everything first makes that class of bug structurally impossible: an
 * empty table can't collide with anything.
 */
async function reconcile<T extends IdRow>(delegate: ReplicaDelegate<T>, primaryRows: T[]) {
  await delegate.deleteMany({});
  if (primaryRows.length > 0) {
    await delegate.createMany({ data: primaryRows });
  }
}
