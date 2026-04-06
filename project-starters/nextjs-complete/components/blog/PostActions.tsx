"use client";

/**
 * components/blog/PostActions.tsx — Post Like/Share Actions (Client Component)
 *
 * Isolated Client Component embedded inside the Server Component post page.
 * Only the interactive parts need to be client-side — the rest of the post
 * stays server-rendered.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Post } from "@/types";
import { Heart, Share2, BookmarkPlus, Twitter, Link2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostActionsProps {
  post: Post;
}

export function PostActions({ post }: PostActionsProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [saved, setSaved] = useState(false);

  const handleLike = async () => {
    // Optimistic update — update UI immediately, then sync with server
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev) => prev + (newLiked ? 1 : -1));

    try {
      // TODO: call PATCH /api/posts/:id to persist the like count
      // await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
      toast.success(newLiked ? "Post liked!" : "Like removed");
    } catch {
      // Rollback on failure
      setLiked(!newLiked);
      setLikeCount((prev) => prev + (newLiked ? -1 : 1));
      toast.error("Failed to update like");
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    toast.success(saved ? "Removed from saved" : "Saved to reading list");
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Like button */}
        <Button
          variant={liked ? "default" : "outline"}
          size="sm"
          onClick={handleLike}
          className="gap-2"
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          {likeCount}
        </Button>

        {/* Save button */}
        <Button
          variant={saved ? "secondary" : "outline"}
          size="sm"
          onClick={handleSave}
          className="gap-2"
        >
          <BookmarkPlus className="h-4 w-4" />
          {saved ? "Saved" : "Save"}
        </Button>
      </div>

      {/* Share dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopyLink}>
            <Link2 className="mr-2 h-4 w-4" />
            Copy link
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`,
                "_blank"
              )
            }
          >
            <Twitter className="mr-2 h-4 w-4" />
            Share on Twitter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
