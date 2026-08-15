import { prisma } from "@/lib/prisma";
import { prismaReplica } from "@/lib/prisma-replica";
import { withFallback } from "@/lib/db-retry";
import { toProxiedUrl } from "@/lib/image-url";

export type ProfileData = {
  name: string;
  role: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  bio: string[];
  email: string;
  socials: {
    github: string;
    linkedin: string;
    email: string;
  };
  location: string;
  resumeUrl: string;
  showreelUrl: string | null;
  valueProposition: string;
  quickFacts: {
    focus: string;
    currently: string;
    basedIn: string;
    openTo: string;
  };
};

export type SkillGroup = {
  category: string;
  items: string[];
};

export type ProjectData = {
  slug: string;
  title: string;
  type: string;
  role: string;
  year: string;
  description: string;
  highlights: string[];
  tags: string[];
  href: string;
  image: string;
  hasCaseStudy: boolean;
};

export type ProjectCaseStudy = ProjectData & {
  challenge: string | null;
  solution: string | null;
  result: string | null;
  gallery: string[];
};

export type ExperienceData = {
  role: string;
  org: string;
  period: string;
  points: string[];
};

export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  tags: string[];
  publishedAt: Date | null;
};

export type PostDetail = PostSummary & {
  content: string;
};

export type AchievementData = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url: string | null;
  description: string | null;
};

export type FaqItemData = {
  id: string;
  question: string;
  answer: string;
};

const DEFAULT_PROFILE = {
  name: "Your Name",
  role: "Your Role",
  eyebrow: "Available for opportunities",
  headline: "Add your headline in /admin/profile",
  subhead: "Add your subhead in /admin/profile.",
  bio: ["Add your bio in /admin/profile."],
  email: "you@example.com",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  location: "Your City, Country",
  resumeUrl: "/files/resume.pdf",
  showreelUrl: null,
  valueProposition: "Add your value proposition in /admin/profile",
  focusText: "Add in /admin/profile",
  currentlyText: "Add in /admin/profile",
  openToText: "Add in /admin/profile",
};

async function ensureProfile() {
  return withFallback(
    async () => {
      const existing = await prisma.profile.findFirst();
      if (existing) return existing;
      // Profile is a required singleton; auto-heal instead of crashing the page
      // if the table is ever empty (fresh DB, accidental reset, etc).
      return prisma.profile.create({ data: DEFAULT_PROFILE });
    },
    async () => {
      const existing = await prismaReplica!.profile.findFirst();
      if (!existing) throw new Error("No profile available on standby.");
      return existing;
    },
  );
}

export async function getProfile(): Promise<ProfileData> {
  const row = await ensureProfile();
  return {
    name: row.name,
    role: row.role,
    eyebrow: row.eyebrow,
    headline: row.headline,
    subhead: row.subhead,
    bio: row.bio,
    email: row.email,
    socials: {
      github: row.githubUrl,
      linkedin: row.linkedinUrl,
      email: `mailto:${row.email}`,
    },
    location: row.location,
    resumeUrl: toProxiedUrl(row.resumeUrl),
    showreelUrl: row.showreelUrl ? toProxiedUrl(row.showreelUrl) : null,
    valueProposition: row.valueProposition,
    quickFacts: {
      focus: row.focusText,
      currently: row.currentlyText,
      basedIn: row.location,
      openTo: row.openToText,
    },
  };
}

export async function getSkills(): Promise<SkillGroup[]> {
  const rows = await withFallback(
    () => prisma.skillCategory.findMany({ orderBy: { order: "asc" } }),
    () => prismaReplica!.skillCategory.findMany({ orderBy: { order: "asc" } }),
    [],
  );
  return rows.map((row) => ({ category: row.category, items: row.items }));
}

export async function getProjects(): Promise<ProjectData[]> {
  const rows = await withFallback(
    () => prisma.project.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    () => prismaReplica!.project.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    [],
  );
  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    type: row.type,
    role: row.role,
    year: row.year,
    description: row.description,
    highlights: row.highlights,
    tags: row.tags,
    href: row.href,
    image: toProxiedUrl(row.imageUrl),
    hasCaseStudy: row.hasCaseStudy,
  }));
}

export async function getProjectCount(): Promise<number> {
  return withFallback(
    () => prisma.project.count({ where: { published: true } }),
    () => prismaReplica!.project.count({ where: { published: true } }),
    0,
  );
}

export async function getProjectBySlug(slug: string): Promise<ProjectCaseStudy | null> {
  const row = await withFallback(
    () => prisma.project.findUnique({ where: { slug } }),
    () => prismaReplica!.project.findUnique({ where: { slug } }),
    null,
  );
  if (!row || !row.published) return null;

  return {
    slug: row.slug,
    title: row.title,
    type: row.type,
    role: row.role,
    year: row.year,
    description: row.description,
    highlights: row.highlights,
    tags: row.tags,
    href: row.href,
    image: toProxiedUrl(row.imageUrl),
    hasCaseStudy: row.hasCaseStudy,
    challenge: row.challenge,
    solution: row.solution,
    result: row.result,
    gallery: row.gallery.map(toProxiedUrl),
  };
}

export async function getExperienceItems(): Promise<ExperienceData[]> {
  const rows = await withFallback(
    () => prisma.experienceItem.findMany({ orderBy: { order: "asc" } }),
    () => prismaReplica!.experienceItem.findMany({ orderBy: { order: "asc" } }),
    [],
  );
  return rows.map((row) => ({
    role: row.role,
    org: row.org,
    period: row.period,
    points: row.points,
  }));
}

export async function getAchievements(): Promise<AchievementData[]> {
  const rows = await withFallback(
    () => prisma.achievement.findMany({ orderBy: { order: "asc" } }),
    () => prismaReplica!.achievement.findMany({ orderBy: { order: "asc" } }),
    [],
  );
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    issuer: row.issuer,
    date: row.date,
    url: row.url,
    description: row.description,
  }));
}

export async function getFaqItems(): Promise<FaqItemData[]> {
  const rows = await withFallback(
    () => prisma.faqItem.findMany({ orderBy: { order: "asc" } }),
    () => prismaReplica!.faqItem.findMany({ orderBy: { order: "asc" } }),
    [],
  );
  return rows.map((row) => ({
    id: row.id,
    question: row.question,
    answer: row.answer,
  }));
}

export async function getPublishedPosts(limit?: number): Promise<PostSummary[]> {
  const rows = await withFallback(
    () => prisma.post.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, take: limit }),
    () => prismaReplica!.post.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, take: limit }),
    [],
  );
  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverImageUrl: row.coverImageUrl ? toProxiedUrl(row.coverImageUrl) : null,
    tags: row.tags,
    publishedAt: row.publishedAt,
  }));
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const row = await withFallback(
    () => prisma.post.findUnique({ where: { slug } }),
    () => prismaReplica!.post.findUnique({ where: { slug } }),
    null,
  );
  if (!row || !row.published) return null;

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImageUrl: row.coverImageUrl ? toProxiedUrl(row.coverImageUrl) : null,
    tags: row.tags,
    publishedAt: row.publishedAt,
  };
}
