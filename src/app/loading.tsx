/**
 * Every route is `force-dynamic` with live DB fetches (Neon cold-starts can
 * take several seconds) — without this, a slow request shows nothing at all
 * until fully ready. Deliberately plain (no Framer Motion): a loading state
 * should be the most robust thing on the site, not another animation to get
 * right.
 */
export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-border-strong border-t-accent"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
