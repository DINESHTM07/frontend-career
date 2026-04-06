"use client";

/**
 * components/dashboard/PostsTable.tsx — Posts Management Table (Client Component)
 *
 * Demonstrates the Shadcn/UI Table component with:
 *  - Sorting by column
 *  - Row selection
 *  - Delete action with optimistic UI
 *  - Toast notifications
 */

import { useState } from "react";
import type { Post } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2, ExternalLink, Edit } from "lucide-react";
import Link from "next/link";

interface PostsTableProps {
  posts: Post[];
}

export function PostsTable({ posts: initialPosts }: PostsTableProps) {
  // Client-side state for optimistic deletes
  const [posts, setPosts] = useState(initialPosts);

  const handleDelete = async (id: string, title: string) => {
    // Optimistic update: remove from UI immediately
    const prevPosts = posts;
    setPosts((prev) => prev.filter((p) => p.id !== id));

    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success(`"${title}" deleted`);
    } catch {
      // Rollback
      setPosts(prevPosts);
      toast.error("Failed to delete post");
    }
  };

  if (posts.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No posts yet. Create your first post!
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="hidden sm:table-cell">Category</TableHead>
            <TableHead className="hidden md:table-cell">Published</TableHead>
            <TableHead className="hidden md:table-cell text-right">Likes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                <div>
                  <p className="font-medium line-clamp-1">{post.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {post.excerpt}
                  </p>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant="secondary">{post.category}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="hidden md:table-cell text-right text-sm">
                {post.likes}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" asChild aria-label="View post">
                    <Link href={`/blog/${post.slug}`} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Edit post">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    aria-label="Delete post"
                    onClick={() => handleDelete(post.id, post.title)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
