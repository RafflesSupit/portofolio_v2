-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "challenge" TEXT,
ADD COLUMN     "gallery" TEXT[],
ADD COLUMN     "hasCaseStudy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "result" TEXT,
ADD COLUMN     "solution" TEXT;
