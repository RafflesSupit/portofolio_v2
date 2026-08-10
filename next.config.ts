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
    // Next's image optimizer fetches the source on the server before
    // resizing it; large originals (e.g. an unresized phone photo) can
    // make that fetch slow enough to 504. Images are compressed at upload
    // time (see uploadToR2) instead, so skip server-side re-optimization
    // and serve the R2 URL directly - more reliable than marginally
    // smaller transfer sizes.
    unoptimized: true,
  },
};

export default nextConfig;
