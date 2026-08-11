import { prisma } from "@/lib/prisma";

function csvField(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET() {
  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });

  const rows = [
    ["First name", "Last name", "Email", "Subscribed at"],
    ...subscribers.map((s) => [s.firstName, s.lastName, s.email, s.createdAt.toISOString()]),
  ];
  const csv = rows.map((row) => row.map(csvField).join(",")).join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="newsletter-subscribers.csv"',
    },
  });
}
