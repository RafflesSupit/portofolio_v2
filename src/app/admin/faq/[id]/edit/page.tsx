import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { prismaReplica } from "@/lib/prisma-replica";
import { withFallback } from "@/lib/db-retry";
import { FaqForm } from "../../faq-form";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await withFallback(
    () => prisma.faqItem.findUnique({ where: { id } }),
    () => prismaReplica!.faqItem.findUnique({ where: { id } }),
    null,
  );
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-h2 text-ink">Edit FAQ</h1>
      <div className="mt-6">
        <FaqForm mode="edit" id={item.id} defaultQuestion={item.question} defaultAnswer={item.answer} />
      </div>
    </div>
  );
}
