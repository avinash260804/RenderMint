# Designers Hub Requirements

## Purpose

This file defines the practical requirements needed to install, configure, run, build, and test the current repository state.

It reflects the codebase as it exists now, not the idealized target architecture.

## Project Type

- Framework: Next.js 14 App Router
- Language: TypeScript
- Styling: Tailwind CSS + shadcn/ui
- Database: PostgreSQL via Supabase
- ORM: Prisma
- Auth: Supabase Auth
- Uploads: Cloudflare R2 or local mock upload mode
- Tests: Vitest + Playwright + Supabase SQL tests

## Current Implementation Status

Completed in `docs/sprint-logs`:

1. Sprint 0: schema drift fix and migration sync
2. Sprint 1: v0 import prep and preview audit
3. Sprint 2: login and auth page wiring
4. Sprint 3: hero page wiring
5. Sprint 4: dashboard page wiring
6. Sprint 5: profile page wiring
7. Sprint 6: uploads
8. Sprint 7: comments
9. Sprint 8: help / solved system
10. Sprint 9: search

Still pending from the higher-level phase roadmap in `AGENTS.md`:

1. Profiles + reputation hardening/completion
2. SEO optimization
3. Performance hardening

## Minimum Local System Requirements

- OS: Windows, macOS, or Linux
- Node.js: 20.x or newer recommended
- npm: 10.x or newer recommended
- Git: required

Optional but recommended:

- Supabase CLI
- Playwright browsers

## Required External Services

### Mandatory for normal application runtime

1. Supabase project
   - PostgreSQL database
   - Auth enabled
   - valid anon key
   - valid service role key

2. PostgreSQL connectivity through:
   - `DATABASE_URL`
   - `DIRECT_URL`

### Optional for production-like uploads

1. Cloudflare R2 account
2. R2 bucket
3. R2 access credentials
4. Optional public base URL for asset delivery

If R2 is not configured, the application can run with:

- `UPLOADS_MOCK_MODE=true`

In that mode, uploads are stored locally under `.tmp/uploads`.

## Environment Variables

Required by the runtime validator in [`src/lib/env.ts`](C:\Users\aviro\OneDrive\Documents\New project\src\lib\env.ts):

### Core

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database / Prisma

```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
```

Notes:

- `prisma.config.ts` defaults `DIRECT_URL` to `DATABASE_URL` if `DIRECT_URL` is missing.
- `DATABASE_URL` is used at runtime.
- `DIRECT_URL` is preferred for Prisma direct connections and migrations.

### Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Uploads / R2

```env
UPLOADS_MOCK_MODE=true
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_BASE_URL=
```

Behavior:

- If all required R2 values are set, upload mock mode can be disabled.
- If R2 values are missing, the app can still run with local mock uploads.

## Installation Requirements

From the repo root:

```powershell
npm install
```

If Playwright tests are needed:

```powershell
npx playwright install
```

If Prisma client needs regeneration:

```powershell
npx prisma generate
```

## Database Requirements

The project expects:

- Prisma schema in `prisma/schema.prisma`
- migrations in `prisma/migrations`
- seed command: `node prisma/seed.js`

Typical setup flow:

```powershell
npm run prisma:generate
npm run db:migrate
npm run db:seed
```

If the target database is already managed externally, ensure:

- migrations are in sync
- schema drift is resolved before runtime testing

## Run Requirements

### Development

```powershell
npm run dev
```

### Production build

```powershell
npm run build
npm run start
```

## Verification Requirements

Minimum expected checks:

```powershell
npm run typecheck
npm run lint
npm run build
```

Full local verification:

```powershell
npm run verify
```

Note:

- `verify` runs tests in addition to typecheck, lint, and build.

## Testing Requirements

### Unit / integration

```powershell
npm run test
npm run test:unit
npm run test:integration
npm run test:api
```

### E2E / UI

```powershell
npm run test:e2e
npm run test:a11y
npm run test:visual
npm run test:perf
```

### Database / policy tests

```powershell
npm run test:rls
```

Requirements for these tests:

- valid `.env.test`
- running app where applicable
- valid Supabase/test database where applicable
- Playwright browsers installed for browser tests

## Known Operational Constraints

1. `next lint` mutates `tsconfig.json`
   - it tends to re-add `.next/types/**/*.ts` to `include`
   - repository workflow has been restoring `tsconfig.json` manually after lint/build verification

2. Build emits Prisma datasource validation noise in this environment
   - build still completes
   - this is a repository-level hardening issue, not a blocker for basic build completion

3. Some older tests still target legacy route/service seams
   - the live application has already moved several routes onto production service modules
   - test refresh is still needed in parts of the suite

4. Search is currently implemented through the repository search service
   - `AGENTS.md` names Algolia as the target stack
   - Algolia is not required for the current repository state to run

## Repository Commands

Primary commands from `package.json`:

```powershell
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run verify
npm run db:validate
npm run prisma:generate
npm run db:migrate
npm run db:seed
```

## Required Files To Configure Before Running

At minimum:

1. `.env`
2. database connection values
3. Supabase URL and keys

Optional depending on scope:

4. `.env.test`
5. R2 credentials
6. Playwright auth state setup inputs

## Recommended Local Setup Sequence

1. Copy `.env.example` to `.env`
2. Fill Supabase values
3. Fill database URLs
4. Decide upload mode
   - local development: keep `UPLOADS_MOCK_MODE=true`
   - production-like uploads: configure R2 and disable mock mode
5. Install dependencies
6. Generate Prisma client
7. Run migrations
8. Seed database
9. Run typecheck, lint, build
10. Start the app

## Current Non-Requirements

These are not required to run the current repository locally:

- Redux
- microservices
- Docker, unless you choose to use local Supabase tooling separately
- Cloudflare R2, if mock upload mode is enabled
- Algolia, for the current implemented search path

## File References

- [`package.json`](C:\Users\aviro\OneDrive\Documents\New project\package.json)
- [`prisma/schema.prisma`](C:\Users\aviro\OneDrive\Documents\New project\prisma\schema.prisma)
- [`prisma.config.ts`](C:\Users\aviro\OneDrive\Documents\New project\prisma.config.ts)
- [`.env.example`](C:\Users\aviro\OneDrive\Documents\New project\.env.example)
- [`src/lib/env.ts`](C:\Users\aviro\OneDrive\Documents\New project\src\lib\env.ts)
- [`playwright.config.ts`](C:\Users\aviro\OneDrive\Documents\New project\playwright.config.ts)
- [`AGENTS.md`](C:\Users\aviro\OneDrive\Documents\New project\AGENTS.md)

