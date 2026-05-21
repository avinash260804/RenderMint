-- Phase 3: auth + onboarding schema additions

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