import { cn } from "@/lib/cn";

/**
 * Mono "spec sheet" chip — e.g. `§ 01 / ABOUT`, `REV 2026.08` — the
 * documentation-style annotation that's the visual signature of this site's
 * "precision engineering" concept. Reserved for high-impact spots (Hero,
 * Intro, Footer); ordinary section headers keep the plainer `SectionLabel`.
 */
export function SpecLabel({
  index,
  children,
  inverse = false,
  className,
}: {
  /** Optional leading index, rendered as `§ 0N`. */
  index?: number;
  children: string;
  inverse?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em]",
        inverse ? "text-hero-text-2" : "text-text-3",
        className,
      )}
    >
      {index !== undefined ? (
        <span className="text-accent-ink">{`§ ${String(index).padStart(2, "0")}`}</span>
      ) : null}
      <span>{children}</span>
    </p>
  );
}
