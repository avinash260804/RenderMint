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
};

export function CommentsPanel({ postSlug, postType }: CommentsPanelProps) {
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [solutionLoading, setSolutionLoading] = useState(false);
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
      comments?: CommentRecord[];
      error?: string;
    } | null;

    if (!response.ok) {
      setError(payload?.error ?? "Failed to load comments.");
      setLoading(false);
      return;
    }

    setComments(payload?.comments ?? []);
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
      state?: HelpSolutionState;
      error?: string;
    } | null;

    if (!response.ok || !payload?.state) {
      setError(payload?.error ?? "Failed to load solved state.");
      return;
    }

    setSolutionState(payload.state);
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
      comment?: CommentRecord;
      error?: string;
    } | null;

    if (!response.ok || !payload?.comment) {
      setError(payload?.error ?? "Failed to post comment.");
      setSubmitting(false);
      return;
    }

    setComments((current) => [...current, payload.comment!]);
    setBody("");
    setSubmitting(false);
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
      state?: HelpSolutionState;
      error?: string;
    } | null;

    if (!response.ok || !payload?.state) {
      setError(payload?.error ?? "Failed to update solved status.");
      setSolutionLoading(false);
      return;
    }

    setSolutionState(payload.state);
    setSolutionLoading(false);
  }

  return (
    <Card className="border-border/70 bg-card/80 rounded-2xl">
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

        {loading ? (
          <div className="space-y-2">
            <div className="bg-muted h-14 animate-pulse rounded-lg" />
            <div className="bg-muted h-14 animate-pulse rounded-lg" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-muted-foreground border-border rounded-xl border border-dashed px-4 py-6 text-sm">
            No comments yet. Start the conversation.
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <article
                key={comment.id}
                className="border-border/70 bg-muted/20 rounded-xl border px-4 py-3"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{comment.authorName}</p>
                  <time className="text-muted-foreground text-xs">
                    {new Date(comment.createdAt).toLocaleString()}
                  </time>
                </div>
                <p className={cn("whitespace-pre-wrap text-sm")}>{comment.body}</p>
                {isHelpThread ? (
                  <div className="mt-3">
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
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
