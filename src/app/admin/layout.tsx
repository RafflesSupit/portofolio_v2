import Link from "next/link";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { logout } from "./actions";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/achievements", label: "Achievements" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/blog", label: "Blog" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const unreadCount = session ? await prisma.contactMessage.count({ where: { read: false } }) : 0;

  return (
    <div className="min-h-screen bg-surface-2">
      <header className="border-b border-border bg-bg px-6 py-3">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <p className="font-display text-body-sm font-bold text-ink">Portfolio Admin</p>
          {session ? (
            <nav className="flex flex-wrap items-center gap-5 text-body-sm">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="text-text-2 hover:text-ink">
                  {link.label}
                </Link>
              ))}
              <Link href="/admin/messages" className="text-text-2 hover:text-ink">
                Messages{unreadCount > 0 ? ` (${unreadCount})` : ""}
              </Link>
              <Link href="/" target="_blank" className="text-text-2 hover:text-ink">
                Lihat situs
              </Link>
              <form action={logout}>
                <button type="submit" className="text-text-2 hover:text-ink">
                  Logout
                </button>
              </form>
            </nav>
          ) : null}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10 md:px-8">{children}</main>
    </div>
  );
}
