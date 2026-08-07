"use client";

import { useActionState } from "react";
import { createAchievement, updateAchievement, type AchievementFormState } from "./actions";

const initialState: AchievementFormState = {};

const inputClass =
  "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm text-ink outline-none focus:border-border-strong";

type Props =
  | {
      mode: "create";
      id?: undefined;
      defaultTitle?: undefined;
      defaultIssuer?: undefined;
      defaultDate?: undefined;
      defaultUrl?: undefined;
      defaultDescription?: undefined;
    }
  | {
      mode: "edit";
      id: string;
      defaultTitle: string;
      defaultIssuer: string;
      defaultDate: string;
      defaultUrl: string;
      defaultDescription: string;
    };

export function AchievementForm(props: Props) {
  const action = props.mode === "edit" ? updateAchievement.bind(null, props.id) : createAchievement;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <div>
        <label className="block text-body-sm text-text-2" htmlFor="title">
          Judul
        </label>
        <input id="title" name="title" defaultValue={props.defaultTitle} required className={inputClass} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-body-sm text-text-2" htmlFor="issuer">
            Penerbit
          </label>
          <input id="issuer" name="issuer" defaultValue={props.defaultIssuer} required className={inputClass} />
        </div>
        <div>
          <label className="block text-body-sm text-text-2" htmlFor="date">
            Tanggal
          </label>
          <input
            id="date"
            name="date"
            defaultValue={props.defaultDate}
            required
            placeholder="2026"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className="block text-body-sm text-text-2" htmlFor="url">
          URL sertifikat/bukti (opsional)
        </label>
        <input id="url" name="url" type="url" defaultValue={props.defaultUrl} className={inputClass} />
      </div>
      <div>
        <label className="block text-body-sm text-text-2" htmlFor="description">
          Deskripsi (opsional)
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={props.defaultDescription}
          rows={3}
          className={inputClass}
        />
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
