import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { BlogArticle } from "@/components/blog-article";
import { getProfile, getPostBySlug, getPublishedPosts, getProjectCount } from "@/lib/queries";
import { estimateReadingTime } from "@/lib/reading-time";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [profile, post, projectCount, allPosts] = await Promise.all([
    getProfile(),
    getPostBySlug(slug),
    getProjectCount(),
    getPublishedPosts(),
  ]);

  if (!post) notFound();

  const readingMinutes = estimateReadingTime(post.content);
  const index = allPosts.findIndex((p) => p.slug === post.slug);
  // allPosts is sorted newest-first: the next index is the older post, the
  // previous index is the newer one.
  const prevPost = index >= 0 && index < allPosts.length - 1 ? allPosts[index + 1] : null;
  const nextPost = index > 0 ? allPosts[index - 1] : null;

  return (
    <>
      <Nav profile={profile} projectCount={projectCount} />
      <main id="main-content" className="flex-1">
        <BlogArticle
          post={post}
          readingMinutes={readingMinutes}
          authorName={profile.name}
          prevPost={prevPost}
          nextPost={nextPost}
        />
      </main>
      <Footer profile={profile} />
    </>
  );
}
