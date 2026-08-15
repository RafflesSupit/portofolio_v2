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

/**
 * R2's public URL is Cloudflare's shared `pub-xxxx.r2.dev` dev bucket
 * domain — some ISP DNS resolvers fail to resolve it for visitors (only
 * switching the device to a resolver like 1.1.1.1 fixed it). Rewriting
 * every stored R2/media URL to this app's own /api/media route (see
 * app/api/media/route.ts) means the visitor's browser only ever talks to
 * a host it already resolved to load the page in the first place — the
 * proxy route does the R2 fetch server-side instead.
 */
export function toProxiedUrl(url: string): string {
  if (!/^https?:\/\//.test(url)) return url;
  return `/api/media?src=${encodeURIComponent(url)}`;
}
