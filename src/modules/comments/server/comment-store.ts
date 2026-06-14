import { randomUUID } from "crypto";

import type { CommentCreateInput, CommentRecord } from "@/modules/comments/schemas/comment-schema";

const seededComments: CommentRecord[] = [
  {
    id: "seed-comment-1",
    postSlug: "best-workflow-architecture-presentations-2026",
    body: "Start with a clear narrative board and keep your section diagrams consistent.",
    authorId: "seed-user-1",
    authorName: "Megha N",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "seed-comment-2",
    postSlug: "best-workflow-architecture-presentations-2026",
    body: "Use one visual language for lineweights from concept to final sheets.",
    authorId: "seed-user-2",
    authorName: "Arjun M",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
];

export async function listCommentsByPostSlug(postSlug: string) {
  return seededComments
    .filter((comment) => comment.postSlug === postSlug)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function createComment(
  input: CommentCreateInput & { authorId: string; authorName: string },
) {
  return {
    id: randomUUID(),
    postSlug: input.postSlug,
    body: input.body,
    authorId: input.authorId,
    authorName: input.authorName,
    createdAt: new Date().toISOString(),
  };
}
