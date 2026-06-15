"use client"

import { useState } from "react"
import { ArrowRight, MessageSquarePlus, BookOpen } from "lucide-react"

/* ── Active Critiques data ── */
const CRITIQUES = [
  {
    id: 1,
    title: "Riverside Cultural Centre — Structural Section",
    designer: "Karan S.",
    level: "Practitioner",
    discipline: "Architecture",
    questions: [
      "Is my column grid legible across scales?",
      "Does the cantilever read structurally honest?",
    ],
    thumbnail: "RC",
  },
  {
    id: 2,
    title: "Adaptive Reuse: Former Mill Complex",
    designer: "Meera P.",
    level: "Student",
    discipline: "Architecture",
    questions: [
      "How can I improve the light-well proportions?",
      "Is the circulation narrative clear?",
    ],
    thumbnail: "AM",
  },
  {
    id: 3,
    title: "High-Rise Residential Skin Study",
    designer: "Liam O.",
    level: "Practitioner",
    discipline: "Architecture",
    questions: [
      "Does the façade rhythm carry from street level?",
      "Are materiality cues too literal?",
    ],
    thumbnail: "HR",
  },
  {
    id: 4,
    title: "Community Library — Interior Flow",
    designer: "Nadia V.",
    level: "Contributor",
    discipline: "Architecture",
    questions: [
      "Is spatial hierarchy intuitive for a first-time visitor?",
      "How does wayfinding read from the entrance?",
    ],
    thumbnail: "CL",
  },
]

/* ── Discussions data ── */
const DISCUSSIONS = [
  {
    id: 1,
    topic: "Does structural honesty still matter in contemporary architecture?",
    participants: 47,
    lastComment: 'Rafael A. - "The skin-and-structure split is a conceptual problem first."',
    heat: "live",
  },
  {
    id: 2,
    topic: "When does ornamentation become pastiche?",
    participants: 31,
    lastComment: 'Priya M. - "Context and intent are inseparable here."',
    heat: "warm",
  },
  {
    id: 3,
    topic: "Parametric tools: empowerment or crutch?",
    participants: 22,
    lastComment: `Soren L. - "Depends entirely on what you're optimizing for."`,
    heat: "warm",
  },
  {
    id: 4,
    topic: "How do we talk about ethics in urban density proposals?",
    participants: 14,
    lastComment: 'Yasmin T. - "We rarely name who bears the cost."',
    heat: "cold",
  },
  {
    id: 5,
    topic: "Section drawing as narrative vs. technical output",
    participants: 9,
    lastComment: 'Karan S. - "The best sections tell two stories at once."',
    heat: "cold",
  },
]

/* ── Resources data ── */
const RESOURCES = [
  {
    id: 1,
    title: "Drawing as Thinking: Section Notation in Practice",
    type: "Essay",
    sharedBy: "Rafael A.",
    relevance: "Section Drawing",
  },
  {
    id: 2,
    title: "Site Analysis Methodologies — from Observation to Diagram",
    type: "PDF Guide",
    sharedBy: "Discipline Lead",
    relevance: "Site Analysis",
  },
  {
    id: 3,
    title: "The Ethics of Adaptive Reuse",
    type: "Lecture",
    sharedBy: "Community",
    relevance: "Adaptive Reuse",
  },
]

const HEAT_STYLES: Record<string, { color: string; label: string }> = {
  live: { color: "oklch(0.65 0.15 140)", label: "Live" },
  warm: { color: "oklch(0.70 0.18 45)",  label: "Active" },
  cold: { color: "oklch(0.40 0 0)",       label: "Open" },
}

/* ── Critique card ── */
function CritiqueCard({ c }: { c: typeof CRITIQUES[0] }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="flex-shrink-0 w-72 flex flex-col cursor-pointer transition-all duration-200"
      style={{
        background: hovered 
          ? "linear-gradient(135deg, oklch(0.14 0 0) 0%, oklch(0.135 0.02 45 / 0.3) 100%)"
          : "linear-gradient(135deg, oklch(0.12 0 0) 0%, oklch(0.115 0.015 45 / 0.2) 100%)",
        border: `0.5px solid ${hovered ? "oklch(0.70 0.20 45 / 0.2)" : "oklch(0.70 0.20 45 / 0.1)"}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div
        className="h-28 flex items-center justify-center relative overflow-hidden"
        style={{ background: "oklch(0.13 0 0)" }}
      >
        <span className="font-display text-[32px] font-bold opacity-10">
          {c.thumbnail}
        </span>
        {/* Grid lines overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          preserveAspectRatio="none"
        >
          <line x1="33%" y1="0" x2="33%" y2="100%" stroke="oklch(0.5 0 0)" strokeWidth="0.5" />
          <line x1="66%" y1="0" x2="66%" y2="100%" stroke="oklch(0.5 0 0)" strokeWidth="0.5" />
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="oklch(0.5 0 0)" strokeWidth="0.5" />
        </svg>
        {/* Open tag */}
        <div
          className="absolute top-2 right-2 px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest"
          style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
        >
          Open
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        <div>
          <h3 className="text-[12px] font-semibold text-foreground leading-snug mb-1 text-pretty">
            {c.title}
          </h3>
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
            <span>{c.designer}</span>
            <span>·</span>
            <span
              className="px-1.5 py-0.5"
              style={{ background: "oklch(0.16 0 0)", border: "0.5px solid oklch(0.24 0 0)" }}
            >
              {c.level}
            </span>
          </div>
        </div>

        {/* Questions — visible on hover */}
        <div
          className="flex flex-col gap-1.5 overflow-hidden transition-all duration-200"
          style={{ maxHeight: hovered ? "80px" : "0px", opacity: hovered ? 1 : 0 }}
        >
          {c.questions.map((q, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[9px] font-mono text-accent mt-0.5 flex-shrink-0">Q{i + 1}</span>
              <span className="text-[10px] text-muted-foreground leading-relaxed">{q}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          className="mt-auto flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-accent hover:text-accent/80 transition-colors"
        >
          <MessageSquarePlus size={11} />
          Give Critique
        </button>
      </div>
    </div>
  )
}

/* ── Main component ── */
export function StudioFloor() {
  return (
    <section aria-label="Studio Floor" className="flex flex-col gap-10">

      {/* 3A — Active Critiques */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Active Critiques in Architecture
            </span>
            <span
              className="text-[9px] font-mono px-2 py-0.5 text-accent"
              style={{ background: "oklch(0.14 0 0)", border: "0.5px solid oklch(0.70 0.20 45 / 30%)" }}
            >
              {CRITIQUES.length} open
            </span>
          </div>
          <button className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
            Browse all <ArrowRight size={10} />
          </button>
        </div>

        {/* Horizontal scroll */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {CRITIQUES.map((c) => (
            <CritiqueCard key={c.id} c={c} />
          ))}
        </div>
      </div>

      {/* 3B & 3C — Discussions + Resources side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border">

        {/* Discussions — 2/3 width */}
        <div
          className="lg:col-span-2 flex flex-col gap-4 p-6"
          style={{ background: "var(--card)" }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Discipline Discussions
            </span>
            <button className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
              All threads <ArrowRight size={10} />
            </button>
          </div>

          <div className="flex flex-col">
            {DISCUSSIONS.map((d, i) => {
              const heat = HEAT_STYLES[d.heat]
              return (
                <div
                  key={d.id}
                  className="flex items-start gap-4 py-4 cursor-pointer hover:bg-muted/20 px-2 -mx-2 transition-colors group"
                  style={{ borderBottom: i < DISCUSSIONS.length - 1 ? "0.5px solid oklch(0.18 0 0)" : "none" }}
                >
                  {/* Heat indicator */}
                  <div className="flex flex-col items-center gap-1 pt-0.5 flex-shrink-0 w-8">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: heat.color }}
                    />
                    <span className="text-[8px] font-mono" style={{ color: heat.color }}>
                      {heat.label}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-foreground group-hover:text-foreground/90 leading-snug text-pretty">
                      {d.topic}
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground truncate">
                      {d.lastComment}
                    </p>
                  </div>

                  {/* Participant count */}
                  <div className="flex items-center gap-1 flex-shrink-0 text-[10px] font-mono text-muted-foreground">
                    <span>{d.participants}</span>
                    <span>voices</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Resources — 1/3 width */}
        <div
          className="flex flex-col gap-4 p-6"
          style={{ background: "var(--card)" }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Resources for You
            </span>
            <BookOpen size={12} className="text-muted-foreground" />
          </div>

          <p className="text-[10px] font-mono text-muted-foreground/70 leading-relaxed">
            Curated by discipline leads — relevant to your recent work
          </p>

          <div className="flex flex-col gap-3">
            {RESOURCES.map((r) => (
              <div
                key={r.id}
                className="flex flex-col gap-2 p-3 cursor-pointer hover:bg-muted/20 transition-colors"
                style={{ border: "0.5px solid oklch(0.20 0 0)" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-medium text-foreground leading-snug text-pretty">
                    {r.title}
                  </p>
                  <span
                    className="flex-shrink-0 text-[9px] font-mono px-1.5 py-0.5 text-muted-foreground uppercase tracking-wider"
                    style={{ background: "oklch(0.16 0 0)" }}
                  >
                    {r.type}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span>via {r.sharedBy}</span>
                  <span
                    className="px-1.5 py-0.5"
                    style={{ background: "oklch(0.14 0 0)", color: "oklch(0.50 0.10 45)" }}
                  >
                    {r.relevance}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
