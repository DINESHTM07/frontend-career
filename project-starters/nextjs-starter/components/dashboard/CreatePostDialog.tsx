"use client";

/**
 * components/dashboard/CreatePostDialog.tsx — Create Post Modal [STUB]
 *
 * Client Component — manages dialog open state and form state.
 *
 * TODO (Day 4):
 *  1. Add state: open (boolean), loading (boolean), form fields (title, slug, excerpt, content, category)
 *  2. Auto-generate slug from title using slugify() from "@/lib/utils"
 *  3. Implement handleSubmit:
 *     a. Set loading = true
 *     b. POST to /api/posts with JSON body
 *     c. If ok: toast.success + close dialog + reset form
 *     d. If error: toast.error with error message
 *     e. Always: set loading = false
 *  4. Build the form inside DialogContent:
 *     - Title input (triggers slug auto-generation)
 *     - Slug input (editable, pre-filled from title)
 *     - Category input
 *     - Excerpt textarea
 *     - Content textarea
 *     - Cancel button (closes dialog) + Submit button (shows spinner when loading)
 *
 * Hint: import { Loader2 } from "lucide-react" for the loading spinner
 *       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
 */

import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function CreatePostDialog() {
  // TODO: const [open, setOpen] = useState(false);
  // TODO: const [loading, setLoading] = useState(false);
  // TODO: form state for title, slug, excerpt, content, category

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            TODO: Build the form (title, slug, category, excerpt, content)
          </DialogDescription>
        </DialogHeader>

        {/* TODO: Form fields — Input for title (auto-slugify), slug, category; Textarea for excerpt and content */}
        <div className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-8 text-center text-sm text-muted-foreground">
          Form fields go here — see TODO comments above
        </div>

        <DialogFooter>
          <Button variant="outline" disabled>Cancel</Button>
          {/* TODO: onClick calls handleSubmit, disabled while loading */}
          <Button disabled>Create Post (TODO)</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
