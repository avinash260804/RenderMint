-- Sprint 2: schema evolution and persistence foundations
-- Adds soft-delete and explicit edit tracking support for upcoming Prisma-backed services.

ALTER TABLE "posts"
ADD COLUMN "edited_at" TIMESTAMP(3),
ADD COLUMN "deleted_at" TIMESTAMP(3);

ALTER TABLE "comments"
ADD COLUMN "edited_at" TIMESTAMP(3),
ADD COLUMN "deleted_at" TIMESTAMP(3);

CREATE INDEX "idx_posts_deleted_at" ON "posts"("deleted_at");
CREATE INDEX "idx_comments_deleted_at" ON "comments"("deleted_at");

DROP POLICY IF EXISTS posts_read_all ON posts;
CREATE POLICY posts_read_all ON posts
FOR SELECT
USING ("deleted_at" IS NULL);

DROP POLICY IF EXISTS comments_read_all ON comments;
CREATE POLICY comments_read_all ON comments
FOR SELECT
USING (
  "deleted_at" IS NULL
  AND EXISTS (
    SELECT 1
    FROM posts p
    WHERE p.id = comments.post_id
      AND p.deleted_at IS NULL
  )
);
