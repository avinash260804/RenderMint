import Link from "next/link";

const previews = [
  {
    href: "/v0-preview/hero",
    title: "Hero",
    summary: "Landing page import with animated editorial sections and mock community stats.",
  },
  {
    href: "/v0-preview/login",
    title: "Login",
    summary: "Auth surface import with placeholder email/password and social provider controls.",
  },
  {
    href: "/v0-preview/dashboard",
    title: "Dashboard",
    summary: "Authenticated workspace import with mock discipline switching and activity widgets.",
  },
  {
    href: "/v0-preview/profile",
    title: "Profile",
    summary: "Creative identity import with mock portfolio data and out-of-scope social actions.",
  },
];

export default function V0PreviewIndexPage() {
  return (
    <main className="v0-preview-theme min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            Sprint 1 Preview Staging
          </p>
          <h1 className="font-display text-5xl tracking-[0.08em]">
            v0 Import Audit
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            These routes are isolated imports only. They preserve the current live
            application while we audit mock data, CTA expectations, design gaps,
            and backend wiring needs for Sprints 2 through 5.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {previews.map((preview) => (
            <Link
              key={preview.href}
              href={preview.href}
              className="panel-primary block rounded-xl p-6 transition-transform hover:-translate-y-1"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                Preview Route
              </p>
              <h2 className="mt-3 text-2xl font-semibold">{preview.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {preview.summary}
              </p>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/70">
                Open {preview.href}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
