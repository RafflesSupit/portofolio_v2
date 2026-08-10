/**
 * Extracts the string fields from a FormData submission (skips File
 * entries — browsers won't let a file input be re-populated
 * programmatically anyway). Used to echo a failed submission's values
 * back into form state, since React resets uncontrolled form fields once
 * a `useActionState` action settles — without this, a rejected create
 * would leave the admin having to retype everything.
 */
export function extractFormValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") values[key] = value;
  }
  return values;
}
