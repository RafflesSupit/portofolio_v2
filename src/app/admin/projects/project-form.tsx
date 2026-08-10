"use client";

import { useActionState } from "react";
import { createProject, updateProject, type ProjectFormState } from "./actions";

const initialState: ProjectFormState = {};

const inputClass =
  "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm text-ink outline-none focus:border-border-strong";

type ProjectDefaults = {
  slug: string;
  title: string;
  type: string;
  role: string;
  year: string;
  description: string;
  highlights: string;
  tags: string;
  href: string;
  imageUrl: string;
  published: boolean;
  hasCaseStudy: boolean;
  challenge: string;
  solution: string;
  result: string;
  gallery: string[];
};

type Props = { mode: "create" } | ({ mode: "edit"; id: string } & ProjectDefaults);

const emptyDefaults: ProjectDefaults = {
  slug: "",
  title: "",
  type: "",
  role: "",
  year: "",
  description: "",
  highlights: "",
  tags: "",
  href: "",
  imageUrl: "",
  published: true,
  hasCaseStudy: false,
  challenge: "",
  solution: "",
  result: "",
  gallery: [],
};

export function ProjectForm(props: Props) {
  const defaults = props.mode === "edit" ? props : emptyDefaults;
  const action = props.mode === "edit" ? updateProject.bind(null, props.id) : createProject;
  const [state, formAction, pending] = useActionState(action, initialState);
  // Echo the just-submitted values back as defaults on failure, and remount
  // the form (via key) so React actually picks them up — React resets
  // uncontrolled fields once the action settles, so without this a failed
  // create/update would look like it wiped everything the admin typed.
  const values = state.values;

  return (
    <form key={state.submittedAt ?? "initial"} action={formAction} className="max-w-2xl space-y-5">
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

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="block text-body-sm text-text-2" htmlFor="type">
            Tipe
          </label>
          <input
            id="type"
            name="type"
            defaultValue={values?.type ?? defaults.type}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-body-sm text-text-2" htmlFor="role">
            Role
          </label>
          <input
            id="role"
            name="role"
            defaultValue={values?.role ?? defaults.role}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-body-sm text-text-2" htmlFor="year">
            Tahun
          </label>
          <input
            id="year"
            name="year"
            defaultValue={values?.year ?? defaults.year}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-body-sm text-text-2" htmlFor="description">
          Deskripsi
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={values?.description ?? defaults.description}
          required
          rows={3}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-body-sm text-text-2" htmlFor="highlights">
          Highlights (satu baris = satu poin)
        </label>
        <textarea
          id="highlights"
          name="highlights"
          defaultValue={values?.highlights ?? defaults.highlights}
          required
          rows={4}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-body-sm text-text-2" htmlFor="tags">
          Tags (pisahkan dengan koma)
        </label>
        <input
          id="tags"
          name="tags"
          defaultValue={values?.tags ?? defaults.tags}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-body-sm text-text-2" htmlFor="href">
          Link project (repo/demo)
        </label>
        <input
          id="href"
          name="href"
          type="url"
          defaultValue={values?.href ?? defaults.href}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-body-sm text-text-2" htmlFor="image">
          Gambar project {props.mode === "edit" ? "(kosongkan jika tidak ganti)" : ""}
        </label>
        {props.mode === "edit" && defaults.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={defaults.imageUrl} alt="" className="mt-2 h-32 w-24 rounded-md object-cover" />
        ) : null}
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          required={props.mode === "create"}
          className="mt-2 block w-full text-body-sm text-text-2"
        />
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
          Tampilkan di halaman utama
        </label>
      </div>

      <div className="rounded-lg border border-border bg-surface-2 p-4">
        <div className="flex items-center gap-2">
          <input
            id="hasCaseStudy"
            name="hasCaseStudy"
            type="checkbox"
            defaultChecked={values ? values.hasCaseStudy === "on" : defaults.hasCaseStudy}
            className="h-4 w-4 rounded border-border"
          />
          <label className="text-body-sm font-medium text-ink" htmlFor="hasCaseStudy">
            Punya halaman case study (/projects/{defaults.slug || "slug"})
          </label>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-body-sm text-text-2" htmlFor="challenge">
              Challenge
            </label>
            <textarea
              id="challenge"
              name="challenge"
              defaultValue={values?.challenge ?? defaults.challenge}
              rows={3}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-body-sm text-text-2" htmlFor="solution">
              Solution
            </label>
            <textarea
              id="solution"
              name="solution"
              defaultValue={values?.solution ?? defaults.solution}
              rows={3}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-body-sm text-text-2" htmlFor="result">
              Result
            </label>
            <textarea
              id="result"
              name="result"
              defaultValue={values?.result ?? defaults.result}
              rows={3}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-body-sm text-text-2" htmlFor="gallery">
              Gambar gallery (bisa pilih beberapa, kosongkan jika tidak ganti)
            </label>
            {props.mode === "edit" && defaults.gallery.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {defaults.gallery.map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={src} src={src} alt="" className="h-16 w-24 rounded-md object-cover" />
                ))}
              </div>
            ) : null}
            <input
              id="gallery"
              name="gallery"
              type="file"
              accept="image/*"
              multiple
              className="mt-2 block w-full text-body-sm text-text-2"
            />
          </div>
        </div>
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
