# Designers Hub

Designers Hub is a community-first, knowledge-first platform for structured design discussion, critique, showcase, help, and resources across architecture-led disciplines.

## Current Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth + PostgreSQL
- Prisma ORM
- Vitest + Playwright

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env
```

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Start the app:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Verification

```bash
npm run typecheck
npm run lint
npm run build
```

## Repository Guide

- Product contract: `AGENTS.md`
- Architecture and state snapshot: `docs/architecture/`
- Implementation plans: `docs/plans/`
- Sprint and verification logs: `docs/sprint-logs/`
- Debug notes: `docs/debug/`
- Runtime logs: `logs/`
- Local helper binaries: `tools/`

## Notes

- This repository contains both active application code and historical sprint/build documentation.
- Cleanup in this repo is documentation-first and should avoid changing page contracts unless explicitly requested.
