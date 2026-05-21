import { randomUUID } from "crypto";

import type { CommentCreateInput, CommentRecord } from "@/modules/comments/schemas/comment-schema";

const globalCommentsStore = globalThis as unknown as {
  commentsBySlug?: Map<string, CommentRecord[]>;
};

const commentsBySlug = globalCommentsStore.commentsBySlug ?? new Map<string, CommentRecord[]>();

if (!globalCommentsStore.commentsBySlug) {
  commentsBySlug.set("best-workflow-architecture-presentations-2026", [
    {
      id: randomUUID(),
      postSlug: "best-workflow-architecture-presentations-2026",
      body: "Start with a clear narrative board and keep your section diagrams consistent.",
      authorId: "mock-user-1",
      authorName: "Megha N",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    },
    {
      id: randomUUID(),
      postSlug: "best-workflow-architecture-presentations-2026",
      body: "Use one visual language for lineweights from concept to final sheets.",
      authorId: "mock-user-2",
      authorName: "Arjun M",
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
  ]);

  globalCommentsStore.commentsBySlug = commentsBySlug;
}

export async function listCommentsByPostSlug(postSlug: string) {
  return [...(commentsBySlug.get(postSlug) ?? [])].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );
}

export async function createComment(
  input: CommentCreateInput & { authorId: string; authorName: string },
) {
  const current = commentsBySlug.get(input.postSlug) ?? [];
  const next: CommentRecord = {
    id: randomUUID(),
    postSlug: input.postSlug,
    body: input.body,
    authorId: input.authorId,
    authorName: input.authorName,
    createdAt: new Date().toISOString(),
  };

  commentsBySlug.set(input.postSlug, [...current, next]);
  return next;
}
