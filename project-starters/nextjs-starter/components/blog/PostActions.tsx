"use client";

/**
 * components/blog/PostActions.tsx — Post Like / Share Actions [STUB]
 *
 * Client Component — isolated interactive island inside the server-rendered post page.
 *
 * TODO (Day 1):
 *  1. Add a like button:
 *     - useState for liked (boolean) and likeCount (number, init from post.likes)
 *     - On click: toggle liked, update likeCount ±1, show toast
 *     - Change button variant between "default" and "outline" based on liked state
 *     - Use Heart icon (fill-current when liked)
 *
 *  2. Add a save button:
 *     - useState for saved (boolean)
 *     - Show BookmarkPlus icon, change label between "Save" and "Saved"
 *
 *  3. Add a share dropdown (DropdownMenu):
 *     - "Copy link": navigator.clipboard.writeText(window.location.href)
 *     - "Share on Twitter": window.open(twitter intent URL)
 *
 * TODO (Day 4): Wire up the like button to PATCH /api/posts/:id
 */

import { Button } from "@/components/ui/button";
import type { Post } from "@/types";
import { Heart, Share2, BookmarkPlus } from "lucide-react";

interface PostActionsProps {
  post: Post;
}

export function PostActions({ post }: PostActionsProps) {
  // TODO: const [liked, setLiked] = useState(false);
  // TODO: const [likeCount, setLikeCount] = useState(post.likes);
  // TODO: const [saved, setSaved] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* TODO: Like button with optimistic update */}
        <Button variant="outline" size="sm" className="gap-2" disabled>
          <Heart className="h-4 w-4" />
          {post.likes} (TODO)
        </Button>

        {/* TODO: Save button */}
        <Button variant="outline" size="sm" className="gap-2" disabled>
          <BookmarkPlus className="h-4 w-4" />
          Save (TODO)
        </Button>
      </div>

      {/* TODO: Share dropdown menu */}
      <Button variant="outline" size="sm" className="gap-2" disabled>
        <Share2 className="h-4 w-4" />
        Share (TODO)
      </Button>
    </div>
  );
}
