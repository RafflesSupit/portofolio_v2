"use client";

import { useActionState } from "react";
import { createSkillCategory, updateSkillCategory, type SkillFormState } from "./actions";

const initialState: SkillFormState = {};

const inputClass =
  "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm text-ink outline-none focus:border-border-strong";

type Props =
  | { mode: "create"; id?: undefined; defaultCategory?: undefined; defaultItems?: undefined }
  | { mode: "edit"; id: string; defaultCategory: string; defaultItems: string };

export function SkillForm(props: Props) {
  const action =
    props.mode === "edit" ? updateSkillCategory.bind(null, props.id) : createSkillCategory;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <div>
        <label className="block text-body-sm text-text-2" htmlFor="category">
          Nama kategori
        </label>
        <input
          id="category"
          name="category"
          defaultValue={props.defaultCategory}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-body-sm text-text-2" htmlFor="items">
          Item (pisahkan dengan koma)
        </label>
        <textarea
          id="items"
          name="items"
          defaultValue={props.defaultItems}
          required
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
