import { TextLink } from "@/components/ui/text-link";
import type { ProfileData } from "@/lib/queries";

export function Footer({ profile }: { profile: ProfileData }) {
  return (
    <footer className="bg-hero-bg px-6 py-8 text-hero-text-2 md:px-8">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-4 text-body-sm sm:flex-row">
        <p className="font-mono text-xs tracking-wide">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <nav className="flex items-center gap-6" aria-label="Footer">
          <TextLink href={profile.socials.github} target="_blank" rel="noreferrer" inverse>
            GitHub
          </TextLink>
          <TextLink href={profile.socials.linkedin} target="_blank" rel="noreferrer" inverse>
            LinkedIn
          </TextLink>
          <TextLink href={profile.socials.email} inverse>
            Email
          </TextLink>
        </nav>
      </div>
    </footer>
  );
}
