import { prisma } from "@/lib/prisma";
import { markMessageRead, deleteMessage } from "./actions";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: [{ read: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <h1 className="text-h2 text-ink">Messages</h1>
      <p className="mt-2 text-body-sm text-text-2">Pesan masuk dari form contact di halaman utama.</p>

      <div className="mt-6 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-lg border p-4 ${msg.read ? "border-border bg-bg" : "border-accent-border bg-accent-bg"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-h4 text-ink">{msg.name}</h2>
                  {!msg.read ? (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-caption text-hero-bg">Baru</span>
                  ) : null}
                </div>
                <a href={`mailto:${msg.email}`} className="text-body-sm text-accent-ink">
                  {msg.email}
                </a>
                <p className="mt-2 whitespace-pre-wrap text-body-sm text-text-2">{msg.message}</p>
                <p className="mt-2 text-caption text-text-3">
                  {msg.createdAt.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-3 text-body-sm">
                <form action={markMessageRead}>
                  <input type="hidden" name="id" value={msg.id} />
                  <input type="hidden" name="read" value={(!msg.read).toString()} />
                  <button type="submit" className="text-text-2 hover:text-ink">
                    {msg.read ? "Tandai belum dibaca" : "Tandai dibaca"}
                  </button>
                </form>
                <form action={deleteMessage}>
                  <input type="hidden" name="id" value={msg.id} />
                  <DeleteButton confirmMessage={`Hapus pesan dari "${msg.name}"?`} />
                </form>
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 ? (
          <p className="text-body-sm text-text-2">Belum ada pesan masuk.</p>
        ) : null}
      </div>
    </div>
  );
}
