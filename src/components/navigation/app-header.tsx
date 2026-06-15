import Link from "next/link";
import { Moon, Sun } from "lucide-react";

import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { cn } from "@/lib/utils";

export function AppHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-[oklch(0.7_0.2_45_/_0.12)] bg-[oklch(0.09_0.004_45_/_0.78)] backdrop-blur-xl supports-[backdrop-filter]:bg-[oklch(0.09_0.004_45_/_0.72)]",
        className,
      )}
    >
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[oklch(0.78_0.12_75)]">
            <Sun className="size-4 dark:hidden" />
            <Moon className="hidden size-4 dark:block" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-[1.65rem] uppercase tracking-[0.24em] text-foreground">
              Atelier
            </p>
            <p className="mt-[-0.15rem] font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
              Designers Hub · Community Design System
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-5 lg:flex">
          <Link
            href="/"
            className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/explore"
            className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Explore
          </Link>
          <Link
            href="/architecture"
            className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Architecture
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 xl:flex">
            <span className="size-1.5 rounded-full bg-[oklch(0.7_0.2_45)]" />
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
              Community archive live
            </span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
