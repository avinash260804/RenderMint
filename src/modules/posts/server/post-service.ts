import { Prisma } from "@prisma/client";

import { decodeCursor, encodeCursor } from "@/lib/pagination";
import { ConflictError, ForbiddenError, NotFoundError } from "@/lib/errors";
import { generateSlug } from "@/lib/slug";
import { sanitizeText, sanitizeUrl } from "@/lib/sanitize";
import type { PostCreationValidated } from "@/modules/posts/schemas/post-creation-schema";
import type {
  PostListQueryInput,
  PostUpdateInput,
} from "@/modules/posts/schemas/post-api-schema";
import { prisma } from "@/server/db/client";
import { POST_CARD_SELECT, POST_FULL_INCLUDE } from "@/modules/posts/server/post-queries";

type PostRecord = Prisma.PostGetPayload<{
  include: typeof POST_FULL_INCLUDE;
}>;

export type PostResponse = ReturnType<typeof mapPostRecord>;

export async function createPost(authorId: string, input: PostCreationValidated) {
  const discipline = await prisma.discipline.findUnique({
    where: { slug: input.discipline },
    select: { id: true, slug: true },
  });

  if (!discipline) {
    throw new NotFoundError("Selected discipline does not exist.");
  }

  const software = input.software
    ? await prisma.software.findFirst({
        where: {
          disciplineId: discipline.id,
          OR: [
            { name: { equals: input.software, mode: "insensitive" } },
            { slug: normalizeSlug(input.software) },
          ],
        },
        select: { id: true, name: true, slug: true },
      })
    : null;

  if (input.postType === "help" && !software) {
    throw new NotFoundError("Selected software does not exist for this discipline.");
  }

  const slug = await generateUniqueSlug(input.title);
  const tagNames = parseTags(input.tags);
  const resourceLinks = parseLinks(input.resourceLinks);
  const toolsUsed = parseCsv(input.toolsUsed);

  const created = await prisma.$transaction(async (tx) => {
    const post = await tx.post.create({
      data: {
        slug,
        title: sanitizeText(input.title),
        body: input.body ? sanitizeText(input.body) : null,
        postType: input.postType,
        authorId,
        disciplineId: discipline.id,
        softwareId: software?.id ?? null,
        context: input.context ? sanitizeText(input.context) : null,
        projectDescription: input.projectDescription
          ? sanitizeText(input.projectDescription)
          : null,
        challengeStatement: input.challengeStatement
          ? sanitizeText(input.challengeStatement)
          : null,
        feedbackRequested: input.feedbackRequested
          ? sanitizeText(input.feedbackRequested)
          : null,
        projectSummary: input.projectSummary ? sanitizeText(input.projectSummary) : null,
        toolsUsed: toolsUsed.length > 0 ? toolsUsed : Prisma.JsonNull,
        projectLink: input.projectLink ? sanitizeUrl(input.projectLink) : null,
        issueDescription: input.issueDescription ? sanitizeText(input.issueDescription) : null,
        errorContext: input.errorContext ? sanitizeText(input.errorContext) : null,
        resourceExplanation: input.resourceExplanation
          ? sanitizeText(input.resourceExplanation)
          : null,
        resourceLinks: resourceLinks.length > 0 ? resourceLinks : Prisma.JsonNull,
        attachments: input.attachments.length
          ? {
              create: input.attachments.map((asset) => ({
                key: asset.key,
                url: asset.url,
                mimeType: asset.mimeType,
                size: BigInt(asset.size),
              })),
            }
          : undefined,
      },
      include: POST_FULL_INCLUDE,
    });

    if (tagNames.length > 0) {
      for (const tagName of tagNames) {
        const tag = await tx.tag.upsert({
          where: { slug: normalizeSlug(tagName) },
          update: { name: tagName },
          create: {
            name: tagName,
            slug: normalizeSlug(tagName),
          },
        });

        await tx.postTag.upsert({
          where: {
            postId_tagId: {
              postId: post.id,
              tagId: tag.id,
            },
          },
          update: {},
          create: {
            postId: post.id,
            tagId: tag.id,
          },
        });
      }
    }

    return tx.post.findUniqueOrThrow({
      where: { id: post.id },
      include: POST_FULL_INCLUDE,
    });
  });

  return mapPostRecord(created);
}

export async function getPostBySlug(slug: string) {
  const existing = await prisma.post.findFirst({
    where: { slug, deletedAt: null } as never,
    include: POST_FULL_INCLUDE,
  });

  if (!existing) {
    return null;
  }

  await prisma.post.update({
    where: { id: existing.id },
    data: {
      viewCount: { increment: 1 },
    },
  });

  return mapPostRecord({
    ...existing,
    viewCount: existing.viewCount + 1,
  } as PostRecord);
}

export async function listPosts(filters: PostListQueryInput) {
  const cursor = filters.cursor ? decodeCursor(filters.cursor) : null;

  const posts = await prisma.post.findMany({
    where: {
      deletedAt: null,
      ...(filters.discipline ? { discipline: { slug: filters.discipline } } : {}),
      ...(filters.postType ? { postType: filters.postType } : {}),
      ...(filters.software
        ? {
            software: {
              OR: [
                { slug: normalizeSlug(filters.software) },
                { name: { equals: filters.software, mode: "insensitive" } },
              ],
            },
          }
        : {}),
      ...(cursor
        ? {
            OR: [
              { createdAt: { lt: new Date(cursor.createdAt) } },
              {
                createdAt: new Date(cursor.createdAt),
                id: { lt: cursor.id },
              },
            ],
          }
        : {}),
    } as never,
    select: POST_CARD_SELECT,
    orderBy:
      filters.sortBy === "top"
        ? [{ voteCount: "desc" }, { createdAt: "desc" }]
        : [{ createdAt: "desc" }, { id: "desc" }],
    take: filters.pageSize + 1,
  });

  const hasMore = posts.length > filters.pageSize;
  const items = posts.slice(0, filters.pageSize).map((post) => mapPostCard(post));
  const last = posts[filters.pageSize - 1];

  return {
    items,
    meta: {
      hasMore,
      nextCursor:
        hasMore && last
          ? encodeCursor({
              id: last.id,
              createdAt: last.createdAt.toISOString(),
            })
          : null,
      pageSize: filters.pageSize,
    },
  };
}

export async function updatePost(postId: string, authorId: string, input: PostUpdateInput) {
  const existing = await prisma.post.findFirst({
    where: {
      id: postId,
      deletedAt: null,
    } as never,
    include: POST_FULL_INCLUDE,
  });

  if (!existing) {
    throw new NotFoundError("Post not found.");
  }

  if (existing.authorId !== authorId) {
    throw new ForbiddenError("You do not have permission to edit this post.");
  }

  const nextProjectLink =
    input.projectLink === undefined ? existing.projectLink : sanitizeUrl(input.projectLink);

  const nextResourceLinks =
    input.resourceLinks === undefined ? undefined : parseLinks(input.resourceLinks);
  const nextToolsUsed = input.toolsUsed === undefined ? undefined : parseCsv(input.toolsUsed);

  const updated = await prisma.post.update({
    where: { id: postId },
    data: {
      title: input.title ? sanitizeText(input.title) : undefined,
      body: input.body !== undefined ? sanitizeText(input.body) : undefined,
      context: input.context !== undefined ? sanitizeText(input.context) : undefined,
      projectDescription:
        input.projectDescription !== undefined
          ? sanitizeText(input.projectDescription)
          : undefined,
      challengeStatement:
        input.challengeStatement !== undefined
          ? sanitizeText(input.challengeStatement)
          : undefined,
      feedbackRequested:
        input.feedbackRequested !== undefined
          ? sanitizeText(input.feedbackRequested)
          : undefined,
      projectSummary:
        input.projectSummary !== undefined ? sanitizeText(input.projectSummary) : undefined,
      toolsUsed:
        nextToolsUsed === undefined
          ? undefined
          : nextToolsUsed.length > 0
            ? nextToolsUsed
            : Prisma.JsonNull,
      projectLink: nextProjectLink,
      issueDescription:
        input.issueDescription !== undefined
          ? sanitizeText(input.issueDescription)
          : undefined,
      errorContext:
        input.errorContext !== undefined ? sanitizeText(input.errorContext) : undefined,
      resourceExplanation:
        input.resourceExplanation !== undefined
          ? sanitizeText(input.resourceExplanation)
          : undefined,
      resourceLinks:
        nextResourceLinks === undefined
          ? undefined
          : nextResourceLinks.length > 0
            ? nextResourceLinks
            : Prisma.JsonNull,
      editedAt: new Date(),
      updatedAt: new Date(),
    } as never,
    include: POST_FULL_INCLUDE,
  });

  if (input.tags !== undefined) {
    await syncPostTags(postId, input.tags);
  }

  if (input.attachments !== undefined) {
    await replaceAttachments(postId, input.attachments);
  }

  const fresh = await prisma.post.findUniqueOrThrow({
    where: { id: updated.id },
    include: POST_FULL_INCLUDE,
  });

  return mapPostRecord(fresh);
}

export async function deletePost(postId: string, authorId: string) {
  const existing = await prisma.post.findFirst({
    where: { id: postId, deletedAt: null } as never,
    select: {
      id: true,
      authorId: true,
      postType: true,
      acceptedCommentId: true,
    },
  });

  if (!existing) {
    throw new NotFoundError("Post not found.");
  }

  if (existing.authorId !== authorId) {
    throw new ForbiddenError("You do not have permission to delete this post.");
  }

  if (existing.postType === "help" && existing.acceptedCommentId) {
    throw new ConflictError("Solved help posts cannot be deleted until the accepted solution is cleared.");
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      deletedAt: new Date(),
      updatedAt: new Date(),
    } as never,
  });
}

async function generateUniqueSlug(title: string) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const slug = generateSlug(title);
    const existing = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }
  }

  throw new ConflictError("Unable to generate a unique slug for this post.");
}

async function syncPostTags(postId: string, tagInput: string) {
  const tagNames = parseTags(tagInput);

  await prisma.$transaction(async (tx) => {
    await tx.postTag.deleteMany({
      where: { postId },
    });

    for (const tagName of tagNames) {
      const tag = await tx.tag.upsert({
        where: { slug: normalizeSlug(tagName) },
        update: { name: tagName },
        create: {
          name: tagName,
          slug: normalizeSlug(tagName),
        },
      });

      await tx.postTag.create({
        data: {
          postId,
          tagId: tag.id,
        },
      });
    }
  });
}

async function replaceAttachments(
  postId: string,
  attachments: Array<{ key: string; url: string; mimeType: string; size: number }>,
) {
  await prisma.$transaction(async (tx) => {
    await tx.attachment.deleteMany({
      where: { postId },
    });

    if (attachments.length === 0) {
      return;
    }

    await tx.attachment.createMany({
      data: attachments.map((asset) => ({
        postId,
        key: asset.key,
        url: asset.url,
        mimeType: asset.mimeType,
        size: BigInt(asset.size),
      })),
    });
  });
}

function parseTags(value?: string) {
  if (!value) return [];

  return Array.from(
    new Set(
      value
        .split(",")
        .map((entry) => sanitizeText(entry).toLowerCase())
        .filter(Boolean)
        .slice(0, 5),
    ),
  );
}

function parseLinks(value?: string) {
  if (!value) return [];

  return value
    .split(/\n|,/)
    .map((entry) => sanitizeUrl(entry))
    .filter((entry): entry is string => Boolean(entry));
}

function parseCsv(value?: string) {
  if (!value) return [];

  return value
    .split(",")
    .map((entry) => sanitizeText(entry))
    .filter(Boolean);
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function createBodyPreview(value: string | null | undefined) {
  if (!value) return "";
  return value.length > 180 ? `${value.slice(0, 177)}...` : value;
}

function mapPostCard(
  post: Prisma.PostGetPayload<{
    select: typeof POST_CARD_SELECT;
  }>,
) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    bodyPreview: createBodyPreview(post.body),
    postType: post.postType,
    voteCount: post.voteCount,
    commentCount: post.commentCount,
    viewCount: post.viewCount,
    isSolved: post.isSolved,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    author: post.author,
    discipline: post.discipline,
    software: post.software,
    tags: post.postTags.map((entry) => entry.tag),
  };
}

function mapPostRecord(post: PostRecord) {
  const postWithSprint2Fields = post as PostRecord & {
    editedAt?: Date | null;
  };

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    body: post.body,
    postType: post.postType,
    voteCount: post.voteCount,
    commentCount: post.commentCount,
    viewCount: post.viewCount,
    isSolved: post.isSolved,
    acceptedCommentId: post.acceptedCommentId,
    context: post.context,
    projectDescription: post.projectDescription,
    challengeStatement: post.challengeStatement,
    feedbackRequested: post.feedbackRequested,
    projectSummary: post.projectSummary,
    toolsUsed: Array.isArray(post.toolsUsed) ? post.toolsUsed : [],
    projectLink: post.projectLink,
    issueDescription: post.issueDescription,
    errorContext: post.errorContext,
    resourceExplanation: post.resourceExplanation,
    resourceLinks: Array.isArray(post.resourceLinks) ? post.resourceLinks : [],
    editedAt: postWithSprint2Fields.editedAt?.toISOString() ?? null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    author: post.author,
    discipline: {
      id: post.discipline.id,
      name: post.discipline.name,
      slug: post.discipline.slug,
    },
    software: post.software
      ? {
          id: post.software.id,
          name: post.software.name,
          slug: post.software.slug,
        }
      : null,
    attachments: post.attachments.map((asset) => ({
      id: asset.id,
      key: asset.key,
      url: asset.url,
      mimeType: asset.mimeType,
      size: Number(asset.size),
      createdAt: asset.createdAt.toISOString(),
    })),
    tags: post.postTags.map((entry) => ({
      id: entry.tag.id,
      name: entry.tag.name,
      slug: entry.tag.slug,
    })),
  };
}
