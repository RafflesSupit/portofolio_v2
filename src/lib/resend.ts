import { Resend } from "resend";

// Undefined during local dev if the key isn't set yet — callers must treat
// a missing key as "sending disabled", not crash the request that's
// creating/publishing content.
export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Needs a domain verified in the Resend dashboard before it can send in
// production — resend.dev's sandbox address only delivers to the
// account's own verified email, so a real "from" address is required once
// this goes live.
export const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
