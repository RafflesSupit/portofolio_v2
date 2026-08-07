import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function TextLink({
  children,
  className,
  inverse = false,
  disabled = false,
  ...props
}: {
  children: ReactNode;
  className?: string;
  inverse?: boolean;
  disabled?: boolean;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : props.tabIndex}
      onClick={disabled ? (e) => e.preventDefault() : props.onClick}
      className={cn(
        "group relative inline-flex w-fit items-center py-2 text-body font-medium transition-colors duration-150",
        inverse ? "text-hero-text-2 hover:text-hero-ink" : "text-text-2 hover:text-ink",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      {...props}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-[250ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100"
        />
      </span>
    </a>
  );
}
