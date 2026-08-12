"use server";

import { fullResyncToReplica, type ResyncResult } from "@/lib/sync-replica";

export async function triggerFullResync(): Promise<ResyncResult> {
  return fullResyncToReplica();
}
