/**
 * Derives the small-variant URL that `uploadToR2` (see lib/r2.ts) uploads
 * alongside every processed image. Kept in its own module, separate from
 * lib/r2.ts, so client components can import it without pulling in
 * server-only deps (sharp, aws-sdk).
 */
export function toThumbnailUrl(url: string): string {
  if (url.toLowerCase().endsWith(".svg")) return url;
  const dot = url.lastIndexOf(".");
  if (dot === -1) return url;
  return `${url.slice(0, dot)}-thumb${url.slice(dot)}`;
}
