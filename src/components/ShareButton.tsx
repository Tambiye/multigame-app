"use client";

import { Share2 } from "lucide-react";

type ShareButtonProps = {
  progress?: number;
};

export default function ShareButton({ progress }: ShareButtonProps) {
  const handleShare = () => {
    const url = window.location.href;

    const text = progress
      ? `I just reached ${progress}% in the game! Check it out: can you beat my score? `
      : "Check out this game! ";

    if (navigator.share) {
      navigator.share({
        title: "Game Progress",
        text,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="share-btn"
      aria-label="Share game progress"
      title="Share game progress"
    >
      <Share2 size={18} />
    </button>
  );
}