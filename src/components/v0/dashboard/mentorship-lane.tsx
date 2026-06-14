"use client"

import { ArrowRight, Award, Clock } from "lucide-react"

const MENTORS = [
  {
    id: 1,
    name: "Rafael Andrade",
    initials: "RA",
    title: "Principal Architect",
    level: "Mentor",
    availability: "open",
    disciplines: ["Architecture", "Urban Design"],
    focus: "Structural Narrative",
    bio: "15 years in practice. Believes the best architecture explains itself.",
  },
  {
    id: 2,
    name: "Soren Larsen",
    initials: "SL",
    title: "Design Director",
    level: "Mentor",
    availability: "busy",
    disciplines: ["Architecture"],
    focus: "Adaptive Reuse",
    bio: "Specialises in transformation of industrial heritage sites.",
  },
  {
    id: 3,
    name: "Yasmin Tahir",
    initials: "YT",
    title: "Urban Designer",
    level: "Contributor",
    availability: "open",
    disciplines: ["Architecture", "Urban Design"],
    focus: "Public Space",
    bio: "Research background. Writes extensively on density ethics.",
  },
]

const AVAILABILITY: Record<string, { label: string; color: string }> = {
  open:   { label: "Open",     color: "oklch(0.65 0.15 140)" },
  busy:   { label: "Busy",     color: "oklch(0.70 0.18 45)"  },
  hiatus: { label: "On Hiatus",color: "oklch(0.40 0 0)"      },
}

const CRITIC_OF_WEEK = {
  name: "Priya Menon",
  initials: "PM",
  title: "Senior Designer",
  reason: "Exceptional depth and constructive empathy across 12 critiques this week — always naming both the strength and the specific improvement.",
  critiqueCount: 12,
}

export function MentorshipLane() {
  return (
    <aside
      aria-label="Mentorship Lane"
      className="flex flex-col gap-6"
    >
      {/* Mentor header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Mentorship Lane
        </span>
        <span
          className="text-[9px] font-mono px-2 py-0.5 uppercase tracking-widest text-muted-foreground"
          style={{ border: "0.5px solid oklch(0.22 0 0)" }}
        >
          Architecture
        </span>
      </div>

      <p className="text-[10px] font-mono text-muted-foreground/70 leading-relaxed -mt-2">
        Reputation-earned. Community-moderated. No marketplace.
      </p>

      {/* Mentor list */}
      <div className="flex flex-col gap-2">
        {MENTORS.map((m) => {
          const avail = AVAILABILITY[m.availability]
          return (
            <div
              key={m.id}
              className="flex flex-col gap-3 p-4 cursor-pointer hover:bg-muted/20 transition-colors group"
              style={{ border: "0.5px solid oklch(0.20 0 0)" }}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div
                  className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-[11px] font-semibold text-background"
                  style={{ background: "oklch(0.65 0.10 200)" }}
                >
                  {m.initials}
                </div>

                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-semibold text-foreground group-hover:text-foreground/90">
                      {m.name}
                    </span>
                    {/* Availability dot */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: avail.color }}
                      />
                      <span className="text-[9px] font-mono" style={{ color: avail.color }}>
                        {avail.label}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {m.title}
                  </span>
                </div>
              </div>

              {/* Level + focus */}
              <div className="flex items-center gap-2">
                <span
                  className="text-[9px] font-mono px-1.5 py-0.5 uppercase tracking-widest"
                  style={{ background: "oklch(0.15 0 0)", color: "oklch(0.60 0 0)", border: "0.5px solid oklch(0.22 0 0)" }}
                >
                  {m.level}
                </span>
                <span className="text-[9px] font-mono text-muted-foreground">
                  Focus: {m.focus}
                </span>
              </div>

              {/* Bio */}
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {m.bio}
              </p>

              {/* Request session */}
              <button
                className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest transition-colors"
                style={{
                  color: m.availability === "open" ? "var(--accent)" : "oklch(0.40 0 0)",
                  cursor: m.availability === "open" ? "pointer" : "not-allowed",
                }}
                disabled={m.availability !== "open"}
              >
                {m.availability === "open" ? (
                  <>Request a Session <ArrowRight size={10} /></>
                ) : (
                  <><Clock size={10} /> Currently unavailable</>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          Recognition
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Critic of the week */}
      <div
        className="flex flex-col gap-4 p-5"
        style={{ background: "oklch(0.12 0 0)", border: "0.5px solid oklch(0.70 0.20 45 / 25%)" }}
      >
        <div className="flex items-center gap-2">
          <Award size={13} className="text-accent flex-shrink-0" />
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-accent">
            Critic of the Week
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 flex-shrink-0 flex items-center justify-center text-[12px] font-semibold text-accent-foreground"
            style={{ background: "var(--accent)" }}
          >
            {CRITIC_OF_WEEK.initials}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-semibold text-foreground">
              {CRITIC_OF_WEEK.name}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-muted-foreground">
                {CRITIC_OF_WEEK.title}
              </span>
              <span
                className="text-[9px] font-mono px-1.5 py-0.5 text-accent"
                style={{ background: "oklch(0.14 0 0)", border: "0.5px solid oklch(0.70 0.20 45 / 30%)" }}
              >
                {CRITIC_OF_WEEK.critiqueCount} critiques
              </span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed italic">
          &ldquo;{CRITIC_OF_WEEK.reason}&rdquo;
        </p>

        <button className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-accent hover:text-accent/80 transition-colors">
          View their critiques <ArrowRight size={10} />
        </button>
      </div>
    </aside>
  )
}
