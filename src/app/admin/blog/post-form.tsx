"use client";

import { useActionState, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { createPost, updatePost, uploadContentImage, type PostFormState } from "./actions";

const initialState: PostFormState = {};

const inputClass =
  "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm text-ink outline-none focus:border-border-strong";

type PostDefaults = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string;
  coverImageUrl: string;
  published: boolean;
};

type Props = { mode: "create" } | ({ mode: "edit"; id: string } & PostDefaults);

const emptyDefaults: PostDefaults = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  tags: "",
  coverImageUrl: "",
  published: false,
};

export function PostForm(props: Props) {
  const defaults = props.mode === "edit" ? props : emptyDefaults;
  const action = props.mode === "edit" ? updatePost.bind(null, props.id) : createPost;
  const [state, formAction, pending] = useActionState(action, initialState);
  // A failed submission resolves the action, and React resets uncontrolled
  // fields once it does — so this echoes the just-submitted values back as
  // the new defaults. Keying the form on the attempt forces React to
  // remount it with those defaults instead of leaving the reset (blank)
  // DOM values in place, which is what made a failed create look like it
  // had wiped the form.
  const values = state.values;
  const [content, setContent] = useState(values?.content ?? defaults.content);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  async function handleInsertImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    const fd = new FormData();
    fd.set("file", file);
    const result = await uploadContentImage(fd);
    setUploading(false);

    if ("error" in result) {
      setUploadError(result.error);
      return;
    }

    const snippet = `![](${result.url})`;
    const textarea = contentRef.current;
    const start = textarea?.selectionStart ?? content.length;
    const end = textarea?.selectionEnd ?? content.length;
    const next = content.slice(0, start) + snippet + content.slice(end);
    setContent(next);

    // setSelectionRange needs the textarea's value to already reflect
    // `next` — queue it for after this render commits the controlled value.
    requestAnimationFrame(() => {
      textarea?.focus();
      textarea?.setSelectionRange(start + snippet.length, start + snippet.length);
    });
  }

  return (
    <form key={state.submittedAt ?? "initial"} action={formAction} className="max-w-4xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-body-sm text-text-2" htmlFor="slug">
            Slug (unik, huruf kecil, dash)
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={values?.slug ?? defaults.slug}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-body-sm text-text-2" htmlFor="title">
            Judul
          </label>
          <input
            id="title"
            name="title"
            defaultValue={values?.title ?? defaults.title}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-body-sm text-text-2" htmlFor="excerpt">
          Excerpt (ringkasan singkat untuk list & preview)
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          defaultValue={values?.excerpt ?? defaults.excerpt}
          required
          rows={2}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-body-sm text-text-2" htmlFor="tags">
          Tags (pisahkan dengan koma)
        </label>
        <input id="tags" name="tags" defaultValue={values?.tags ?? defaults.tags} className={inputClass} />
      </div>

      <div>
        <label className="block text-body-sm text-text-2" htmlFor="coverImage">
          Cover image {props.mode === "edit" ? "(kosongkan jika tidak ganti)" : "(opsional)"}
        </label>
        {props.mode === "edit" && defaults.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={defaults.coverImageUrl} alt="" className="mt-2 h-24 w-40 rounded-md object-cover" />
        ) : null}
        <input
          id="coverImage"
          name="coverImage"
          type="file"
          accept="image/*"
          className="mt-2 block w-full text-body-sm text-text-2"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-body-sm text-text-2" htmlFor="content">
              Konten (Markdown)
            </label>
            <label className="cursor-pointer text-caption text-accent-ink underline">
              {uploading ? "Mengunggah..." : "+ Sisipkan gambar"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={handleInsertImage}
              />
            </label>
          </div>
          {uploadError ? <p className="mt-1 text-caption text-red-600">{uploadError}</p> : null}
          <textarea
            id="content"
            name="content"
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={20}
            className={`${inputClass} font-mono`}
          />
        </div>
        <div>
          <p className="text-body-sm text-text-2">Preview</p>
          <div className="mt-1 h-[460px] overflow-y-auto rounded-md border border-border bg-surface p-4 text-body-sm text-ink [&_a]:text-accent-ink [&_a]:underline [&_h1]:text-h3 [&_h1]:mt-4 [&_h1]:font-display [&_h2]:text-h4 [&_h2]:mt-4 [&_h2]:font-display [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={values ? values.published === "on" : defaults.published}
          className="h-4 w-4 rounded border-border"
        />
        <label className="text-body-sm text-text-2" htmlFor="published">
          Publish (tampil di /blog)
        </label>
      </div>

      {state?.error ? <p className="text-body-sm text-red-600">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-ink px-5 py-2.5 text-body-sm font-medium text-bg disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
