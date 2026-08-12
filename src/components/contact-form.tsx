"use client";

import { useActionState } from "react";
import { submitContactMessage, type ContactFormState } from "@/lib/contact-actions";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/check-icon";

const initialState: ContactFormState = {};

const inputClass =
  "mt-1 w-full rounded-md border border-white/25 bg-transparent px-3 py-2 text-body-sm text-hero-ink outline-none focus:border-white/60";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactMessage, initialState);

  if (state?.success) {
    return (
      <div
        className="mx-auto mt-10 flex max-w-md items-center gap-3 rounded-lg border border-white/20 bg-white/5 px-4 py-3.5 text-left"
        role="status"
      >
        <CheckIcon className="shrink-0 text-hero-ink" />
        <p className="text-body-sm text-hero-text-2">
          Pesan terkirim — masuk antrian, biasanya saya balas dalam 1x24 jam.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mx-auto mt-10 max-w-md space-y-4 text-left">
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="name" className="block text-body-sm text-hero-text-2">
          Nama
        </label>
        <input id="name" name="name" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="email" className="block text-body-sm text-hero-text-2">
          Email
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="message" className="block text-body-sm text-hero-text-2">
          Pesan
        </label>
        <textarea id="message" name="message" required rows={4} className={inputClass} />
      </div>

      {state?.error ? (
        <p className="text-body-sm text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" variant="solid-inverse" disabled={pending} fullWidth>
        {pending ? "Mengirim..." : "Kirim pesan"}
      </Button>
    </form>
  );
}
