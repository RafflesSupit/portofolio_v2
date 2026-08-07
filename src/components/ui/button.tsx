import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "@/components/ui/spinner";

const base =
  "tap-target relative inline-flex select-none items-center justify-center gap-2 rounded-md text-body-sm font-semibold transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3",
};

const variants = {
  solid: "bg-ink text-bg hover:-translate-y-px hover:brightness-110 active:translate-y-0 active:brightness-95",
  ghost:
    "bg-transparent text-ink border border-border-strong hover:border-ink hover:-translate-y-px active:translate-y-0",
  "solid-inverse":
    "bg-hero-ink text-hero-bg hover:-translate-y-px hover:brightness-110 active:translate-y-0",
  "ghost-inverse":
    "bg-transparent text-hero-ink border border-white/25 hover:border-white/60 hover:-translate-y-px active:translate-y-0",
};

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

type OwnProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and blocks interaction, without changing the button's size. */
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  className?: string;
};

type AsButton = OwnProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof OwnProps> & { href?: undefined };
type AsAnchor = OwnProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof OwnProps> & { href: string };

/**
 * Renders an <a> when `href` is passed, otherwise a <button>.
 * Handles loading/disabled state consistently across both.
 */
export type ButtonProps = AsButton | AsAnchor;

export function Button(props: ButtonProps) {
  const {
    variant = "solid",
    size = "md",
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    children,
    className,
    ...rest
  } = props;

  const classes = cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);

  const content = (
    <>
      {loading ? (
        <Spinner className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      ) : null}
      <span className={cn("inline-flex items-center gap-2", loading && "invisible")}>
        {leftIcon}
        {children}
        {rightIcon}
      </span>
    </>
  );

  if ("href" in rest && rest.href) {
    const { href, onClick, "aria-disabled": ariaDisabled, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };
    const isDisabled = loading || ariaDisabled === true || ariaDisabled === "true";
    return (
      <a
        {...anchorRest}
        href={href}
        className={classes}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        tabIndex={isDisabled ? -1 : anchorRest.tabIndex}
        onClick={isDisabled ? (e) => e.preventDefault() : onClick}
      >
        {content}
      </a>
    );
  }

  const { disabled, type, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      {...buttonRest}
      type={type ?? "button"}
      className={classes}
      aria-busy={loading || undefined}
      disabled={loading || disabled}
    >
      {content}
    </button>
  );
}
