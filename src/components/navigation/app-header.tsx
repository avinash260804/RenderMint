import Link from "next/link";
import { Moon, Search, Settings, Sun } from "lucide-react";

import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { cn } from "@/lib/utils";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { prisma } from "@/server/db/client";

async function getHeaderUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: {
      username: true,
    },
  });

  return {
    email: user.email ?? "",
    username: profile?.username ?? null,
  };
}

export async function AppHeader({ className }: { className?: string }) {
  const user = await getHeaderUser();
  const profileHref = user?.username ? `/profile/${user.username}` : "/dashboard";

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-[oklch(0.7_0.2_45_/_0.12)] bg-[oklch(0.09_0.004_45_/_0.78)] backdrop-blur-xl supports-[backdrop-filter]:bg-[oklch(0.09_0.004_45_/_0.72)]",
        className,
      )}
    >
      <div className="container-shell flex min-h-16 flex-wrap items-center justify-between gap-4 py-3">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[oklch(0.78_0.12_75)]">
            <Sun className="size-4 dark:hidden" />
            <Moon className="hidden size-4 dark:block" />
          </div>
          <div className="min-w-0">
            <Link href="/" className="font-display text-[1.65rem] uppercase tracking-[0.24em] text-foreground">
              Atelier
            </Link>
            <p className="mt-[-0.15rem] font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
              Designers Hub · Community Design System
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          <Link href="/" className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground">
            Home
          </Link>
          <Link href="/explore" className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground">
            Explore
          </Link>
          <Link href="/search" className="inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground">
            <Search className="size-3.5" />
            Search
          </Link>
          <Link href="/post/new" className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground">
            Create Post
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground">
                Dashboard
              </Link>
              <Link href={profileHref} className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground">
                My Profile
              </Link>
              <Link href="/profile/me/edit" className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground">
                Edit Profile
              </Link>
              <Link href="/settings/profile" className="inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground">
                <Settings className="size-3.5" />
                Settings
              </Link>
              <Link href="/auth/signout" className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground">
                Sign Out
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground">
                Login
              </Link>
              <Link href="/signup" className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground">
                Signup
              </Link>
            </>
          )}
        </nav>

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
