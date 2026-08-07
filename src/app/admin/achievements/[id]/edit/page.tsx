import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AchievementForm } from "../../achievement-form";

export default async function EditAchievementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.achievement.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-h2 text-ink">Edit achievement</h1>
      <div className="mt-6">
        <AchievementForm
          mode="edit"
          id={item.id}
          defaultTitle={item.title}
          defaultIssuer={item.issuer}
          defaultDate={item.date}
          defaultUrl={item.url ?? ""}
          defaultDescription={item.description ?? ""}
        />
      </div>
    </div>
  );
}
