"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const signals = [
  {
    date: "2026.06.12",
    title: "Discipline Rooms",
    note: "Focused spaces for architecture, interiors, and urban design without losing cross-disciplinary learning.",
  },
  {
    date: "2026.06.08",
    title: "Critique Loops",
    note: "Structured feedback requests that make review more specific, more actionable, and easier to iterate on.",
  },
  {
    date: "2026.06.04",
    title: "Help Threads",
    note: "Problem-solving surfaces tuned for software workflows, rendering fixes, and durable accepted answers.",
  },
  {
    date: "2026.05.30",
    title: "Search Memory",
    note: "Knowledge-first thread architecture so discussions and solved issues become a reusable archive.",
  },
]

export function SignalsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (!sectionRef.current || !cursorRef.current) return

    const section = sectionRef.current
    const cursor = cursorRef.current

    const handleMouseMove = (event: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      gsap.to(cursor, {
        x,
        y,
        duration: 0.5,
        ease: "power3.out",
      })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    section.addEventListener("mousemove", handleMouseMove)
    section.addEventListener("mouseenter", handleMouseEnter)
    section.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      section.removeEventListener("mousemove", handleMouseMove)
      section.removeEventListener("mouseenter", handleMouseEnter)
      section.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !cardsRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      )

      const cards = cardsRef.current?.querySelectorAll("article")
      if (cards) {
        gsap.fromTo(
          cards,
          { x: -100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="signals"
      ref={sectionRef}
      className="relative overflow-hidden py-20 pl-6 md:py-24 md:pl-12 lg:pl-28"
    >
      <div
        ref={cursorRef}
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-20 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-accent/90 transition-opacity duration-300 mix-blend-screen",
          isHovering ? "opacity-100" : "opacity-0",
        )}
      />

      <div ref={headerRef} className="mb-12 pr-6 md:mb-16 md:pr-12">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
          01 / Signals
        </span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl tracking-tight md:text-7xl">
          WHAT&apos;S NEW
        </h2>
      </div>

      <div
        ref={cardsRef}
        className="scrollbar-hide flex gap-6 overflow-x-auto pb-6 pr-8 md:gap-8 md:pr-12"
      >
        {signals.map((signal, index) => (
          <article
            key={signal.title}
            className="group relative w-[19rem] flex-shrink-0 transition-transform duration-500 ease-out hover:-translate-y-2 md:w-80"
          >
            <div className="relative border border-border/50 bg-card p-6 md:border-t md:border-l md:border-r-0 md:border-b-0 md:p-8">
              <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

              <div className="mb-8 flex items-baseline justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  No. {String(index + 1).padStart(2, "0")}
                </span>
                <time className="font-mono text-[10px] text-muted-foreground/60">
                  {signal.date}
                </time>
              </div>

              <h3 className="mb-4 font-[var(--font-bebas)] text-4xl tracking-tight transition-colors duration-300 group-hover:text-accent">
                {signal.title}
              </h3>

              <div className="mb-6 h-px w-12 bg-accent/60 transition-all duration-500 group-hover:w-full" />

              <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                {signal.note}
              </p>

              <div className="absolute bottom-0 right-0 h-6 w-6 overflow-hidden">
                <div className="absolute bottom-0 right-0 h-8 w-8 translate-x-4 translate-y-4 rotate-45 border-l border-t border-border/30 bg-background" />
              </div>
            </div>

            <div className="absolute inset-0 -z-10 translate-x-1 translate-y-1 bg-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </article>
        ))}
      </div>
    </section>
  )
}
