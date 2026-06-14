BEGIN;

SELECT plan(5);

INSERT INTO auth.users (id, email)
VALUES
  ('00000000-0000-0000-0000-000000001101', 'rlsp1@test.com'),
  ('00000000-0000-0000-0000-000000001102', 'rlsp2@test.com')
ON CONFLICT DO NOTHING;

INSERT INTO disciplines (id, slug, name)
VALUES (9101, 'rls-post-disc', 'RLS Post Disc')
ON CONFLICT DO NOTHING;

INSERT INTO profiles (id, username, onboarded, discipline_id, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000001101', 'rlspost1', true, 9101, now()),
  ('00000000-0000-0000-0000-000000001102', 'rlspost2', true, 9101, now())
ON CONFLICT DO NOTHING;

INSERT INTO posts (id, title, slug, body, post_type, author_id, discipline_id, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000001201', 'Live Post', 'rls-pp-live', 'Body', 'discussion', '00000000-0000-0000-0000-000000001101', 9101, now()),
  ('00000000-0000-0000-0000-000000001202', 'Deleted Post', 'rls-pp-del', 'Body', 'discussion', '00000000-0000-0000-0000-000000001101', 9101, now())
ON CONFLICT DO NOTHING;

UPDATE posts SET deleted_at = now() WHERE id = '00000000-0000-0000-0000-000000001202';

SET LOCAL ROLE anon;
SELECT results_eq(
  $$ SELECT count(*)::int FROM posts WHERE id = '00000000-0000-0000-0000-000000001201' $$,
  $$ VALUES (1) $$,
  'RLS-01: anon can SELECT non-deleted posts'
);

SELECT results_eq(
  $$ SELECT count(*)::int FROM posts WHERE id = '00000000-0000-0000-0000-000000001202' $$,
  $$ VALUES (0) $$,
  'RLS-02: anon cannot SELECT soft-deleted posts'
);

SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = '00000000-0000-0000-0000-000000001101';
SELECT lives_ok(
  $$ INSERT INTO posts (id, title, slug, body, post_type, author_id, discipline_id, updated_at)
     VALUES ('00000000-0000-0000-0000-000000001203', 'Auth Post', 'rls-pp-auth', 'Body', 'discussion', '00000000-0000-0000-0000-000000001101', 9101, now()) $$,
  'RLS-03: authenticated user can INSERT own post'
);

SET LOCAL ROLE anon;
SELECT throws_ok(
  $$ INSERT INTO posts (id, title, slug, body, post_type, author_id, discipline_id, updated_at)
     VALUES ('00000000-0000-0000-0000-000000001204', 'Anon Post', 'rls-pp-anon', 'Body', 'discussion', '00000000-0000-0000-0000-000000001101', 9101, now()) $$,
  '42501',
  NULL,
  'RLS-04: anon is blocked from inserting posts'
);

SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = '00000000-0000-0000-0000-000000001101';
SELECT lives_ok(
  $$ UPDATE posts SET deleted_at = now() WHERE id = '00000000-0000-0000-0000-000000001201' $$,
  'RLS-05: post author can soft-delete own post'
);

RESET ROLE;
SELECT * FROM finish();

ROLLBACK;
