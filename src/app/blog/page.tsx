import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SectionLabel } from "@/components/ui/section-label";
import { getProfile, getPublishedPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog - Raffles Supit",
  description: "Articles, tutorials, and engineering notes.",
};

export default async function BlogIndexPage() {
  const [profile, posts] = await Promise.all([getProfile(), getPublishedPosts()]);

  return (
    <>
      <Nav profile={profile} />
      <main id="main-content" className="flex-1 px-6 pb-20 pt-28 md:px-8 md:pt-36">
        <div className="mx-auto max-w-[1180px]">
          <SectionLabel>Blog</SectionLabel>
          <h1 className="text-display-l mt-4 text-ink">Notes on building backend systems.</h1>

          {posts.length === 0 ? (
            <p className="mt-10 text-body text-text-2">Belum ada tulisan. Cek lagi nanti.</p>
          ) : (
            <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block" data-cursor-hover>
                  {post.coverImageUrl ? (
                    <div className="relative aspect-video overflow-hidden rounded-lg border border-border">
                      <Image
                        src={post.coverImageUrl}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                      />
                    </div>
                  ) : null}
                  <p className="mt-4 text-meta text-text-3">
                    {post.publishedAt?.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <h2 className="mt-2 text-h3 text-ink transition-colors duration-150 group-hover:text-accent-ink">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-body-sm text-text-2">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer profile={profile} />
    </>
  );
}
