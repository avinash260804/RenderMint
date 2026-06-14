"use client"

import {
  Flame,
  ArrowRight,
  MessageCircle,
  Users,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

const SKILL_TAGS = ["AutoCAD", "Section Drawing", "Site Analysis", "Structural Logic"]

const CRITIQUE_REQUESTS = [
  { name: "Priya M.", project: "Urban Mixed-Use Proposal", avatar: "PM" },
  { name: "Lena K.", project: "Residential Façade Study", avatar: "LK" },
]

const STREAK_DAYS = [true, true, true, false, true, true, false]
const TODAY_IDX = 6

export function StudioStatePanel() {
  return (
    <section aria-label="Studio State" className="w-full">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Studio State
        </span>
        <div className="flex-1 h-px bg-border" />
        <span className="text-[10px] font-mono text-muted-foreground">Thu, 12 Jun 2026</span>
      </div>

      {/* 3-column grid with chamfered cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ── Column A: Craft Momentum ── */}
        <div
          className="flex flex-col gap-5 p-6 chamfered-card"
        >
          {/* Label */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
              Craft Momentum
            </span>
            <Flame size={13} className="text-accent" />
          </div>

          {/* Last worked on */}
          <div className="flex gap-3">
            <div
              className="w-14 h-14 flex-shrink-0"
              style={{ background: "oklch(0.16 0 0)", border: "0.5px solid oklch(0.24 0 0)" }}
            >
              {/* WIP thumbnail placeholder — grid lines */}
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="opacity-40">
                <line x1="0" y1="14" x2="56" y2="14" stroke="oklch(0.5 0 0)" strokeWidth="0.5"/>
                <line x1="0" y1="28" x2="56" y2="28" stroke="oklch(0.5 0 0)" strokeWidth="0.5"/>
                <line x1="0" y1="42" x2="56" y2="42" stroke="oklch(0.5 0 0)" strokeWidth="0.5"/>
                <line x1="14" y1="0" x2="14" y2="56" stroke="oklch(0.5 0 0)" strokeWidth="0.5"/>
                <line x1="28" y1="0" x2="28" y2="56" stroke="oklch(0.5 0 0)" strokeWidth="0.5"/>
                <line x1="42" y1="0" x2="42" y2="56" stroke="oklch(0.5 0 0)" strokeWidth="0.5"/>
              </svg>
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-[11px] text-muted-foreground font-mono">Last worked on</span>
              <span className="text-[13px] font-semibold text-foreground leading-snug">
                Riverside Cultural Centre
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                Phase 2 — Structural Section
              </span>
            </div>
          </div>

          {/* Skills this week */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Skills practiced this week
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SKILL_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] font-mono text-foreground/70"
                  style={{ background: "oklch(0.18 0 0)", border: "0.5px solid oklch(0.26 0 0)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Craft streak */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Craft Streak
              </span>
              <span className="text-[11px] font-mono text-accent font-medium">5 days</span>
            </div>
            <div className="flex gap-1.5">
              {STREAK_DAYS.map((active, i) => (
                <div
                  key={i}
                  className="h-1.5 flex-1 transition-all"
                  style={{
                    background: active
                      ? i === TODAY_IDX
                        ? "var(--accent)"
                        : "oklch(0.50 0.12 45)"
                      : "oklch(0.18 0 0)",
                    border: `0.5px solid ${active ? "transparent" : "oklch(0.24 0 0)"}`,
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between">
              {["M","T","W","T","F","S","S"].map((d, i) => (
                <span key={i} className="text-[9px] font-mono text-muted-foreground flex-1 text-center">
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            className="mt-auto flex items-center justify-between w-full px-4 py-2.5 text-[11px] font-mono uppercase tracking-widest text-accent-foreground hover:opacity-90 transition-opacity"
            style={{ background: "var(--accent)" }}
          >
            <span>Continue Project</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* ── Column B: Community Pulse ── */}
        <div
          className="flex flex-col gap-5 p-6 chamfered-card"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
              Community Pulse
            </span>
            <Users size={13} className="text-foreground/40" />
          </div>

          {/* Pending critiques */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Pending Critique Requests
            </span>
            <div className="flex flex-col gap-1.5">
              {CRITIQUE_REQUESTS.map((req) => (
                <div
                  key={req.name}
                  className="flex items-center gap-3 px-3 py-2.5 group cursor-pointer hover:bg-muted/30 transition-colors"
                  style={{ border: "0.5px solid oklch(0.22 0 0)" }}
                >
                  <div
                    className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-[9px] font-semibold text-background"
                    style={{ background: "oklch(0.65 0.10 200)" }}
                  >
                    {req.avatar}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-medium text-foreground">{req.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground truncate">
                      {req.project}
                    </span>
                  </div>
                  <MessageCircle
                    size={11}
                    className="ml-auto text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Mentor feedback indicator */}
          <div
            className="flex items-start gap-3 px-3 py-3"
            style={{ background: "oklch(0.13 0 0)", border: "0.5px solid oklch(0.22 0 0)" }}
          >
            <CheckCircle2 size={13} className="text-accent mt-0.5 flex-shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-medium text-foreground">
                New feedback from Mentor
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                Rafael A. replied on your Section Drawing thread
              </span>
            </div>
          </div>

          {/* Discussion of the day */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Discussion of the Day
            </span>
            <div
              className="px-3 py-3 cursor-pointer hover:bg-muted/20 transition-colors"
              style={{ border: "0.5px solid oklch(0.28 0 0)" }}
            >
              <p className="text-[12px] font-medium text-foreground leading-relaxed mb-1 text-pretty">
                &ldquo;Does structural honesty still matter in contemporary architecture?&rdquo;
              </p>
              <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                <span>Architecture · 47 voices</span>
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: "oklch(0.65 0.15 140)" }}
                />
                <span style={{ color: "oklch(0.65 0.15 140)" }}>Live</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            className="mt-auto flex items-center justify-between w-full px-4 py-2.5 text-[11px] font-mono uppercase tracking-widest text-foreground hover:text-foreground/80 transition-colors"
            style={{ border: "0.5px solid oklch(0.28 0 0)" }}
          >
            <span>Give Critique</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* ── Column C: Growth Signal ── */}
        <div
          className="flex flex-col gap-5 p-6 chamfered-card"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
              Growth Signal
            </span>
            <TrendingUp size={13} className="text-foreground/40" />
          </div>

          {/* Discipline arc */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Discipline Arc
              </span>
              <span
                className="text-[10px] font-mono px-2 py-0.5 uppercase tracking-widest"
                style={{ background: "oklch(0.16 0 0)", color: "oklch(0.65 0.10 200)", border: "0.5px solid oklch(0.65 0.10 200 / 40%)" }}
              >
                Practitioner
              </span>
            </div>

            {/* Level steps */}
            <div className="flex gap-1">
              {["Student", "Practitioner", "Contributor", "Mentor"].map((level, i) => {
                const filled = i <= 1
                const active = i === 1
                return (
                  <div key={level} className="flex-1 flex flex-col gap-1">
                    <div
                      className="h-1"
                      style={{
                        background: active
                          ? "var(--accent)"
                          : filled
                            ? "oklch(0.40 0 0)"
                            : "oklch(0.18 0 0)",
                      }}
                    />
                    <span
                      className="text-[8.5px] font-mono truncate"
                      style={{ color: active ? "var(--accent)" : "oklch(0.38 0 0)" }}
                    >
                      {level}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Progress within Practitioner */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between">
                <span className="text-[10px] font-mono text-muted-foreground">
                  To Contributor
                </span>
                <span className="text-[10px] font-mono text-foreground/70">68%</span>
              </div>
              <div className="h-0.5 bg-muted w-full">
                <div
                  className="h-full"
                  style={{ width: "68%", background: "var(--accent)" }}
                />
              </div>
            </div>
          </div>

          {/* Recent milestone */}
          <div
            className="flex items-start gap-3 px-3 py-3"
            style={{ background: "oklch(0.13 0 0)", border: "0.5px solid oklch(0.22 0 0)" }}
          >
            <span
              className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-[11px]"
              style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
            >
              +
            </span>
            <div>
              <span className="text-[11px] font-medium text-foreground block">
                Skill unlocked: Site Analysis
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                Logged 8 sessions in 14 days
              </span>
            </div>
          </div>

          {/* Nudge */}
          <div
            className="flex items-start gap-3 px-3 py-3"
            style={{ border: "0.5px solid oklch(0.30 0.06 45 / 50%)" }}
          >
            <AlertCircle size={13} className="text-accent/70 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[11px] text-foreground/80 leading-relaxed text-pretty">
                You haven&apos;t received a critique in 14 days — post a WIP?
              </span>
            </div>
          </div>

          {/* CTA */}
          <button
            className="mt-auto flex items-center justify-between w-full px-4 py-2.5 text-[11px] font-mono uppercase tracking-widest text-foreground hover:text-foreground/80 transition-colors"
            style={{ border: "0.5px solid oklch(0.28 0 0)" }}
          >
            <span>Post for Critique</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </section>
  )
}
