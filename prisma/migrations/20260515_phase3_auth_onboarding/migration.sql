-- Phase 3: auth + onboarding schema additions
-- Prisma shadow databases do not include Supabase's auth schema.
-- Create a no-op auth.uid() only when the real Supabase helper is absent.
CREATE SCHEMA IF NOT EXISTS "auth";

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'auth'
      AND p.proname = 'uid'
      AND pg_get_function_identity_arguments(p.oid) = ''
  ) THEN
    CREATE FUNCTION "auth"."uid"()
    RETURNS uuid
    LANGUAGE sql
    STABLE
    AS 'SELECT NULL::uuid';
  END IF;
END
$$;

CREATE TABLE "profile_softwares" (
  "profile_id" UUID NOT NULL,
  "software_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "profile_softwares_pkey" PRIMARY KEY ("profile_id", "software_id")
);

CREATE INDEX "idx_profile_softwares_software_id" ON "profile_softwares"("software_id");

ALTER TABLE "profile_softwares"
ADD CONSTRAINT "profile_softwares_profile_id_fkey"
FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "profile_softwares"
ADD CONSTRAINT "profile_softwares_software_id_fkey"
FOREIGN KEY ("software_id") REFERENCES "softwares"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "profile_softwares" ENABLE ROW LEVEL SECURITY;

CREATE POLICY profile_softwares_read_all ON profile_softwares FOR SELECT USING (true);
CREATE POLICY profile_softwares_insert_own ON profile_softwares
FOR INSERT
WITH CHECK (profile_id = auth.uid());
CREATE POLICY profile_softwares_delete_own ON profile_softwares
FOR DELETE
USING (profile_id = auth.uid());
