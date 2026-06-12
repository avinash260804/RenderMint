# Designers Hub Implementation Plan V2

## Purpose

This document is the working implementation plan for the next iteration of Designers Hub.

It adapts the structure and ambition of the uploaded backend master plan, but restructures it to fit the actual state of this repository today.

This plan is intended to be:

- executable step by step
- aligned with the current codebase
- compatible with `AGENTS.md`
- realistic for incremental delivery
- safe for phased migration from mock-backed flows to persistent production behavior

## Planning Principles

This plan follows the existing product contract in [AGENTS.md](</C:/Users/aviro/OneDrive/Documents/New%20project/AGENTS.md>) and the current implementation audit in [PROJECT_MASTER_LOG.md](</C:/Users/aviro/OneDrive/Documents/New%20project/PROJECT_MASTER_LOG.md>).

The core principles are:

1. Do not rebuild what already works unless it is blocking production readiness.
2. Preserve route structure, page behavior, and UI contracts while replacing mock internals.
3. Stabilize persistence before adding too many new user-facing capabilities.
4. Keep `src/app/` thin and move business logic into domain services.
5. Use Prisma as the canonical data source.
6. Treat Algolia as a later read-optimized search layer, not the first persistence step.
7. Preserve SSR and canonical thread pages throughout the migration.

## Current Reality

The repository already includes:

- Next.js 14 App Router bootstrap
- TypeScript strict setup
- Tailwind and shadcn/ui
- Prisma schema and migrations
- Supabase auth entry points and onboarding
- community UI and page structure
- post creation UI and schema
- upload support with mock/R2 switching
- comments API with in-memory store
- solved help flow with in-memory store
- search API with in-memory ranking
- sitemap and robots

The biggest gap is not missing UI. The biggest gap is that several important features still rely on:

- `src/lib/mock/community-data.ts`
- `src/modules/comments/server/comment-store.ts`
- `src/modules/help/server/help-solution-store.ts`
- `src/modules/search/server/search-service.ts` using mock feed content

That means the next iteration should focus on persistence cutover and backend hardening.

## Target Outcome For This Iteration

At the end of this implementation plan, the project should have:

- real Prisma-backed posts
- real Prisma-backed comments
- real Prisma-backed help solved state
- real feed queries instead of mock feed imports
- database-backed search as the canonical search source
- shared service patterns, auth helpers, and API error handling
- improved seed data
- a stable base for profiles, reputation, and later Algolia integration

## Structural Rules

### Layering

`src/app/`

- pages remain orchestration-focused
- route handlers remain HTTP controllers only
- no deep business logic

`src/modules/`

- domain-specific schemas
- service functions
- query helpers

`src/lib/`

- shared infrastructure only
- auth helpers
- error helpers
- generic utilities
- no domain ownership leakage unless truly cross-cutting

`src/server/db/`

- Prisma singleton only

### Compatibility Rule

During migration:

- existing pages must keep working
- existing route URLs must remain stable
- current UI components should not be rewritten unless a data contract requires it
- mock sources may remain temporarily as adapters, but new production code should target Prisma-backed services

### Migration Rule

For every mock-backed feature, use this order:

1. add shared infrastructure if needed
2. add persistence service
3. switch route handler
4. switch page or server component
5. verify parity
6. remove old mock/store code only after cutover is stable

## Delivery Model

This plan is organized into sprints. Each sprint is designed to be executed in sequence and verified before moving forward.

Each sprint includes:

- objective
- scope
- files to add or modify
- dependencies
- verification gates
- exit criteria

## Sprint Roadmap Overview

1. Sprint 1: Shared Infrastructure Hardening
2. Sprint 2: Schema Evolution And Persistence Foundations
3. Sprint 3: Posts Service And Post API
4. Sprint 4: Comments Persistence Cutover
5. Sprint 5: Help Solved Persistence Cutover
6. Sprint 6: Feed Migration Off Mock Data
7. Sprint 7: Search Migration To Database-Backed Search
8. Sprint 8: Votes And Reputation
9. Sprint 9: Tags And Profiles
10. Sprint 10: Seed Rewrite, Test Gates, And Final Stabilization

## Sprint 1: Shared Infrastructure Hardening

### Objective

Create the shared backend foundation needed for the persistence migration without changing core product behavior.

### Why First

The current repo has feature logic, but not a strong enough shared server infrastructure for consistent auth, validation, sanitization, and error handling.

### Scope

Add:

- shared auth helper
- shared API error handler
- app error classes
- slug utility
- pagination helper
- sanitization helper
- lightweight rate-limit helper
- env normalization improvements

### Planned Files

New files:

- `src/lib/errors.ts`
- `src/lib/api/handle-error.ts`
- `src/lib/auth/require-auth.ts`
- `src/lib/utils/slug.ts`
- `src/lib/utils/pagination.ts`
- `src/lib/utils/sanitize.ts`
- `src/lib/rate-limit.ts`

Modify:

- `src/lib/env.ts`
- upload route auth enforcement if safe to include in this sprint

### Notes

Adapted from the uploaded plan:

- keep the route contract pattern
- keep typed service boundaries
- keep reusable helpers

Adjusted for this repo:

- rate limiting should be documented as local or single-instance only
- env normalization should explicitly handle optional blank values like `R2_PUBLIC_BASE_URL`

### Verification

- `npm run typecheck`
- `npm run build`
- verify auth routes still function
- verify onboarding route still functions

### Exit Criteria

- common server helpers exist
- route handlers can begin migrating to shared patterns
- no visible regression in existing auth/onboarding behavior

## Sprint 2: Schema Evolution And Persistence Foundations

### Objective

Prepare the schema for production persistence cutover before rewriting major services.

### Why Second

The uploaded plan assumes fields and query behaviors that are not fully reflected in the current schema or runtime expectations.

### Scope

Evaluate and add only the schema changes truly needed for persistence migration:

- `deletedAt` for soft delete if adopted
- `editedAt` or equivalent if needed
- optional search-support fields only if PostgreSQL full-text search is adopted in this iteration
- any missing indexes required by feed and thread reads

### Planned Files

Modify:

- `prisma/schema.prisma`

Add:

- new migration folder under `prisma/migrations/`

Potentially update:

- `prisma/rls.sql`
- `prisma/RLS_STRATEGY.md`

### Notes

This sprint should not try to complete votes, profiles, tags, and search-vector changes all at once unless the schema changes are tightly related.

### Verification

- `npx prisma generate`
- migration applies cleanly
- existing onboarding queries still work
- build passes

### Exit Criteria

- database structure supports post, comment, and help persistence migration
- migration is explicit and reversible through normal Prisma workflows

## Sprint 3: Posts Service And Post API

### Objective

Make posts the canonical persisted content foundation.

### Why Third

Everything else depends on posts being real:

- comments
- help solved state
- feeds
- thread pages
- search
- tags
- reputation

### Scope

Introduce a proper posts server layer with:

- post create
- post read by slug
- post list with filters
- post update
- post delete or soft delete behavior

Introduce supporting post query helpers and API schemas.

### Planned Files

New files:

- `src/modules/posts/server/post-service.ts`
- `src/modules/posts/server/post-queries.ts`
- `src/modules/posts/schemas/post-api-schema.ts`
- `src/app/api/posts/route.ts`
- `src/app/api/posts/[slug]/route.ts`

Modify:

- `src/modules/posts/schemas/post-creation-schema.ts` if persistence contracts need cleanup
- existing post creation page only if API integration is introduced in this sprint

### Notes

Adapt from the uploaded plan:

- slug generation
- transaction-based create flow
- typed list filters
- explicit Prisma `select` and `include`

Adjusted for this repo:

- preserve the current multi-post-type shape already encoded in Prisma
- avoid changing the UX flow prematurely
- keep thread slug canonical behavior intact

### Verification

- create all five post types through service-level tests or manual route checks
- verify valid slugs are generated
- verify post reads do not depend on `community-data.ts`
- build passes

### Exit Criteria

- posts are persisted and queryable through Prisma-backed services
- post API exists as the canonical server interface

## Sprint 4: Comments Persistence Cutover

### Objective

Replace the in-memory comment store with Prisma-backed persistence.

### Scope

Implement:

- list comments by post
- create comment
- optional update/delete rules if included
- post comment count synchronization

### Planned Files

New files:

- `src/modules/comments/server/comment-service.ts`

Modify:

- `src/app/api/comments/route.ts`
- `src/components/forum/comments-panel.tsx` only if response shape changes

Retire after cutover:

- `src/modules/comments/server/comment-store.ts`

### Notes

Comments should move to Prisma while preserving the existing thread-page comment UX.

### Verification

- create and list comments through the API
- verify `commentCount` updates atomically
- verify thread pages still render comments correctly
- build passes

### Exit Criteria

- comments no longer rely on global in-memory state

## Sprint 5: Help Solved Persistence Cutover

### Objective

Replace the in-memory help solved-state store with post/comment-backed persistence.

### Scope

Implement:

- read solved state from the `posts` table
- set accepted comment
- clear accepted comment
- author-only ownership checks
- reputation hook points if added now or in a later sprint

### Planned Files

New files:

- `src/modules/help/server/help-solution-service.ts`

Modify:

- `src/app/api/help/solution/route.ts`

Retire after cutover:

- `src/modules/help/server/help-solution-store.ts`

### Verification

- accept solution on help post
- clear solution on help post
- reject non-help types
- reject unauthorized users
- thread/help pages still reflect solved state

### Exit Criteria

- solved state is fully Prisma-backed

## Sprint 6: Feed Migration Off Mock Data

### Objective

Move all page-level feed rendering away from `community-data.ts` and onto database-backed read services.

### Why This Is The Real Cutover Sprint

This is the point where the app stops behaving like a mock-backed demo and starts behaving like a real community product.

### Scope

Introduce a `feed-service` that serves:

- home sections
- discipline feeds
- thread read model
- discipline list for explore

Switch these pages away from mock imports:

- home
- explore
- discipline pages
- thread page

### Planned Files

New files:

- `src/modules/feed/server/feed-service.ts`

Modify:

- `src/app/page.tsx`
- `src/app/explore/page.tsx`
- `src/app/[discipline]/page.tsx`
- `src/app/[discipline]/discussions/page.tsx`
- `src/app/[discipline]/critique/page.tsx`
- `src/app/[discipline]/showcase/page.tsx`
- `src/app/[discipline]/help/page.tsx`
- `src/app/[discipline]/resources/page.tsx`
- `src/app/thread/[slug]/page.tsx`

Demote:

- `src/lib/mock/community-data.ts`

### Notes

The thread page should load a composed server-side read model, but it does not need to force everything into one oversized query if a small number of coordinated queries is cleaner and safer.

### Verification

- all page routes render from real data
- thread page SSR remains intact
- zero production page imports from `community-data.ts`
- build passes

### Exit Criteria

- feed and thread rendering no longer depend on mock feed sources

## Sprint 7: Search Migration To Database-Backed Search

### Objective

Remove mock-backed search dependence and move to a database-backed search implementation while preserving the current filter contract.

### Scope

Step A for this project:

- keep the existing `searchPosts()` abstraction
- change the source from mock feed data to database queries
- preserve filters:
  - discipline
  - software
  - post type
  - solved
- preserve ranking intent:
  - relevance
  - solved help priority
  - engagement
  - freshness

Step B for later:

- Algolia integration as an optional optimized search replica

### Planned Files

Modify:

- `src/modules/search/server/search-service.ts`
- `src/app/api/search/route.ts`
- `src/components/forum/search-experience.tsx` only if response shape changes

Potential schema support:

- search indexes or full-text support if chosen in Sprint 2

### Notes

The uploaded plan’s PostgreSQL full-text search path is useful as a practical intermediate stage, but this document treats it as the MVP persistence search layer, not the final architecture if Algolia is still the long-term target.

### Verification

- search results come from persisted posts
- filters behave correctly
- solved help results still rank strongly
- build passes

### Exit Criteria

- search no longer depends on `community-data.ts`

## Sprint 8: Votes And Reputation

### Objective

Introduce engagement mechanics once the core content model is truly persisted.

### Scope

Implement:

- post voting
- comment voting
- reputation adjustments
- self-vote checks
- threshold checks if enabled

### Planned Files

New files:

- `src/modules/votes/schemas/vote-schema.ts`
- `src/modules/votes/server/vote-service.ts`
- `src/modules/reputation/server/reputation-service.ts`
- `src/app/api/votes/route.ts`

### Notes

Adapted from the uploaded plan:

- transaction-based toggle or flip logic
- atomic counter updates
- inline reputation adjustments

Adjusted for this repo:

- keep the reputation system simple and aligned with `AGENTS.md`
- avoid building heavy moderation or privilege systems unless directly needed for MVP

### Verification

- upvote/downvote flows work
- counters update correctly
- reputation changes correctly
- self-vote prevention works

### Exit Criteria

- posts and comments support real voting
- reputation becomes meaningful data rather than future-only design

## Sprint 9: Tags And Profiles

### Objective

Complete profile and tagging capabilities that support public identity and discovery.

### Scope

Implement tags:

- create or resolve tags
- tag search
- popular tags

Implement profiles:

- public profile route and service
- own profile route and update service
- profile stats from persisted data

### Planned Files

New files:

- `src/modules/tags/server/tag-service.ts`
- `src/app/api/tags/route.ts`
- `src/modules/profiles/schemas/profile-schema.ts`
- `src/modules/profiles/server/profile-service.ts`
- `src/app/api/profiles/[username]/route.ts`
- `src/app/api/profiles/me/route.ts`

Potential page work:

- actual `src/app/profile/[username]` page if brought into scope in this sprint

### Notes

This sprint intentionally comes after persistence and votes so profile stats and reputation have real data behind them.

### Verification

- profile APIs return persisted profile information
- public profile data is stable
- tags connect correctly to posts
- builds and routes pass

### Exit Criteria

- profile and tag systems are real and queryable

## Sprint 10: Seed Rewrite, Test Gates, And Final Stabilization

### Objective

Make the app boot into a realistic, populated state and add verification discipline for the next development phase.

### Scope

Rewrite seed data so it populates:

- disciplines
- softwares
- profiles
- posts across all five types
- comments
- tags and post tags
- votes

Also:

- secure upload auth if not already done
- add test scaffolding or at least verification scripts
- confirm production build integrity

### Planned Files

Modify:

- `prisma/seed.js` or rename to `prisma/seed.ts`
- verification documentation if added

Potential new test files and config:

- to be decided based on chosen test stack

### Verification

- seed executes cleanly
- seeded app looks populated
- typecheck passes
- build passes
- manual smoke test of:
  - auth
  - onboarding
  - post creation
  - comments
  - solved help
  - feeds
  - search

### Exit Criteria

- the app is no longer a UI-first mock with partial persistence
- the app is a data-backed MVP foundation ready for deeper feature work

## Recommended Sprint Execution Rules

For every sprint:

1. analyze the current affected files
2. explain architecture before coding
3. implement only the sprint scope
4. verify with build and typecheck
5. log what changed in the iteration log
6. stop after completion unless the next sprint is explicitly requested

## Verification Gates

These should run after each sprint when applicable:

```bash
npx prisma generate
npm run typecheck
npm run build
```

When migrations are involved:

```bash
npx prisma migrate dev
```

When seed changes are involved:

```bash
npx prisma db seed
```

## Deferred Or Future Work

These are intentionally out of this iteration unless explicitly requested:

- direct messages
- live chat
- marketplace
- notifications system
- recommendation engine
- AI assistant
- advanced moderation system
- monorepo or microservice split

## Final Execution Advice

The uploaded plan had the right long-term instincts:

- strong service layer
- explicit API contracts
- persistence-first backend thinking
- feed cutover strategy
- search abstraction

This V2 plan keeps those strengths, but restructures them around the actual repository so the team can move forward without unnecessary rewrites or architecture drift.
