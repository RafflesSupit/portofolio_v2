import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prismaReplicaGlobal: PrismaClient | null | undefined;
}

function createReplicaClient(): PrismaClient | null {
  const url = process.env.DATABASE_URL_REPLICA;
  if (!url) return null;
  const adapter = new PrismaPg(url, { schema: "portfolio" });
  return new PrismaClient({ adapter });
}

// Secondary, read-only standby database. `null` until DATABASE_URL_REPLICA
// is configured — callers must treat that as "no replica available" rather
// than crash, same as the pattern used for `resend` in lib/resend.ts.
export const prismaReplica = globalThis.prismaReplicaGlobal ?? createReplicaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaReplicaGlobal = prismaReplica;
}
