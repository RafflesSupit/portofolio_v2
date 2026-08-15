import { NextRequest, NextResponse } from "next/server";

/**
 * Only ever proxies to hosts the app itself already trusts as image sources
 * (mirrors next.config.ts's remotePatterns) — this route would otherwise be
 * an open fetch proxy for any URL a caller supplies.
 */
function allowedHosts(): Set<string> {
  const hosts = new Set<string>(["picsum.photos"]);
  if (process.env.R2_PUBLIC_URL) {
    try {
      hosts.add(new URL(process.env.R2_PUBLIC_URL).hostname);
    } catch {
      // ignore malformed env value
    }
  }
  return hosts;
}

export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get("src");
  if (!src) return new NextResponse("Missing src", { status: 400 });

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return new NextResponse("Invalid src", { status: 400 });
  }

  if (url.protocol !== "https:" || !allowedHosts().has(url.hostname)) {
    return new NextResponse("Host not allowed", { status: 403 });
  }

  const upstream = await fetch(url).catch(() => null);
  if (!upstream || !upstream.ok || !upstream.body) {
    return new NextResponse("Upstream error", { status: 502 });
  }

  // Uploaded keys are content-addressed (random UUID per upload, see
  // uploadToR2) — a given URL's bytes never change, so this is safe to
  // cache aggressively both at the edge and in the browser.
  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
