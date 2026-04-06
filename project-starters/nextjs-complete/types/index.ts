/**
 * types/index.ts — Shared TypeScript Types
 *
 * Centralized type definitions used across the app.
 * Import from "@/types" (resolved via tsconfig paths).
 */

// ─── Domain Types ──────────────────────────────────────────────────────────────

export interface Author {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: string;
  author: Author;
  publishedAt: string; // ISO 8601 date string
  updatedAt?: string;
  readingTime: number; // minutes
  likes: number;
  published?: boolean;
}

// ─── API Response Types ────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ─── Next-Auth Extensions ──────────────────────────────────────────────────────

// Extend the default Session type to include our custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
  }
}
