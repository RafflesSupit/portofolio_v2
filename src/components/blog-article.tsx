"use client";

import { useRef, isValidElement } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { RegistrationMark } from "@/components/ui/registration-mark";
import { SpecLabel } from "@/components/ui/spec-label";
import { Reveal } from "@/components/ui/reveal";
import { ReadingProgressBar } from "@/components/reading-progress-bar";
import { MermaidDiagram } from "@/components/ui/mermaid-diagram";
import { toProxiedUrl } from "@/lib/image-url";
import type { PostDetail, PostSummary } from "@/lib/queries";

function formatDate(date: Date | null) {
  return date?.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) ?? "";
}

// ```mermaid fenced blocks come through as <pre><code class="language-mermaid">
// — swap those specifically for a rendered diagram, and leave every other
// code block exactly as the default `pre`/`code` markup already styled below.
const markdownComponents: Components = {
  pre({ children }) {
    if (isValidElement<{ className?: string; children?: React.ReactNode }>(children)) {
      const match = /language-(\w+)/.exec(children.props.className ?? "");
      if (match?.[1] === "mermaid") {
        return <MermaidDiagram code={String(children.props.children).replace(/\n$/, "")} />;
      }
    }
    return <pre>{children}</pre>;
  },
  table({ node, ...props }) {
    void node;
    return (
      <div className="overflow-x-auto">
        <table {...props} />
      </div>
    );
  },
  // Inline `![alt](url)` images in post content point straight at R2's raw
  // URL, same as coverImageUrl/gallery — needs the same proxy rewrite.
  img({ node, src, ...props }) {
    void node;
    return <img {...props} src={typeof src === "string" ? toProxiedUrl(src) : src} />;
  },
};

/**
 * Cover images aren't always the portrait crop this rail would prefer
 * (diagrams/screenshots are usually landscape) — object-cover would just
 * cut them off. A blurred, oversized copy of the same image fills the
 * frame as a backdrop while the real image sits on top with
 * object-contain, so nothing is ever cropped regardless of native
 * orientation.
 */
function CoverImage({ src, aspect, sizes }: { src: string; aspect: string; sizes: string }) {
  return (
    <div className={`relative ${aspect} overflow-hidden rounded-lg border border-border bg-surface-2`}>
      <Image
        src={src}
        alt=""
        fill
        aria-hidden="true"
        sizes={sizes}
        className="scale-110 object-cover opacity-40 blur-2xl"
      />
      <Image src={src} alt="" fill sizes={sizes} className="relative object-contain" />
    </div>
  );
}

/**
 * codapress.co.uk/insights pattern: left reading column with a key/value
 * byline block (Author / Date / Reading time), first paragraph styled as a
 * lead-in, and a sticky right rail carrying the cover image plus a
 * "Further reading" list — not the case-study hero+metadata-sidebar
 * formula the project pages use.
 */
export function BlogArticle({
  post,
  readingMinutes,
  authorName,
  prevPost,
  nextPost,
}: {
  post: PostDetail;
  readingMinutes: number;
  authorName: string;
  prevPost: PostSummary | null;
  nextPost: PostSummary | null;
}) {
  const articleRef = useRef<HTMLElement>(null);
  const related = [prevPost, nextPost].filter((p): p is PostSummary => p !== null);

  return (
    <>
      <ReadingProgressBar target={articleRef} />
      <article ref={articleRef} className="relative px-6 pb-24 pt-28 md:px-8 md:pt-36">
        <div className="mx-auto max-w-[1280px]">
          <Reveal>
            <Link
              href="/blog"
              data-cursor-hover
              className="group inline-flex items-center gap-2 font-mono text-caption uppercase tracking-[0.15em] text-text-3 transition-colors duration-150 hover:text-ink"
            >
              <span
                aria-hidden="true"
                className="transition-transform duration-200 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-x-1"
              >
                &larr;
              </span>
              All notes
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-12 md:grid-cols-[1fr_340px] md:gap-20">
            {/*
              min-w-0 overrides a grid item's default min-width:auto, which
              otherwise refuses to shrink below its content's natural width
              — a wide table or code block would stretch this whole column
              (and the grid track with it) instead of scrolling internally
              via overflow-x-auto, which is what made the entire page
              widen rather than just the table/diagram.
            */}
            <div className="min-w-0 max-w-[720px]">
              <Reveal delay={0.05}>
                <h1 className="text-display-l text-ink">{post.title}</h1>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="mt-5 text-body-lg text-text-2">{post.excerpt}</p>
              </Reveal>

              <Reveal
                delay={0.15}
                className="mt-8 flex flex-col gap-1.5 border-y border-border py-4 font-mono text-caption"
              >
                <span className="text-text-3">
                  Author <span className="text-ink">{authorName}</span>
                </span>
                <span className="text-text-3">
                  Date <span className="text-ink">{formatDate(post.publishedAt)}</span>
                </span>
                <span className="text-text-3">
                  Reading time <span className="text-ink">{readingMinutes} min</span>
                </span>
              </Reveal>

              {post.tags.length > 0 ? (
                <Reveal delay={0.2} className="mt-6 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-caption rounded-full border border-border bg-surface-2 px-2.5 py-1 text-text-2"
                    >
                      {tag}
                    </span>
                  ))}
                </Reveal>
              ) : null}

              {/*
                On mobile the grid below collapses to one column, stacking
                the aside (which carries the cover image) after this whole
                content block in source order — so on a long post the cover
                image only appeared once you'd scrolled past the entire
                article. This renders it once more, right up near the top,
                for mobile only; the sidebar copy below is hidden below md.
              */}
              {post.coverImageUrl ? (
                <Reveal delay={0.22} className="mt-8 md:hidden">
                  <CoverImage src={post.coverImageUrl} aspect="aspect-video" sizes="100vw" />
                </Reveal>
              ) : null}

              {/*
                Deliberately not wrapped in <Reveal> — that component only
                fades an element in once 20% of *its own height* has
                scrolled into view, which works fine for compact blocks but
                is nearly unusable for a long article body: 20% of a
                multi-thousand-pixel-tall element can be a huge scroll
                distance, so the text could sit at opacity:0 for most of
                the read, reading as "the content never showed up". Body
                copy you're there to read should just be visible.
              */}
              <div className="mt-10 text-body-lg leading-[1.75] text-text-2 [&>p:first-of-type]:mt-0 [&>p:first-of-type]:text-h4 [&>p:first-of-type]:font-normal [&>p:first-of-type]:text-ink [&_a]:text-accent-ink [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-border-strong [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-surface-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-body-sm [&_h1]:text-h2 [&_h1]:mt-10 [&_h1]:text-ink [&_h2]:text-h3 [&_h2]:mt-8 [&_h2]:text-ink [&_h3]:text-h4 [&_h3]:mt-6 [&_h3]:text-ink [&_li]:mt-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-5 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-surface-2 [&_pre]:p-4 [&_table]:min-w-full [&_table]:border-collapse [&_table]:text-body-sm [&_th]:border [&_th]:border-border [&_th]:bg-surface-2 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-ink [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:align-top [&_ul]:list-disc [&_ul]:pl-6">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>

            <aside className="space-y-10 md:sticky md:top-32 md:h-fit">
              {/* Mobile gets its own copy up top (see above) — this one is desktop-only. */}
              <Reveal delay={0.1} className="hidden md:block">
                {post.coverImageUrl ? (
                  <CoverImage src={post.coverImageUrl} aspect="aspect-[4/5]" sizes="340px" />
                ) : (
                  <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-2">
                    <RegistrationMark position="top-right" className="text-text-3" />
                    <RegistrationMark position="bottom-left" className="text-text-3" />
                    <SpecLabel>No cover</SpecLabel>
                  </div>
                )}
              </Reveal>

              {related.length > 0 ? (
                <Reveal delay={0.15}>
                  <SpecLabel>Further reading</SpecLabel>
                  <div className="mt-4 space-y-4">
                    {related.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/blog/${p.slug}`}
                        data-cursor-hover
                        data-cursor-label="Read"
                        className="group flex items-center gap-3"
                      >
                        {p.coverImageUrl ? (
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-border">
                            <Image src={p.coverImageUrl} alt="" fill sizes="64px" className="object-cover" />
                          </div>
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded border border-border bg-surface-2 font-mono text-caption text-text-3">
                            §
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-body-sm font-medium text-ink transition-colors duration-150 group-hover:text-accent-ink">
                            {p.title}
                          </p>
                          <p className="mt-1 text-caption text-text-3">{formatDate(p.publishedAt)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Reveal>
              ) : null}
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
