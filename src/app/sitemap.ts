import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = "https://rafflessupit.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const caseStudies = await prisma.project.findMany({
    where: { published: true, hasCaseStudy: true },
    select: { slug: true, updatedAt: true },
  });

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
