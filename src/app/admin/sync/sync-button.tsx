"use client";

import { useState, useTransition } from "react";
import { triggerFullResync } from "./actions";
import type { ResyncResult } from "@/lib/sync-replica";

export function SyncButton() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ResyncResult | null>(null);

  function handleClick() {
    setResult(null);
    startTransition(async () => {
      setResult(await triggerFullResync());
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="rounded-md bg-ink px-5 py-2.5 text-body-sm font-medium text-bg disabled:opacity-60"
      >
        {isPending ? "Menyinkronkan..." : "Sync sekarang"}
      </button>

      {result?.success ? (
        <p className="mt-3 text-body-sm text-green-600" role="status">
          Berhasil. {result.summary}
        </p>
      ) : null}
      {result?.error ? (
        <p className="mt-3 text-body-sm text-red-600" role="alert">
          {result.error}
        </p>
      ) : null}
    </div>
  );
}
