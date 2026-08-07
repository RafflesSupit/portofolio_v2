import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

function createPrismaClient() {
  // Neon database is shared with other projects; all portfolio tables live in
  // their own "portfolio" schema so they never collide with pre-existing ones.
  const adapter = new PrismaPg(process.env.DATABASE_URL!, { schema: "portfolio" });
  return new PrismaClient({ adapter });
}

export const prisma = globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
