import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { QuickFacts } from "@/components/quick-facts";
import { About } from "@/components/about";
import { Experience } from "@/components/experience";
import { Achievements } from "@/components/achievements";
import { Projects } from "@/components/projects";
import { LatestPosts } from "@/components/latest-posts";
import { Faq } from "@/components/faq";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import {
  getProfile,
  getSkills,
  getProjects,
  getExperienceItems,
  getAchievements,
  getFaqItems,
  getPublishedPosts,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

const siteUrl = "https://rafflessupit.dev";

export default async function Home() {
  const [profile, skills, projects, experience, achievements, faqItems, posts] = await Promise.all([
    getProfile(),
    getSkills(),
    getProjects(),
    getExperienceItems(),
    getAchievements(),
    getFaqItems(),
    getPublishedPosts(3),
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
      <Nav profile={profile} />
      <main id="main-content" className="flex-1">
        <Hero profile={profile} />
        <QuickFacts profile={profile} />
        <About profile={profile} skills={skills} />
        <Experience items={experience} />
        <Projects projects={projects} />
        <Achievements items={achievements} />
        <LatestPosts posts={posts} />
        <Faq items={faqItems} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
