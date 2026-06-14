-- Sprint 0: schema drift sync for V3.
-- Align the live database with the current Prisma schema contract used by the app.

ALTER TABLE "profiles"
ADD COLUMN IF NOT EXISTS "onboarded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "discipline_id" INTEGER;

ALTER TABLE "tags"
ADD COLUMN IF NOT EXISTS "usage_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "discipline_id" INTEGER;

ALTER TABLE "votes"
ADD COLUMN IF NOT EXISTS "direction" VARCHAR(8);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_discipline_id_fkey'
  ) THEN
    ALTER TABLE "profiles"
    ADD CONSTRAINT "profiles_discipline_id_fkey"
    FOREIGN KEY ("discipline_id") REFERENCES "disciplines"("id")
    ON DELETE SET NULL
    ON UPDATE CASCADE;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'tags_discipline_id_fkey'
  ) THEN
    ALTER TABLE "tags"
    ADD CONSTRAINT "tags_discipline_id_fkey"
    FOREIGN KEY ("discipline_id") REFERENCES "disciplines"("id")
    ON DELETE SET NULL
    ON UPDATE CASCADE;
  END IF;
END
$$;

UPDATE "profiles" AS p
SET "discipline_id" = d."id"
FROM "disciplines" AS d
WHERE p."discipline_id" IS NULL
  AND p."primary_discipline" = d."slug";

UPDATE "profiles" AS p
SET "onboarded" = true
WHERE p."onboarded" = false
  AND p."username" IS NOT NULL
  AND p."primary_discipline" IS NOT NULL
  AND EXISTS (
    SELECT 1
    FROM "profile_softwares" ps
    WHERE ps."profile_id" = p."id"
  );

WITH tag_counts AS (
  SELECT pt."tag_id", COUNT(*)::INTEGER AS usage_count
  FROM "post_tags" pt
  JOIN "posts" p ON p."id" = pt."post_id"
  WHERE p."deleted_at" IS NULL
  GROUP BY pt."tag_id"
)
UPDATE "tags" t
SET "usage_count" = COALESCE(tc.usage_count, 0)
FROM tag_counts tc
WHERE t."id" = tc."tag_id";

UPDATE "tags"
SET "usage_count" = 0
WHERE "usage_count" IS NULL;

WITH tag_disciplines AS (
  SELECT
    pt."tag_id",
    MIN(p."discipline_id") AS discipline_id,
    COUNT(DISTINCT p."discipline_id") AS discipline_count
  FROM "post_tags" pt
  JOIN "posts" p ON p."id" = pt."post_id"
  WHERE p."deleted_at" IS NULL
  GROUP BY pt."tag_id"
)
UPDATE "tags" t
SET "discipline_id" = td.discipline_id
FROM tag_disciplines td
WHERE t."id" = td."tag_id"
  AND td.discipline_count = 1;

UPDATE "votes"
SET "direction" = UPPER("vote_type"::TEXT)
WHERE "direction" IS NULL;
