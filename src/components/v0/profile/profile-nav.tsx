"use client"

import Link from "next/link"
import { Bell, LayoutGrid, Plus, Search, Settings } from "lucide-react"

type ProfileNavProps = {
  userName?: string
  userInitials?: string
  disciplineName?: string
  experienceLevel?: string
  statusLine?: string
}

export function ProfileNav({
  userName = "Avinash Varma",
  userInitials = "AV",
  disciplineName = "Architecture",
  experienceLevel = "Mid-Level",
  statusLine = "Working on residential facade studies",
}: ProfileNavProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-12 items-center border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex w-full items-center gap-8 px-6">
        <Link
          href="/dashboard"
          className="shrink-0 text-[18px] tracking-[0.28em] text-foreground"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          ATELIER
        </Link>

        <div className="flex items-center gap-3 border-l border-border pl-6">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[10px] font-mono font-medium shrink-0"
            style={{
              background: "oklch(0.13 0.004 60)",
              color: "oklch(0.70 0.20 45)",
              border: "1.5px solid oklch(0.70 0.20 45)",
            }}
          >
            {userInitials}
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[13px] font-medium tracking-tight text-foreground">{userName}</span>
            <span className="label-micro mt-0.5">
              {disciplineName}
              <span className="mx-1 text-muted-foreground/50">·</span>
              {experienceLevel}
            </span>
          </div>
        </div>

        <div className="ml-4 hidden items-center gap-2 md:flex">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "oklch(0.70 0.20 45)" }} />
          <span className="font-mono text-[11px] tracking-wide text-muted-foreground">{statusLine}</span>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/search"
            className="flex h-8 items-center gap-2 border border-border px-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-all duration-200 hover:border-muted-foreground/50 hover:text-foreground"
            aria-label="Search"
          >
            <Search size={12} />
            <span className="hidden sm:inline">Search</span>
          </Link>

          <button
            className="relative flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-all duration-200 hover:border-muted-foreground/50 hover:text-foreground"
            aria-label="Notifications"
            type="button"
          >
            <Bell size={13} />
          </button>

          <Link
            href="/post/new"
            className="hidden h-8 items-center gap-2 border border-border px-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-all duration-200 hover:border-muted-foreground/50 hover:text-foreground sm:flex"
            aria-label="New post"
          >
            <Plus size={12} />
            New Post
          </Link>

          <Link
            href="/dashboard"
            className="flex h-8 items-center gap-2 px-4 font-mono text-[11px] uppercase tracking-widest font-medium transition-all duration-200"
            style={{ background: "oklch(0.70 0.20 45)", color: "oklch(0.08 0 0)" }}
            aria-label="Dashboard"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard"
            className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-all duration-200 hover:border-muted-foreground/50 hover:text-foreground"
            aria-label="Grid view"
          >
            <LayoutGrid size={13} />
          </Link>

          <Link
            href="/settings"
            className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-all duration-200 hover:border-muted-foreground/50 hover:text-foreground"
            aria-label="Settings"
          >
            <Settings size={13} />
          </Link>
        </div>
      </div>
    </header>
  )
}

