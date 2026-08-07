import { SectionHeader } from "@/components/ui/section-header";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import type { ProfileData, SkillGroup } from "@/lib/queries";

export function About({ profile, skills }: { profile: ProfileData; skills: SkillGroup[] }) {
  return (
    <section id="about" className="px-6 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeader label="About" heading="Backend-focused, systems-minded." />

        <Reveal>
          <p className="text-h3 mb-12 rounded-lg border border-accent-border bg-accent-bg p-6 text-ink md:p-8">
            {profile.valueProposition}
          </p>
        </Reveal>

        <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
          <Reveal className="space-y-5">
            {profile.bio.map((paragraph, i) => (
              <p key={i} className="text-body-lg text-text-2">
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-caption mb-5 text-text-3">Skills</p>
            <RevealGroup className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
              {skills.map((group) => (
                <RevealItem key={group.category}>
                  <h3 className="text-h4 mb-3 text-ink">{group.category}</h3>
                  <ul className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="text-caption rounded-full border border-border bg-surface px-2.5 py-1 text-text-2"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </RevealItem>
              ))}
            </RevealGroup>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
