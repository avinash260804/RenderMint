# AI_HANDOFF

## Project Overview
This repository is a Next.js 14 App Router implementation of Designers Hub/Atelier, a design-community platform centered on structured community participation rather than social-feed mechanics. The current codebase already contains working implementations for:

- Supabase auth entry flows
- onboarding
- dashboard and profile surfaces
- discipline hubs
- multi-post-type post creation
- comments
- votes
- accepted solution flow for help posts
- search
- uploads
- SSR thread pages

It also contains a deliberate hybrid fallback layer that lets major read paths render from static catalog data when the database is unavailable.

## Important Implementation Patterns
### 1. Domain-service architecture
Business logic is concentrated in `src/modules/*/server`.
A new agent should usually start there rather than embedding logic directly into route files or components.

Examples:
- post logic: `src/modules/posts/server/post-service.ts`
- comments: `src/modules/comments/server/comment-service.ts`
- search: `src/modules/search/server/search-service.ts`
- profiles: `src/modules/profiles/server/profile-service.ts`
- dashboard shaping: `src/modules/dashboard/server/dashboard-service.ts`

### 2. Hybrid persisted-plus-fallback data model
Several services check DB availability and fall back to `src/lib/community/catalog.ts`.
That pattern is active, not dead.
It currently affects feed, search, stats, thread loading, and some help/comment fallback behavior.

### 3. SSR-first pages with client-side islands
Pages load data on the server and hand off interactivity to client components.
Avoid converting established server pages into fully client-rendered routes unless necessary.

### 4. Multi-post-type single-table model
`prisma/schema.prisma` keeps all post types in `Post` with type-specific nullable fields.
Do not split these into separate tables without first understanding every service, card component, and thread renderer that depends on this shape.

### 5. Imported premium surface layer
The design language is not only Tailwind utilities.
A large part of the final visual system comes from:
- `src/app/v0-surfaces.css`
- `src/components/v0/*`

Avoid rewriting these as generic utility-only components unless there is a targeted reason.

## Naming Conventions
### Files
- page routes follow App Router conventions under `src/app`
- domain schemas use `*-schema.ts`
- domain services use `*-service.ts`
- query-only helpers use `*-queries.ts`
- fallback stores use `*-store.ts`

### Components
- generic reusable UI: `src/components/ui/*`
- feature UI: `src/components/forum/*`, `src/components/editor/*`, `src/components/upload/*`
- premium imported surfaces: `src/components/v0/*`

### Models
Prisma model names are singular PascalCase.
Client-facing route params and API payloads are mostly lowercase and camelCase.

## Folder Conventions
### `src/app`
Holds route pages, layouts, loading states, metadata routes, and API routes.

### `src/modules`
Holds feature/domain logic and schemas.
This is the main business-logic boundary.

### `src/components`
Holds render-layer code.
Prefer keeping data shaping out of these files when possible.

### `src/lib`
Shared infra/utilities.
Includes env handling, auth helpers, sanitization, pagination, rate limiting, static catalog fallback, and Supabase helpers.

### `src/server`
Server-only persistence bootstrap and extensions.

## Reusable Systems
### Auth
- Supabase session helpers
- middleware gatekeeping
- `requireAuth` and `requireOnboarded`
- post-auth redirect resolver

### Search UI system
- `SearchExperience`
- card rendering through `PostGrid`
- API-backed pagination and filter sync

### Post creation system
- `PostCreationForm`
- Zod schema in `src/modules/posts/schemas/post-creation-schema.ts`
- localStorage autosave
- `AssetUploader`

### Thread interaction system
- thread page loader
- `CommentsPanel`
- `/api/comments`
- `/api/help/solution`
- `/api/votes`

### Profile system
- `profile-service`
- `profile-page-service`
- `AtelierProfilePage`
- `profile-edit-form.tsx`

## Existing Design Language
The current design language is a premium dark, editorial, grid-overlay-heavy UI with subtle gradients, tinted borders, mono labeling, and high-contrast display typography.

Primary ingredients:
- IBM Plex Sans and IBM Plex Mono for body and technical labels
- Bebas Neue and display-styled headings for impact surfaces
- CSS variable theme tokens in `globals.css`
- panel, noise, and overlay treatments in `v0-surfaces.css`
- dark-first visual language with optional theme switching

## Existing Animation Language
Motion is concentrated in the imported v0 surfaces.
Patterns include:
- GSAP-driven transitions and scene movement
- scroll-reactive sections
- card swapping
- text scrambling and split-flap effects
- subtle surface shimmer, gradients, and layered overlays

Most community pages are less motion-heavy than the landing/preview surfaces.

## Existing UX Patterns
- server-rendered pages with immediate first paint
- search-first discovery
- type-specific cards and type-specific post forms
- thread URL as canonical content location
- dashboard/profile as structured overviews, not social feeds
- community-first copy with explicit avoidance of follower/DM systems
- graceful fallback rendering when DB connectivity is degraded

## Existing Coding Standards Seen In Practice
- TypeScript-first module organization
- schemas close to services
- environment validation through Zod
- Prisma singleton pattern
- route handlers thin relative to services
- sanitization before persistence for user-entered text and URLs
- no Redux/global store usage

## Dead Code
The following files appear outside the main route-bound implementation and may be legacy or alternate UI entry points:
- `src/components/Dashboard.tsx`
- `src/components/HeroPage.tsx`
- `src/components/LoginForm.tsx`
- `src/components/PostCreationForm.tsx`
- `src/components/ProfileEditForm.tsx`
- `src/components/ProfilePage.tsx`
- `src/components/SearchResults.tsx`
- `src/components/ThreadPage.tsx`
- `src/components/VoteControl.tsx`

Also likely unused in the live app runtime:
- `src/lib/mock/community-data.ts`

No imports of `src/lib/mock/community-data.ts` were found during repository inspection.

## Duplicate Code Or Parallel Systems
### Static community sources
- active fallback source: `src/lib/community/catalog.ts`
- duplicate-looking legacy source: `src/lib/mock/community-data.ts`

### Test organization
- `Tests/` root test scripts
- `src/__tests__/` and `src/modules/**/__tests__`
- `src/app/api/__tests__/api-routes.test.ts` re-exports a root test file

This creates two parallel test locations and uneven discovery behavior.

## Placeholder Code
### Notifications placeholder
- `src/components/v0/dashboard/dashboard-page.tsx`
The notifications panel explicitly states advanced notifications are deferred in MVP.

### Profile static ecosystem blocks
- `src/components/v0/profile/profile-page.tsx`
Mentorship lane and recognition areas are UI-side static constructs, not backed by persisted mentor/admin data.

### Preview/import pages
- `src/app/(v0-import)/v0-preview/*`
These preserve imported references and are not core product routes.

## Incomplete Implementations
### Search backend target mismatch
- `src/modules/search/server/search-service.ts`
Search is implemented locally with Prisma/manual scoring rather than an external search provider.

### Static taxonomy in post creation
- `src/components/editor/post-creation-form.tsx`
Discipline and software options are sourced from `communityCatalogDisciplines` rather than the live `disciplines` and `softwares` tables.

### Hybrid thread/comments fallback
- `src/modules/feed/server/feed-service.ts`
- `src/modules/comments/server/comment-store.ts`
- `src/modules/help/server/help-solution-store.ts`
Fallback support exists, but it is narrower and less authoritative than persisted DB mode.

### Sitemap sourcing
- `src/app/sitemap.ts`
Sitemap entries are derived from static catalog disciplines/posts, not live database records.

## Missing Navigation Paths Or Navigation Gaps
### Discipline-aware sidebar gap
- `src/components/navigation/app-sidebar.tsx`
Sidebar links are architecture-biased rather than fully dynamic to the current discipline context.

### Primary nav scope gap
- `src/components/navigation/app-header.tsx`
Header navigation is narrow and does not expose the full route inventory present in the app.

## Accessibility Issues Observed In Code
### Legacy test mismatch indicates auth form expectation drift
- live auth form is OAuth/Magic Link only
- older tests still expect password field behavior
This is a test-contract issue, but it also means accessibility validation may still be targeting obsolete UI contracts.

### Dense premium surfaces require care
The imported premium surfaces use layered overlays, mono labels, and dark-on-dark panels. These should be reviewed carefully with automated and visual accessibility checks whenever edited.
Relevant files:
- `src/app/v0-surfaces.css`
- `src/components/v0/hero/*`
- `src/components/v0/dashboard/*`
- `src/components/v0/profile/*`

## Performance Concerns
### Fallback-aware service fanout
- `src/modules/dashboard/server/dashboard-service.ts`
- `src/modules/feed/server/feed-service.ts`
- `src/modules/stats/server/stats-service.ts`
These services aggregate multiple queries and fallback checks; they are central points for build/runtime performance.

### Search scoring in process
- `src/modules/search/server/search-service.ts`
Search ranking is computed in application code after fetching candidate records.

### Premium surface cost
- `src/components/v0/hero/*`
GSAP/framer-heavy landing surfaces are visually rich and likely among the heaviest client bundles.

## Technical Debt
### Mock-cookie auth shortcuts in live API routes
Files containing `mock-valid-token` checks:
- `src/app/api/posts/route.ts`
- `src/app/api/posts/[slug]/route.ts`
- `src/app/api/comments/route.ts`
- `src/app/api/comments/[commentId]/route.ts`
- `src/app/api/help/solution/route.ts`
- `src/app/api/profiles/me/route.ts`
- `src/app/api/votes/route.ts`

### Mixed error-handling styles
- shared helpers exist in `src/lib/handle-error.ts` and `src/lib/api/handle-error.ts`
- not every API route uses them consistently

### Mixed data authority
- database-backed content and static catalog content are both live sources
- this improves resilience but increases reasoning complexity for new changes

### Stale root documentation
- `README.md` is still the generic create-next-app template and does not describe the current build

### Test discovery inconsistency
- `vitest.config.ts` includes selected `Tests/` subpaths but not every root-level test file pattern

## Known Issues With File References
- `src/components/navigation/app-sidebar.tsx`: hard-coded architecture-oriented navigation links
- `src/components/editor/post-creation-form.tsx`: static discipline/software taxonomy source
- `src/app/sitemap.ts`: sitemap generated from catalog data instead of persisted records
- `src/components/v0/profile/profile-page.tsx`: static mentor/recognition ecosystem content
- `src/components/v0/dashboard/dashboard-page.tsx`: notifications panel is explicit placeholder
- `src/lib/mock/community-data.ts`: likely unused duplicate mock data source
- `README.md`: stale setup documentation
- `vitest.config.ts`: partial root `Tests/` discovery
- `src/app/api/posts/route.ts` and related API files listed above: mock-cookie auth shortcuts present

## How To Continue This Project
### First understand the runtime split
Before changing behavior, identify whether the affected page or feature currently reads from:
- Prisma/Supabase only
- fallback catalog only
- hybrid DB plus fallback path

This matters because a change applied only to the Prisma path may appear incomplete when the DB is unavailable.

### Prefer service-layer edits
When fixing or extending behavior:
- start with the domain service in `src/modules/*/server`
- update schemas near the service
- keep API routes thin
- only then adjust the UI

### Preserve canonical thread architecture
`/thread/[slug]` is the canonical content route and already handles metadata plus solved/help semantics.
Avoid introducing alternate canonical content routes unless absolutely necessary.

### Preserve the premium surface system
The repository already invested heavily in `src/components/v0/*` and `src/app/v0-surfaces.css`.
New work should integrate with those systems instead of replacing them wholesale.

### Avoid unnecessary rewrites of working hybrid paths
Catalog fallback is part of the current build contract.
If removing or changing it, trace all dependent services and pages first.

### Check both server and client boundaries
Many features are split across:
- server page loader
- client interactive component
- API route
- module service
- Prisma model

Examples:
- comments
- post creation
- help solved flow
- profile editing

### Validate against existing logs and docs
Useful repository-grounded context lives in:
- `AGENTS.md`
- `docs/architecture/design_system.md`
- `docs/architecture/REQUIREMENTS.md`
- `docs/sprint-logs/PROJECT_MASTER_LOG.md`
- `docs/sprint-logs/PRODUCTION_QUALITY_TEST_AUDIT_LOG.md`
- `docs/sprint-logs/*`

### Be careful with tests
The repository has mixed test locations and older test assumptions.
Before trusting a failing test, confirm whether it targets the current route/component contract or a previous UI contract.

### Be careful with static-looking UI panels
Some panels are intentionally presentational and do not yet map one-to-one with persisted data systems.
Do not assume every displayed block has a database source just because the page around it is dynamic.

### Keep established constraints intact unless intentionally changing them
Observed live constraints include:
- no follower counts
- no DMs
- no notification backend
- no moderation system
- help solved flow only on help posts
- thread pages are SSR-driven
- posts and comments use soft-delete-aware querying





