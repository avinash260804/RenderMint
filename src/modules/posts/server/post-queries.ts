import type { Prisma } from "@prisma/client";

export const POST_CARD_SELECT = {
  id: true,
  slug: true,
  title: true,
  body: true,
  postType: true,
  voteCount: true,
  commentCount: true,
  viewCount: true,
  isSolved: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      username: true,
      avatarUrl: true,
      reputation: true,
    },
  },
  discipline: {
    select: {
      name: true,
      slug: true,
    },
  },
  software: {
    select: {
      name: true,
      slug: true,
    },
  },
  postTags: {
    select: {
      tag: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  },
} satisfies Prisma.PostSelect;

export const POST_FULL_INCLUDE = {
  author: {
    select: {
      id: true,
      username: true,
      avatarUrl: true,
      bio: true,
      reputation: true,
      primaryDiscipline: true,
    },
  },
  discipline: true,
  software: true,
  attachments: true,
  postTags: {
    include: {
      tag: true,
    },
  },
} satisfies Prisma.PostInclude;
