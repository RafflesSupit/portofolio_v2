"use client";

import { useActionState } from "react";
import { subscribeToNewsletter, type NewsletterFormState } from "@/lib/newsletter-actions";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/check-icon";
import { cn } from "@/lib/cn";

const initialState: NewsletterFormState = {};

const inputClass =
  "mt-1 w-full rounded-md border border-border-strong bg-transparent px-3 py-2 text-body-sm text-ink outline-none focus:border-accent";

/**
 * Reusable lead-capture form — meant to be dropped into the off-canvas menu,
 * the showreel modal, and the footer without duplicating the submit logic.
 */
export function NewsletterForm({ className }: { className?: string }) {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState);

  if (state?.success) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-md border border-border bg-surface-2 px-4 py-3.5",
          className,
        )}
        role="status"
      >
        <CheckIcon className="shrink-0 text-accent-ink" />
        <p className="text-body-sm text-text-2">
          Terdaftar — notifikasi post baru bakal masuk ke inbox kamu.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className={cn("space-y-3", className)}>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className="block text-caption text-text-3">
            First name
          </label>
          <input id="firstName" name="firstName" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-caption text-text-3">
            Last name
          </label>
          <input id="lastName" name="lastName" required className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="newsletter-email" className="block text-caption text-text-3">
          Email
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          className={inputClass}
        />
      </div>

      {state?.error ? (
        <p className="text-body-sm text-error-text" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" variant="ghost" size="sm" disabled={pending} fullWidth>
        {pending ? "Submitting..." : "Sign up"}
      </Button>
    </form>
  );
}
