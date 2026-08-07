import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { profile, skills, projects, experience } from "../src/lib/data";

const adapter = new PrismaPg(process.env.DATABASE_URL!, { schema: "portfolio" });
const prisma = new PrismaClient({ adapter });

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn("ADMIN_EMAIL/ADMIN_PASSWORD not set - skipping admin user seed.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });
  console.log(`Admin user ready: ${email}`);
}

async function seedProfile() {
  const existing = await prisma.profile.findFirst();
  const data = {
    name: profile.name,
    role: profile.role,
    eyebrow: profile.eyebrow,
    headline: profile.headline,
    subhead: profile.subhead,
    bio: profile.bio,
    email: profile.email,
    githubUrl: profile.socials.github,
    linkedinUrl: profile.socials.linkedin,
    location: profile.location,
    resumeUrl: profile.resumeUrl,
    focusText: "Backend & Microservices",
    currentlyText: "IT Business Integration Intern @ Alfamart",
    openToText: "Full-time backend roles",
    valueProposition:
      "Teams bring me in when a backend needs to hold up under real growth - I turn tangled, monolithic logic into RESTful APIs and independent services with clean boundaries, so features ship without fear of breaking something else in production.",
  };

  if (existing) {
    await prisma.profile.update({ where: { id: existing.id }, data });
  } else {
    await prisma.profile.create({ data });
  }
  console.log("Profile seeded.");
}

async function seedSkills() {
  await prisma.skillCategory.deleteMany();
  await prisma.skillCategory.createMany({
    data: skills.map((group, index) => ({
      category: group.category,
      items: group.items,
      order: index,
    })),
  });
  console.log(`Seeded ${skills.length} skill categories.`);
}

async function seedProjects() {
  for (const [index, project] of projects.entries()) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        title: project.title,
        type: project.type,
        role: project.role,
        year: project.year,
        description: project.description,
        highlights: project.highlights,
        tags: project.tags,
        href: project.href,
        imageUrl: project.image,
        order: index,
      },
      create: {
        slug: project.slug,
        title: project.title,
        type: project.type,
        role: project.role,
        year: project.year,
        description: project.description,
        highlights: project.highlights,
        tags: project.tags,
        href: project.href,
        imageUrl: project.image,
        order: index,
      },
    });
  }
  console.log(`Seeded ${projects.length} projects.`);
}

async function seedExperience() {
  await prisma.experienceItem.deleteMany();
  await prisma.experienceItem.createMany({
    data: experience.map((item, index) => ({
      role: item.role,
      org: item.org,
      period: item.period,
      points: item.points,
      order: index,
    })),
  });
  console.log(`Seeded ${experience.length} experience items.`);
}

async function main() {
  await seedAdminUser();
  await seedProfile();
  await seedSkills();
  await seedProjects();
  await seedExperience();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
