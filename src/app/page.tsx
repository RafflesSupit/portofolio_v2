import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Intro } from "@/components/intro";
import { Journey } from "@/components/journey";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Faq } from "@/components/faq";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { getProfile, getProjects, getExperienceItems, getFaqItems } from "@/lib/queries";

export const dynamic = "force-dynamic";

const siteUrl = "https://rafflessupit.dev";

export default async function Home() {
  const [profile, projects, experience, faqItems] = await Promise.all([
    getProfile(),
    getProjects(),
    getExperienceItems(),
    getFaqItems(),
  ]);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    url: siteUrl,
    email: profile.email,
    sameAs: [profile.socials.github, profile.socials.linkedin],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Nav profile={profile} projectCount={projects.length} />
      <main id="main-content" className="flex-1">
        <Hero profile={profile} />
        <Intro profile={profile} />
        <Projects projects={projects} />
        <Journey />
        <Experience items={experience} />
        <Faq items={faqItems} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
