"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

const navItems = [
  { id: "hero", label: "Home", short: "00" },
  { id: "signals", label: "Signals", short: "01" },
  { id: "critiques", label: "Critiques", short: "02" },
  { id: "work", label: "Showcases", short: "03" },
  { id: "principles", label: "Platform", short: "04" },
  { id: "join", label: "Join", short: "05" },
  { id: "colophon", label: "Community", short: "06" },
]

export function SideNav() {
  const [activeSection, setActiveSection] = useState("hero")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      { threshold: [0.2, 0.5] },
    )

    navItems.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <nav
      className="hero-side-nav fixed left-0 top-0 z-20 hidden h-screen w-[52px] flex-col justify-center border-r border-border/20 bg-background/60 backdrop-blur-md lg:flex"
      aria-label="Section navigation"
    >
      <div className="absolute left-1/2 top-8 -translate-x-1/2">
        <span
          className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent"
          style={{ writingMode: "vertical-rl" }}
        >
          DH
        </span>
      </div>

      <div className="flex flex-col items-center gap-5">
        {navItems.map(({ id, label, short }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="group relative flex w-full items-center justify-center py-1"
            aria-label={`Go to ${label}`}
          >
            <span
              className={cn(
                "block h-[1px] transition-all duration-300",
                activeSection === id
                  ? "w-5 bg-accent"
                  : "w-2.5 bg-muted-foreground/30 group-hover:w-4 group-hover:bg-muted-foreground/60",
              )}
            />
            <span
              className={cn(
                "pointer-events-none absolute left-[44px] whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.25em] opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                activeSection === id ? "text-accent" : "text-muted-foreground",
              )}
            >
              {short} {label}
            </span>
          </button>
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1">
        <div className="h-10 w-px bg-border/30" />
        <span
          className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/40"
          style={{ writingMode: "vertical-rl" }}
        >
          scroll
        </span>
      </div>
    </nav>
  )
}
