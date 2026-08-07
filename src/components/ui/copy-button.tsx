"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Status = "idle" | "copying" | "success" | "error";

export function CopyButton({
  value,
  label = "Copy",
  successLabel = "Copied!",
  errorLabel = "Couldn't copy",
  className,
}: {
  value: string;
  label?: string;
  successLabel?: string;
  errorLabel?: string;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleCopy() {
    if (status === "copying") return;
    setStatus("copying");
    try {
      if (!navigator.clipboard) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(value);
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setStatus("idle"), 2000);
    }
  }

  const displayLabel = status === "success" ? successLabel : status === "error" ? errorLabel : label;

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={status === "copying"}
      aria-label={`${label}: ${value}`}
      className={cn(
        "tap-target inline-flex items-center gap-2 text-body-sm font-medium transition-colors",
        status === "error" ? "text-error-text" : "text-text-2 hover:text-ink",
        className,
      )}
    >
      <CopyIcon status={status} />
      <span aria-live="polite" className="min-w-0">
        {displayLabel}
      </span>
    </button>
  );
}

function CopyIcon({ status }: { status: Status }) {
  if (status === "success") {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
