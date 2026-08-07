"use client";

import { useState, type AnchorHTMLAttributes, type ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

type CardBaseProps = {
  children: ReactNode;
  className?: string;
};

type CardAsDiv = CardBaseProps & { href?: undefined };
type CardAsAnchor = CardBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CardBaseProps> & { href: string };

export type CardProps = CardAsDiv | CardAsAnchor;

const cardClasses =
  "group block overflow-hidden rounded-lg border border-border bg-surface shadow-[var(--shadow-rest)] transition-shadow duration-300 hover:shadow-[var(--shadow-soft)] focus-visible:shadow-[var(--shadow-soft)]";

/** Container primitive. Renders as <a> when `href` is passed, else a plain <div>. */
export function Card(props: CardProps) {
  const { children, className, ...rest } = props;

  if ("href" in rest && rest.href) {
    return (
      <a className={cn(cardClasses, className)} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return <div className={cn(cardClasses, className)}>{children}</div>;
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

/**
 * Cover image with a graceful fallback: renders a branded gradient +
 * monogram if `src` is omitted, fails to load, or is still loading.
 */
export function CardMedia({
  src,
  alt = "",
  monogram,
  aspect = "video",
  className,
}: {
  src?: string;
  alt?: string;
  monogram?: string;
  aspect?: "video" | "square" | "portrait";
  className?: string;
}) {
  const [errored, setErrored] = useState(false);
  const showFallback = !src || errored;

  const aspectClass = { video: "aspect-video", square: "aspect-square", portrait: "aspect-[3/4]" }[aspect];

  return (
    <div className={cn("relative overflow-hidden border-b border-border", aspectClass, className)}>
      {showFallback ? (
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          style={{ background: "linear-gradient(135deg, var(--surface-2), var(--accent-bg))" }}
        >
          {monogram ? (
            <span className="text-display-l select-none text-accent-border" aria-hidden="true">
              {monogram}
            </span>
          ) : null}
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          onError={() => setErrored(true)}
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
      )}
    </div>
  );
}

export function CardSkeleton({ aspect = "video" }: { aspect?: "video" | "square" | "portrait" }) {
  const aspectClass = { video: "aspect-video", square: "aspect-square", portrait: "aspect-[3/4]" }[aspect];
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface" role="status" aria-label="Loading">
      <div className={cn("animate-pulse bg-surface-2", aspectClass)} />
      <div className="space-y-3 p-6">
        <div className="h-3 w-1/3 animate-pulse rounded bg-surface-2" />
        <div className="h-5 w-2/3 animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-surface-2" />
      </div>
    </div>
  );
}
