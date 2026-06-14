"use client"

import { useState } from "react"
import { ArrowRight, Clock, Users, Bookmark, ChevronRight } from "lucide-react"

const BRIEFS = [
  {
    id: 1,
    number: "01",
    title: "Redesign the wayfinding system for a public library",
    discipline: "Architecture",
    posted: "Contributor · Rafael A.",
    deadline: "5 days remaining",
    submissions: 7,
    description:
      "A mid-sized public library in a dense urban neighbourhood serves 3,000+ visitors weekly. The current wayfinding is confusing — visitors consistently miss the children's section and cannot locate the study pods. Propose a spatial and graphic wayfinding system.",
    constraints: ["No new construction", "Must work in low-light conditions", "Multi-language considered"],
    saved: false,
  },
  {
    id: 2,
    number: "02",
    title: "Typographic identity for a fictional architecture firm",
    discipline: "Architecture",
    posted: "Mentor · Soren L.",
    deadline: "3 days remaining",
    submissions: 12,
    description:
      "The firm is named 'Threshold' — founded in 2024, specialising in adaptive reuse. They operate at the intersection of heritage preservation and contemporary living. Design a typographic identity that communicates exactness without coldness.",
    constraints: ["Logotype only — no pictorial marks", "Must work at 12pt and billboard scale", "Black and white first"],
    saved: true,
  },
  {
    id: 3,
    number: "03",
    title: "A shelter for a mountaineer's base camp — altitude 4,200m",
    discipline: "Architecture",
    posted: "Community · Yasmin T.",
    deadline: "8 days remaining",
    submissions: 4,
    description:
      "Propose a temporary shelter structure for a 6-person mountaineering team at 4,200 metres. It must be transported in two 25-litre packs, assembled in under 40 minutes, and withstand winds of 100km/h.",
    constraints: ["Max weight 18kg total", "No powered tools for assembly", "Must handle −20°C"],
    saved: false,
  },
]

function BriefCard({ brief, featured }: { brief: typeof BRIEFS[0]; featured?: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const [saved, setSaved] = useState(brief.saved)

  return (
    <div
      className="flex flex-col cursor-pointer transition-all duration-200 group"
      style={{
        background: featured 
          ? "linear-gradient(135deg, oklch(0.12 0 0) 0%, oklch(0.115 0.02 45 / 0.3) 100%)"
          : "linear-gradient(135deg, oklch(0.105 0 0) 0%, oklch(0.10 0.01 270 / 0.15) 100%)",
        border: featured
          ? "0.5px solid oklch(0.70 0.20 45 / 0.2)"
          : "0.5px solid oklch(0.18 0 0)",
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-4 p-5">
        {/* Brief number */}
        <span
          className="font-display text-[28px] leading-none font-bold flex-shrink-0 mt-0.5 opacity-20"
          style={{ color: featured ? "var(--accent)" : "var(--foreground)" }}
        >
          {brief.number}
        </span>

        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3
              className="text-[13px] font-semibold text-foreground leading-snug text-pretty"
              style={{ color: featured ? "oklch(0.98 0 0)" : undefined }}
            >
              {brief.title}
            </h3>
            {/* Save */}
            <button
              onClick={(e) => { e.stopPropagation(); setSaved(!saved) }}
              className="flex-shrink-0 transition-colors"
              aria-label={saved ? "Unsave brief" : "Save brief"}
            >
              <Bookmark
                size={13}
                style={{
                  fill: saved ? "var(--accent)" : "transparent",
                  stroke: saved ? "var(--accent)" : "oklch(0.40 0 0)",
                }}
              />
            </button>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-muted-foreground">
            <span>{brief.posted}</span>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Clock size={10} />
              <span style={{ color: brief.deadline.includes("3") ? "var(--accent)" : undefined }}>
                {brief.deadline}
              </span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Users size={10} />
              <span>{brief.submissions} submissions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable body */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-5 pb-4 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
      >
        <ChevronRight
          size={11}
          className="transition-transform duration-200"
          style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
        />
        {expanded ? "Hide brief" : "Read brief"}
      </button>

      {expanded && (
        <div className="px-5 pb-5 flex flex-col gap-4" style={{ borderTop: "0.5px solid oklch(0.18 0 0)" }}>
          <p className="text-[11px] text-muted-foreground leading-relaxed pt-4">
            {brief.description}
          </p>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Constraints
            </span>
            <div className="flex flex-col gap-1.5">
              {brief.constraints.map((c, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[10px] font-mono text-accent mt-0.5">—</span>
                  <span className="text-[11px] text-muted-foreground">{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA row */}
          <div className="flex items-center gap-3 pt-1">
            <button
              className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-mono uppercase tracking-widest text-accent-foreground hover:opacity-90 transition-opacity"
              style={{ background: "var(--accent)" }}
            >
              Submit Response <ArrowRight size={11} />
            </button>
            <button className="text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
              View {brief.submissions} submissions
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function BriefBoard() {
  return (
    <section aria-label="Brief Board" className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              The Brief Board
            </span>
            <span
              className="text-[9px] font-mono px-2 py-0.5 text-accent uppercase tracking-widest"
              style={{ background: "oklch(0.14 0 0)", border: "0.5px solid oklch(0.70 0.20 45 / 30%)" }}
            >
              Architecture · {BRIEFS.length} active
            </span>
          </div>
        </div>
        <div className="flex-1 h-px bg-border" />
        <button className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest flex-shrink-0">
          Post a brief <ArrowRight size={10} />
        </button>
      </div>

      {/* Brief board context */}
      <p className="text-[11px] text-muted-foreground leading-relaxed max-w-2xl">
        Creative briefs posted by Contributors and Mentors — real-world-inspired design challenges with community critique loops. Not a contest. Collaborative practice.
      </p>

      {/* Brief cards — first one is featured */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-border">
        {BRIEFS.map((brief, i) => (
          <BriefCard key={brief.id} brief={brief} featured={i === 0} />
        ))}
      </div>
    </section>
  )
}
