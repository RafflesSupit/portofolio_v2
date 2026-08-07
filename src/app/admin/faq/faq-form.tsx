"use client";

import { useActionState } from "react";
import { createFaqItem, updateFaqItem, type FaqFormState } from "./actions";

const initialState: FaqFormState = {};

const inputClass =
  "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm text-ink outline-none focus:border-border-strong";

type Props =
  | { mode: "create"; id?: undefined; defaultQuestion?: undefined; defaultAnswer?: undefined }
  | { mode: "edit"; id: string; defaultQuestion: string; defaultAnswer: string };

export function FaqForm(props: Props) {
  const action = props.mode === "edit" ? updateFaqItem.bind(null, props.id) : createFaqItem;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <div>
        <label className="block text-body-sm text-text-2" htmlFor="question">
          Pertanyaan
        </label>
        <input
          id="question"
          name="question"
          defaultValue={props.defaultQuestion}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-body-sm text-text-2" htmlFor="answer">
          Jawaban
        </label>
        <textarea
          id="answer"
          name="answer"
          defaultValue={props.defaultAnswer}
          required
          rows={4}
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
