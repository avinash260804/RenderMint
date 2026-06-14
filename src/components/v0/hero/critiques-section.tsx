"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import CardSwap, { Card } from "@/components/v0/hero/card-swap"

gsap.registerPlugin(ScrollTrigger)

const critiques = [
  {
    id: "01",
    discipline: "Architecture",
    title: "Tower residential — facade rhythm feels unresolved",
    author: "Mara Iliev",
    stage: "Work in Progress",
    tools: ["Rhino", "V-Ray"],
    responses: 8,
    note: "The curtain wall module repeats without any hierarchy. Looking for feedback on how to introduce scale variation without abandoning the grid.",
  },
  {
    id: "02",
    discipline: "Interior Design",
    title: "Warm Minimal — walnut and linen living space",
    author: "Jonah Reyes",
    stage: "Near Final",
    tools: ["SketchUp", "V-Ray"],
    responses: 14,
    note: "Seeking critique on material balance. The warm tones feel right but the lighting plan still reads as disconnected from the spatial flow.",
  },
  {
    id: "03",
    discipline: "Urban Design",
    title: "Waterfront promenade — activation strategy",
    author: "Sena Okoye",
    stage: "Concept",
    tools: ["AutoCAD", "Lumion"],
    responses: 6,
    note: "Early-stage work. Looking for structural critique on programming sequence — how to move people from transit node to water edge.",
  },
  {
    id: "04",
    discipline: "Product Design",
    title: "Tactile wayfinding system for public transit",
    author: "Ingrid Dahl",
    stage: "Prototype",
    tools: ["Figma", "Keyshot"],
    responses: 11,
    note: "The haptic language is established, but I'm unsure whether the spatial metaphors translate across cultures. Open to perspectives.",
  },
]

const stageColors: Record<string, string> = {
  Concept: "text-muted-foreground border-muted-foreground/30",
  "Work in Progress": "text-accent border-accent/40",
  "Near Final": "text-foreground border-foreground/30",
  Prototype: "text-accent border-accent/40",
}

const CARD_W = 560
const CARD_H = 340

export function CritiquesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { x: -60, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: headerRef.current, start: "top 85%", toggleActions: "play none none reverse" },
          },
        )
      }
      if (wrapRef.current) {
        gsap.fromTo(
          wrapRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: wrapRef.current, start: "top 88%", toggleActions: "play none none reverse" },
          },
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % critiques.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const handleCardClick = useCallback((idx: number) => {
    setActiveIndex(idx)
  }, [])

  const active = critiques[activeIndex]

  return (
    /* FIX: was pl-6 md:pl-[268px] — SideNav is now 52px wide, sections offset by lg:pl-[52px] */
    <section id="critiques" ref={sectionRef} className="relative py-32 px-6 md:px-16 lg:pl-[calc(52px+4rem)]">
      {/* Section header */}
      <div ref={headerRef} className="mb-16">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">01 / Critiques</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">OPEN FOR REVIEW</h2>
        <p className="mt-4 max-w-md font-mono text-xs text-muted-foreground leading-relaxed">
          Works in progress seeking structured feedback from the community. Cards auto-advance — click to pause.
        </p>
      </div>

      {/* Layout: info panel left, CardSwap right */}
      <div
        ref={wrapRef}
        className="relative flex flex-col md:flex-row gap-10 md:gap-0 items-start md:items-stretch"
        style={{ minHeight: CARD_H + 80 }}
      >
        {/* Left — active critique info */}
        <div className="flex-1 flex flex-col justify-between pr-0 md:pr-16 max-w-lg">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                {active.discipline}
              </span>
              <span
                className={cn(
                  "font-mono text-[10px] uppercase tracking-widest border px-2 py-0.5",
                  stageColors[active.stage] ?? "text-muted-foreground border-muted-foreground/30",
                )}
              >
                {active.stage}
              </span>
            </div>

            <h3
              key={active.id}
              className="font-[var(--font-bebas)] text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight max-w-md"
            >
              {active.title}
            </h3>

            <p className="mt-5 font-mono text-xs text-muted-foreground leading-relaxed max-w-sm">
              {active.note}
            </p>
          </div>

          <div className="mt-10 pt-6 border-t border-border/20 flex flex-col gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-mono text-xs text-foreground/70">by {active.author}</span>
              <div className="flex items-center gap-2">
                {active.tools.map((tool) => (
                  <span key={tool} className="font-mono text-[10px] text-muted-foreground border border-border/40 px-2 py-0.5">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-[10px] text-muted-foreground">
                {active.responses} responses open
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              {critiques.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "h-px transition-all duration-300",
                    i === activeIndex ? "w-8 bg-accent" : "w-4 bg-border/60 hover:bg-border",
                  )}
                  aria-label={`View critique ${i + 1}`}
                />
              ))}
              <span className="font-mono text-[10px] text-muted-foreground ml-2">
                {String(activeIndex + 1).padStart(2, "0")} / {String(critiques.length).padStart(2, "0")}
              </span>
            </div>

            {/* CTA link */}
            <a
              href="#join"
              className="mt-2 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent hover:text-foreground transition-colors duration-200 group"
            >
              <span>Submit your work for critique</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>

        {/* Right — CardSwap stack */}
        <div
          className="relative hidden md:block flex-shrink-0"
          style={{ width: CARD_W + 180, height: CARD_H + 120 }}
        >
          <CardSwap
            width={CARD_W}
            height={CARD_H}
            cardDistance={50}
            verticalDistance={60}
            delay={5000}
            pauseOnHover
            skewAmount={5}
            easing="elastic"
            onCardClick={handleCardClick}
          >
            {critiques.map((c) => (
              <Card key={c.id} className="overflow-hidden cursor-pointer">
                <div className="flex flex-col justify-between h-full p-7 md:p-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                        {c.discipline}
                      </span>
                      <span
                        className={cn(
                          "font-mono text-[10px] uppercase tracking-widest border px-2 py-0.5",
                          stageColors[c.stage] ?? "text-muted-foreground border-muted-foreground/30",
                        )}
                      >
                        {c.stage}
                      </span>
                    </div>
                    <h3 className="font-[var(--font-bebas)] text-2xl md:text-3xl tracking-tight leading-tight">
                      {c.title}
                    </h3>
                    <p className="mt-3 font-mono text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                      {c.note}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-border/20 mt-5">
                    <span className="font-mono text-[11px] text-foreground/60">by {c.author}</span>
                    <div className="flex items-center gap-1.5">
                      {c.tools.map((tool) => (
                        <span key={tool} className="font-mono text-[10px] text-muted-foreground border border-border/30 px-1.5 py-0.5">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute top-0 left-0 w-16 h-16 opacity-30 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-accent" />
                  <div className="absolute top-0 left-0 w-[1px] h-full bg-accent" />
                </div>
              </Card>
            ))}
          </CardSwap>
        </div>

        {/* Mobile fallback */}
        <div className="flex flex-col gap-4 w-full md:hidden">
          {critiques.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "text-left border p-5 transition-all duration-300",
                i === activeIndex ? "border-accent/60 bg-accent/5" : "border-border/30",
              )}
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent block mb-1">
                {c.discipline}
              </span>
              <span className="font-[var(--font-bebas)] text-xl tracking-tight">{c.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
