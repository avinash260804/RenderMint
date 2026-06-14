"use client";

type VoteControlProps = {
  voteCount: number;
  isOwner: boolean;
  currentVote: "UP" | "DOWN" | null;
  onVote: (direction: "UP" | "DOWN") => void;
  isAuthenticated?: boolean;
  onLoginPrompt?: () => void;
};

export default function VoteControl({
  voteCount,
  isOwner,
  onVote,
  isAuthenticated = true,
  onLoginPrompt,
}: VoteControlProps) {
  function handleVote(direction: "UP" | "DOWN") {
    if (!isAuthenticated) {
      onLoginPrompt?.();
      return;
    }

    onVote(direction);
  }

  return (
    <div>
      <button aria-label="upvote" disabled={isOwner} onClick={() => handleVote("UP")}>
        Upvote
      </button>
      <span>{voteCount}</span>
      <button aria-label="downvote" disabled={isOwner} onClick={() => handleVote("DOWN")}>
        Downvote
      </button>
    </div>
  );
}
