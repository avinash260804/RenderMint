"use client"

import { useState } from "react"
import { AuthLeftPanel } from "./auth-left-panel"
import { AuthForm } from "./auth-form"

interface AuthPageProps {
  initialMode?: "signin" | "signup"
  nextPath?: string | null
  errorCode?: string | null
}

export function AuthPage({
  initialMode = "signup",
  nextPath,
  errorCode,
}: AuthPageProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode)

  const toggleMode = () =>
    setMode((m) => (m === "signup" ? "signin" : "signup"))

  return (
    <main className="v0-preview-theme v0-surface v0-surface--login relative z-10 flex min-h-screen items-center justify-center bg-background p-4 md:p-8">
      {/* Outer card — dark rounded container matching the reference */}
      <div
        className="w-full max-w-5xl flex rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "oklch(0.14 0.005 60)",
          border: "1px solid rgba(255,255,255,0.07)",
          minHeight: "600px",
        }}
      >
        {/* Left: photo + glass overlay */}
        <AuthLeftPanel mode={mode} onToggleMode={toggleMode} />

        {/* Right: dark form panel */}
        <div className="flex-1 flex items-center justify-center bg-background/80">
          <AuthForm
            mode={mode}
            nextPath={nextPath}
            errorCode={errorCode}
            onToggleMode={toggleMode}
          />
        </div>
      </div>
    </main>
  )
}
