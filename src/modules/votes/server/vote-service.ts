import { ForbiddenError, NotFoundError } from "@/lib/errors";
import { recalculateReputation } from "@/modules/reputation/server/reputation-service";
import type { VoteMutationInput, VoteTypeInput } from "@/modules/votes/schemas/vote-schema";
import { prisma } from "@/server/db/client";

type VoteResult = {
  targetType: VoteMutationInput["targetType"];
  targetId: string;
  voteType: VoteTypeInput | null;
  voteCount: number;
  reputation: {
    recalculatedFor: string[];
  };
};

export async function castVote(authorId: string, input: VoteMutationInput): Promise<VoteResult> {
  if (input.targetType === "post") {
    return voteOnPost(authorId, input.targetId, input.voteType);
  }

  return voteOnComment(authorId, input.targetId, input.voteType);
}

export async function getUserVotes(
  authorId: string,
  input: { postIds?: string; commentIds?: string },
) {
  const postIds = parseIdList(input.postIds);
  const commentIds = parseIdList(input.commentIds);

  if (postIds.length === 0 && commentIds.length === 0) {
    return {
      posts: {},
      comments: {},
    };
  }

  const [postVotes, commentVotes] = await Promise.all([
    postIds.length
      ? prisma.vote.findMany({
          where: {
            authorId,
            targetType: "post",
            postId: { in: postIds },
          },
          select: {
            postId: true,
            voteType: true,
          },
        })
      : [],
    commentIds.length
      ? prisma.vote.findMany({
          where: {
            authorId,
            targetType: "comment",
            commentId: { in: commentIds },
          },
          select: {
            commentId: true,
            voteType: true,
          },
        })
      : [],
  ]);

  return {
    posts: Object.fromEntries(
      postVotes
        .filter((vote) => vote.postId)
        .map((vote) => [vote.postId, vote.voteType]),
    ),
    comments: Object.fromEntries(
      commentVotes
        .filter((vote) => vote.commentId)
        .map((vote) => [vote.commentId, vote.voteType]),
    ),
  };
}

async function voteOnPost(authorId: string, postId: string, voteType: VoteTypeInput) {
  const post = await prisma.post.findFirst({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (!post) {
    throw new NotFoundError("Post not found.");
  }

  if (post.authorId === authorId) {
    throw new ForbiddenError("You cannot vote on your own post.");
  }

  const result = await prisma.$transaction(async (tx) => {
    const existingVote = await tx.vote.findUnique({
      where: {
        authorId_postId: {
          authorId,
          postId,
        },
      },
      select: {
        id: true,
        voteType: true,
      },
    });

    const { delta, nextVoteType } = await applyVoteMutation({
      tx,
      existingVote,
      authorId,
      targetType: "post",
      targetId: postId,
      voteType,
    });

    const updatedPost = await tx.post.update({
      where: { id: postId },
      data: {
        voteCount: { increment: delta },
      },
      select: {
        voteCount: true,
      },
    });

    return {
      voteType: nextVoteType,
      voteCount: updatedPost.voteCount,
    };
  });

  await recalculateReputation(post.authorId);

  return {
    targetType: "post",
    targetId: postId,
    voteType: result.voteType,
    voteCount: result.voteCount,
    reputation: {
      recalculatedFor: [post.authorId],
    },
  } satisfies VoteResult;
}

async function voteOnComment(authorId: string, commentId: string, voteType: VoteTypeInput) {
  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      post: {
        deletedAt: null,
      },
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (!comment) {
    throw new NotFoundError("Comment not found.");
  }

  if (comment.authorId === authorId) {
    throw new ForbiddenError("You cannot vote on your own comment.");
  }

  const result = await prisma.$transaction(async (tx) => {
    const existingVote = await tx.vote.findUnique({
      where: {
        authorId_commentId: {
          authorId,
          commentId,
        },
      },
      select: {
        id: true,
        voteType: true,
      },
    });

    const { delta, nextVoteType } = await applyVoteMutation({
      tx,
      existingVote,
      authorId,
      targetType: "comment",
      targetId: commentId,
      voteType,
    });

    const updatedComment = await tx.comment.update({
      where: { id: commentId },
      data: {
        voteCount: { increment: delta },
      },
      select: {
        voteCount: true,
      },
    });

    return {
      voteType: nextVoteType,
      voteCount: updatedComment.voteCount,
    };
  });

  await recalculateReputation(comment.authorId);

  return {
    targetType: "comment",
    targetId: commentId,
    voteType: result.voteType,
    voteCount: result.voteCount,
    reputation: {
      recalculatedFor: [comment.authorId],
    },
  } satisfies VoteResult;
}

async function applyVoteMutation(input: {
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0];
  existingVote: { id: string; voteType: VoteTypeInput } | null;
  authorId: string;
  targetType: "post" | "comment";
  targetId: string;
  voteType: VoteTypeInput;
}) {
  const { tx, existingVote, authorId, targetType, targetId, voteType } = input;

  if (!existingVote) {
    await tx.vote.create({
      data: {
        authorId,
        targetType,
        postId: targetType === "post" ? targetId : null,
        commentId: targetType === "comment" ? targetId : null,
        voteType,
      },
    });

    return {
      delta: voteType === "up" ? 1 : -1,
      nextVoteType: voteType,
    };
  }

  if (existingVote.voteType === voteType) {
    await tx.vote.delete({
      where: { id: existingVote.id },
    });

    return {
      delta: voteType === "up" ? -1 : 1,
      nextVoteType: null,
    };
  }

  await tx.vote.update({
    where: { id: existingVote.id },
    data: { voteType },
  });

  return {
    delta: voteType === "up" ? 2 : -2,
    nextVoteType: voteType,
  };
}

function parseIdList(value?: string) {
  if (!value) return [];

  return Array.from(
    new Set(
      value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
    ),
  );
}
