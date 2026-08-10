import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SpecLabel } from "@/components/ui/spec-label";
import { RegistrationMark } from "@/components/ui/registration-mark";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Achievements } from "@/components/achievements";
import { HowIWork } from "@/components/how-i-work";
import { getProfile, getProjectCount, getSkills, getAchievements } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About - Raffles Supit",
  description: "The story behind the systems.",
};

export default async function AboutPage() {
  const [profile, projectCount, skills, achievements] = await Promise.all([
    getProfile(),
    getProjectCount(),
    getSkills(),
    getAchievements(),
  ]);

  return (
    <>
      <Nav profile={profile} projectCount={projectCount} />
      <main id="main-content" className="flex-1">
        <section className="relative px-6 pb-16 pt-28 md:px-8 md:pt-36">
          <RegistrationMark position="top-right" className="text-text-3" />
          <div className="mx-auto max-w-[1180px]">
            <SpecLabel index={1}>About</SpecLabel>
            <h1 className="text-display-l mt-4 max-w-[18ch] text-ink">The story behind the systems.</h1>
          </div>
        </section>

        <section className="px-6 pb-20 md:px-8 md:pb-28">
          <div className="mx-auto grid max-w-[1180px] gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
            <div className="mx-auto w-full max-w-[720px] space-y-6 md:mx-0">
              {profile.bio.map((paragraph, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <p className="text-body-lg text-text-2">{paragraph}</p>
                </Reveal>
              ))}
            </div>

            <div>
              <Reveal>
                <SpecLabel index={2} className="mb-5">
                  Skills
                </SpecLabel>
              </Reveal>
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
            </div>
          </div>
        </section>

        <Achievements items={achievements} />

        <HowIWork />
      </main>
      <Footer profile={profile} />
    </>
  );
}
