import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePost } from "./actions";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminBlogPage() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-h2 text-ink">Blog</h1>
        <Link href="/admin/blog/new" className="rounded-md bg-ink px-4 py-2 text-body-sm font-medium text-bg">
          + Tulis post
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="rounded-lg border border-border bg-bg p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-h4 text-ink">{post.title}</h2>
                  {!post.published ? (
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-caption text-text-3">Draft</span>
                  ) : null}
                </div>
                <p className="mt-1 text-body-sm text-text-2">{post.excerpt}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-body-sm">
                <Link href={`/admin/blog/${post.id}/edit`} className="text-text-2 hover:text-ink">
                  Edit
                </Link>
                <form action={deletePost}>
                  <input type="hidden" name="id" value={post.id} />
                  <DeleteButton confirmMessage={`Hapus post "${post.title}"?`} />
                </form>
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 ? <p className="text-body-sm text-text-2">Belum ada post.</p> : null}
      </div>
    </div>
  );
}
