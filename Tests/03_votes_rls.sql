BEGIN;

SELECT plan(3);

INSERT INTO auth.users (id, email)
VALUES
  ('00000000-0000-0000-0000-000000003101', 'rlsvt1@test.com'),
  ('00000000-0000-0000-0000-000000003102', 'rlsvt2@test.com')
ON CONFLICT DO NOTHING;

INSERT INTO disciplines (id, slug, name)
VALUES (9301, 'rls-vt-disc', 'RLS Vote Disc')
ON CONFLICT DO NOTHING;

INSERT INTO profiles (id, username, onboarded, discipline_id, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000003101', 'rlsvt1', true, 9301, now()),
  ('00000000-0000-0000-0000-000000003102', 'rlsvt2', true, 9301, now())
ON CONFLICT DO NOTHING;

INSERT INTO posts (id, title, slug, body, post_type, author_id, discipline_id, updated_at)
VALUES ('00000000-0000-0000-0000-000000003201', 'Vote Post', 'rls-vt-post', 'Body', 'discussion', '00000000-0000-0000-0000-000000003101', 9301, now())
ON CONFLICT DO NOTHING;

INSERT INTO votes (id, author_id, target_type, post_id, vote_type, direction)
VALUES ('00000000-0000-0000-0000-000000003301', '00000000-0000-0000-0000-000000003101', 'post', '00000000-0000-0000-0000-000000003201', 'up', 'UP')
ON CONFLICT DO NOTHING;

SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = '00000000-0000-0000-0000-000000003102';

SELECT results_eq(
  $$ SELECT count(*)::int FROM votes WHERE id = '00000000-0000-0000-0000-000000003301' $$,
  $$ VALUES (1) $$,
  'RLS-10: authenticated user can read votes'
);

SELECT lives_ok(
  $$ INSERT INTO votes (id, author_id, target_type, post_id, vote_type, direction)
     VALUES ('00000000-0000-0000-0000-000000003302', '00000000-0000-0000-0000-000000003102', 'post', '00000000-0000-0000-0000-000000003201', 'up', 'UP') $$,
  'RLS-11: user can INSERT vote as themselves'
);

SELECT throws_ok(
  $$ INSERT INTO votes (id, author_id, target_type, post_id, vote_type, direction)
     VALUES ('00000000-0000-0000-0000-000000003303', '00000000-0000-0000-0000-000000003101', 'post', '00000000-0000-0000-0000-000000003201', 'down', 'DOWN') $$,
  '42501',
  NULL,
  'RLS-12: user cannot INSERT vote as a different user'
);

RESET ROLE;
SELECT * FROM finish();

ROLLBACK;
