"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ScrambleDigits } from "@/components/ui/scramble-digits";
import { NewsletterForm } from "@/components/newsletter-form";
import { Showreel } from "@/components/showreel";
import type { ProfileData } from "@/lib/queries";
import { cn } from "@/lib/cn";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";

/**
 * About, Projects, and Blog each have a real, complete page now — link to
 * those directly rather than an in-page homepage teaser, so "click About"
 * always means "go to the full story" regardless of which page you're on.
 * Experience/FAQ/Contact don't have enough content for their own page, so
 * they stay as homepage anchors.
 */
const links = [
  { href: "/about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

const pill = "rounded-xl border border-white/10 bg-surface/90 backdrop-blur-md";

const collapse = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

const EASE = [0.16, 1, 0.3, 1] as const;

const panelContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const panelBlock = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const navBlock = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE, staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const linkItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

/**
 * Header is a row of separate floating pills (not one continuous bar) —
 * matches estrela.studio's actual header structure. At top, logo + links +
 * a section-position counter + the menu trigger are all visible; on scroll
 * everything collapses to just the logo pill and the trigger pill, which
 * recenter via Framer's `layout` animation as siblings leave.
 */
export function Nav({ profile, projectCount }: { profile: ProfileData; projectCount: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrollActive, setScrollActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const shouldReduceMotion = useSafeReducedMotion();

  // Whole-document scroll progress — always correct on every route (unlike
  // the old "section N of 6" count, which broke once About/Projects/Blog
  // became real pages instead of homepage anchors: only half the links
  // still mapped to an actual scrollable section, so the number shown
  // rarely matched where you actually were).
  const { scrollYProgress } = useScroll();
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollPercent(Math.round(latest * 100));
  });

  useEffect(() => {
    // Hysteresis (80px to collapse, 40px to re-expand) instead of one hard
    // threshold — a single cutoff meant the collapse/expand animation could
    // re-trigger repeatedly from ordinary scroll jitter right at that pixel,
    // which read as rough rather than a single deliberate transition.
    function onScroll() {
      setScrolled((prev) => (prev ? window.scrollY > 40 : window.scrollY > 80));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Scroll-position tracking only makes sense for the homepage's own
    // anchor sections — on any other route there's nothing to observe.
    if (pathname !== "/") return;

    const anchorLinks = links.filter((l) => l.href.startsWith("/#"));
    const sections = anchorLinks
      .map((l) => document.querySelector(`#${l.href.split("#")[1]}`))
      .filter((el): el is Element => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setScrollActive(`/#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // The showreel preview <video> doesn't exist in the DOM until the
  // off-canvas menu actually opens, so it can't be preloaded directly —
  // hint the browser to start fetching the file as soon as there's a sign
  // of intent (hovering/focusing the menu trigger), well before the click.
  function preloadShowreel() {
    const url = profile.showreelUrl;
    if (!url) return;
    if (document.querySelector(`link[rel="preload"][href="${url}"]`)) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = url;
    document.head.appendChild(link);
  }

  const active = links.find((link) =>
    link.href.startsWith("/#")
      ? pathname === "/" && link.href === scrollActive
      : pathname === link.href || pathname.startsWith(`${link.href}/`),
  )?.href;
  const expanded = !scrolled;
  // Layout repositioning (the logo/dots pills sliding to recenter as
  // siblings leave) gets spring physics — Framer's own default for
  // `layout`, and it reads far more natural than forcing a fixed-duration
  // tween onto a spatial movement. Opacity/scale (the fade itself) stay on
  // a plain tween since those don't benefit from spring overshoot.
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : {
        layout: { type: "spring" as const, stiffness: 350, damping: 32 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6">
      <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-3">
        <motion.a
          layout
          transition={transition}
          href="/#top"
          className={cn(
            "flex items-center rounded-xl border px-5 py-3 font-display text-[15px] font-semibold tracking-[-0.01em] text-ink backdrop-blur-md transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            scrolled ? "border-transparent bg-transparent" : "border-white/10 bg-surface/90",
          )}
        >
          {profile.name}
        </motion.a>

        <AnimatePresence mode="popLayout">
          {expanded ? (
            <motion.nav
              layout
              key="links"
              {...(shouldReduceMotion ? {} : collapse)}
              transition={transition}
              className={cn(pill, "hidden items-center gap-6 px-6 py-3 md:flex")}
              aria-label="Primary"
            >
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={active === link.href ? "page" : undefined}
                  className={cn(
                    "group relative text-body-sm font-medium transition-colors duration-150",
                    active === link.href ? "text-ink" : "text-text-2 hover:text-ink",
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-1 left-0 h-px w-full origin-left bg-accent transition-transform duration-[250ms] ease-[cubic-bezier(0.65,0,0.35,1)]",
                      active === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </a>
              ))}
            </motion.nav>
          ) : null}
        </AnimatePresence>

        {/*
          Deliberately NOT gated behind `expanded` — needs to stay visible
          while actually scrolling, not just at the top of the page.
        */}
        <motion.div layout transition={transition} className="hidden items-center sm:flex">
          <div
            role="progressbar"
            aria-label="Reading progress"
            aria-valuenow={scrollPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            className={cn(
              "flex h-[46px] min-w-[46px] items-center justify-center rounded-xl border px-3 font-mono text-caption text-ink backdrop-blur-md transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              scrolled ? "border-transparent bg-transparent" : "border-white/10 bg-surface/90",
            )}
          >
            <span aria-hidden="true">
              <ScrambleDigits value={`${String(scrollPercent).padStart(2, "0")}%`} />
            </span>
          </div>
        </motion.div>

        <motion.button
          layout
          transition={transition}
          type="button"
          onClick={() => setOpen((v) => !v)}
          onMouseEnter={preloadShowreel}
          onFocus={preloadShowreel}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="off-canvas-menu"
          className={cn(
            "flex h-[46px] w-[46px] items-center justify-center rounded-xl border text-ink backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            scrolled ? "bg-transparent" : "bg-surface/90",
            scrolled || open ? "border-accent" : "border-white/10",
          )}
        >
          <DotsIcon />
        </motion.button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="off-canvas-menu"
            className="fixed inset-0 z-40 bg-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          >
            <motion.div
              // `justify-center` on mobile clipped the top of the first
              // link ("About") whenever the stacked-to-one-column content
              // (links + actions + showreel + newsletter) was taller than
              // the viewport — centering overflowing flex content lets the
              // start edge run past the container's top, and that portion
              // isn't reachable by scrolling. Desktop content reliably
              // fits one screen (that's the whole point of the two-column
              // layout), so centering stays there; mobile falls back to
              // top-aligned + normal scroll.
              className="no-scrollbar mx-auto flex h-full w-full max-w-[1180px] flex-col justify-start overflow-y-auto px-6 py-24 md:justify-center md:px-8"
              initial={shouldReduceMotion ? undefined : "hidden"}
              animate={shouldReduceMotion ? undefined : "visible"}
              exit={shouldReduceMotion ? undefined : "hidden"}
              variants={panelContainer}
            >
              <motion.div variants={panelBlock} className="flex items-center justify-between">
                <p className="text-caption text-text-3">
                  {String(projectCount).padStart(2, "0")} {projectCount === 1 ? "project" : "projects"} shipped
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="tap-target inline-flex items-center gap-2 text-text-3 transition-colors hover:text-ink"
                >
                  <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] font-semibold">
                    ESC
                  </kbd>
                  <CloseIcon />
                </button>
              </motion.div>

              <motion.div variants={panelBlock} className="mt-8 grid gap-12 md:grid-cols-[1fr_380px] md:items-start">
                <div>
                  <motion.nav variants={navBlock} className="flex flex-col" aria-label="Full menu">
                    {links.map((link, i) => (
                      <motion.a
                        key={link.href}
                        variants={linkItem}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "border-border py-4 text-h2 text-ink transition-colors hover:text-accent-ink",
                          i > 0 && "border-t",
                        )}
                      >
                        {link.label}
                      </motion.a>
                    ))}
                  </motion.nav>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <a
                      href={profile.socials.email}
                      className="text-body font-medium text-ink transition-colors hover:text-accent-ink"
                    >
                      Write us
                    </a>
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-body font-medium text-ink transition-colors hover:text-accent-ink"
                    >
                      Download CV
                    </a>
                    <a
                      href={profile.socials.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-body font-medium text-ink transition-colors hover:text-accent-ink"
                    >
                      GitHub
                    </a>
                    <a
                      href={profile.socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-body font-medium text-ink transition-colors hover:text-accent-ink"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>

                <div className="space-y-6">
                  <Showreel videoUrl={profile.showreelUrl} variant="preview" />
                  <div>
                    <p className="text-caption text-text-3">Newsletter</p>
                    <NewsletterForm className="mt-4" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function DotsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
