"use client";

import { forwardRef } from "react";

import { cn } from "@/lib/utils";

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const PillButton = forwardRef<HTMLButtonElement, PillButtonProps>(function PillButton(
  { variant = "primary", size = "md", className = "", children, ...props },
  ref,
) {
  const baseClasses =
    "rounded-xl font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-all duration-150 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-60";

  const variantClasses = {
    primary: "bg-accent text-accent-foreground hover:opacity-90 active:scale-[0.985] active:duration-100",
    secondary: "border border-white/12 bg-white/[0.03] text-foreground hover:bg-white/[0.06]",
    ghost: "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
  } as const;

  const sizeClasses = {
    sm: "px-3 py-1.5",
    md: "px-4 py-2",
    lg: "px-6 py-3",
  } as const;

  return (
    <button ref={ref} className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)} {...props}>
      {children}
    </button>
  );
});
