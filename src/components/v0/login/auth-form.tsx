"use client"

import { useState } from "react"
import { Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface AuthFormProps {
  mode: "signin" | "signup"
  nextPath?: string | null
  errorCode?: string | null
  onToggleMode: () => void
}

type PendingAction = "google" | "magic-link" | null

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function getAuthErrorMessage(errorCode?: string | null) {
  if (!errorCode) return null

  switch (errorCode) {
    case "auth_callback_failed":
      return "We could not complete your sign-in. Please try Google or Magic Link again."
    default:
      return "We could not complete authentication. Please try again."
  }
}

export function AuthForm({ mode, nextPath, errorCode, onToggleMode }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(getAuthErrorMessage(errorCode))

  async function handleGoogle() {
    setPendingAction("google")
    setError(null)
    setMessage(null)

    const response = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ next: nextPath, intent: mode }),
    })

    const payload = (await response.json().catch(() => null)) as
      | { url?: string; error?: string }
      | null

    if (!response.ok || !payload?.url) {
      setError(payload?.error ?? "Unable to start Google authentication.")
      setPendingAction(null)
      return
    }

    window.location.href = payload.url
  }

  async function handleMagicLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPendingAction("magic-link")
    setError(null)
    setMessage(null)

    const response = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, next: nextPath, intent: mode }),
    })

    const payload = (await response.json().catch(() => null)) as
      | { message?: string; error?: string }
      | null

    if (!response.ok) {
      setError(payload?.error ?? "Unable to send your magic link.")
      setPendingAction(null)
      return
    }

    setMessage(
      payload?.message ??
        "Check your inbox for the sign-in link. New members will finish discipline setup after authentication.",
    )
    setPendingAction(null)
  }

  const isBusy = pendingAction !== null

  return (
    <div className="flex w-full max-w-md flex-col justify-center px-8 py-10 md:py-16">
      <div className="mb-8">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[--atelier-gold] md:hidden">
          Atelier
        </p>
        <h2
          className="text-4xl font-light leading-tight text-balance"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {mode === "signup" ? "Join Atelier" : "Enter Atelier"}
        </h2>
        <p className="mt-2 text-sm font-light tracking-wide text-muted-foreground">
          {mode === "signup"
            ? "Use Google or Magic Link. Username, discipline, and software selection happen during onboarding."
            : "Sign in with Google or request a Magic Link to continue."}
        </p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleMagicLink}>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-xs font-sans uppercase tracking-widest text-muted-foreground"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@atelier.com"
            required
            autoComplete="email"
            aria-describedby="auth-email-hint"
            className={cn(
              "rounded-none border-x-0 border-b border-t-0 bg-transparent px-0 text-sm text-foreground placeholder:text-muted-foreground/40",
              "focus-visible:border-[--atelier-gold] focus-visible:ring-0 transition-colors",
            )}
          />
          <p id="auth-email-hint" className="text-xs leading-relaxed text-muted-foreground/70">
            We&apos;ll send a secure Magic Link to this email. No password is required.
          </p>
        </div>

        <Button
          type="submit"
          disabled={isBusy}
          className="mt-2 h-11 w-full rounded-sm bg-[--atelier-gold] text-xs font-medium uppercase tracking-widest text-[--background] transition-colors hover:bg-[--atelier-warm]"
        >
          {pendingAction === "magic-link" ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Sending link
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Mail className="size-4" />
              Send Magic Link
            </span>
          )}
        </Button>

        <p className="text-center text-xs font-sans text-muted-foreground">
          {mode === "signup" ? "Already a member?" : "New to Atelier?"}{" "}
          <button
            type="button"
            onClick={onToggleMode}
            className="font-medium text-[--atelier-gold] underline underline-offset-2 transition-colors hover:text-[--atelier-warm]"
          >
            {mode === "signup" ? "Sign in" : "Create an account"}
          </button>
        </p>

        <div className="my-1 flex items-center gap-3">
          <Separator className="flex-1 bg-border/40" />
          <span className="text-xs font-sans uppercase tracking-widest text-muted-foreground/50">
            or
          </span>
          <Separator className="flex-1 bg-border/40" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={isBusy}
          className={cn(
            "flex h-11 w-full items-center justify-center gap-3 rounded-sm border border-border/50 bg-muted/20 text-sm text-foreground transition-all",
            "hover:border-[--atelier-gold]/50 hover:bg-[--atelier-gold]/10 disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          {pendingAction === "google" ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Connecting to Google
            </>
          ) : (
            <>
              <GoogleIcon />
              Continue with Google
            </>
          )}
        </button>

        {message ? (
          <p className="rounded-sm border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            {message}
          </p>
        ) : null}

        {error ? (
          <p
            role="alert"
            className="rounded-sm border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200"
          >
            {error}
          </p>
        ) : null}
      </form>
    </div>
  )
}
