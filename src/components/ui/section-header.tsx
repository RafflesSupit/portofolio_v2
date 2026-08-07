import { SectionLabel } from "@/components/ui/section-label";

export function SectionHeader({
  label,
  heading,
  description,
}: {
  label: string;
  heading: string;
  description?: string;
}) {
  return (
    <div className="mb-12 grid gap-4 md:grid-cols-[200px_1fr] md:gap-10">
      <SectionLabel>{label}</SectionLabel>
      <div>
        <h2 className="text-h2 text-ink">{heading}</h2>
        {description ? (
          <p className="mt-3 max-w-[60ch] text-body text-text-2">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
