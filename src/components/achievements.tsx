import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import type { AchievementData } from "@/lib/queries";

export function Achievements({ items }: { items: AchievementData[] }) {
  if (items.length === 0) return null;

  return (
    <section id="achievements" className="border-t border-border px-6 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeader
          label="Achievements"
          heading="Recognition along the way."
          description="Certifications and milestones that back up the work above."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05} className="h-full">
              <div className="group h-full rounded-lg border border-border bg-surface p-6 shadow-[var(--shadow-rest)] transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--shadow-soft)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-bg text-accent-ink">
                  <AwardIcon />
                </div>
                <p className="mt-5 text-meta text-text-3">{item.date}</p>
                <h3 className="mt-1.5 text-h4 text-ink">
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-colors duration-150 group-hover:text-accent-ink"
                    >
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </h3>
                <p className="mt-1 text-body-sm font-medium text-accent-ink">{item.issuer}</p>
                {item.description ? (
                  <p className="mt-3 text-body-sm text-text-2">{item.description}</p>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AwardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M9 13.5 7 21l5-2.5 5 2.5-2-7.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
