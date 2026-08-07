const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 3;

const hits = new Map<string, number[]>();

/**
 * In-memory sliding-window rate limit, keyed by an arbitrary string (e.g. IP).
 * Resets on redeploy/restart - acceptable for deterring casual form spam on
 * a low-traffic personal site; not a substitute for a real gateway-level
 * limiter if abuse ever becomes a serious problem.
 */
export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > MAX_REQUESTS;
}
