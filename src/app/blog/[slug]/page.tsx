import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SectionLabel } from "@/components/ui/section-label";
import { getProfile, getPostBySlug } from "@/lib/queries";

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
  const [profile, post] = await Promise.all([getProfile(), getPostBySlug(slug)]);

  if (!post) notFound();

  return (
    <>
      <Nav profile={profile} />
      <main id="main-content" className="flex-1 px-6 pb-20 pt-28 md:px-8 md:pt-36">
        <article className="mx-auto max-w-[768px]">
          <SectionLabel>
            {post.publishedAt?.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }) ?? ""}
          </SectionLabel>
          <h1 className="text-display-l mt-4 text-ink">{post.title}</h1>

          {post.tags.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-caption rounded-full border border-border bg-surface-2 px-2.5 py-1 text-text-2"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {post.coverImageUrl ? (
            <div className="relative mt-10 aspect-video overflow-hidden rounded-lg border border-border">
              <Image
                src={post.coverImageUrl}
                alt=""
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          ) : null}

          <div className="mt-10 text-body text-text-2 [&_a]:text-accent-ink [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-border-strong [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-surface-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-body-sm [&_h1]:text-h2 [&_h1]:mt-10 [&_h1]:text-ink [&_h2]:text-h3 [&_h2]:mt-8 [&_h2]:text-ink [&_h3]:text-h4 [&_h3]:mt-6 [&_h3]:text-ink [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-surface-2 [&_pre]:p-4 [&_ul]:list-disc [&_ul]:pl-6">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer profile={profile} />
    </>
  );
}
