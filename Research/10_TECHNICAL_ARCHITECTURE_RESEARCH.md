# Atelier Technical Architecture Research

# Research Document Context

These files are created for **Atelier / Designers Hub**, a creative-professional community platform being reworked around forum discussions, structured critique, help posts, resources, profiles, dashboards, uploads, search, reputation, settings, moderation, and future admin systems.

The purpose of these files is not to provide final answers yet. Each file clearly defines **what data must be researched**, **why it matters**, **what questions to answer**, and **what output should be produced** before implementation decisions are made.

Use these files as research briefs for ChatGPT, Codex, manual web research, competitor analysis, product planning, and implementation planning.


## Purpose

This research defines technical decisions for the rework so the platform remains stable, secure, scalable, and maintainable without overengineering.

## Main research objective

Research best practices for the current Atelier stack: Next.js App Router, Supabase Auth, Prisma + PostgreSQL, Cloudflare R2 uploads, Upstash Redis rate limits, SSR pages, search, settings, admin, and future notifications.

## Data to research

### 1. Next.js App Router architecture

Research:

- Server components vs client components.
- Route handlers.
- Middleware.
- Layout nesting.
- SSR thread pages.
- Metadata/SEO.
- Loading and error boundaries.
- Server actions if relevant.
- Caching and revalidation.

Data to collect:

- Where to use server components.
- Where client components are required.
- How to avoid hydration issues.
- How to structure feature modules.
- How to protect routes.

### 2. Supabase Auth architecture

Research:

- SSR auth patterns.
- Auth callback handling.
- Session cookies.
- Magic link flow.
- Google OAuth flow.
- Logout invalidation.
- Post-auth redirect.
- Middleware session checks.

Data to collect:

- Correct Supabase SSR client setup.
- Cookie security.
- OAuth state handling.
- Session timeout/refresh behavior.
- Common auth mistakes.

### 3. Prisma + Supabase PostgreSQL architecture

Research:

- Prisma schema design.
- Supabase RLS with Prisma.
- Service role key risks.
- User ownership checks.
- Database constraints.
- Transactions.
- Indexing.
- Migrations.

Data to collect:

- Best model structure for posts/comments/votes/profiles/uploads.
- How to prevent duplicate votes.
- How to enforce ownership.
- Which constraints belong in database.
- Which rules belong in service layer.

### 4. Upload architecture with Cloudflare R2

Research:

- Secure upload flow.
- Signed upload URLs vs server upload.
- MIME validation.
- File signature validation.
- Random file names.
- Image optimization.
- Public vs private buckets.
- CDN delivery.
- Quotas.

Data to collect:

- Best upload pattern for critique images.
- How to store file metadata.
- How to associate uploads with posts.
- How to delete unused uploads.

### 5. Search architecture

Research:

- Simple database search.
- Full-text search in PostgreSQL.
- Prisma search limitations.
- Ranking/scoring.
- Filters.
- Tags.
- Pagination.
- Search performance.
- Search rate limiting.

Data to collect:

- What search version is enough for launch.
- What to index.
- How to filter by post type, discipline, tag, status.
- How to avoid expensive queries.

### 6. Settings architecture

Research:

- Profile settings.
- Account settings.
- Privacy settings.
- Notification preferences placeholder.
- Appearance/theme preferences.

Data to collect:

- Which settings require backend models.
- Which can be stored in profile.
- Which can wait.
- How to protect settings routes.

### 7. Admin architecture

Research:

- Admin-only route protection.
- Role model.
- Report management.
- User management.
- Content moderation.
- Audit logs.
- Admin UI safety.

Data to collect:

- Minimum admin data model.
- Role-based authorization pattern.
- Admin route middleware.
- Actions requiring logs.

### 8. Performance architecture

Research:

- N+1 query prevention.
- Pagination.
- Infinite scroll vs paginated pages.
- Indexing.
- Caching.
- Image optimization.
- Bundle size.
- Loading states.

Data to collect:

- Pages most likely to be slow.
- Queries that need includes/batching.
- Cache boundaries.
- Performance budget.

### 9. Notifications architecture later

Research but do not implement too early:

- In-app notifications.
- Email notifications.
- Digest emails.
- Notification preferences.
- Background jobs.
- Event table.
- Queue workers.

Data to collect:

- What notification events are needed.
- What can wait.
- What schema should not block current work.

## Questions this research must answer

1. What is the correct architecture for Atelier's current stack?
2. How should modules be organized?
3. How should auth/session be handled?
4. How should RLS and Prisma coexist?
5. How should uploads work securely?
6. What search architecture is enough for launch?
7. How should settings be added?
8. How should admin be added minimally?
9. What performance risks exist?
10. What future systems should not be built yet?

## Sources and references to research

Research:

- Next.js App Router docs and examples.
- Supabase SSR auth examples.
- Prisma best practices.
- Supabase RLS patterns.
- Cloudflare R2 upload architecture.
- Upstash rate limiting examples.
- PostgreSQL full-text search.
- Admin route protection patterns.

Look for:

- Official docs.
- Example repos.
- Known pitfalls.
- Security notes.
- Performance advice.

## Expected output

After research, produce:

- Technical architecture plan.
- Module structure.
- Auth/session model.
- Data access rules.
- Upload architecture.
- Search architecture.
- Settings/admin architecture.
- Performance checklist.
- Future architecture notes.

## Codex usage

Use this research to create or update:

```txt
/docs/technical/ARCHITECTURE_PLAN.md
/docs/technical/AUTH_ARCHITECTURE.md
/docs/technical/UPLOAD_ARCHITECTURE.md
/docs/technical/SEARCH_ARCHITECTURE.md
```

---

## Research Findings

Use this section to paste actual research notes, screenshots, references, observations, and examples.

### Findings

- 

### Strong references

- 

### Weak references / avoid

- 

### Final decisions from this research

- 

### Open questions

-
