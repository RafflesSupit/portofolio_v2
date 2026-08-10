"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { FilterChip } from "@/components/ui/filter-chip";
import type { PostSummary } from "@/lib/queries";

/**
 * Grid of large cards, grayscale-until-hover — the tile.pt/articles pattern:
 * image desaturated and title muted at rest, hover brings the image to full
 * color and reveals the rest of the tags + excerpt underneath.
 */
export function BlogExplorer({ posts }: { posts: PostSummary[] }) {
  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const post of posts) {
      for (const tag of post.tags) set.add(tag);
    }
    return Array.from(set).sort();
  }, [posts]);

  const [activeTag, setActiveTag] = useState<string>("all");
  const filtered = activeTag === "all" ? posts : posts.filter((p) => p.tags.includes(activeTag));

  return (
    <div>
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2 border-b border-border pb-6" role="group" aria-label="Filter by tag">
          <FilterChip active={activeTag === "all"} onClick={() => setActiveTag("all")}>
            All
          </FilterChip>
          {tags.map((tag) => (
            <FilterChip key={tag} active={activeTag === tag} onClick={() => setActiveTag(tag)}>
              {tag}
            </FilterChip>
          ))}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-body text-text-2">No posts match this filter.</p>
      ) : (
        <div className="mt-10 grid gap-x-8 gap-y-16 sm:grid-cols-2">
          {filtered.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function PostCard({ post, index }: { post: PostSummary; index: number }) {
  return (
    <Reveal delay={(index % 2) * 0.06}>
      <Link href={`/blog/${post.slug}`} data-cursor-hover data-cursor-label="Read" className="group block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-surface-2">
          {post.coverImageUrl ? (
            <Image
              src={post.coverImageUrl}
              alt=""
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover grayscale transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] group-hover:grayscale-0"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-mono text-caption text-text-3">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          )}
          <span className="absolute left-4 top-4 font-mono text-caption text-white/70 mix-blend-difference">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h2 className="mt-5 text-h3 text-text-3 transition-colors duration-300 group-hover:text-ink">
          {post.title}
        </h2>

        {post.tags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag, i) =>
              i === 0 ? (
                <span
                  key={tag}
                  className="text-caption rounded-full border border-border px-2.5 py-1 text-text-2"
                >
                  {tag}
                </span>
              ) : (
                <span
                  key={tag}
                  className="text-caption -translate-x-1 rounded-full border border-border px-2.5 py-1 text-text-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        ) : null}

        <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-h-24 group-hover:opacity-100">
          <p className="mt-3 text-body-sm text-text-2">{post.excerpt}</p>
        </div>
      </Link>
    </Reveal>
  );
}
