# RLS Strategy (Phase 2)

This strategy is intentionally schema-level only and does not implement auth flows.

## Principles

- Public read access for discovery content (disciplines, softwares, tags, posts, comments, attachments).
- Authenticated write access for community contributions.
- Ownership checks for updates/deletes.
- Help post solution state limited to post owner.
- Service role bypass for backend maintenance and indexing jobs.

## Policy Overview

- `profiles`: user can read all, update own row.
- `posts`: public read, authenticated create, owner update/delete.
- `comments`: public read, authenticated create, owner update/delete.
- `attachments`: public read, authenticated create bound to own post, owner delete.
- `post_tags`: public read, authenticated create/delete for own post.
- `votes`: public read, authenticated create/update/delete own vote.
- `profile_softwares`: public read, authenticated insert/delete for own profile.
- `disciplines`, `softwares`, `tags`: public read; writes restricted to service role.

## Enforcement Notes

- `is_solved` and `accepted_comment_id` business rules are guarded by SQL constraints and policy checks.
- `votes` enforce exactly one target (`post_id` xor `comment_id`) and target type consistency.
- All client access should use anon/authenticated keys with RLS enabled.

See `prisma/rls.sql` for executable SQL.
