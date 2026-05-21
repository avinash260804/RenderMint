"use client";

import { useState } from "react";

type AuthActionsProps = {
  mode: "login" | "signup";
};

export function AuthActions({ mode }: AuthActionsProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth/google", { method: "POST" });
    const payload = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !payload.url) {
      setError(payload.error ?? "Unable to start Google OAuth.");
      setLoading(false);
      return;
    }

    window.location.href = payload.url;
  }

  async function handleMagicLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const payload = (await response.json()) as { message?: string; error?: string };

    if (!response.ok) {
      setError(payload.error ?? "Unable to send magic link.");
      setLoading(false);
      return;
    }

    setMessage(payload.message ?? "Check your inbox for a magic link.");
    setLoading(false);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">{mode === "login" ? "Sign in" : "Create account"}</h1>

      <button
        type="button"
        className="rounded-md border px-4 py-2"
        onClick={handleGoogle}
        disabled={loading}
      >
        Continue with Google
      </button>

      <form className="flex flex-col gap-3" onSubmit={handleMagicLink}>
        <label className="text-sm" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="rounded-md border bg-transparent px-3 py-2"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <button
          className="rounded-md bg-foreground px-4 py-2 text-background"
          type="submit"
          disabled={loading}
        >
          Send magic link
        </button>
      </form>

      {message ? <p className="text-sm text-green-600">{message}</p> : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </main>
  );
}
