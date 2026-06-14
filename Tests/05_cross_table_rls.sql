BEGIN;

SELECT plan(4);

INSERT INTO auth.users (id, email)
VALUES ('00000000-0000-0000-0000-000000005101', 'rlsxt1@test.com')
ON CONFLICT DO NOTHING;

INSERT INTO disciplines (id, slug, name)
VALUES (9501, 'rls-xt-disc', 'RLS Cross Disc')
ON CONFLICT DO NOTHING;

INSERT INTO profiles (id, username, onboarded, discipline_id, reputation, updated_at)
VALUES ('00000000-0000-0000-0000-000000005101', 'rlsxt1', true, 9501, 77, now())
ON CONFLICT DO NOTHING;

INSERT INTO posts (id, title, slug, body, post_type, author_id, discipline_id, comment_count, updated_at)
VALUES ('00000000-0000-0000-0000-000000005201', 'Deleted', 'rls-xt-del', 'Body', 'discussion', '00000000-0000-0000-0000-000000005101', 9501, 1, now())
ON CONFLICT DO NOTHING;

UPDATE posts SET deleted_at = now() WHERE id = '00000000-0000-0000-0000-000000005201';

INSERT INTO comments (id, body, post_id, author_id, updated_at)
VALUES ('00000000-0000-0000-0000-000000005301', 'Comment on deleted post', '00000000-0000-0000-0000-000000005201', '00000000-0000-0000-0000-000000005101', now())
ON CONFLICT DO NOTHING;

INSERT INTO tags (id, name, slug, usage_count, discipline_id)
VALUES (9501, 'RLS Tag', 'rls-tag', 1, 9501)
ON CONFLICT DO NOTHING;

SET LOCAL ROLE anon;

SELECT results_eq(
  $$ SELECT count(*)::int FROM comments c
     JOIN posts p ON c.post_id = p.id
     WHERE p.deleted_at IS NOT NULL $$,
  $$ VALUES (0) $$,
  'RLS-17: anon sees zero comments on soft-deleted posts'
);

SELECT ok(
  (SELECT count(*)::int FROM disciplines WHERE id = 9501) = 1,
  'RLS-18: anon can read disciplines table'
);

SELECT lives_ok(
  $$ SELECT count(*) FROM tags WHERE id = 9501 $$,
  'RLS-19: anon can SELECT tags without error'
);

SELECT ok(
  (SELECT reputation FROM profiles WHERE username = 'rlsxt1') = 77,
  'RLS-20: anon can read reputation from profiles'
);

RESET ROLE;
SELECT * FROM finish();

ROLLBACK;
