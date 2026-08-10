"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileFormState } from "./actions";
import type { ProfileData } from "@/lib/queries";

const initialState: ProfileFormState = {};

const inputClass =
  "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm text-ink outline-none focus:border-border-strong";

function Field({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-body-sm text-text-2" htmlFor={name}>
        {label}
      </label>
      <input id={name} name={name} type={type} defaultValue={defaultValue} required className={inputClass} />
    </div>
  );
}

export function ProfileForm({ profile }: { profile: ProfileData }) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama" name="name" defaultValue={profile.name} />
        <Field label="Role" name="role" defaultValue={profile.role} />
      </div>

      <Field label="Eyebrow (badge kecil di hero)" name="eyebrow" defaultValue={profile.eyebrow} />
      <Field label="Headline" name="headline" defaultValue={profile.headline} />

      <div>
        <label className="block text-body-sm text-text-2" htmlFor="subhead">
          Subhead
        </label>
        <textarea
          id="subhead"
          name="subhead"
          defaultValue={profile.subhead}
          required
          rows={3}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-body-sm text-text-2" htmlFor="valueProposition">
          Value proposition (kenapa orang harus kerja sama dengan anda)
        </label>
        <textarea
          id="valueProposition"
          name="valueProposition"
          defaultValue={profile.valueProposition}
          required
          rows={3}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-body-sm text-text-2" htmlFor="bio">
          Bio (pisahkan tiap paragraf dengan baris kosong)
        </label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={profile.bio.join("\n\n")}
          required
          rows={8}
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" name="email" type="email" defaultValue={profile.email} />
        <Field label="Lokasi" name="location" defaultValue={profile.location} />
        <Field label="GitHub URL" name="githubUrl" defaultValue={profile.socials.github} />
        <Field label="LinkedIn URL" name="linkedinUrl" defaultValue={profile.socials.linkedin} />
      </div>

      <Field label="URL file CV" name="resumeUrl" defaultValue={profile.resumeUrl} />
      <div>
        <label className="block text-body-sm text-text-2" htmlFor="resume">
          Ganti file CV (opsional, kosongkan jika tidak ganti)
        </label>
        <input id="resume" name="resume" type="file" accept="application/pdf" className="mt-2 block w-full text-body-sm text-text-2" />
      </div>

      <div>
        <label className="block text-body-sm text-text-2" htmlFor="showreelUrl">
          URL video showreel (opsional — kosongkan kalau belum ada, tombol Showreel di header akan
          disembunyikan)
        </label>
        <input
          id="showreelUrl"
          name="showreelUrl"
          defaultValue={profile.showreelUrl ?? ""}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-body-sm text-text-2" htmlFor="showreel">
          Upload video showreel (opsional, kosongkan jika tidak ganti). File besar mungkin gagal
          lewat form ini di Vercel — kalau videonya besar, upload manual ke R2 lalu tempel URL-nya
          di field di atas.
        </label>
        <input
          id="showreel"
          name="showreel"
          type="file"
          accept="video/*"
          className="mt-2 block w-full text-body-sm text-text-2"
        />
      </div>

      <div className="rounded-lg border border-border bg-surface-2 p-4">
        <p className="text-body-sm font-medium text-ink">Quick facts (bar di bawah hero)</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Field label="Focus" name="focusText" defaultValue={profile.quickFacts.focus} />
          <Field label="Currently" name="currentlyText" defaultValue={profile.quickFacts.currently} />
          <Field label="Open to" name="openToText" defaultValue={profile.quickFacts.openTo} />
        </div>
        <p className="mt-2 text-caption text-text-3">
          &quot;Based in&quot; otomatis memakai field Lokasi di atas.
        </p>
      </div>

      {state?.error ? <p className="text-body-sm text-red-600">{state.error}</p> : null}
      {state?.success ? <p className="text-body-sm text-green-600">Tersimpan.</p> : null}

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
