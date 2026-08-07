import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardMedia } from "@/components/ui/card";
import type { PostSummary } from "@/lib/queries";

export function LatestPosts({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="border-t border-border px-6 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeader
          label="Blog"
          heading="Latest notes."
          description="Writing on backend engineering, architecture, and lessons from building this site."
        />

        <div className="grid gap-6 sm:grid-cols-3">
          {posts.map((post, i) => {
            const monogram = post.title
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("");

            return (
              <Reveal key={post.slug} delay={i * 0.05} className="h-full">
                <Card href={`/blog/${post.slug}`} data-cursor-hover className="flex h-full flex-col">
                  <CardMedia src={post.coverImageUrl ?? undefined} monogram={monogram} />
                  <CardBody className="flex flex-1 flex-col">
                    <p className="text-meta text-text-3">
                      {post.publishedAt?.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <h3 className="mt-2 line-clamp-2 text-h4 text-ink transition-colors duration-150 group-hover:text-accent-ink">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-body-sm text-text-2">{post.excerpt}</p>
                    {post.tags.length > 0 ? (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <li
                            key={tag}
                            className="text-caption rounded-full border border-border bg-surface-2 px-2.5 py-1 text-text-2"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </CardBody>
                </Card>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-10">
          <Button href="/blog" variant="ghost" rightIcon={<ArrowIcon />}>
            View all posts
          </Button>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
