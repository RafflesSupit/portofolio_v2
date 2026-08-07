import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

function getR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

const MAX_DIMENSION = 1920;
const THUMB_DIMENSION = 640;
const WEBP_QUALITY = 82;

/**
 * Resizes and re-encodes image uploads to WebP before they ever reach R2.
 * Uploads from a phone camera can be several MB at 3000px+; serving those
 * directly (image optimization is disabled - see next.config.ts) would be
 * slow to load and, for large-enough sources, was timing out entirely.
 * WebP is used for everything (not just JPEG sources) because sharp's PNG
 * `quality` option only takes effect in palette mode -- without it, PNG
 * uploads were coming out far larger than intended.
 *
 * A second, smaller variant is produced alongside the full-size one so
 * call sites that only need a thumbnail (e.g. a hover preview) don't have
 * to download the full 1920px original. Its key is derived from the main
 * key by `toThumbnailUrl` (see lib/image-url.ts) rather than returned here,
 * so the public interface of `uploadToR2` doesn't change.
 */
async function processImage(bytes: Uint8Array): Promise<{ main: Uint8Array; thumb: Uint8Array }> {
  const image = sharp(bytes).rotate(); // apply EXIF orientation, then strip EXIF on encode

  const [main, thumb] = await Promise.all([
    image
      .clone()
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer(),
    image
      .clone()
      .resize({ width: THUMB_DIMENSION, height: THUMB_DIMENSION, fit: "inside", withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer(),
  ]);

  return { main: new Uint8Array(main), thumb: new Uint8Array(thumb) };
}

export async function uploadToR2(file: File, keyPrefix: string): Promise<string> {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME!;
  const base = process.env.R2_PUBLIC_URL!.replace(/\/$/, "");
  const contentType = file.type || "application/octet-stream";
  const isProcessableImage = contentType.startsWith("image/") && contentType !== "image/svg+xml";
  const bytes = new Uint8Array(await file.arrayBuffer());

  if (!isProcessableImage) {
    const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
    const key = `${keyPrefix}/${crypto.randomUUID()}.${extension}`;
    await client.send(
      new PutObjectCommand({ Bucket: bucket, Key: key, Body: bytes, ContentType: contentType }),
    );
    return `${base}/${key}`;
  }

  const { main, thumb } = await processImage(bytes);
  const id = crypto.randomUUID();
  const mainKey = `${keyPrefix}/${id}.webp`;
  const thumbKey = `${keyPrefix}/${id}-thumb.webp`;

  await Promise.all([
    client.send(
      new PutObjectCommand({ Bucket: bucket, Key: mainKey, Body: main, ContentType: "image/webp" }),
    ),
    client.send(
      new PutObjectCommand({ Bucket: bucket, Key: thumbKey, Body: thumb, ContentType: "image/webp" }),
    ),
  ]);

  return `${base}/${mainKey}`;
}
