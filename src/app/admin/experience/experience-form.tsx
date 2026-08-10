"use client";

import { useActionState } from "react";
import { createExperienceItem, updateExperienceItem, type ExperienceFormState } from "./actions";

const initialState: ExperienceFormState = {};

const inputClass =
  "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm text-ink outline-none focus:border-border-strong";

type Props =
  | {
      mode: "create";
      id?: undefined;
      defaultRole?: undefined;
      defaultOrg?: undefined;
      defaultPeriod?: undefined;
      defaultPoints?: undefined;
    }
  | {
      mode: "edit";
      id: string;
      defaultRole: string;
      defaultOrg: string;
      defaultPeriod: string;
      defaultPoints: string;
    };

export function ExperienceForm(props: Props) {
  const action =
    props.mode === "edit" ? updateExperienceItem.bind(null, props.id) : createExperienceItem;
  const [state, formAction, pending] = useActionState(action, initialState);
  // Echo the just-submitted values back as defaults on failure, and remount
  // the form (via key) so React actually picks them up — React resets
  // uncontrolled fields once the action settles, so without this a failed
  // create would look like it wiped everything the admin typed.
  const values = state.values;

  return (
    <form key={state.submittedAt ?? "initial"} action={formAction} className="max-w-xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-body-sm text-text-2" htmlFor="role">
            Posisi
          </label>
          <input
            id="role"
            name="role"
            defaultValue={values?.role ?? props.defaultRole}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-body-sm text-text-2" htmlFor="org">
            Organisasi
          </label>
          <input
            id="org"
            name="org"
            defaultValue={values?.org ?? props.defaultOrg}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-body-sm text-text-2" htmlFor="period">
          Periode
        </label>
        <input
          id="period"
          name="period"
          defaultValue={values?.period ?? props.defaultPeriod}
          required
          placeholder="Sep 2025 - Aug 2026"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-body-sm text-text-2" htmlFor="points">
          Poin (satu baris = satu poin)
        </label>
        <textarea
          id="points"
          name="points"
          defaultValue={values?.points ?? props.defaultPoints}
          required
          rows={5}
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
