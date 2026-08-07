import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { ContactForm } from "@/components/contact-form";
import type { ProfileData } from "@/lib/queries";

export function Contact({ profile }: { profile: ProfileData }) {
  return (
    <section id="contact" className="bg-hero-bg px-6 py-24 text-hero-ink md:px-8 md:py-32">
      <div className="mx-auto max-w-[1180px]">
        <Reveal className="mx-auto max-w-[42rem] text-center">
          <SectionLabel>Contact</SectionLabel>
          <h2 className="text-display-l mt-4 text-hero-ink">Let&apos;s work together.</h2>
          <p className="mt-5 text-body-lg text-hero-text-2">
            I&apos;m open to full-time backend engineering roles and interesting
            problems in distributed systems. If that&apos;s what you&apos;re hiring
            for, I&apos;d like to hear from you.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href={profile.socials.email} variant="solid-inverse">
              {profile.email}
            </Button>
            <Button
              href={profile.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              variant="ghost-inverse"
            >
              LinkedIn
            </Button>
            <Button
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer"
              variant="ghost-inverse"
            >
              GitHub
            </Button>
          </div>

          <div className="mt-6 flex justify-center">
            <CopyButton
              value={profile.email}
              className="text-hero-text-2 hover:text-hero-ink"
            />
          </div>

          <div className="mt-14 border-t border-white/10 pt-10">
            <p className="text-body-sm text-hero-text-2">Or send a message directly:</p>
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
