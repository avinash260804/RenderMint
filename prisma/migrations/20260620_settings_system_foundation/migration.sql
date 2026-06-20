CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "display_name" VARCHAR(80),
    "bio" VARCHAR(300),
    "avatar_url" VARCHAR(500),
    "cover_image_url" VARCHAR(500),
    "portfolio_url" VARCHAR(500),
    "location" VARCHAR(120),
    "location_visible" BOOLEAN NOT NULL DEFAULT true,
    "social_links" JSONB NOT NULL DEFAULT '{}',
    "primary_discipline" VARCHAR(64),
    "secondary_disciplines" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "experience_level" VARCHAR(32) NOT NULL DEFAULT 'student',
    "software_tools" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "accept_critique" BOOLEAN NOT NULL DEFAULT true,
    "offer_mentorship" BOOLEAN NOT NULL DEFAULT false,
    "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "in_app_notifications" BOOLEAN NOT NULL DEFAULT true,
    "email_frequency" VARCHAR(16) NOT NULL DEFAULT 'daily',
    "comment_notifications" BOOLEAN NOT NULL DEFAULT true,
    "new_follower_notifications" BOOLEAN NOT NULL DEFAULT false,
    "news_and_features" BOOLEAN NOT NULL DEFAULT true,
    "profile_visibility" VARCHAR(16) NOT NULL DEFAULT 'public',
    "online_status_visible" BOOLEAN NOT NULL DEFAULT true,
    "activity_visible" BOOLEAN NOT NULL DEFAULT true,
    "message_permissions" VARCHAR(16) NOT NULL DEFAULT 'none',
    "search_visible" BOOLEAN NOT NULL DEFAULT true,
    "content_type_filters" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "discipline_filters" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sorting_preference" VARCHAR(32) NOT NULL DEFAULT 'recent',
    "theme" VARCHAR(16) NOT NULL DEFAULT 'dark',
    "compact_mode" BOOLEAN NOT NULL DEFAULT false,
    "font_size" VARCHAR(16) NOT NULL DEFAULT 'normal',
    "display_credits" BOOLEAN NOT NULL DEFAULT true,
    "credits_goal" INTEGER NOT NULL DEFAULT 100,
    "reputation_history_visible" BOOLEAN NOT NULL DEFAULT true,
    "reputation_goal" INTEGER NOT NULL DEFAULT 500,
    "connections" JSONB NOT NULL DEFAULT '[]',
    "export_frequency" VARCHAR(16) NOT NULL DEFAULT 'manual',
    "export_format" VARCHAR(16) NOT NULL DEFAULT 'json',
    "last_export_date" TIMESTAMP(3),
    "api_keys" JSONB NOT NULL DEFAULT '[]',
    "account_deletion_requested" BOOLEAN NOT NULL DEFAULT false,
    "account_deletion_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

ALTER TABLE "user_settings"
ADD CONSTRAINT "user_settings_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "profiles"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
