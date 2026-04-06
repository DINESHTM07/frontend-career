"use client";

/**
 * components/dashboard/CreatePostDialog.tsx — Create Post Modal (Client Component)
 *
 * Demonstrates the Shadcn/UI Dialog + controlled form.
 * On submit, POSTs to /api/posts and shows a toast notification.
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { slugify } from "@/lib/utils";

export function CreatePostDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    slug: "",
  });

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugify(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tags: [] }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create post");
      }

      toast.success("Post created successfully!");
      setOpen(false);
      setForm({ title: "", excerpt: "", content: "", category: "", slug: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            Fill in the details below. You can edit everything after creation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="My awesome post"
              value={form.title}
              onChange={handleTitleChange}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              placeholder="my-awesome-post"
              value={form.slug}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, slug: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              placeholder="React, Next.js, TypeScript..."
              value={form.category}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, category: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              placeholder="A brief description of your post..."
              value={form.excerpt}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, excerpt: e.target.value }))
              }
              rows={2}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              placeholder="Write your post content here..."
              value={form.content}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, content: e.target.value }))
              }
              rows={4}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Creating..." : "Create Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
