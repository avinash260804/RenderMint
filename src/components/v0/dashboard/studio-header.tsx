"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDown, LayoutGrid, MessageSquare, Plus, Search } from "lucide-react"

type StudioHeaderProps = {
  userName?: string
  userInitials?: string
  currentDisciplineName?: string
  currentDisciplineSlug?: string | null
  disciplines?: Array<{ slug: string; name: string }>
  statusLine?: string
  createHref?: string
  critiqueHref?: string
}

const DEFAULT_DISCIPLINES = [{ slug: "architecture", name: "Architecture" }]

const DISCIPLINE_COLORS: Record<string, string> = {
  architecture: "oklch(0.65 0.10 200)",
  "interior-design": "oklch(0.70 0.16 35)",
  "urban-design": "oklch(0.65 0.15 140)",
}

function getDisciplineColor(slug?: string | null) {
  return (slug && DISCIPLINE_COLORS[slug]) || "oklch(0.70 0.20 45)"
}

export function StudioHeader({
  userName = "Atelier Member",
  userInitials = "AT",
  currentDisciplineName = "Architecture",
  currentDisciplineSlug = "architecture",
  disciplines = DEFAULT_DISCIPLINES,
  statusLine = "Discipline-aware dashboard active",
  createHref = "/post/new",
  critiqueHref = "/architecture/critique",
}: StudioHeaderProps) {
  const [showDisciplineMenu, setShowDisciplineMenu] = useState(false)
  const discColor = getDisciplineColor(currentDisciplineSlug)

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 flex h-[60px] items-center justify-between px-6 md:px-10"
      style={{
        background: "oklch(0.08 0 0 / 80%)",
        backdropFilter: "blur(16px)",
        borderBottom: "0.5px solid oklch(0.70 0.20 45 / 0.12)",
      }}
    >
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="font-display text-[22px] font-bold tracking-[0.28em] text-foreground">
          ATELIER
        </Link>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-3">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold text-background"
            style={{ background: discColor }}
            aria-label="User avatar"
          >
            {userInitials}
          </div>

          <div className="hidden gap-0.5 leading-none md:flex md:flex-col">
            <span className="text-[13px] font-semibold tracking-wide text-foreground">{userName}</span>
            <div className="relative">
              <button
                onClick={() => setShowDisciplineMenu((open) => !open)}
                className="group flex items-center gap-1"
                aria-expanded={showDisciplineMenu}
                aria-label="Switch discipline"
              >
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: discColor }}>
                  {currentDisciplineName}
                </span>
                <ChevronDown size={10} className="text-muted-foreground transition-colors group-hover:text-foreground" />
              </button>

              {showDisciplineMenu && (
                <div
                  className="absolute left-0 top-full z-50 mt-2 min-w-[220px] py-1"
                  style={{
                    background: "oklch(0.13 0 0)",
                    border: "0.5px solid oklch(0.22 0 0)",
                  }}
                >
                  {disciplines.map((discipline) => (
                    <Link
                      key={discipline.slug}
                      href={`/dashboard?discipline=${discipline.slug}`}
                      onClick={() => setShowDisciplineMenu(false)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-[11px] font-mono uppercase tracking-widest transition-colors hover:bg-muted/50"
                    >
                      <span
                        className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                        style={{ background: getDisciplineColor(discipline.slug) }}
                      />
                      <span
                        style={{
                          color:
                            discipline.slug === currentDisciplineSlug
                              ? getDisciplineColor(discipline.slug)
                              : "oklch(0.55 0 0)",
                        }}
                      >
                        {discipline.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden items-center gap-2 lg:flex">
        <span className="h-1.5 w-1.5 flex-shrink-0 animate-pulse rounded-full bg-accent" />
        <span className="font-mono text-[11px] tracking-wide text-muted-foreground">{statusLine}</span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/search"
          className="hidden items-center gap-2 border border-border px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-all hover:border-border/80 hover:text-foreground md:flex"
          aria-label="Search"
        >
          <Search size={12} />
          <span className="hidden lg:inline">Search</span>
        </Link>

        <div className="mx-1 h-4 w-px bg-border" />

        <Link
          href={createHref}
          className="flex items-center gap-1.5 border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-all hover:border-foreground/30 hover:text-foreground"
          aria-label="Create post"
        >
          <Plus size={11} />
          <span className="hidden sm:inline">New Post</span>
        </Link>

        <Link
          href={critiqueHref}
          className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-accent-foreground transition-opacity hover:opacity-90"
          style={{ background: "var(--accent)" }}
          aria-label="Open critique space"
        >
          <MessageSquare size={11} />
          <span className="hidden sm:inline">Critique</span>
        </Link>

        <div className="ml-1 hidden items-center gap-1 md:flex">
          <Link
            href="/dashboard"
            className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Dashboard"
          >
            <LayoutGrid size={14} />
          </Link>
        </div>
      </div>
    </header>
  )
}
