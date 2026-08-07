import Link from "next/link";

const sections = [
  { href: "/admin/profile", title: "Profile", description: "Nama, headline, bio, kontak, quick facts, dan CV." },
  { href: "/admin/skills", title: "Skills", description: "Kategori skill dan daftar item di dalamnya." },
  { href: "/admin/experience", title: "Experience", description: "Riwayat pekerjaan, magang, dan organisasi." },
  { href: "/admin/achievements", title: "Achievements", description: "Sertifikasi dan pencapaian." },
  { href: "/admin/projects", title: "Projects", description: "Project yang tampil di halaman utama." },
  { href: "/admin/faq", title: "FAQ", description: "Pertanyaan yang sering ditanyakan." },
  { href: "/admin/blog", title: "Blog", description: "Tulisan/artikel yang tampil di /blog." },
  { href: "/admin/messages", title: "Messages", description: "Pesan masuk dari form contact." },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-h2 text-ink">Dashboard</h1>
      <p className="mt-2 text-body-sm text-text-2">Pilih bagian yang mau diedit.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-lg border border-border bg-bg p-5 transition-colors hover:border-border-strong"
          >
            <h2 className="text-h4 text-ink">{s.title}</h2>
            <p className="mt-1 text-body-sm text-text-2">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
