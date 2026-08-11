import { prisma } from "@/lib/prisma";
import { deleteSubscriber } from "./actions";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 text-ink">Newsletter</h1>
          <p className="mt-2 text-body-sm text-text-2">
            {subscribers.length} orang mendaftar lewat form newsletter di off-canvas menu, showreel, dan
            footer.
          </p>
        </div>
        {subscribers.length > 0 ? (
          <a
            href="/admin/newsletter/export"
            className="rounded-md bg-ink px-4 py-2 text-body-sm font-medium text-bg"
          >
            Export CSV
          </a>
        ) : null}
      </div>

      <div className="mt-6">
        {subscribers.length === 0 ? (
          <p className="text-body-sm text-text-2">Belum ada subscriber.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-body-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2 text-text-3">
                  <th className="px-4 py-2 font-medium">Nama</th>
                  <th className="px-4 py-2 font-medium">Email</th>
                  <th className="px-4 py-2 font-medium">Tanggal</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 text-ink">
                      {s.firstName} {s.lastName}
                    </td>
                    <td className="px-4 py-2">
                      <a href={`mailto:${s.email}`} className="text-accent-ink">
                        {s.email}
                      </a>
                    </td>
                    <td className="px-4 py-2 text-text-3">
                      {s.createdAt.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <form action={deleteSubscriber}>
                        <input type="hidden" name="id" value={s.id} />
                        <DeleteButton confirmMessage={`Hapus subscriber "${s.email}"?`} />
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
