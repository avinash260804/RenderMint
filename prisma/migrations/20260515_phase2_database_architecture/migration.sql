-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('discussion', 'critique', 'showcase', 'help', 'resource');

-- CreateEnum
CREATE TYPE "VoteTargetType" AS ENUM ('post', 'comment');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('up', 'down');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "username" VARCHAR(32) NOT NULL,
    "avatar_url" TEXT,
    "bio" VARCHAR(300),
    "primary_discipline" VARCHAR(64),
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disciplines" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "slug" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "disciplines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "softwares" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "slug" VARCHAR(64) NOT NULL,
    "discipline_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "softwares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "body" TEXT,
    "post_type" "PostType" NOT NULL,
    "author_id" UUID NOT NULL,
    "discipline_id" INTEGER NOT NULL,
    "software_id" INTEGER,
    "vote_count" INTEGER NOT NULL DEFAULT 0,
    "comment_count" INTEGER NOT NULL DEFAULT 0,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "is_solved" BOOLEAN NOT NULL DEFAULT false,
    "accepted_comment_id" UUID,
    "context" TEXT,
    "project_description" TEXT,
    "challenge_statement" TEXT,
    "feedback_requested" TEXT,
    "project_summary" TEXT,
    "tools_used" JSONB,
    "project_link" TEXT,
    "issue_description" TEXT,
    "error_context" TEXT,
    "resource_explanation" TEXT,
    "resource_links" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "mime_type" VARCHAR(120) NOT NULL,
    "size" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "vote_count" INTEGER NOT NULL DEFAULT 0,
    "is_solution" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "slug" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_tags" (
    "post_id" UUID NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_tags_pkey" PRIMARY KEY ("post_id","tag_id")
);

-- CreateTable
CREATE TABLE "votes" (
    "id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "target_type" "VoteTargetType" NOT NULL,
    "post_id" UUID,
    "comment_id" UUID,
    "vote_type" "VoteType" NOT NULL DEFAULT 'up',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles"("username");

-- CreateIndex
CREATE INDEX "idx_profiles_reputation" ON "profiles"("reputation");

-- CreateIndex
CREATE UNIQUE INDEX "disciplines_name_key" ON "disciplines"("name");

-- CreateIndex
CREATE UNIQUE INDEX "disciplines_slug_key" ON "disciplines"("slug");

-- CreateIndex
CREATE INDEX "idx_softwares_discipline_id" ON "softwares"("discipline_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_softwares_discipline_slug" ON "softwares"("discipline_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "posts_accepted_comment_id_key" ON "posts"("accepted_comment_id");

-- CreateIndex
CREATE INDEX "idx_posts_type_created_at" ON "posts"("post_type", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_posts_discipline_type_created_at" ON "posts"("discipline_id", "post_type", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_posts_software_type_created_at" ON "posts"("software_id", "post_type", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_posts_is_solved_post_type" ON "posts"("is_solved", "post_type");

-- CreateIndex
CREATE INDEX "idx_posts_author_created_at" ON "posts"("author_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_attachments_post_id" ON "attachments"("post_id");

-- CreateIndex
CREATE INDEX "idx_comments_post_created_at" ON "comments"("post_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_comments_author_created_at" ON "comments"("author_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_comments_is_solution" ON "comments"("is_solution");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "idx_post_tags_tag_id" ON "post_tags"("tag_id");

-- CreateIndex
CREATE INDEX "idx_votes_post_id" ON "votes"("post_id");

-- CreateIndex
CREATE INDEX "idx_votes_comment_id" ON "votes"("comment_id");

-- CreateIndex
CREATE INDEX "idx_votes_author_id" ON "votes"("author_id");

-- CreateIndex
CREATE INDEX "idx_votes_target_type_created_at" ON "votes"("target_type", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "uq_votes_author_post" ON "votes"("author_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_votes_author_comment" ON "votes"("author_id", "comment_id");

-- AddForeignKey
ALTER TABLE "softwares" ADD CONSTRAINT "softwares_discipline_id_fkey" FOREIGN KEY ("discipline_id") REFERENCES "disciplines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_discipline_id_fkey" FOREIGN KEY ("discipline_id") REFERENCES "disciplines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_software_id_fkey" FOREIGN KEY ("software_id") REFERENCES "softwares"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_accepted_comment_id_fkey" FOREIGN KEY ("accepted_comment_id") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Domain constraints for multi-post-type architecture
ALTER TABLE "posts"
ADD CONSTRAINT "chk_posts_help_solved_only"
CHECK ("post_type" = 'help' OR ("is_solved" = false AND "accepted_comment_id" IS NULL));

ALTER TABLE "posts"
ADD CONSTRAINT "chk_posts_critique_required_fields"
CHECK (
  "post_type" <> 'critique'
  OR (
    "project_description" IS NOT NULL
    AND "challenge_statement" IS NOT NULL
  )
);

ALTER TABLE "posts"
ADD CONSTRAINT "chk_posts_showcase_required_fields"
CHECK (
  "post_type" <> 'showcase'
  OR "project_summary" IS NOT NULL
);

ALTER TABLE "posts"
ADD CONSTRAINT "chk_posts_help_required_fields"
CHECK (
  "post_type" <> 'help'
  OR (
    "issue_description" IS NOT NULL
    AND "software_id" IS NOT NULL
  )
);

ALTER TABLE "posts"
ADD CONSTRAINT "chk_posts_resource_required_fields"
CHECK (
  "post_type" <> 'resource'
  OR "resource_explanation" IS NOT NULL
);

-- Domain constraints for votes
ALTER TABLE "votes"
ADD CONSTRAINT "chk_votes_exactly_one_target"
CHECK (
  ("post_id" IS NOT NULL AND "comment_id" IS NULL)
  OR ("post_id" IS NULL AND "comment_id" IS NOT NULL)
);

ALTER TABLE "votes"
ADD CONSTRAINT "chk_votes_target_type_match"
CHECK (
  ("target_type" = 'post' AND "post_id" IS NOT NULL AND "comment_id" IS NULL)
  OR ("target_type" = 'comment' AND "comment_id" IS NOT NULL AND "post_id" IS NULL)
);