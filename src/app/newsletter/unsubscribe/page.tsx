import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  let unsubscribed = false;
  if (id) {
    try {
      await prisma.newsletterSubscriber.delete({ where: { id } });
      unsubscribed = true;
    } catch {
      // Already unsubscribed or an invalid id — nothing to do, not an error.
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg px-6 text-center">
      <div>
        <h1 className="text-h2 text-ink">
          {unsubscribed ? "You've been unsubscribed" : "Nothing to unsubscribe"}
        </h1>
        <p className="mt-3 text-body text-text-2">
          {unsubscribed
            ? "You won't receive any more newsletter emails from Raffles Supit."
            : "This link is no longer valid — you may already be unsubscribed."}
        </p>
        <Link href="/" className="mt-6 inline-block text-body-sm font-medium text-accent-ink underline">
          Back to the site
        </Link>
      </div>
    </main>
  );
}
