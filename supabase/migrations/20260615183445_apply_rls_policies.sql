-- Production RLS policies derived from the verification scripts in tests/01-05.
-- Keep the Tests SQL files as pgTAP verification only; this migration applies the
-- same protections in Supabase-managed environments.

GRANT SELECT ON TABLE disciplines, softwares, tags TO anon, authenticated;
GRANT SELECT ON TABLE profiles, posts, comments TO anon, authenticated;
GRANT SELECT ON TABLE votes TO authenticated;
GRANT INSERT, UPDATE ON TABLE profiles, posts, comments, votes TO authenticated;
GRANT DELETE ON TABLE votes TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE disciplines_id_seq, softwares_id_seq, tags_id_seq TO authenticated;

ALTER TABLE disciplines ENABLE ROW LEVEL SECURITY;
ALTER TABLE softwares ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS posts_read_all ON posts;
DROP POLICY IF EXISTS comments_read_all ON comments;
DROP POLICY IF EXISTS votes_read_all ON votes;

DROP POLICY IF EXISTS disciplines_read_all ON disciplines;
CREATE POLICY disciplines_read_all ON disciplines
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS softwares_read_all ON softwares;
CREATE POLICY softwares_read_all ON softwares
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS tags_read_all ON tags;
CREATE POLICY tags_read_all ON tags
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS profiles_read_all ON profiles;
CREATE POLICY profiles_read_all ON profiles
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS profiles_insert_own ON profiles;
CREATE POLICY profiles_insert_own ON profiles
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS profiles_update_own ON profiles;
CREATE POLICY profiles_update_own ON profiles
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS posts_read_public ON posts;
CREATE POLICY posts_read_public ON posts
FOR SELECT
TO anon, authenticated
USING (deleted_at IS NULL);

DROP POLICY IF EXISTS posts_read_own ON posts;
CREATE POLICY posts_read_own ON posts
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = author_id);

DROP POLICY IF EXISTS posts_insert_own ON posts;
CREATE POLICY posts_insert_own ON posts
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = author_id);

DROP POLICY IF EXISTS posts_update_own ON posts;
CREATE POLICY posts_update_own ON posts
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = author_id)
WITH CHECK ((SELECT auth.uid()) = author_id);

DROP POLICY IF EXISTS comments_read_public ON comments;
CREATE POLICY comments_read_public ON comments
FOR SELECT
TO anon, authenticated
USING (
  deleted_at IS NULL
  AND EXISTS (
    SELECT 1
    FROM posts
    WHERE posts.id = comments.post_id
      AND posts.deleted_at IS NULL
  )
);

DROP POLICY IF EXISTS comments_insert_own ON comments;
CREATE POLICY comments_insert_own ON comments
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT auth.uid()) = author_id
  AND EXISTS (
    SELECT 1
    FROM posts
    WHERE posts.id = comments.post_id
      AND posts.deleted_at IS NULL
  )
);

DROP POLICY IF EXISTS comments_update_own ON comments;
CREATE POLICY comments_update_own ON comments
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = author_id)
WITH CHECK ((SELECT auth.uid()) = author_id);

DROP POLICY IF EXISTS votes_read_authenticated ON votes;
CREATE POLICY votes_read_authenticated ON votes
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS votes_insert_own ON votes;
CREATE POLICY votes_insert_own ON votes
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = author_id);

DROP POLICY IF EXISTS votes_update_own ON votes;
CREATE POLICY votes_update_own ON votes
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = author_id)
WITH CHECK ((SELECT auth.uid()) = author_id);

DROP POLICY IF EXISTS votes_delete_own ON votes;
CREATE POLICY votes_delete_own ON votes
FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = author_id);
