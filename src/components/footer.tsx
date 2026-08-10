import { TextLink } from "@/components/ui/text-link";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/newsletter-form";
import type { ProfileData } from "@/lib/queries";

const siteLinks = [
  { href: "/#top", label: "Home" },
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

export function Footer({ profile }: { profile: ProfileData }) {
  return (
    <footer className="border-t border-white/10 bg-hero-bg px-6 pt-20 text-hero-text-2 md:px-8 md:pt-28">
      <div className="mx-auto max-w-[1180px]">
        <p className="text-caption text-hero-text-2">Get in touch</p>
        <h2 className="text-display-huge mt-4 max-w-[10ch] text-hero-ink">Let&apos;s talk.</h2>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button href={profile.socials.email} variant="solid-inverse">
            {profile.email}
          </Button>
        </div>

        <div className="mt-16 grid gap-12 border-t border-white/10 pt-12 md:grid-cols-[1fr_1fr_1.3fr]">
          <div>
            <p className="text-caption text-hero-text-2">Site</p>
            <nav className="mt-4 flex flex-col gap-2" aria-label="Footer site index">
              {siteLinks.map((link) => (
                <TextLink key={link.href} href={link.href} inverse className="w-fit">
                  {link.label}
                </TextLink>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-caption text-hero-text-2">Social</p>
            <nav className="mt-4 flex flex-col gap-2" aria-label="Footer social links">
              <TextLink href={profile.socials.github} target="_blank" rel="noreferrer" inverse className="w-fit">
                GitHub
              </TextLink>
              <TextLink href={profile.socials.linkedin} target="_blank" rel="noreferrer" inverse className="w-fit">
                LinkedIn
              </TextLink>
              <TextLink href={profile.socials.email} inverse className="w-fit">
                Email
              </TextLink>
            </nav>
          </div>

          <div>
            <p className="text-caption text-hero-text-2">Newsletter</p>
            <NewsletterForm className="mt-4 max-w-sm" />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-body-sm sm:flex-row">
          <p className="font-mono text-xs tracking-wide">
            © {new Date().getFullYear()} {profile.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
