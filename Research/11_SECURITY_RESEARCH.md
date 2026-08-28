# Atelier Security Research

# Research Document Context

These files are created for **Atelier / Designers Hub**, a creative-professional community platform being reworked around forum discussions, structured critique, help posts, resources, profiles, dashboards, uploads, search, reputation, settings, moderation, and future admin systems.

The purpose of these files is not to provide final answers yet. Each file clearly defines **what data must be researched**, **why it matters**, **what questions to answer**, and **what output should be produced** before implementation decisions are made.

Use these files as research briefs for ChatGPT, Codex, manual web research, competitor analysis, product planning, and implementation planning.


## Purpose

This research converts the security assessment idea into a practical launch-readiness research file for Atelier. Security is especially important because Atelier has authentication, user-generated content, uploads, comments, votes, profiles, reputation, settings, and future admin tools.

## Main research objective

Research and verify security risks for a Next.js + Supabase + Prisma + R2 + Upstash community platform, then convert findings into a launch checklist and security test plan.

## Important note

Treat security research as verification, not assumption. Do not assume every listed vulnerability exists. For each issue, inspect the actual codebase and mark it as:

- Pass.
- Fail.
- Unclear.
- Not applicable.
- Future roadmap.

## Data to research

### 1. Authentication and session security

Research:

- Mock authentication bypass.
- Supabase session handling.
- Auth callback security.
- Logout invalidation.
- Magic link security.
- Google OAuth security.
- OAuth state parameter.
- Session expiration.
- Cookie flags.

Data to collect:

- All auth routes.
- Any mock token logic.
- Session cookie behavior.
- Supabase SSR client setup.
- Logout implementation.
- Redirect behavior after auth.
- Error handling in auth flow.

### 2. Authorization and ownership checks

Research:

- Post ownership checks.
- Comment ownership checks.
- Profile update protection.
- Upload ownership.
- Vote permissions.
- Accepted solution permissions.
- Admin-only route protection.
- Settings route protection.

Data to collect:

- Every write API route.
- Whether each route checks user identity.
- Whether each route checks ownership.
- Whether route returns 403 or 404.
- Whether shared authorization helpers exist.

### 3. Supabase RLS and database access

Research:

- RLS policies for all tables.
- Prisma/service-role behavior.
- Anon key behavior.
- Service role key storage.
- Database constraints.
- Cross-user data access tests.

Data to collect:

- Which tables have RLS enabled.
- Which operations have policies.
- Whether policies are tested directly.
- Whether service role key bypasses RLS in app queries.
- Whether client can access protected data.

### 4. XSS and user-generated content

Research:

- Post title sanitization.
- Post body sanitization.
- Comment sanitization.
- Profile bio sanitization.
- Tag name sanitization.
- Resource description sanitization.
- Search query rendering.
- `dangerouslySetInnerHTML` usage.
- Markdown/rich text renderer safety.
- Content Security Policy.

Data to collect:

- All fields that accept user text.
- All rendering paths for user text.
- Whether sanitization happens server-side.
- Whether any HTML is allowed.
- Whether React safe rendering is used.

### 5. Injection prevention

Research:

- SQL injection risks in search.
- Raw Prisma queries.
- Filter/query parameter validation.
- Sort allowlists.
- Zod schemas.
- Request body validation.

Data to collect:

- All `$queryRaw` usage.
- Search service implementation.
- Filter construction logic.
- Query parameter schemas.
- Input length limits.

### 6. File upload security

Research:

- Allowed MIME types.
- File extension checks.
- File signature/magic byte validation.
- File size limits.
- Image dimension limits.
- Random filenames.
- Path traversal prevention.
- R2 bucket privacy.
- Signed URLs.
- SVG handling.
- Upload rate limits.

Data to collect:

- Upload API route.
- Upload service.
- Storage bucket config.
- File metadata model.
- How files are served.
- Upload deletion behavior.

### 7. API security

Research:

- Rate limits on auth routes.
- Rate limits on post creation.
- Rate limits on comments.
- Rate limits on votes.
- Rate limits on search.
- Rate limits on uploads.
- Global rate limiting.
- Mass assignment prevention.
- Request size limits.
- CORS config.
- Generic error handling.

Data to collect:

- All API routes.
- Schema validation per route.
- Fields accepted from client.
- Error response format.
- Rate limit implementation.

### 8. Client-side security

Research:

- localStorage usage.
- sessionStorage usage.
- Draft autosave storage.
- Tokens in browser storage.
- Sensitive data in URLs.
- Browser history exposure.
- Security headers.

Data to collect:

- What is stored client-side.
- Expiration behavior.
- Whether tokens are exposed.
- Whether sensitive profile/post data is stored unnecessarily.

### 9. Infrastructure security

Research:

- Environment variable exposure.
- `NEXT_PUBLIC_` variables.
- Service role key exposure.
- Database URL exposure.
- HTTPS enforcement.
- Secure cookies.
- Cloudflare configuration.
- Deployment previews.
- Logs and monitoring.

Data to collect:

- Environment variable list.
- Build bundle checks.
- Deployment config.
- Security headers.
- Secret rotation plan.

### 10. Business logic security

Research:

- Self-voting.
- Duplicate votes.
- Vote manipulation.
- Help solution gaming.
- Reputation farming.
- Duplicate posts.
- Spam comments.
- Link spam.

Data to collect:

- Vote table constraints.
- Reputation service rules.
- Help solution service rules.
- Rate limits.
- Abuse cases.

### 11. Privacy and data exposure

Research:

- API responses exposing email.
- Internal IDs in public responses.
- Deleted/hidden content leakage.
- Personal data in logs.
- Public profile data.
- Own profile vs public profile response.

Data to collect:

- API response shapes.
- View models.
- Public/private field split.
- Logging behavior.

### 12. Security testing

Research and define tests for:

- Auth bypass.
- Logout invalidation.
- Cross-user post edit.
- Cross-user comment delete.
- Profile update protection.
- XSS payloads.
- Search injection.
- HTML upload rejection.
- Oversized upload rejection.
- Rate limit behavior.
- Admin route access.
- Secret exposure check.

## Questions this research must answer

1. Are there any mock auth paths left?
2. Does every write route check ownership?
3. Is RLS enabled and tested?
4. Are user-generated posts/comments sanitized?
5. Are uploads restricted and safe?
6. Are secrets server-only?
7. Are auth and write routes rate-limited?
8. Is mass assignment prevented?
9. Are admin routes protected?
10. What must be fixed before launch?

## Sources and references to research

Research:

- OWASP Top 10.
- Next.js security practices.
- Supabase auth/RLS docs.
- Prisma security notes.
- Cloudflare R2 security patterns.
- Upstash rate limiting.
- Web security headers.
- User-generated content security.

Look for:

- Official docs.
- Security checklists.
- Vulnerability examples.
- Testing strategies.
- Launch checklists.

## Expected output

After research, produce:

- Current security audit.
- P0/P1 launch blockers.
- Security checklist.
- Security test plan.
- API route risk matrix.
- Upload security decision.
- Auth/authorization decision.
- Admin security requirements.

## Codex usage

Use this research to create or update:

```txt
/docs/security/CURRENT_SECURITY_AUDIT.md
/docs/security/SECURITY_LAUNCH_CHECKLIST.md
/docs/security/SECURITY_TEST_PLAN.md
/docs/security/API_ROUTE_SECURITY_MATRIX.md
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
