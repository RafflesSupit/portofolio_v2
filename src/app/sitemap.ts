import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { prismaReplica } from "@/lib/prisma-replica";
import { withFallback } from "@/lib/db-retry";

const siteUrl = "https://rafflessupit.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const caseStudies = await withFallback(
    () => prisma.project.findMany({ where: { published: true, hasCaseStudy: true }, select: { slug: true, updatedAt: true } }),
    () => prismaReplica!.project.findMany({ where: { published: true, hasCaseStudy: true }, select: { slug: true, updatedAt: true } }),
    [],
  );

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...caseStudies.map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
