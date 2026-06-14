BEGIN;

SELECT plan(4);

INSERT INTO auth.users (id, email)
VALUES
  ('00000000-0000-0000-0000-000000002101', 'rlscm1@test.com'),
  ('00000000-0000-0000-0000-000000002102', 'rlscm2@test.com')
ON CONFLICT DO NOTHING;

INSERT INTO disciplines (id, slug, name)
VALUES (9201, 'rls-cm-disc', 'RLS Comment Disc')
ON CONFLICT DO NOTHING;

INSERT INTO profiles (id, username, onboarded, discipline_id, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000002101', 'rlscm1', true, 9201, now()),
  ('00000000-0000-0000-0000-000000002102', 'rlscm2', true, 9201, now())
ON CONFLICT DO NOTHING;

INSERT INTO posts (id, title, slug, body, post_type, author_id, discipline_id, updated_at)
VALUES ('00000000-0000-0000-0000-000000002201', 'Comment Post', 'rls-cm-post', 'Body', 'discussion', '00000000-0000-0000-0000-000000002101', 9201, now())
ON CONFLICT DO NOTHING;

INSERT INTO comments (id, body, post_id, author_id, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000002301', 'Live comment', '00000000-0000-0000-0000-000000002201', '00000000-0000-0000-0000-000000002102', now()),
  ('00000000-0000-0000-0000-000000002302', 'Deleted comment', '00000000-0000-0000-0000-000000002201', '00000000-0000-0000-0000-000000002102', now())
ON CONFLICT DO NOTHING;

UPDATE comments SET deleted_at = now() WHERE id = '00000000-0000-0000-0000-000000002302';

SET LOCAL ROLE anon;
SELECT results_eq(
  $$ SELECT count(*)::int FROM comments WHERE id = '00000000-0000-0000-0000-000000002301' $$,
  $$ VALUES (1) $$,
  'RLS-06: anon can read non-deleted comments'
);

SELECT results_eq(
  $$ SELECT count(*)::int FROM comments WHERE id = '00000000-0000-0000-0000-000000002302' $$,
  $$ VALUES (0) $$,
  'RLS-07: anon cannot read soft-deleted comments'
);

SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = '00000000-0000-0000-0000-000000002102';
SELECT lives_ok(
  $$ INSERT INTO comments (id, body, post_id, author_id, updated_at)
     VALUES ('00000000-0000-0000-0000-000000002303', 'Auth comment', '00000000-0000-0000-0000-000000002201', '00000000-0000-0000-0000-000000002102', now()) $$,
  'RLS-08: authenticated user can INSERT own comment'
);

SET LOCAL ROLE anon;
SELECT throws_ok(
  $$ INSERT INTO comments (id, body, post_id, author_id, updated_at)
     VALUES ('00000000-0000-0000-0000-000000002304', 'Anon comment', '00000000-0000-0000-0000-000000002201', '00000000-0000-0000-0000-000000002101', now()) $$,
  '42501',
  NULL,
  'RLS-09: anon is blocked from inserting comments'
);

RESET ROLE;
SELECT * FROM finish();

ROLLBACK;
