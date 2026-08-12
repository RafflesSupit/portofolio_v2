import { Prisma } from "@prisma/client";
import { prismaReplica } from "@/lib/prisma-replica";

/** Shown to admins instead of a technical error when a write can't reach the primary store at all. */
export const SAVE_UNAVAILABLE_MESSAGE = "Gagal menyimpan perubahan. Coba lagi dalam beberapa menit.";

/**
 * True for the transient "connection dropped" failures Neon's serverless
 * pool produces when an idle connection gets closed server-side (P1017),
 * or when the client can't establish a connection at all. Both resolve on
 * a fresh attempt most of the time — they are not the same thing as the
 * primary database being genuinely down.
 */
export function isConnectionError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === "P1017" || error.code === "P1001" || error.code === "P1002";
  }
  return error instanceof Prisma.PrismaClientInitializationError;
}

/**
 * Retries a query once, after a short delay, if it fails with a transient
 * connection error — covers the common case (an idle pooled connection
 * getting closed) without masking a genuine, sustained outage: a second
 * failure is left to propagate to the caller.
 */
export async function withPrimaryRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (!isConnectionError(error)) throw error;
    await new Promise((resolve) => setTimeout(resolve, 300));
    return fn();
  }
}

/**
 * A single page load can trigger a handful of these (profile, project
 * count, skills, achievements, ...), and passing a raw Error to
 * console.error makes Next's dev overlay paste in a full stack trace and
 * source code frame for each one — reads as a wall of crashes even though
 * every one of them was already handled. Prisma's own dev-mode error
 * *messages* make this worse: they can embed a source code frame directly
 * in `.message` (not something Next adds afterward), so flattening
 * whitespace alone still produces one very long line. The actual reason
 * ("Can't reach database server at ...") is reliably the last non-blank
 * line, so pull just that instead of the whole message.
 */
export function describeError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const lines = message.split("\n").map((line) => line.trim()).filter(Boolean);
  const reason = lines[lines.length - 1] ?? message;
  const code = error instanceof Prisma.PrismaClientKnownRequestError ? `${error.code} — ` : "";
  return `${code}${reason}`;
}

/**
 * Read helper shared by every place that talks to the primary for a read:
 * retry once (covers transient drops), then fall back to the read-only
 * standby if one is configured, then — if given — a last-resort default
 * instead of crashing the page. Used by the public queries (queries.ts) and
 * by admin list/edit pages and the sitemap, which read the primary directly
 * (including drafts, so they can't reuse the public-only queries).
 *
 * `fallback` is opt-in per call site: a value with no sensible empty form
 * (the Profile singleton) should keep failing loudly instead of rendering
 * placeholder content pretending to be real data.
 */
export async function withFallback<T>(primary: () => Promise<T>, replica: () => Promise<T>, fallback?: T): Promise<T> {
  try {
    return await withPrimaryRetry(primary);
  } catch (primaryError) {
    if (!prismaReplica) throw primaryError;
    console.warn(`[db] primary unreachable, reading from standby — ${describeError(primaryError)}`);
    try {
      return await replica();
    } catch (replicaError) {
      console.warn(`[db] standby also unreachable — ${describeError(replicaError)}`);
      if (fallback !== undefined) return fallback;
      throw replicaError;
    }
  }
}
