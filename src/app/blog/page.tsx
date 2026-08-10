import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SpecLabel } from "@/components/ui/spec-label";
import { RegistrationMark } from "@/components/ui/registration-mark";
import { BlogExplorer } from "@/components/blog-explorer";
import { getProfile, getPublishedPosts, getProjectCount } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog - Raffles Supit",
  description: "Articles, tutorials, and engineering notes.",
};

export default async function BlogIndexPage() {
  const [profile, posts, projectCount] = await Promise.all([
    getProfile(),
    getPublishedPosts(),
    getProjectCount(),
  ]);

  return (
    <>
      <Nav profile={profile} projectCount={projectCount} />
      <main id="main-content" className="relative flex-1 px-6 pb-20 pt-28 md:px-8 md:pt-36">
        <RegistrationMark position="top-right" className="text-text-3" />
        <div className="mx-auto max-w-[1180px]">
          <SpecLabel index={1}>Blog</SpecLabel>
          <h1 className="text-display-l mt-4 max-w-[20ch] text-ink">Notes on building backend systems.</h1>

          {posts.length === 0 ? (
            <p className="mt-10 text-body text-text-2">No posts yet — check back soon.</p>
          ) : (
            <div className="mt-12">
              <BlogExplorer posts={posts} />
            </div>
          )}
        </div>
      </main>
      <Footer profile={profile} />
    </>
  );
}
