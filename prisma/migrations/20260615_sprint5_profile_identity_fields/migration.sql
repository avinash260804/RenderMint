-- Sprint 5: profile identity fields
-- Add minimal identity fields required for the public profile and own-profile edit flows.

ALTER TABLE "profiles"
ADD COLUMN IF NOT EXISTS "experience_level" VARCHAR(32),
ADD COLUMN IF NOT EXISTS "skills" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "profiles"
SET "experience_level" = COALESCE("experience_level", 'Practitioner')
WHERE "experience_level" IS NULL;
