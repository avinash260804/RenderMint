"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    number: "01",
    label: "Showcase",
    headline: "PUT YOUR BEST WORK IN FRONT OF PEOPLE WHO GET IT",
    description:
      "A gallery for polished portfolio pieces. Upload renders, drawings, and process work for peers who understand the craft.",
    stat: { value: "120k+", label: "Projects shared" },
  },
  {
    number: "02",
    label: "Critique",
    headline: "STRUCTURED FEEDBACK. NOT JUST COMMENTS.",
    description:
      "A studio environment for works-in-progress. Requests are tagged by stage, discipline, and what kind of feedback you need.",
    stat: { value: "3.2k", label: "Active critiques" },
  },
  {
    number: "03",
    label: "Technical Help",
    headline: "ANSWERS FROM PRACTITIONERS, NOT FORUMS.",
    description:
      "Revit, Rhino, SketchUp, ArchiCAD, Grasshopper — solved by people who use these tools daily, not just Google.",
    stat: { value: "94%", label: "Questions answered" },
  },
  {
    number: "04",
    label: "Resources",
    headline: "SIGNAL OVER NOISE. CURATED BY THE COMMUNITY.",
    description:
      "Templates, references, and tool guides — voted up by professionals. No tutorials for beginners, no sponsored noise.",
    stat: { value: "8.4k", label: "Curated resources" },
  },
]

export function PrinciplesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          x: -60, opacity: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        })
      }
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll("article")
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger: gridRef.current, start: "top 85%", toggleActions: "play none none reverse" },
          },
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="principles"
      className="relative py-32 px-6 md:px-16 lg:pl-[calc(52px+4rem)]"
    >
      {/* Section header */}
      <div ref={headerRef} className="mb-16">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">03 / Platform</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">HOW IT WORKS</h2>
        <p className="mt-4 max-w-md font-mono text-xs text-muted-foreground leading-relaxed">
          Four spaces, one community. Each section is designed for how designers actually work.
        </p>
      </div>

      {/* 2×2 feature grid */}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/20">
        {features.map((feature) => (
          <article
            key={feature.number}
            className="group relative bg-background p-8 md:p-10 flex flex-col gap-6 hover:bg-card transition-colors duration-300"
          >
            {/* Top row: number + label */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {feature.number} / {feature.label}
              </span>
              {/* Stat */}
              <div className="text-right">
                <div className="font-[var(--font-bebas)] text-2xl tracking-tight text-accent leading-none">
                  {feature.stat.value}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">
                  {feature.stat.label}
                </div>
              </div>
            </div>

            {/* Headline */}
            <h3 className="font-[var(--font-bebas)] text-2xl md:text-3xl tracking-tight leading-tight text-foreground group-hover:text-accent transition-colors duration-300">
              {feature.headline}
            </h3>

            {/* Divider */}
            <div className="h-px w-12 bg-accent/50 group-hover:w-full transition-all duration-500" />

            {/* Description */}
            <p className="font-mono text-xs text-muted-foreground leading-relaxed flex-1">
              {feature.description}
            </p>

            {/* Corner accent */}
            <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 right-0 w-full h-[1px] bg-accent" />
              <div className="absolute bottom-0 right-0 w-[1px] h-full bg-accent" />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
