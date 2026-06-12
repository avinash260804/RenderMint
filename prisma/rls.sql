-- Phase 2 RLS SQL (Supabase/Postgres)

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE disciplines ENABLE ROW LEVEL SECURITY;
ALTER TABLE softwares ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_softwares ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY profiles_read_all ON profiles FOR SELECT USING (true);
CREATE POLICY disciplines_read_all ON disciplines FOR SELECT USING (true);
CREATE POLICY softwares_read_all ON softwares FOR SELECT USING (true);
CREATE POLICY posts_read_all ON posts FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY comments_read_all ON comments FOR SELECT USING (
  deleted_at IS NULL
  AND EXISTS (
    SELECT 1
    FROM posts p
    WHERE p.id = comments.post_id
      AND p.deleted_at IS NULL
  )
);
CREATE POLICY attachments_read_all ON attachments FOR SELECT USING (true);
CREATE POLICY tags_read_all ON tags FOR SELECT USING (true);
CREATE POLICY post_tags_read_all ON post_tags FOR SELECT USING (true);
CREATE POLICY votes_read_all ON votes FOR SELECT USING (true);
CREATE POLICY profile_softwares_read_all ON profile_softwares FOR SELECT USING (true);

-- Owner policies
CREATE POLICY profiles_update_own ON profiles
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY posts_create_auth ON posts
FOR INSERT
WITH CHECK (author_id = auth.uid());

CREATE POLICY posts_update_own ON posts
FOR UPDATE
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());

CREATE POLICY posts_delete_own ON posts
FOR DELETE
USING (author_id = auth.uid());

CREATE POLICY comments_create_auth ON comments
FOR INSERT
WITH CHECK (author_id = auth.uid());

CREATE POLICY comments_update_own ON comments
FOR UPDATE
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());

CREATE POLICY comments_delete_own ON comments
FOR DELETE
USING (author_id = auth.uid());

CREATE POLICY attachments_create_if_own_post ON attachments
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM posts p
    WHERE p.id = post_id
      AND p.author_id = auth.uid()
  )
);

CREATE POLICY attachments_delete_if_own_post ON attachments
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM posts p
    WHERE p.id = post_id
      AND p.author_id = auth.uid()
  )
);

CREATE POLICY post_tags_create_if_own_post ON post_tags
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM posts p
    WHERE p.id = post_id
      AND p.author_id = auth.uid()
  )
);

CREATE POLICY post_tags_delete_if_own_post ON post_tags
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM posts p
    WHERE p.id = post_id
      AND p.author_id = auth.uid()
  )
);

CREATE POLICY votes_create_own ON votes
FOR INSERT
WITH CHECK (author_id = auth.uid());

CREATE POLICY votes_update_own ON votes
FOR UPDATE
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());

CREATE POLICY votes_delete_own ON votes
FOR DELETE
USING (author_id = auth.uid());

CREATE POLICY profile_softwares_insert_own ON profile_softwares
FOR INSERT
WITH CHECK (profile_id = auth.uid());

CREATE POLICY profile_softwares_delete_own ON profile_softwares
FOR DELETE
USING (profile_id = auth.uid());

-- Optional: lock taxonomy writes to service role only (not anonymous/authenticated)
-- In Supabase, service_role bypasses RLS by default.
