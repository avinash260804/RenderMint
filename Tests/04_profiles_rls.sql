BEGIN;

SELECT plan(4);

INSERT INTO auth.users (id, email)
VALUES
  ('00000000-0000-0000-0000-000000004101', 'rlspr1@test.com'),
  ('00000000-0000-0000-0000-000000004102', 'rlspr2@test.com')
ON CONFLICT DO NOTHING;

INSERT INTO disciplines (id, slug, name)
VALUES (9401, 'rls-pr-disc', 'RLS Profile Disc')
ON CONFLICT DO NOTHING;

INSERT INTO profiles (id, username, onboarded, discipline_id, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000004101', 'rlspr1', true, 9401, now()),
  ('00000000-0000-0000-0000-000000004102', 'rlspr2', true, 9401, now())
ON CONFLICT DO NOTHING;

SET LOCAL ROLE anon;
SELECT results_eq(
  $$ SELECT count(*)::int FROM profiles WHERE username = 'rlspr1' $$,
  $$ VALUES (1) $$,
  'RLS-13: anon can read public profiles'
);

SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = '00000000-0000-0000-0000-000000004101';

SELECT lives_ok(
  $$ UPDATE profiles SET bio = 'My new bio' WHERE id = '00000000-0000-0000-0000-000000004101' $$,
  'RLS-14: user can update their own profile'
);

SELECT results_eq(
  $$ WITH updated_rows AS (
       UPDATE profiles SET bio = 'Hacked' WHERE id = '00000000-0000-0000-0000-000000004102' RETURNING id
     )
     SELECT count(*)::int FROM updated_rows $$,
  $$ VALUES (0) $$,
  'RLS-15: user cannot update another user profile'
);

SELECT throws_ok(
  $$ INSERT INTO profiles (id, username, onboarded, discipline_id, updated_at)
     VALUES ('00000000-0000-0000-0000-000000004202', 'hacker', true, 9401, now()) $$,
  '42501',
  NULL,
  'RLS-16: user cannot insert profile row for another user'
);

RESET ROLE;
SELECT * FROM finish();

ROLLBACK;
