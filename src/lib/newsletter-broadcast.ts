import { prisma } from "@/lib/prisma";
import { resend, RESEND_FROM_EMAIL } from "@/lib/resend";
import { SITE_URL } from "@/lib/site";

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

function buildEmailHtml(options: {
  firstName: string;
  title: string;
  excerpt: string;
  postUrl: string;
  unsubscribeUrl: string;
}) {
  return `
    <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #111;">
      <p style="font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: #888; margin: 0 0 24px;">New note from Raffles Supit</p>
      <p style="font-size: 15px; margin: 0 0 8px;">Hi ${options.firstName},</p>
      <h1 style="font-size: 24px; line-height: 1.3; margin: 0 0 12px;">${options.title}</h1>
      <p style="font-size: 15px; line-height: 1.6; color: #444; margin: 0 0 24px;">${options.excerpt}</p>
      <a href="${options.postUrl}" style="display: inline-block; background: #111; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600;">
        Read the post
      </a>
      <p style="margin-top: 40px; font-size: 12px; color: #999;">
        You're receiving this because you signed up at ${SITE_URL}.
        <a href="${options.unsubscribeUrl}" style="color: #999;">Unsubscribe</a>
      </p>
    </div>
  `;
}

/**
 * Fire-and-forget from the caller's perspective: failures are swallowed
 * (logged) rather than thrown, since a broadcast failing should never
 * block the post create/update that triggered it. No-op if RESEND_API_KEY
 * isn't configured yet.
 */
export async function notifySubscribersOfNewPost(post: { slug: string; title: string; excerpt: string }) {
  if (!resend) return;

  const subscribers = await prisma.newsletterSubscriber.findMany();
  if (subscribers.length === 0) return;

  const postUrl = `${SITE_URL}/blog/${post.slug}`;

  const emails = subscribers.map((subscriber) => ({
    from: RESEND_FROM_EMAIL,
    to: subscriber.email,
    subject: `New post: ${post.title}`,
    html: buildEmailHtml({
      firstName: subscriber.firstName,
      title: post.title,
      excerpt: post.excerpt,
      postUrl,
      unsubscribeUrl: `${SITE_URL}/newsletter/unsubscribe?id=${subscriber.id}`,
    }),
  }));

  try {
    for (const batch of chunk(emails, 100)) {
      await resend.batch.send(batch);
    }
  } catch (error) {
    console.error("Newsletter broadcast failed:", error);
  }
}
