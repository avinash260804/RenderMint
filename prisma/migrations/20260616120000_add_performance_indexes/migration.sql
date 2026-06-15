-- P2 hardening: add the additional lookup indexes requested in the audit.
-- Note: unique constraints on profiles.username and posts.slug already provide
-- dedicated indexes, so they are intentionally not duplicated here.

CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts (author_id);
CREATE INDEX IF NOT EXISTS idx_posts_discipline_id ON posts (discipline_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at);
CREATE INDEX IF NOT EXISTS idx_posts_post_type ON posts (post_type);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments (post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments (author_id);
