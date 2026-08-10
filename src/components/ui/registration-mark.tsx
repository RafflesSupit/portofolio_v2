import { cn } from "@/lib/cn";

const POSITION = {
  "top-left": "left-4 top-4 md:left-6 md:top-6",
  "top-right": "right-4 top-4 md:right-6 md:top-6",
  "bottom-left": "left-4 bottom-4 md:left-6 md:bottom-6",
  "bottom-right": "right-4 bottom-4 md:right-6 md:bottom-6",
} as const;

/**
 * Corner crosshair — a technical-drawing/registration-mark motif, purely
 * decorative. Part of the "precision engineering" spec-sheet visual system.
 */
export function RegistrationMark({
  position,
  className,
}: {
  position: keyof typeof POSITION;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className={cn("absolute z-10 text-current opacity-40", POSITION[position], className)}
    >
      <path d="M9 0v6M9 12v6M0 9h6M12 9h6" stroke="currentColor" strokeWidth="1" />
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
