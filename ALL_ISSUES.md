# RenderMint — Full Issue Tracker

Branch: `feature/v3-current-state`  
Audit Date: June 21, 2026  
Total Issues: **87**

---

## Legend

- 🔴 Critical — security, data loss, or silent correctness failures
- 🟠 High — incorrect behaviour, memory/connection issues, CI blockers
- 🟡 Medium — edge-case bugs, UX failures, missing safeguards
- 🟢 Low — hygiene, performance hints, minor improvements

---

## Group A — Infrastructure

| ID | Severity | File | Issue |
|---|---|---|---|
| A-01 | 🔴 Critical | `src/server/db/client.ts` | Prisma client not guarded by `globalThis` singleton in development — new client created per hot-reload, exhausting DB connection pool |
| A-02 | 🟡 Medium | `src/server/db/client.ts` | `DATABASE_URL` not validated at startup — crashes with unhelpful error if env var is missing |
| A-03 | 🟡 Medium | `src/server/db/client.ts` | No Prisma query logging in development — slow queries invisible |
| A-04 | 🟡 Medium | `prisma/schema.prisma` | Missing `@@index` on foreign key fields — unindexed FK columns cause full table scans |
| A-05 | 🟡 Medium | `prisma/schema.prisma` | `createdAt`/`updatedAt` fields use `DateTime` without timezone annotation — ambiguous in multi-region deployments |
| A-06 | 🟡 Medium | `src/server/db/client.ts` | No connection timeout configured — long-hanging DB connections will block the Node.js event loop |
| A-07 | 🟢 Low | `prisma/schema.prisma` | Soft-delete pattern not implemented — deleted records are hard-deleted with no recovery path |
| A-08 | 🟢 Low | `prisma/schema.prisma` | No enum types for status/type fields — raw strings used where Prisma enums would give compile-time safety |
| A-09 | 🟢 Low | `prisma/seed.ts` | Seed script uses `upsert` but does not handle concurrent seed runs — parallel seeding can produce duplicate records |
| A-10 | 🟢 Low | `prisma/schema.prisma` | `Profile.username` has `@unique` but no explicit length cap — DB allows arbitrarily long usernames |

---

## Group B — API Routes

| ID | Severity | File | Issue |
|---|---|---|---|
| B-01 | 🔴 Critical | `src/app/api/posts/route.ts` | `POST /api/posts` does not validate `authorId` matches the authenticated user — any logged-in user can create posts on behalf of others |
| B-02 | 🔴 Critical | `src/app/api/uploads/[key]/route.ts` | Upload key path is not sanitised — path traversal via `../../etc/passwd`-style keys can expose arbitrary files |
| B-03 | 🔴 Critical | `src/app/api/posts/[id]/route.ts` | `DELETE /api/posts/[id]` does not verify the requesting user owns the post — any authenticated user can delete any post |
| B-04 | 🟠 High | `src/app/api/posts/route.ts` | No rate limiting on `POST /api/posts` — unlimited post creation allows spam/abuse |
| B-05 | 🟠 High | `src/app/api/comments/route.ts` | Comment body is stored without sanitisation — stored XSS vector |
| B-06 | 🟠 High | `src/app/api/uploads/route.ts` | File MIME type validated only by extension string — MIME sniffing bypass allows polyglot file uploads |
| B-07 | 🟠 High | `src/app/api/auth/magic-link/route.ts` | Magic-link rate limit keyed only on email — can be trivially bypassed by rotating email addresses |
| B-08 | 🟡 Medium | `src/app/api/posts/route.ts` | Pagination `limit` parameter not capped server-side — client can request unlimited rows |
| B-09 | 🟡 Medium | `src/app/api/posts/[id]/route.ts` | `PATCH` handler returns full Prisma model including internal fields — over-exposes schema |
| B-10 | 🟡 Medium | `src/app/api/votes/route.ts` | Vote toggle logic is not atomic — concurrent votes from same user can produce duplicate vote records |
| B-11 | 🟡 Medium | `src/app/api/profile/route.ts` | Profile update does not re-validate username uniqueness race condition — two concurrent requests with same username can both succeed |
| B-12 | 🟡 Medium | `src/app/api/uploads/route.ts` | Upload error response leaks internal R2 bucket name and key path in error message |

---

## Group C — Services

| ID | Severity | File | Issue |
|---|---|---|---|
| C-01 | 🔴 Critical | `src/server/services/post.service.ts` | `createPost()` does not check if the user's profile is fully onboarded before writing — unauthorised partial-profile posts possible |
| C-02 | 🔴 Critical | `src/server/services/upload.service.ts` | `deleteUpload()` deletes R2 object before removing the DB record — crash between the two leaves orphan DB records referencing deleted files |
| C-03 | 🟠 High | `src/server/services/post.service.ts` | `getPostsByUser()` runs `findMany` with no `take` limit — full user post history fetched in one query |
| C-04 | 🟠 High | `src/server/services/comment.service.ts` | Nested comment fetch uses recursive Prisma include — depth is unbounded, triggering N+1 queries on deep threads |
| C-05 | 🟠 High | `src/server/services/vote.service.ts` | `toggleVote()` performs separate read-then-write without a transaction — non-atomic under concurrent load |
| C-06 | 🟠 High | `src/server/services/upload.service.ts` | Mock upload mode stores files in-memory (`Map`) per request — files lost between requests with no error |
| C-07 | 🟡 Medium | `src/server/services/post.service.ts` | `searchPosts()` uses `contains` (LIKE) without a full-text index — slow on large post tables |
| C-08 | 🟡 Medium | `src/server/services/profile.service.ts` | `getProfileWithStats()` makes 3 separate Prisma calls — should be combined into one query with `_count` |
| C-09 | 🟡 Medium | `src/server/services/upload.service.ts` | Uploaded filename is not sanitised before use as R2 key — special characters in original filename can produce invalid S3 keys |
| C-10 | 🟢 Low | `src/server/services/post.service.ts` | `updatePost()` does not diff changed fields — always writes all fields even when only one changed |
| C-11 | 🟢 Low | `src/server/services/comment.service.ts` | Soft-deleted comments still appear in `getCommentsByPost()` response |

---

## Group D — Schemas & Validation

| ID | Severity | File | Issue |
|---|---|---|---|
| D-01 | 🔴 Critical | `src/lib/schemas/post.schema.ts` | `createPostSchema` does not strip unknown fields — extra properties pass through to Prisma create and can cause unexpected DB writes |
| D-02 | 🟠 High | `src/lib/schemas/profile.schema.ts` | `username` regex allows leading/trailing hyphens — invalid usernames accepted |
| D-03 | 🟠 High | `src/lib/schemas/upload.schema.ts` | `maxFileSize` enforced on client only — server route does not re-validate size from actual content-length |
| D-04 | 🟠 High | `src/lib/schemas/post.schema.ts` | `tags` array has no max length cap — unlimited tags can be submitted per post |
| D-05 | 🟠 High | `src/lib/schemas/comment.schema.ts` | Comment `body` min length is 0 — empty comments are accepted |
| D-06 | 🟡 Medium | `src/lib/schemas/post.schema.ts` | `title` allows HTML entities — title is rendered without escaping in some components |
| D-07 | 🟡 Medium | `src/lib/schemas/profile.schema.ts` | `bio` field has no max length — very long bios can break layout in card views |
| D-08 | 🟡 Medium | `src/lib/schemas/post.schema.ts` | `slug` field is optional in update schema — sending an empty slug clears an existing post slug |
| D-09 | 🟡 Medium | `src/lib/schemas/upload.schema.ts` | Accepted MIME type list is inconsistent between schema and API route handler |
| D-10 | 🟢 Low | Multiple schema files | Zod schemas use `z.string().min(1)` in some places and `.nonempty()` in others — inconsistent validation style |

---

## Group E — Frontend Components

| ID | Severity | File | Issue |
|---|---|---|---|
| E-01 | 🔴 Critical | `src/components/post/PostCard.tsx` | `dangerouslySetInnerHTML` used with unsanitised post body — stored XSS if sanitisation at write time fails |
| E-02 | 🟠 High | `src/components/forms/CreatePostForm.tsx` | Form resets state on network error and loses user-entered content — destructive UX on transient failures |
| E-03 | 🟠 High | `src/components/ui/FileUpload.tsx` | File size validation runs only after file selection — large files begin uploading before rejection |
| E-04 | 🟠 High | `src/components/post/PostList.tsx` | Infinite scroll `useEffect` adds and never removes the scroll event listener — memory leak |
| E-05 | 🟠 High | `src/components/profile/ProfileAvatar.tsx` | Falls back to `user.email` as display text when `username` is missing — exposes email address in UI |
| E-06 | 🟡 Medium | `src/components/forms/CreatePostForm.tsx` | Submit button remains enabled during submission — double-submit possible on slow connections |
| E-07 | 🟡 Medium | `src/components/ui/Modal.tsx` | Modal does not trap keyboard focus — Tab key navigates outside the modal while it is open (accessibility) |
| E-08 | 🟡 Medium | `src/components/post/PostCard.tsx` | Relative timestamps ("2 hours ago") computed on the server — hydration mismatch warning in development |
| E-09 | 🟡 Medium | `src/components/ui/ImagePreview.tsx` | `<img>` used instead of Next.js `<Image>` — misses optimisation and causes LCP regression |
| E-10 | 🟢 Low | `src/components/layout/Sidebar.tsx` | Active nav item determined by `pathname.startsWith()` — sub-routes incorrectly highlight parent item |

---

## Group F — Auth & Onboarding

| ID | Severity | File | Issue |
|---|---|---|---|
| F-01 | 🔴 Critical | `src/app/(auth)/login/page.tsx` | `next` redirect parameter is not validated — open redirect allows `?next=https://attacker.com` |
| F-02 | 🔴 Critical | `src/app/onboarding/page.tsx` | Onboarding form posts `softwareIds` without server-side validation that the IDs exist — foreign key constraint bypass |
| F-03 | 🟠 High | `src/app/(auth)/login/page.tsx` | Magic-link email field accepts any string — no server-side email format validation before dispatching Supabase auth |
| F-04 | 🟠 High | `src/app/onboarding/page.tsx` | Onboarding step state is stored in `useState` only — refreshing mid-onboarding resets all progress |
| F-05 | 🟠 High | `src/lib/auth/require-auth.ts` | `requireOnboarded()` checks only `username`, `primaryDiscipline`, and one software — other required fields can remain empty |
| F-06 | 🟠 High | `src/app/(auth)/callback/route.ts` | Auth callback does not verify PKCE code verifier — session replay attack possible if code is intercepted |
| F-07 | 🟠 High | `src/app/onboarding/page.tsx` | Onboarding page is client-side only with no server-side guard — direct URL navigation skips onboarding |
| F-08 | 🟡 Medium | `src/app/(auth)/login/page.tsx` | Login error messages distinguish between "email not found" and "wrong link" — user enumeration possible |
| F-09 | 🟡 Medium | `src/app/onboarding/page.tsx` | `username` availability check fires on every keystroke — no debounce causes excessive API calls |
| F-10 | 🟡 Medium | `src/app/(auth)/callback/route.ts` | Auth callback error redirects to `/login` without an error code — user shown blank login page with no explanation |
| F-11 | 🟢 Low | `src/app/onboarding/page.tsx` | Onboarding page has no `<title>` meta tag — shows generic app name in browser tab |

---

## Group G — Lib Utilities

| ID | Severity | File | Issue |
|---|---|---|---|
| G-01 | 🔴 Critical | `src/lib/handle-error.ts` vs `src/lib/errors.ts` | Duplicate `AppError` class exported from two separate files — `instanceof` checks silently fail, causing wrong HTTP status codes |
| G-02 | 🟠 High | `src/lib/sanitize.ts` | `sanitizeHtml` allows `target="_blank"` links without forcing `rel="noopener noreferrer"` — reverse tabnapping vector |
| G-03 | 🟠 High | `src/lib/rate-limit.ts` | In-memory rate-limit store (`memoryStore`) never evicts expired entries — unbounded memory growth |
| G-04 | 🟠 High | `src/lib/db/availability.ts` | DB availability check result is cached permanently — transient startup failures make DB permanently unavailable until restart |
| G-05 | 🟠 High | `src/lib/r2/client.ts` | `getR2Client()` creates a new `S3Client` on every call — no singleton, causes connection pool exhaustion under load |
| G-06 | 🟡 Medium | `src/lib/slug.ts` | After 100 slug collisions, falls back to `Date.now()` — produces ugly, permanent timestamp-based URLs |
| G-07 | 🟡 Medium | `src/lib/env.ts` | Partial R2 configuration silently falls back to mock mode in production with no warning |
| G-08 | 🟡 Medium | `src/lib/toast.tsx` | Uses `window.setTimeout` directly — crashes in SSR or test environments where `window` is undefined |
| G-09 | 🟡 Medium | `src/lib/community/catalog.ts` | Hardcoded mock/demo community post data shipped in production bundle — fake posts can appear to real users |
| G-10 | 🟢 Low | `src/lib/auth/require-auth.ts` | `requireAuth()` and `requireOnboarded()` make two sequential DB round-trips per authenticated request |

---

## Group H — Config & Tooling

| ID | Severity | File | Issue |
|---|---|---|---|
| H-01 | 🔴 Critical | `.env.example` | Real production PostgreSQL database password and project credentials committed in plaintext — rotate immediately |
| H-02 | 🔴 Critical | `middleware.ts` | CSP uses `'unsafe-eval'` and `'unsafe-inline'` in `script-src` — XSS protection fully nullified in production |
| H-03 | 🟠 High | `middleware.ts` | `connect-src` in CSP does not include Cloudflare R2 or Upstash — browser blocks upload and rate-limit API calls |
| H-04 | 🟠 High | `cloudflared-windows-amd64.exe` | 54MB Windows binary committed to git — permanent history bloat and supply-chain risk |
| H-05 | 🟠 High | `*.log` (root) | Runtime server log files committed — leaks internal server paths, error details, and request data |
| H-06 | 🟠 High | `package.json` | Package name is `designers-hub` not `rendermint` — brand/identity mismatch across tooling and runtime globals |
| H-07 | 🟡 Medium | `next.config.mjs` | No `images.remotePatterns` configured — Next.js `<Image>` with external sources throws at runtime |
| H-08 | 🟡 Medium | `tsconfig.json` | All test files excluded from TypeScript type checking — broken test code is invisible to `tsc` |
| H-09 | 🟡 Medium | `vitest.config.ts` | Both `tests/` and `Tests/` included in config — case-sensitive Linux/CI filesystems only see one of them |
| H-10 | 🟡 Medium | `playwright.config.ts` | Playwright loads `.env.test` which is gitignored — CI E2E tests run with missing environment variables |
| H-11 | 🟡 Medium | `tailwind.config.ts` | Content paths omit `src/lib/` and other non-component directories — utility classes purged from production CSS |
| H-12 | 🟢 Low | Root `*.md` files | 10+ internal planning, sprint log, and debug notes committed to repo root including unfiltered developer notes |
| H-13 | 🟢 Low | `.eslintrc.json` | ESLint config only extends Next defaults — no unused variable, no explicit `any`, no import ordering rules |

---

## Priority Fix Order

### Fix immediately (block deployment)
1. **H-01** — Rotate exposed database credentials
2. **H-02** — Fix CSP `unsafe-inline`/`unsafe-eval` in production
3. **B-01** — Authorisation bypass on post creation
4. **B-02** — Path traversal in upload key route
5. **B-03** — Any user can delete any post
6. **G-01** — Duplicate `AppError` — silent HTTP status failures
7. **F-01** — Open redirect on login `?next=` parameter

### Fix before first production user
8. **C-01** — Post creation without onboarding check
9. **C-02** — R2 delete before DB delete — orphan records
10. **E-01** — `dangerouslySetInnerHTML` with unsanitised body
11. **F-02** — Onboarding `softwareIds` FK validation bypass
12. **F-06** — Auth callback missing PKCE verification

### Fix in sprint (quality & stability)
- All remaining High issues: B-04 through B-07, C-03 through C-06, D-02 through D-05, E-02 through E-05, F-03, F-04, F-05, F-07, G-02 through G-05, H-03 through H-06

### Backlog (medium/low)
- All Medium and Low issues across all groups

---

*This file was generated during the Group A–H code audit of the `feature/v3-current-state` branch.*
