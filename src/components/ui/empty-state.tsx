import { RegistrationMark } from "@/components/ui/registration-mark";
import { SpecLabel } from "@/components/ui/spec-label";
import { cn } from "@/lib/cn";

/**
 * The site's standard "nothing here" treatment — a spec-sheet frame
 * (four registration marks + a mono label), not a lone line of gray text.
 * Reused for empty listings and zero-result filters so both read as a
 * deliberate state, matching the placeholder box already used for a
 * missing blog cover image.
 */
export function EmptyState({
  label,
  message,
  className,
}: {
  label: string;
  message: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-20 text-center",
        className,
      )}
    >
      <RegistrationMark position="top-left" className="text-text-3" />
      <RegistrationMark position="top-right" className="text-text-3" />
      <RegistrationMark position="bottom-left" className="text-text-3" />
      <RegistrationMark position="bottom-right" className="text-text-3" />
      <SpecLabel>{label}</SpecLabel>
      <p className="max-w-[40ch] text-body text-text-2">{message}</p>
    </div>
  );
}
