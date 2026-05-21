import Link from "next/link";
import { Moon, Sun } from "lucide-react";

import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { cn } from "@/lib/utils";
import { typographyTokens } from "@/components/ui-system/tokens";

export function AppHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "border-border/70 bg-background/85 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-30 border-b backdrop-blur-xl",
        className,
      )}
    >
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary rounded-xl p-2">
            <Sun className="size-4 dark:hidden" />
            <Moon className="hidden size-4 dark:block" />
          </div>
          <div>
            <p className={cn(typographyTokens.label, "text-[10px]")}>Designers Hub</p>
            <p className="text-sm font-semibold tracking-tight">Community Design System</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/"
            className="hover:bg-accent rounded-lg px-3 py-1.5 text-sm transition-colors"
          >
            Home
          </Link>
          <Link
            href="/explore"
            className="hover:bg-accent rounded-lg px-3 py-1.5 text-sm transition-colors"
          >
            Explore
          </Link>
          <Link
            href="/architecture"
            className="hover:bg-accent rounded-lg px-3 py-1.5 text-sm transition-colors"
          >
            Architecture
          </Link>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
