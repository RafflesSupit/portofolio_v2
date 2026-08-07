"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import type { ProfileData } from "@/lib/queries";
import { cn } from "@/lib/cn";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#projects", label: "Projects" },
  { href: "/#blog", label: "Blog" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

export function Nav({ profile }: { profile: ProfileData }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sections = links
      .filter((l) => l.href.includes("#"))
      .map((l) => document.querySelector(`#${l.href.split("#")[1]}`))
      .filter((el): el is Element => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`/#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-3.5 md:px-8">
        <a
          href="/#top"
          className="font-display text-[15px] font-bold tracking-[-0.01em] text-ink"
        >
          {profile.name}
          {/* <span className="hidden text-text-3 sm:inline"> - {profile.role}</span> */}
        </a>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={active === link.href ? "page" : undefined}
              className={cn(
                "group relative py-2 text-body-sm font-medium transition-colors duration-150",
                active === link.href ? "text-ink" : "text-text-2 hover:text-ink",
              )}
            >
              {link.label}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-accent transition-transform duration-[250ms] ease-[cubic-bezier(0.65,0,0.35,1)]",
                  active === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                )}
              />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noreferrer"
            className="tap-target inline-flex items-center justify-center text-text-2 transition-colors hover:text-ink"
            aria-label="GitHub profile"
          >
            <GithubIcon />
          </a>
          <a
            href={profile.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="tap-target inline-flex items-center justify-center text-text-2 transition-colors hover:text-ink"
            aria-label="LinkedIn profile"
          >
            <LinkedinIcon />
          </a>
          <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="tap-target inline-flex items-center justify-center text-text-2"
            >
              <Button variant="ghost" size="sm" className="ml-auto">
                Download CV
              </Button>
            </a>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="tap-target inline-flex items-center justify-center text-ink"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        className="overflow-hidden transition-[max-height] duration-200 ease-in-out md:hidden"
        style={{ maxHeight: open ? "24rem" : "0px" }}
      >
        <nav
          className="flex flex-col gap-1 border-t border-border px-6 py-4"
          aria-label="Mobile"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-3 text-body font-medium text-text-2 transition-colors hover:bg-surface-2 hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex items-center gap-4 px-2 py-2">
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer"
              className="tap-target inline-flex items-center justify-center text-text-2"
              aria-label="GitHub profile"
            >
              <GithubIcon />
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="tap-target inline-flex items-center justify-center text-text-2"
              aria-label="LinkedIn profile"
            >
              <LinkedinIcon />
            </a>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="tap-target inline-flex items-center justify-center text-text-2"
            >
              <Button variant="ghost" size="sm" className="ml-auto">
                Download CV
              </Button>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.1-3.17.69-3.84-1.35-3.84-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.53-.29-5.19-1.27-5.19-5.63 0-1.24.44-2.26 1.17-3.06-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 2.87-.39c.97 0 1.95.13 2.87.39 2.19-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.75.11 3.04.73.8 1.17 1.82 1.17 3.06 0 4.37-2.67 5.34-5.21 5.62.41.36.77 1.07.77 2.15 0 1.55-.01 2.8-.01 3.18 0 .3.2.66.79.55A11.26 11.26 0 0 0 23.25 11.75C23.25 5.48 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45Z" />
    </svg>
  );
}
