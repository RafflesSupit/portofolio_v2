import type { NextConfig } from "next";
import path from "node:path";

function r2RemotePattern() {
  if (!process.env.R2_PUBLIC_URL) return [];
  try {
    const { hostname, protocol } = new URL(process.env.R2_PUBLIC_URL);
    return [{ protocol: protocol.replace(":", "") as "http" | "https", hostname }];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    serverActions: {
      // Bumped from 10mb for showreel video uploads (see admin/profile).
      // Note: Vercel's own serverless request-body ceiling is lower than
      // this regardless of what's configured here, so a large video may
      // still need to be uploaded to R2 manually with the URL pasted in.
      bodySizeLimit: "50mb",
    },
  },
  allowedDevOrigins: ['192.168.1.21'],
  images: {
    // picsum.photos is only used by the original seed's placeholder project
    // images; safe to drop once real images are uploaded via the admin panel.
    remotePatterns: [...r2RemotePattern(), { protocol: "https", hostname: "picsum.photos" }],
    // R2's public URL is Cloudflare's shared `r2.dev` dev domain, which some
    // ISP DNS resolvers fail to resolve for visitors. A custom loader routes
    // every <Image> through this app's own domain (see /api/media) instead
    // of letting the browser resolve r2.dev itself — Next's built-in
    // optimizer is bypassed entirely (no resizing/re-encoding), matching
    // the original intent of not re-optimizing already-compressed uploads
    // (see uploadToR2 in lib/r2.ts).
    // Images are compressed at upload time (see uploadToR2) and served
    // through /api/media (see lib/image-url.ts's toProxiedUrl) rather than
    // Next's optimizer, so skip server-side re-optimization here too.
    unoptimized: true,
  },
};

export default nextConfig;
