import { cn } from "@/lib/cn";

export function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "text-caption rounded-full border px-3 py-1.5 transition-colors",
        active
          ? "border-ink bg-ink text-bg"
          : "border-border text-text-2 hover:border-border-strong hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
