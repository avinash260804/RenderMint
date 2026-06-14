"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const DISCIPLINES = ["All", "Architecture", "Interior Design", "Urban Design", "Product Design", "Graphic Design"]

const showcases = [
  {
    title: "Warm Minimal",
    discipline: "Interior Design",
    author: "Jonah Reyes",
    tools: ["SketchUp", "V-Ray"],
    appreciations: 962,
    description: "A walnut and linen living space exploring tension between warmth and restraint.",
    image: "/v0/showcase-warm-minimal.png",
    height: "tall",
  },
  {
    title: "Tower Facade Study",
    discipline: "Architecture",
    author: "Mara Iliev",
    tools: ["Rhino", "Grasshopper"],
    appreciations: 741,
    description: "Parametric curtain wall studies for a 42-floor residential tower.",
    image: "/v0/showcase-tower-facade.png",
    height: "short",
  },
  {
    title: "Waterfront Promenade",
    discipline: "Urban Design",
    author: "Sena Okoye",
    tools: ["AutoCAD", "Lumion"],
    appreciations: 584,
    description: "Activation strategy and programming sequence for a 2km riverbank edge.",
    image: "/v0/showcase-waterfront.png",
    height: "medium",
  },
  {
    title: "Tactile Wayfinding",
    discipline: "Product Design",
    author: "Ingrid Dahl",
    tools: ["Figma", "Keyshot"],
    appreciations: 812,
    description: "Haptic and spatial language system for public transit navigation.",
    image: "/v0/showcase-wayfinding.png",
    height: "short",
  },
  {
    title: "Adaptive Courtyard",
    discipline: "Architecture",
    author: "Tomas Bek",
    tools: ["Revit", "Enscape"],
    appreciations: 439,
    description: "A heritage building transformation where the courtyard becomes the primary civic space.",
    image: "/v0/showcase-courtyard.png",
    height: "tall",
  },
  {
    title: "Editorial Grid System",
    discipline: "Graphic Design",
    author: "Pita Noa",
    tools: ["InDesign", "Illustrator"],
    appreciations: 1200,
    description: "Free grid system templates for editorial layout — 980 saves.",
    image: "/v0/showcase-editorial.png",
    height: "medium",
  },
  {
    title: "Bioclimatic Housing",
    discipline: "Architecture",
    author: "Camille Voss",
    tools: ["ArchiCAD", "ClimateConsultant"],
    appreciations: 327,
    description: "Passive design strategies applied to affordable housing in humid subtropical climates.",
    image: "/v0/showcase-bioclimatic.png",
    height: "short",
  },
  {
    title: "Commercial Kitchen",
    discipline: "Interior Design",
    author: "Omar Faris",
    tools: ["SketchUp", "Photoshop"],
    appreciations: 651,
    description: "Tight spatial choreography for a 28-seat restaurant — flow, ergonomics, and atmosphere.",
    image: "/v0/showcase-kitchen.png",
    height: "medium",
  },
]

const imageHeightMap: Record<string, number> = {
  tall: 260,
  medium: 200,
  short: 150,
}

export function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const col1Ref = useRef<HTMLDivElement>(null)
  const col2Ref = useRef<HTMLDivElement>(null)
  const col3Ref = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState("All")
  const [isAnimating, setIsAnimating] = useState(false)

  const filtered = useMemo(
    () => (activeFilter === "All" ? showcases : showcases.filter((s) => s.discipline === activeFilter)),
    [activeFilter],
  )

  // Greedy shortest-column masonry distribution
  const columns = useMemo(() => {
    const cols: (typeof showcases)[] = [[], [], []]
    const colHeights = [0, 0, 0]
    filtered.forEach((item) => {
      const minCol = colHeights.indexOf(Math.min(...colHeights))
      cols[minCol].push(item)
      colHeights[minCol] += imageHeightMap[item.height] + 140
    })
    return cols
  }, [filtered])

  const handleFilter = (discipline: string) => {
    if (discipline === activeFilter || isAnimating) return
    setIsAnimating(true)

    // Fade out existing cards
    if (gridRef.current) {
      gsap.to(gridRef.current.querySelectorAll("article"), {
        opacity: 0,
        y: 20,
        duration: 0.25,
        stagger: 0.03,
        ease: "power2.in",
        onComplete: () => {
          setActiveFilter(discipline)
          setIsAnimating(false)
        },
      })
    } else {
      setActiveFilter(discipline)
      setIsAnimating(false)
    }
  }

  // Re-animate cards after filter change
  useEffect(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll("article")
    if (cards.length === 0) return
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: "power3.out" },
    )
  }, [activeFilter])

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { x: -60, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: headerRef.current, start: "top 90%", toggleActions: "play none none reverse" },
          },
        )
      }
      ;[col1Ref, col2Ref, col3Ref].forEach((colRef, colIndex) => {
        if (!colRef.current) return
        const cards = colRef.current.querySelectorAll("article")
        if (cards.length === 0) return
        gsap.fromTo(
          cards,
          { y: 60 + colIndex * 20, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger: colRef.current, start: "top 90%", toggleActions: "play none none reverse" },
          },
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const colRefs = [col1Ref, col2Ref, col3Ref]

  return (
    <section ref={sectionRef} id="work" className="relative py-32 px-6 md:px-16">
      {/* Section header */}
      <div ref={headerRef} className="mb-10 flex items-end justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">02 / Showcases</span>
          <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">SELECTED WORKS</h2>
        </div>
        <p className="hidden md:block max-w-xs font-mono text-xs text-muted-foreground text-right leading-relaxed">
          Portfolio pieces from the community — architecture, interiors, urban design, and beyond.
        </p>
      </div>

      {/* Discipline filter tabs */}
      <div className="mb-12 flex flex-wrap gap-2">
        {DISCIPLINES.map((d) => (
          <button
            key={d}
            onClick={() => handleFilter(d)}
            className={cn(
              "font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-all duration-200",
              activeFilter === d
                ? "border-accent text-accent bg-accent/8"
                : "border-border/40 text-muted-foreground hover:border-border hover:text-foreground/70",
            )}
          >
            {d}
            {d !== "All" && (
              <span className="ml-2 opacity-50">
                {showcases.filter((s) => s.discipline === d).length}
              </span>
            )}
          </button>
        ))}
        <span className="ml-auto font-mono text-[10px] text-muted-foreground/50 self-center">
          {filtered.length} works
        </span>
      </div>

      {/* Masonry grid */}
      <div ref={gridRef} className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
        {columns.map((col, colIndex) => (
          <div
            key={`${activeFilter}-${colIndex}`}
            ref={colRefs[colIndex]}
            className="flex flex-col gap-4 md:gap-6 w-full md:flex-1"
          >
            {col.map((showcase, cardIndex) => (
              <ShowcaseCard key={`${colIndex}-${cardIndex}-${showcase.title}`} showcase={showcase} />
            ))}
          </div>
        ))}
      </div>

      {/* View all CTA */}
      <div className="mt-16 pt-8 border-t border-border/20 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Showing {filtered.length} of 120k+ projects
        </span>
        <a
          href="#join"
          className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent hover:text-foreground transition-colors duration-200"
        >
          <span>Explore all works</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </a>
      </div>
    </section>
  )
}

function ShowcaseCard({ showcase }: { showcase: (typeof showcases)[number] }) {
  const [isHovered, setIsHovered] = useState(false)
  const imgH = imageHeightMap[showcase.height]

  return (
    <article
      className={cn(
        "group relative border border-border/40 flex flex-col transition-all duration-500 cursor-pointer overflow-hidden",
        isHovered && "border-accent/60",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image preview */}
      <div className="relative w-full overflow-hidden flex-shrink-0" style={{ height: imgH }}>
        <Image
          src={showcase.image}
          alt={showcase.title}
          fill
          className={cn("object-cover transition-transform duration-700", isHovered ? "scale-105" : "scale-100")}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className={cn("absolute inset-0 bg-background/40 transition-opacity duration-500", isHovered ? "opacity-60" : "opacity-20")} />
        <div className="absolute top-3 left-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/90 bg-background/70 backdrop-blur-sm px-2 py-1">
            {showcase.discipline}
          </span>
        </div>
        <div className={cn("absolute top-3 right-3 font-mono text-[10px] text-foreground/70 bg-background/70 backdrop-blur-sm px-2 py-1 transition-opacity duration-300", isHovered ? "opacity-100" : "opacity-0")}>
          {showcase.appreciations.toLocaleString()} appr.
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col gap-3">
        <h3 className={cn("font-[var(--font-bebas)] text-2xl md:text-3xl tracking-tight transition-colors duration-300 leading-tight", isHovered ? "text-accent" : "text-foreground")}>
          {showcase.title}
        </h3>
        <p className={cn("font-mono text-xs text-muted-foreground leading-relaxed transition-all duration-500", isHovered ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden")}>
          {showcase.description}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-border/20 mt-1">
          <span className="font-mono text-[10px] text-muted-foreground">by {showcase.author}</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {showcase.tools.map((tool) => (
              <span key={tool} className="font-mono text-[10px] text-muted-foreground/60 border border-border/30 px-1.5 py-0.5">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Corner accent on hover */}
      <div className={cn("absolute bottom-0 right-0 w-10 h-10 transition-all duration-500 pointer-events-none", isHovered ? "opacity-100" : "opacity-0")}>
        <div className="absolute bottom-0 right-0 w-full h-[1px] bg-accent" />
        <div className="absolute bottom-0 right-0 w-[1px] h-full bg-accent" />
      </div>
    </article>
  )
}
