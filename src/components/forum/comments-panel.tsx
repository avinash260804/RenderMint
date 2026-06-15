"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { CommentRecord } from "@/modules/comments/schemas/comment-schema";

type CommentsPanelProps = {
  postSlug: string;
  postType: "discussion" | "critique" | "showcase" | "help" | "resource";
};

type HelpSolutionState = {
  postSlug: string;
  isSolved: boolean;
  acceptedCommentId: string | null;
  updatedAt: string;
  canManageSolution?: boolean;
};

export function CommentsPanel({ postSlug, postType }: CommentsPanelProps) {
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [solutionLoading, setSolutionLoading] = useState(false);
  const [canManageSolution, setCanManageSolution] = useState(false);
  const [savingCommentId, setSavingCommentId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState("");
  const [solutionState, setSolutionState] = useState<HelpSolutionState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const isHelpThread = postType === "help";

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await fetch(`/api/comments?postSlug=${encodeURIComponent(postSlug)}`, {
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as {
      data?: CommentRecord[];
      meta?: { currentUserId?: string | null };
      error?: { message?: string };
    } | null;

    if (!response.ok) {
      setError(payload?.error?.message ?? "Failed to load comments.");
      setLoading(false);
      return;
    }

    setComments(payload?.data ?? []);
    setCurrentUserId(payload?.meta?.currentUserId ?? null);
    setLoading(false);
  }, [postSlug]);

  useEffect(() => {
    void load();
  }, [load]);

  const loadSolutionState = useCallback(async () => {
    if (!isHelpThread) return;

    const response = await fetch(`/api/help/solution?postSlug=${encodeURIComponent(postSlug)}`, {
      cache: "no-store",
    });
    const payload = (await response.json().catch(() => null)) as {
      data?: HelpSolutionState;
      meta?: { canManageSolution?: boolean };
      error?: { message?: string };
    } | null;

    if (!response.ok || !payload?.data) {
      setError(payload?.error?.message ?? "Failed to load solved state.");
      return;
    }

    setSolutionState(payload.data);
    setCanManageSolution(Boolean(payload?.meta?.canManageSolution ?? payload.data.canManageSolution));
  }, [isHelpThread, postSlug]);

  useEffect(() => {
    void loadSolutionState();
  }, [loadSolutionState]);

  async function submitComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim()) return;

    setSubmitting(true);
    setError(null);

    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postSlug, body }),
    });

    const payload = (await response.json().catch(() => null)) as {
      data?: CommentRecord;
      error?: { message?: string };
    } | null;

    if (!response.ok || !payload?.data) {
      setError(payload?.error?.message ?? "Failed to post comment.");
      setSubmitting(false);
      return;
    }

    setComments((current) => [...current, payload.data!]);
    setBody("");
    setSubmitting(false);
  }

  async function saveCommentEdit(commentId: string) {
    if (!editingBody.trim()) return;

    setSavingCommentId(commentId);
    setError(null);

    const response = await fetch(`/api/comments/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: editingBody }),
    });

    const payload = (await response.json().catch(() => null)) as {
      data?: CommentRecord;
      error?: { message?: string };
    } | null;

    if (!response.ok || !payload?.data) {
      setError(payload?.error?.message ?? "Failed to update comment.");
      setSavingCommentId(null);
      return;
    }

    setComments((current) =>
      current.map((comment) => (comment.id === commentId ? payload.data! : comment)),
    );
    setEditingCommentId(null);
    setEditingBody("");
    setSavingCommentId(null);
  }

  async function removeComment(commentId: string) {
    setSavingCommentId(commentId);
    setError(null);

    const response = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        error?: { message?: string };
      } | null;
      setError(payload?.error?.message ?? "Failed to delete comment.");
      setSavingCommentId(null);
      return;
    }

    setComments((current) => current.filter((comment) => comment.id !== commentId));
    if (editingCommentId === commentId) {
      setEditingCommentId(null);
      setEditingBody("");
    }
    setSavingCommentId(null);
  }

  async function toggleSolution(commentId: string) {
    if (!isHelpThread) return;

    setSolutionLoading(true);
    setError(null);

    const shouldUnset = solutionState?.acceptedCommentId === commentId;
    const response = await fetch("/api/help/solution", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postSlug,
        commentId: shouldUnset ? null : commentId,
      }),
    });

    const payload = (await response.json().catch(() => null)) as {
      data?: HelpSolutionState;
      meta?: { canManageSolution?: boolean };
      error?: { message?: string };
    } | null;

    if (!response.ok || !payload?.data) {
      setError(payload?.error?.message ?? "Failed to update solved status.");
      setSolutionLoading(false);
      return;
    }

    setSolutionState(payload.data);
    setCanManageSolution(Boolean(payload?.meta?.canManageSolution ?? payload.data.canManageSolution));
    setSolutionLoading(false);
  }

  return (
    <Card data-testid="comments-panel" className="border-border/70 bg-card/80 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg">Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-3" onSubmit={submitComment}>
          <Textarea
            rows={4}
            placeholder="Share feedback, suggestions, or a solution..."
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
          <div className="flex items-center justify-between gap-2">
            <p className="text-muted-foreground text-xs">Be constructive and specific.</p>
            <Button type="submit" size="sm" disabled={submitting}>
              <Send className="size-4" /> {submitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>

        {error ? <p className="text-destructive text-sm">{error}</p> : null}
        {isHelpThread && solutionState?.isSolved ? (
          <div className="inline-flex w-fit items-center gap-1 rounded-lg bg-emerald-500/15 px-2 py-1 text-xs text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="size-3.5" /> Marked as solved
          </div>
        ) : null}

        <div data-testid="comment-list" role="list" className="space-y-3">
          {loading ? (
            <div className="space-y-2" role="listitem">
              <div className="bg-muted h-14 animate-pulse rounded-lg" />
              <div className="bg-muted h-14 animate-pulse rounded-lg" />
            </div>
          ) : comments.length === 0 ? (
            <div
              role="listitem"
              className="text-muted-foreground border-border rounded-xl border border-dashed px-4 py-6 text-sm"
            >
              No comments yet. Start the conversation.
            </div>
          ) : (
            comments.map((comment) => (
              <article
                key={comment.id}
                role="listitem"
                className="border-border/70 bg-muted/20 rounded-xl border px-4 py-3"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{comment.authorName}</p>
                  <time className="text-muted-foreground text-xs">
                    {new Date(comment.createdAt).toLocaleString()}
                    {comment.updatedAt !== comment.createdAt ? " · edited" : ""}
                  </time>
                </div>
                {editingCommentId === comment.id ? (
                  <div className="space-y-3">
                    <Textarea
                      rows={3}
                      value={editingBody}
                      onChange={(event) => setEditingBody(event.target.value)}
                    />
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditingBody("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => saveCommentEdit(comment.id)}
                        disabled={savingCommentId === comment.id}
                      >
                        {savingCommentId === comment.id ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className={cn("whitespace-pre-wrap text-sm")}>{comment.body}</p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {comment.authorId === currentUserId ? (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditingBody(comment.body);
                        }}
                        disabled={savingCommentId === comment.id}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeComment(comment.id)}
                        disabled={savingCommentId === comment.id}
                      >
                        {savingCommentId === comment.id ? "Deleting..." : "Delete"}
                      </Button>
                    </>
                  ) : null}
                  {isHelpThread && canManageSolution ? (
                    <Button
                      type="button"
                      size="sm"
                      variant={
                        solutionState?.acceptedCommentId === comment.id ? "default" : "outline"
                      }
                      onClick={() => toggleSolution(comment.id)}
                      disabled={solutionLoading}
                    >
                      {solutionState?.acceptedCommentId === comment.id
                        ? "Unmark solution"
                        : "Mark as solution"}
                    </Button>
                  ) : null}
                </div>
              </article>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
