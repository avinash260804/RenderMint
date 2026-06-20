# PROJECT_STATE

## Scope
This document describes the current repository state only as of 2026-06-20. It is based on the checked-in code, configuration, assets, tests, and logs in this repository. It does not include future plans or speculative roadmap items.

## Product Summary
Designers Hub, also branded in the imported premium UI as Atelier, is currently implemented as a community-first design platform for structured discussions, critique requests, showcases, help threads, and resource sharing across design disciplines. The current build combines:

- persisted community data through Prisma + PostgreSQL/Supabase
- Supabase authentication and onboarding
- file upload support through Cloudflare R2 or local mock storage
- a search experience over posts
- a help-thread solved system
- profile, dashboard, and premium imported UI surfaces
- static catalog fallbacks when the database is unavailable or empty

## Current Purpose Of The Platform
The live code supports a multidisciplinary design community centered on:

- reading and browsing design community content
- creating multi-type posts
- commenting and voting
- solving help posts through accepted answers
- onboarding users into a discipline and software stack
- browsing discipline hubs, search results, threads, dashboards, and profiles

## Tech Stack
### Framework and runtime
- Next.js 14.2.33
- React 18
- TypeScript strict mode
- App Router

### Styling and UI
- Tailwind CSS 3.4.1
- shadcn/ui-style component primitives in `src/components/ui`
- `next-themes` for dark/light theme switching
- custom CSS variables in `src/app/globals.css`
- imported premium surface styles in `src/app/v0-surfaces.css`

### Forms and validation
- React Hook Form
- Zod
- `@hookform/resolvers`

### Database and backend
- Prisma 6.19.3
- PostgreSQL via Supabase
- Supabase SSR + browser clients

### Storage and uploads
- Cloudflare R2 through `@aws-sdk/client-s3`
- local mock upload storage in `.tmp/uploads`

### Motion and interactions
- GSAP
- Framer Motion

### Security and utility packages
- `isomorphic-dompurify`
- `@upstash/ratelimit`
- `@upstash/redis`
- `clsx`
- `class-variance-authority`
- `tailwind-merge`

### Testing
- Vitest
- Playwright
- Testing Library
- MSW
- Axe Playwright

## Dependencies
### Runtime dependencies
- `@aws-sdk/client-s3`
- `@base-ui/react`
- `@hookform/resolvers`
- `@prisma/client`
- `@supabase/ssr`
- `@supabase/supabase-js`
- `@upstash/ratelimit`
- `@upstash/redis`
- `class-variance-authority`
- `clsx`
- `framer-motion`
- `gsap`
- `isomorphic-dompurify`
- `lucide-react`
- `next`
- `next-themes`
- `react`
- `react-dom`
- `react-hook-form`
- `shadcn`
- `tailwind-merge`
- `tw-animate-css`
- `zod`

### Dev dependencies
- `@axe-core/playwright`
- `@playwright/test`
- `@testing-library/jest-dom`
- `@testing-library/react`
- `@testing-library/user-event`
- `@types/node`
- `@types/react`
- `@types/react-dom`
- `@vitejs/plugin-react`
- `@vitest/coverage-v8`
- `eslint`
- `eslint-config-next`
- `jsdom`
- `msw`
- `postcss`
- `prettier`
- `prettier-plugin-tailwindcss`
- `prisma`
- `prismock`
- `supabase`
- `tailwindcss`
- `typescript`
- `uuid`
- `vite`
- `vitest`
- `vite-tsconfig-paths`

## Folder Structure
### Top level
- `prisma/`: Prisma schema, migrations, seed, RLS strategy docs
- `public/`: static assets, especially `public/v0`
- `src/`: application source
- `supabase/`: SQL migration for RLS policies
- `Tests/`: root test scripts and audit-era test files
- `V3 logs/`: sprint-by-sprint V3 implementation logs
- `.tmp/`: local mock upload storage and temp files

### Source structure
- `src/app/`: routes, layouts, metadata files, API routes
- `src/components/`: UI primitives, forum UI, navigation, editor, upload, and imported v0 surfaces
- `src/lib/`: shared utilities, env validation, sanitization, rate limiting, auth helpers, community catalog
- `src/modules/`: domain services and schemas by feature area
- `src/server/`: Prisma client and server-side extensions
- `src/types/`: shared types
- `src/__tests__/`: component and helper tests

## Route Inventory
### Primary app routes
| Route | File | Purpose | Status |
|---|---|---|---|
| `/` | `src/app/page.tsx` | Marketing/landing page using imported Atelier hero surface | Implemented |
| `/login` | `src/app/login/page.tsx` | Alias to auth login | Implemented |
| `/signup` | `src/app/signup/page.tsx` | Alias to auth signup | Implemented |
| `/auth/login` | `src/app/auth/login/page.tsx` | Login page | Implemented |
| `/auth/signup` | `src/app/auth/signup/page.tsx` | Signup page | Implemented |
| `/onboarding` | `src/app/(community)/onboarding/page.tsx` | User onboarding flow | Implemented |
| `/dashboard` | `src/app/dashboard/page.tsx` | Authenticated dashboard | Implemented |
| `/explore` | `src/app/explore/page.tsx` | Explore/search-driven community index | Implemented |
| `/search` | `src/app/search/page.tsx` | Dedicated search page | Implemented |
| `/post/new` | `src/app/post/new/page.tsx` | Multi-post-type creation form | Implemented |
| `/thread/[slug]` | `src/app/thread/[slug]/page.tsx` | Canonical thread page | Implemented |
| `/profile/[username]` | `src/app/profile/[username]/page.tsx` | Public profile page | Implemented |
| `/profile/me/edit` | `src/app/profile/me/edit/page.tsx` | Authenticated profile editing | Implemented |
| `/[discipline]` | `src/app/[discipline]/page.tsx` | Discipline hub | Implemented |
| `/[discipline]/discussions` | `src/app/[discipline]/discussions/page.tsx` | Discipline discussion listing | Implemented |
| `/[discipline]/critique` | `src/app/[discipline]/critique/page.tsx` | Discipline critique listing | Implemented |
| `/[discipline]/showcase` | `src/app/[discipline]/showcase/page.tsx` | Discipline showcase listing | Implemented |
| `/[discipline]/help` | `src/app/[discipline]/help/page.tsx` | Discipline help listing | Implemented |
| `/[discipline]/resources` | `src/app/[discipline]/resources/page.tsx` | Discipline resources listing | Implemented |

### Authentication callback and sign-out routes
| Route | File | Purpose | Status |
|---|---|---|---|
| `/auth/callback` | `src/app/auth/callback/route.ts` | Handles Supabase auth callback/session exchange | Implemented |
| `/auth/signout` | `src/app/auth/signout/route.ts` | Signs user out | Implemented |

### Metadata routes
| Route | File | Purpose | Status |
|---|---|---|---|
| `/robots.txt` | `src/app/robots.ts` | Robots policy | Implemented |
| `/sitemap.xml` | `src/app/sitemap.ts` | Sitemap generation | Implemented |

### Preview/import routes
| Route | File | Purpose | Status |
|---|---|---|---|
| `/v0-preview` | `src/app/(v0-import)/v0-preview/page.tsx` | Imported preview surface | Partial/reference |
| `/v0-preview/hero` | `src/app/(v0-import)/v0-preview/hero/page.tsx` | Hero preview | Partial/reference |
| `/v0-preview/login` | `src/app/(v0-import)/v0-preview/login/page.tsx` | Login preview | Partial/reference |
| `/v0-preview/dashboard` | `src/app/(v0-import)/v0-preview/dashboard/page.tsx` | Dashboard preview | Partial/reference |
| `/v0-preview/profile` | `src/app/(v0-import)/v0-preview/profile/page.tsx` | Profile preview | Partial/reference |

## Page Inventory
### `/`
- Purpose: primary landing page
- Components used: `LandingPage`, imported hero sections under `src/components/v0/hero`
- Current functionality: animated premium marketing/community surface, stats display, CTA links
- Missing functionality: not personalized, not backed by live community feed
- Completion status: implemented with static/persisted stats mix

### `/auth/login` and `/login`
- Purpose: sign-in entry point
- Components used: `AuthPage`, `AuthForm`, `AuthLeftPanel`
- Current functionality: Google OAuth and Magic Link initiation; post-auth redirect logic
- Missing functionality: no password login; some legacy tests still expect password fields
- Completion status: implemented

### `/auth/signup` and `/signup`
- Purpose: sign-up entry point
- Components used: same auth surface as login with alternate copy/flow
- Current functionality: Google OAuth and Magic Link initiation
- Missing functionality: no separate credential registration flow
- Completion status: implemented

### `/onboarding`
- Purpose: complete profile and discipline setup after authentication
- Components used: `OnboardingForm`
- Current functionality: username, discipline, software selection with server-side validation and persistence
- Missing functionality: no richer profile completion fields beyond current schema
- Completion status: implemented

### `/dashboard`
- Purpose: authenticated user overview
- Components used: `DashboardPage`, `StudioHeader`, dashboard feed panels
- Current functionality: profile stats, discipline focus, quick routes, mixed feed sections, practice stack panel
- Missing functionality: notifications are explicitly deferred; sidebar content includes static copy; some data panels are presentation-heavy and partly derived from fallback/feed summaries rather than fully normalized dashboard metrics
- Completion status: implemented/partial

### `/explore`
- Purpose: browse and search community content
- Components used: `AppLayoutShell`, `SearchExperience`
- Current functionality: server-seeded search results, filters, ranking chips, pagination, mixed post cards
- Missing functionality: external search provider integration; all filter options are not fully dynamic from DB
- Completion status: implemented/partial

### `/search`
- Purpose: dedicated searchable archive page
- Components used: `AppLayoutShell`, `SearchExperience`
- Current functionality: same search system as explore with query hydration
- Missing functionality: Algolia integration; fully live taxonomy options
- Completion status: implemented/partial

### `/post/new`
- Purpose: create a new post
- Components used: `PostCreationForm`, `AssetUploader`
- Current functionality: dynamic fields by post type, client validation, autosave draft, preview mode, upload integration, post submission
- Missing functionality: discipline/software options are still sourced from static catalog data rather than live discipline/software tables
- Completion status: implemented/partial

### `/thread/[slug]`
- Purpose: canonical thread view
- Components used: `CommentsPanel`, page-level type-specific content blocks
- Current functionality: loads persisted thread when available, falls back to catalog thread, renders comments, accepted solution controls, metadata generation, help JSON-LD
- Missing functionality: thread body rendering is plain text sections rather than rich editor content; fallback thread/comments are limited in scope
- Completion status: implemented/partial

### `/profile/[username]`
- Purpose: public profile view
- Components used: `AtelierProfilePage`, `ProfileNav`
- Current functionality: profile info, stats, heatmap, recent posts, practice stack, mentor lane panel, recognition panel
- Missing functionality: mentorship lane and recognition content are UI-side static constructs, not backed by a mentor/admin subsystem
- Completion status: implemented/partial

### `/profile/me/edit`
- Purpose: edit current user profile
- Components used: `ProfileEditForm`
- Current functionality: edit bio, avatar URL, discipline/software/skills-related profile fields
- Missing functionality: no avatar upload pipeline tied directly into edit form
- Completion status: implemented/partial

### `/[discipline]` and discipline subpages
- Purpose: discipline hub and filtered feed pages
- Components used: `AppLayoutShell`, `DisciplineTabs`, `PostGrid`, `FeedSkeleton`, `EmptyState`
- Current functionality: lists posts by discipline and space using feed service
- Missing functionality: some navigation links remain architecture-biased in sidebar; page content can fall back to static catalog when DB is unavailable
- Completion status: implemented/partial

### Preview pages under `/v0-preview/*`
- Purpose: preserve imported design references and component previews
- Components used: imported preview pages under `src/components/v0/*`
- Current functionality: isolated design previews
- Missing functionality: not part of primary user flows
- Completion status: reference/partial

## Component Inventory
### Layout and navigation
- `src/components/ui-system/app-layout-shell.tsx`
- `src/components/navigation/app-header.tsx`
- `src/components/navigation/app-sidebar.tsx`
- `src/components/navigation/top-navigation.tsx`
- `src/components/navigation/theme-toggle.tsx`

### Forum and feed
- `src/components/forum/post-grid.tsx`
- `src/components/forum/comments-panel.tsx`
- `src/components/forum/search-experience.tsx`
- `src/components/forum/discipline-tabs.tsx`
- `src/components/forum/feed-skeleton.tsx`
- `src/components/forum/empty-state.tsx`

### Post cards
- `src/components/cards/discussion-card.tsx`
- `src/components/cards/critique-card.tsx`
- `src/components/cards/help-card.tsx`
- `src/components/cards/resource-card.tsx`
- `src/components/cards/showcase-card.tsx`

### Post creation and upload
- `src/components/editor/post-creation-form.tsx`
- `src/components/upload/asset-uploader.tsx`

### UI primitives
- `src/components/ui/avatar.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/separator.tsx`
- `src/components/ui/skeleton.tsx`
- `src/components/ui/textarea.tsx`

### Imported v0 surfaces
- hero surface components under `src/components/v0/hero`
- auth surface components under `src/components/v0/login`
- dashboard surface components under `src/components/v0/dashboard`
- profile surface components under `src/components/v0/profile`

### Legacy root components
The following components exist in `src/components/` but are not part of the current route architecture discovered in the app router:
- `Dashboard.tsx`
- `HeroPage.tsx`
- `LoginForm.tsx`
- `PostCreationForm.tsx`
- `ProfileEditForm.tsx`
- `ProfilePage.tsx`
- `SearchResults.tsx`
- `ThreadPage.tsx`
- `VoteControl.tsx`

These appear to be legacy or alternate entry components rather than the main route-bound implementation.

## Feature Inventory
### Authentication
- Current state: implemented
- Frontend implementation: login/signup pages use `AuthForm`; theme and premium auth UI exist
- Backend implementation: Supabase OAuth and Magic Link routes under `src/app/api/auth/*` plus callback/signout handlers
- Database implementation: relies on Supabase auth user IDs mapped to `Profile.id`
- Dependencies: `@supabase/ssr`, `@supabase/supabase-js`, middleware, auth helpers

### Onboarding
- Current state: implemented
- Frontend implementation: onboarding page + form
- Backend implementation: `src/app/api/onboarding/route.ts`, `completeOnboarding` service
- Database implementation: updates `Profile`, `disciplineId`, `primaryDiscipline`, `ProfileSoftware`, `onboarded`
- Dependencies: Prisma, Supabase session, auth schemas

### Discipline hubs
- Current state: implemented with fallback mode
- Frontend implementation: route pages, tabs, post grid, skeletons, empty states
- Backend implementation: `getDisciplineFeed` through `feed-service`
- Database implementation: reads `Post`, `Discipline`, `Software`, `Tag`, `Profile`
- Dependencies: Prisma, community catalog fallback

### Multi-post-type post creation
- Current state: implemented
- Frontend implementation: RHF/Zod dynamic form, autosave, preview, asset uploader
- Backend implementation: `createPost` in `post-service`, upload route
- Database implementation: `Post`, `Attachment`, `Tag`, `PostTag`
- Dependencies: Prisma, DOMPurify sanitization, upload module

### Comments
- Current state: implemented with fallback store
- Frontend implementation: `CommentsPanel`
- Backend implementation: comment CRUD routes + `comment-service`
- Database implementation: `Comment`, `Post.commentCount`, accepted comment clearing behavior
- Dependencies: Prisma, auth, fallback comment store

### Votes
- Current state: implemented
- Frontend implementation: thread/comment actions are wired through APIs; dedicated legacy root `VoteControl.tsx` is present but not part of main route discovery
- Backend implementation: `vote-service`, `/api/votes`
- Database implementation: `Vote`, `Post.voteCount`, `Comment.voteCount`, reputation recompute
- Dependencies: Prisma, rate limiting, auth

### Help solved system
- Current state: implemented with fallback behavior
- Frontend implementation: solution controls in `CommentsPanel`
- Backend implementation: `/api/help/solution`, `help-solution-service`
- Database implementation: `Post.isSolved`, `Post.acceptedCommentId`, `Comment.isSolution`
- Dependencies: Prisma, auth, fallback store

### Search
- Current state: implemented as Prisma/manual search, not external search service
- Frontend implementation: `SearchExperience`, explore/search pages
- Backend implementation: `/api/search`, `search-service`
- Database implementation: `Post` query with filters and scoring derived from post, discipline, software, tag relations
- Dependencies: Prisma, pagination utils, catalog fallback

### Profiles
- Current state: implemented/partial
- Frontend implementation: profile page, edit page, dashboard profile panels
- Backend implementation: `profile-service`, `profile-page-service`, `/api/profiles/*`
- Database implementation: `Profile`, `ProfileSoftware`, profile stats via `Post` and `Comment`
- Dependencies: Prisma, auth, UI surfaces

### Reputation
- Current state: implemented as server-side recompute
- Frontend implementation: displayed on dashboard/profile
- Backend implementation: `reputation-service`
- Database implementation: stored in `Profile.reputation`
- Dependencies: Prisma, posts/comments/votes/help solution data

### Uploads
- Current state: implemented with dual mode
- Frontend implementation: `AssetUploader`
- Backend implementation: `/api/uploads`, `/api/uploads/[...key]`, `upload-service`
- Database implementation: `Attachment` records associated to posts
- Dependencies: R2 client, local filesystem mock mode, upload schemas

### SEO
- Current state: partial
- Frontend implementation: metadata generation on thread pages; robots and sitemap files exist
- Backend implementation: server-rendered thread pages and static metadata helpers
- Database implementation: none directly; routes still largely use catalog data in sitemap generation
- Dependencies: Next metadata APIs, env config

### Notifications
- Current state: not implemented as a backend feature
- Frontend implementation: dashboard contains a visible placeholder stating notifications are deferred in MVP
- Backend implementation: none found
- Database implementation: none found
- Dependencies: none

### Moderation/admin
- Current state: not implemented
- Frontend implementation: none found
- Backend implementation: none found
- Database implementation: none found
- Dependencies: none

### Collaboration functionality
- Current state: limited to asynchronous community interaction
- Frontend implementation: posts, comments, critique flows, help solve actions
- Backend implementation: post/comment/vote/help APIs
- Database implementation: `Post`, `Comment`, `Vote`, `Attachment`, `Tag`
- Dependencies: Prisma, auth

## Authentication Flow
1. User opens `/auth/login`, `/login`, `/auth/signup`, or `/signup`.
2. User chooses Google OAuth or Magic Link.
3. Frontend posts to `/api/auth/google` or `/api/auth/magic-link`.
4. Supabase starts auth flow.
5. User returns through `/auth/callback`.
6. Redirect logic in `resolvePostAuthRedirect` checks onboarding status.
7. User is sent to `/onboarding` if profile is not onboarded, otherwise `/dashboard`.
8. Middleware protects `/dashboard`, `/onboarding`, and `/settings` prefixes and enforces session presence.

## User Flows
### Anonymous user
- visit landing page
- browse explore/search/discipline pages/thread pages/profile pages
- initiate login or signup

### Authenticated new user
- authenticate
- complete onboarding
- enter dashboard
- create posts, comments, votes after session is present

### Authenticated returning user
- open dashboard
- navigate to discipline spaces
- create post
- comment or vote on thread
- edit profile

### Help thread author
- create help post
- receive comments
- mark accepted solution from one comment
- thread moves into solved state

## Database Inventory
### Prisma models
- `Profile`
- `Discipline`
- `Software`
- `ProfileSoftware`
- `Post`
- `Attachment`
- `Comment`
- `Tag`
- `PostTag`
- `Vote`

### Enums
- `PostType`
- `VoteTargetType`
- `VoteType`

### Schema characteristics
- `Post` supports multiple post-type-specific fields in one table
- `Comment` and `Post` use soft delete through `deletedAt`
- `ProfileSoftware` and `PostTag` are join tables
- `Vote` supports post and comment targets
- multiple performance and feed/search indexes exist
- RLS strategy documentation exists in `prisma/RLS_STRATEGY.md`
- a Supabase SQL migration exists in `supabase/migrations/20260615183445_apply_rls_policies.sql`

### Migrations present
- `20260515_phase2_database_architecture`
- `20260515_phase3_auth_onboarding`
- `20260609_sprint2_schema_persistence_foundations`
- `20260614_rls_policy_hardening`
- `20260615_sprint0_schema_drift_sync`
- `20260615_sprint5_profile_identity_fields`
- `20260616120000_add_performance_indexes`

## API Inventory
| Endpoint | Purpose | Current status |
|---|---|---|
| `POST /api/auth/google` | start Google OAuth | implemented |
| `POST /api/auth/magic-link` | start Magic Link | implemented |
| `GET/POST /api/comments` | list/create comments | implemented |
| `PATCH/DELETE /api/comments/[commentId]` | edit/delete comment | implemented |
| `GET/POST /api/help/solution` | read/set accepted solution | implemented |
| `POST /api/onboarding` | complete onboarding | implemented |
| `GET/POST /api/posts` | list/create posts | implemented |
| `GET/PATCH/DELETE /api/posts/[slug]` | read/update/delete post | implemented |
| `GET/PATCH /api/profiles/me` | current profile read/update | implemented |
| `GET /api/profiles/[username]` | public profile lookup | implemented |
| `PATCH /api/profiles/[username]` | public profile patch | intentionally unsupported |
| `GET /api/search` | search archive | implemented |
| `GET /api/stats` | platform stats | implemented |
| `GET /api/tags` | tag listing/search | implemented |
| `POST /api/uploads` | file upload | implemented |
| `GET /api/uploads/[...key]` | serve uploaded file | implemented |
| `POST /api/votes` | cast/toggle vote | implemented |

## Animation Inventory
### Libraries in use
- GSAP
- Framer Motion

### Animated surfaces/components
- hero sections under `src/components/v0/hero/*`
- `magic-bento.tsx`
- `card-swap.tsx`
- `scramble-text.tsx`
- `split-flap-text.tsx`
- `grid-motion.tsx`
- multiple premium surface overlays driven by CSS in `src/app/v0-surfaces.css`

### Animation status
- imported hero and premium marketing surfaces use the richest motion language
- community application pages rely more on CSS surface treatments and lighter interaction motion

## Design System Inventory
### Fonts
- local Geist variable fonts from `src/app/fonts/*`
- Google fonts: IBM Plex Sans, IBM Plex Mono, Bebas Neue

### Theme system
- `next-themes` provider in `src/components/providers/theme-provider.tsx`
- class-based dark mode in `tailwind.config.ts`
- CSS variables in `src/app/globals.css`

### Token sources
- CSS variables for colors, radius, spacing, and surfaces in `src/app/globals.css`
- UI token exports in `src/components/ui-system/tokens.ts`

### Layout system
- `AppLayoutShell`
- top navigation + sidebar + header composition
- grid overlays and premium surface wrappers in `v0-surfaces.css`

### Component families
- shadcn-style primitive components
- typed post cards per post type
- premium imported v0 hero/dashboard/profile/auth surfaces

## Assets Inventory
### Public assets
- `public/v0/atelier-bg.png`
- `public/v0/bioclimatic.png`
- `public/v0/courtyard.png`
- `public/v0/editorial.png`
- `public/v0/kitchen.png`
- `public/v0/tower-facade.png`
- `public/v0/warm-minimal.png`
- `public/v0/waterfront.png`
- `public/v0/wayfinding.png`

### Font assets
- `src/app/fonts/GeistVF.woff`
- `src/app/fonts/GeistMonoVF.woff`

## State Management Patterns
- server components for initial data loading on pages
- client components for interactive forms, search, uploads, comments, and theme
- React local state and hooks for UI state
- React Hook Form for form state
- no Redux, no Zustand, no global client store discovered
- URL query parameters used to persist search filters and page state
- localStorage autosave for post drafts
- Prisma services as source of truth for persisted data when DB is available
- fallback in-memory/static catalog behavior when DB is unavailable

## Error Handling Patterns
- shared env validation through `src/lib/env.ts`
- shared error helpers under `src/lib/errors.ts`, `src/lib/handle-error.ts`, and `src/lib/api/handle-error.ts`
- API routes generally return structured JSON errors
- search, feed, comments, help solution, and stats services often degrade gracefully to fallback data when DB access fails
- upload errors are surfaced inline in the uploader
- some write routes include mock cookie fallback behavior for testing/development shortcuts

## Loading State Patterns
- route-level loading files for `explore`, `thread/[slug]`, and `[discipline]`
- skeleton components in `src/components/forum/feed-skeleton.tsx`
- inline loading states in comments panel, uploader, and search experience

## Search Functionality
- implemented in `src/modules/search/server/search-service.ts`
- uses Prisma queries and manual scoring/ranking
- filters: discipline, software, post type, solved state, query text
- ranking factors in code: relevance, solved boost, engagement, freshness
- fallback search runs over static community catalog
- not currently backed by Algolia

## Notification Systems
- no functional notification system found
- dashboard includes explicit placeholder copy stating advanced notifications are deferred in MVP

## Community/Forum Functionality
Implemented:
- discipline hubs
- post listings by space
- multi-post-type creation
- thread reading
- comments
- votes
- accepted solution flow for help posts
- profile views
- search

Partially implemented:
- hybrid fallback content when DB unavailable
- some UI panels remain static or semi-static
- some navigation links are not fully discipline-aware

Missing:
- moderation tools
- admin dashboard
- advanced notifications
- direct messaging
- realtime collaboration

## Collaboration Functionality
Current collaboration is asynchronous and forum-centric:
- critique posts
- threaded comments on posts
- help solve flow
- vote feedback

No synchronous or workspace collaboration systems were found.

## Moderation/Admin Functionality
No moderation, admin, banning, content review queue, or admin route implementation was found in the current repository snapshot.

## Documentation Inventory
### Product and build docs present
- `AGENTS.md`
- `design_system.md`
- `IMPLEMENTATION_PLAN_V2.md`
- `ITERATION_BUILD_LOG_TEMPLATE.md`
- `PRODUCTION_BUILD_VERIFICATION.md`
- `PRODUCTION_QUALITY_TEST_AUDIT_LOG.md`
- `PROJECT_MASTER_LOG.md`
- `REQUIREMENTS.md`
- `SPRINT_10_VERIFICATION.md`
- `TEST_EXECUTION_LOG.md`

### Iteration logs present
- `V3 logs/V3_SPRINT_0_LOG.md`
- `V3 logs/V3_SPRINT_1_LOG.md`
- `V3 logs/V3_SPRINT_2_LOG.md`
- `V3 logs/V3_SPRINT_3_LOG.md`
- `V3 logs/V3_SPRINT_4_LOG.md`
- `V3 logs/V3_SPRINT_5_LOG.md`
- `V3 logs/V3_SPRINT_6_LOG.md`
- `V3 logs/V3_SPRINT_7_LOG.md`
- `V3 logs/V3_SPRINT_8_LOG.md`
- `V3 logs/V3_SPRINT_9_LOG.md`

## Current Missing Or Partial Areas
### Partial implementations
- static catalog fallback remains part of critical runtime paths in feed, search, stats, help solution, and comments fallback
- profile page includes static mentor/recognition constructs
- dashboard includes static placeholder notification block
- sitemap is generated from catalog data, not live persisted posts
- post creation discipline/software taxonomy is driven from static catalog data

### Missing implementations
- moderation/admin
- advanced notifications
- external search provider integration
- fully dynamic discipline-aware sidebar navigation
- fully live taxonomy sourcing in all write flows

## Notes, Comments, TODO-Style Markers
Repository-discoverable TODO-style markers were limited. Notable findings:
- `Tests/integration.test.ts`: note about real transaction isolation requiring pgLite or transaction strategy
- `Tests/security.spec (1).ts`: note that SEC-01 through SEC-11 were coded previously
- dashboard UI includes explicit product note that advanced notifications are deferred in MVP

## Completion Summary
### Implemented and active
- auth entry flows
- onboarding
- dashboard
- explore and search
- discipline hubs
- post creation
- uploads
- comments
- votes
- solved help flow
- profiles
- metadata routes

### Implemented but partial or hybrid
- search
- SEO metadata surface
- dashboard data normalization
- profile ecosystem data
- runtime data sourcing resilience

### Not implemented
- moderation/admin
- advanced notifications
- realtime collaboration
- follower/social systems
- marketplace or jobs systems
