"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NewsletterForm } from "@/components/newsletter-form";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";
import { cn } from "@/lib/cn";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const TRIGGER_CLASSES = {
  // Text-link style (currently unused, kept for reuse elsewhere).
  subtle:
    "inline-flex items-center gap-2 text-body font-medium text-ink transition-colors hover:text-accent-ink",
  // Hero: prominent, shown at every viewport, matches the ghost CTA buttons beside it.
  prominent:
    "tap-target inline-flex items-center gap-2.5 rounded-md border border-white/25 px-6 py-3 text-body-sm font-semibold text-hero-ink transition-all duration-200 hover:-translate-y-px hover:border-white/60",
};

/**
 * Trigger + video modal. `variant="preview"` (off-canvas menu) renders an
 * always-playing muted/looping preview clip that expands into the full
 * modal on click; `"prominent"` (Hero) is a CTA button. Renders nothing
 * until a real video is set in /admin/profile — no placeholder/fake video
 * is shown.
 */
export function Showreel({
  videoUrl,
  variant = "subtle",
}: {
  videoUrl: string | null;
  variant?: keyof typeof TRIGGER_CLASSES | "preview";
}) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useSafeReducedMotion();

  // The modal is portaled to <body> (see the render below) so it can never
  // end up trapped inside an ancestor's `transform` — e.g. the nav's pills
  // use Framer's `layout` prop, which keeps an active transform on them at
  // all times, and a `position: fixed` descendant of a transformed ancestor
  // is contained by *that ancestor's box* per the CSS spec, not the
  // viewport. That silently squeezed this modal into a ~150x50px pill.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();

    const trigger = triggerRef.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      trigger?.focus();
    };
  }, [open]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    // Sets the DOM property directly rather than relying on React's `muted`
    // prop reconciliation — React has a longstanding bug where updating
    // `muted` purely via a prop change doesn't reliably reach the media
    // element, so the state below is for the icon only; this line is what
    // actually (un)mutes the audio.
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  function handleSeek(e: ChangeEvent<HTMLInputElement>) {
    const video = videoRef.current;
    if (!video) return;
    const time = Number(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }
    playerRef.current?.requestFullscreen();
  }

  if (!videoUrl) return null;

  const modal = (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Showreel"
        >
          <motion.div
            ref={panelRef}
            className="relative w-full max-w-3xl"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close showreel"
              className="tap-target absolute -top-12 right-0 inline-flex items-center justify-center text-hero-ink"
            >
              <CloseIcon />
            </button>

            <div
              ref={playerRef}
              className="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-black"
            >
              <video
                ref={videoRef}
                src={videoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pb-3 pt-10">
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Seek"
                  className="h-1 w-full cursor-pointer accent-accent"
                />
                <div className="mt-2 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={playing ? "Pause video" : "Play video"}
                      className="tap-target inline-flex items-center justify-center text-white"
                    >
                      {playing ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={muted ? "Unmute video" : "Mute video"}
                      className="tap-target inline-flex items-center justify-center text-white"
                    >
                      {muted ? <MuteIcon /> : <VolumeIcon />}
                    </button>
                    <span className="font-mono text-caption text-white/70">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-label="Toggle fullscreen"
                    className="tap-target inline-flex items-center justify-center text-white"
                  >
                    <FullscreenIcon />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-lg border border-white/10 bg-black/40 p-6">
              <p className="text-caption text-hero-text-2">Stay in the loop</p>
              <NewsletterForm className="mt-4" />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      {variant === "preview" ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          data-cursor-hover
          aria-label="Play showreel"
          className="group relative block aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-black"
        >
          {/* Shown until the video actually has a frame to paint — a plain
              pulse placeholder (same pattern as CardSkeleton elsewhere),
              since there's no separate poster-image field to upload one. */}
          {!previewReady ? (
            <div className="absolute inset-0 animate-pulse bg-surface-2" aria-hidden="true" />
          ) : null}
          <video
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={() => setPreviewReady(true)}
            className={cn(
              "h-full w-full object-cover transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]",
              previewReady ? "opacity-100" : "opacity-0",
            )}
          />
          {/* Same bottom-gradient-with-sliding-label treatment as the project
              thumbnails elsewhere on the site (see ProjectMedia in
              project-list.tsx). No `data-cursor-label` on this button — the
              cursor's own text pill would just repeat "watch/play" a second
              time alongside this label. `data-cursor-hover` alone still
              grows the cursor circle on hover, same generic affordance as
              every other link/button, just without a duplicated word. */}
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 translate-y-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10 transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
              "pointer-fine:translate-y-full pointer-fine:group-hover:translate-y-0",
            )}
          >
            <p className="text-meta text-white/90">Watch full reel</p>
          </div>
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          data-cursor-hover
          data-cursor-label="Play"
          className={TRIGGER_CLASSES[variant]}
        >
          <PlayIcon />
          Showreel
        </button>
      )}

      {mounted ? createPortal(modal, document.body) : null}
    </>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 4.5v15l14-7.5-14-7.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 4.5h4v15H6v-15Zm8 0h4v15h-4v-15Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
      <path
        d="M16.5 8.5a5 5 0 0 1 0 7M19 6a9 9 0 0 1 0 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MuteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
      <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}
