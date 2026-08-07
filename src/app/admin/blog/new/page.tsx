import { PostForm } from "../post-form";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-h2 text-ink">Tulis post</h1>
      <div className="mt-6">
        <PostForm mode="create" />
      </div>
    </div>
  );
}
