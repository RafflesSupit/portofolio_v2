import path from "node:path";
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Same schema, pointed at the standby database instead of the primary —
// used only to run migrations against it (`prisma migrate deploy --config
// prisma.replica.config.ts`). The app itself never reads this file; the
// runtime standby connection lives in src/lib/prisma-replica.ts.
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: env("DATABASE_URL_REPLICA"),
  },
});
