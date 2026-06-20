import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex w-full max-w-3xl flex-col items-center gap-8 px-6 py-16 text-center sm:items-start sm:text-left">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-mono font-bold tracking-tight uppercase text-foreground">
            Atelier
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">
            A comprehensive settings page for the Atelier creative community platform.
          </p>
          <Link
            href="/settings/profile"
            className="inline-block mt-4 px-6 py-3 rounded bg-accent text-accent-foreground font-mono text-sm font-bold uppercase hover:opacity-80 transition-opacity w-fit"
          >
            View Settings
          </Link>
        </div>
      </main>
    </div>
  );
}
