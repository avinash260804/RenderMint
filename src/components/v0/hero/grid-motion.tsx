'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface GridMotionProps {
  className?: string
  columns?: number
  rows?: number
  speed?: number
  gap?: number
  glowColor?: string
}

export function GridMotion({
  className = '',
  columns = 3,
  rows = 4,
  speed = 18,
  gap = 10,
  glowColor = '220, 160, 60',
}: GridMotionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const rowEls = Array.from(container.querySelectorAll<HTMLDivElement>('[data-grid-row]'))
    const tweens: gsap.core.Tween[] = []

    rowEls.forEach((row, i) => {
      const trackEl = row.querySelector<HTMLDivElement>('[data-grid-track]')
      if (!trackEl) return

      const dir = i % 2 === 0 ? -1 : 1
      const rowSpeed = speed * (0.8 + i * 0.12)

      // Clone tiles for seamless loop
      const tiles = Array.from(trackEl.children) as HTMLElement[]
      tiles.forEach((tile) => {
        trackEl.appendChild(tile.cloneNode(true))
      })

      const trackWidth = trackEl.scrollWidth / 2

      if (dir === 1) {
        gsap.set(trackEl, { x: -trackWidth })
      }

      const tween = gsap.to(trackEl, {
        x: dir === -1 ? -trackWidth : 0,
        duration: trackWidth / rowSpeed,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: (x) => {
            const val = parseFloat(x)
            if (dir === -1) {
              const m = val % -trackWidth
              return `${m > 0 ? m - trackWidth : m}px`
            } else {
              const m = val % trackWidth
              return `${m >= 0 ? m - trackWidth : m}px`
            }
          },
        },
      })

      tweens.push(tween)
    })

    return () => { tweens.forEach((t) => t.kill()) }
  }, [speed, columns, rows])

  const tiles = Array.from({ length: columns })

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 flex flex-col overflow-hidden pointer-events-none ${className}`}
      style={{ gap }}
    >
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} data-grid-row className="flex-1 overflow-hidden">
          <div data-grid-track className="flex h-full will-change-transform" style={{ gap }}>
            {tiles.map((_, colIdx) => (
              <div
                key={colIdx}
                className="relative flex-shrink-0 rounded-[6px] overflow-hidden"
                style={{
                  width: `calc((100% - ${(columns - 1) * gap}px) / ${columns})`,
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.045)',
                }}
              >
                {/* Radial oval glow */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(ellipse 68% 52% at 50% 50%, rgba(${glowColor}, 0.12) 0%, rgba(${glowColor}, 0.04) 45%, transparent 72%)`,
                  }}
                />
                {/* Concentric rings */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-[0.06]"
                  viewBox="0 0 100 80"
                  preserveAspectRatio="xMidYMid slice"
                >
                  {[8, 16, 24, 32, 40, 48].map((r) => (
                    <ellipse
                      key={r}
                      cx="50" cy="40"
                      rx={r * 1.3} ry={r}
                      fill="none"
                      stroke={`rgba(${glowColor}, 1)`}
                      strokeWidth="0.5"
                    />
                  ))}
                </svg>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Left fade — seamlessly dissolves into bg */}
      <div
        className="absolute inset-y-0 left-0 pointer-events-none"
        style={{
          width: '45%',
          background: 'linear-gradient(90deg, oklch(0.08 0 0) 0%, oklch(0.08 0 0) 10%, transparent 100%)',
        }}
      />
      {/* Right fade */}
      <div
        className="absolute inset-y-0 right-0 pointer-events-none"
        style={{
          width: '30%',
          background: 'linear-gradient(270deg, oklch(0.08 0 0) 0%, transparent 100%)',
        }}
      />
      {/* Top fade */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: '30%',
          background: 'linear-gradient(180deg, oklch(0.08 0 0) 0%, transparent 100%)',
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '30%',
          background: 'linear-gradient(0deg, oklch(0.08 0 0) 0%, transparent 100%)',
        }}
      />
    </div>
  )
}
