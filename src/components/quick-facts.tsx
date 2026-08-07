import type { ProfileData } from "@/lib/queries";

export function QuickFacts({ profile }: { profile: ProfileData }) {
  const facts = [
    { label: "Focus", value: profile.quickFacts.focus },
    { label: "Currently", value: profile.quickFacts.currently },
    { label: "Based in", value: profile.quickFacts.basedIn },
    { label: "Open to", value: profile.quickFacts.openTo },
  ];

  return (
    <div className="border-b border-border bg-surface-2 px-6 py-5 md:px-8">
      <dl className="mx-auto flex max-w-[1180px] flex-wrap gap-x-8 gap-y-3">
        {facts.map((fact) => (
          <div key={fact.label} className="flex items-baseline gap-2">
            <dt className="text-meta text-text-3">{fact.label}</dt>
            <dd className="text-body-sm text-text-2">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
