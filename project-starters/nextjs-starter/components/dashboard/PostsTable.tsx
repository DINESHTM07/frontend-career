"use client";

/**
 * components/dashboard/PostsTable.tsx — Posts Management Table [STUB]
 *
 * Client Component — manages optimistic deletes in local state.
 *
 * TODO (Day 4):
 *  1. Initialize state: const [posts, setPosts] = useState(initialPosts)
 *  2. Implement handleDelete(id, title):
 *     a. Save prevPosts = posts (for rollback)
 *     b. Optimistically remove: setPosts(prev => prev.filter(p => p.id !== id))
 *     c. Call: await fetch(`/api/posts/${id}`, { method: "DELETE" })
 *     d. If error: rollback setPosts(prevPosts) + toast.error(...)
 *     e. If success: toast.success(...)
 *  3. Build the table:
 *     - Columns: Title (+ excerpt), Category badge, Published date, Likes, Actions
 *     - Action buttons: View (ExternalLink → /blog/[slug]), Edit, Delete (Trash2, destructive color)
 *     - Empty state: "No posts yet. Create your first post!"
 *
 * Hint: Use Table, TableHeader, TableRow, TableHead, TableBody, TableCell from "@/components/ui/table"
 */

import type { Post } from "@/types";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, Edit } from "lucide-react";
import Link from "next/link";

interface PostsTableProps {
  posts: Post[];
}

export function PostsTable({ posts: initialPosts }: PostsTableProps) {
  // TODO: const [posts, setPosts] = useState(initialPosts);
  const posts = initialPosts; // remove this line once useState is implemented

  // TODO: implement handleDelete(id, title) with optimistic UI

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
                <p className="font-medium line-clamp-1">{post.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {post.excerpt}
                </p>
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
                  {/* TODO: Wire up onClick to handleDelete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    aria-label="Delete post"
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
