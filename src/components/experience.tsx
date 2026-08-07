import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import type { ExperienceData } from "@/lib/queries";

export function Experience({ items }: { items: ExperienceData[] }) {
  return (
    <section id="experience" className="border-t border-border px-6 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeader
          label="Experience"
          heading="Where I've put this to work."
          description="Internship, teaching, and event work that shaped how I build and explain systems."
        />

        <div className="divide-y divide-border border-t border-border">
          {items.map((role, i) => (
            <Reveal key={role.org} delay={i * 0.05}>
              <div className="grid gap-3 py-8 md:grid-cols-[160px_1fr] md:gap-8">
                <p className="text-meta text-text-3">{role.period}</p>
                <div>
                  <h3 className="text-h3 text-ink">{role.role}</h3>
                  <p className="mt-1 text-body-sm font-medium text-accent-ink">{role.org}</p>
                  <ul className="mt-4 space-y-2.5">
                    {role.points.map((point, j) => (
                      <li
                        key={j}
                        className="flex gap-3 text-body-sm text-text-2"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-border-strong" aria-hidden="true" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
