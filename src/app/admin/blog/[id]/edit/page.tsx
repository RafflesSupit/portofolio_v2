import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostForm } from "../../post-form";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-h2 text-ink">Edit post</h1>
      <div className="mt-6">
        <PostForm
          mode="edit"
          id={post.id}
          slug={post.slug}
          title={post.title}
          excerpt={post.excerpt}
          content={post.content}
          tags={post.tags.join(", ")}
          coverImageUrl={post.coverImageUrl ?? ""}
          published={post.published}
        />
      </div>
    </div>
  );
}
