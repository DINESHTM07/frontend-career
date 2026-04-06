/**
 * lib/utils.ts — Utility Functions
 *
 * `cn()` is the standard Shadcn/UI utility for composing class names.
 * It combines clsx (conditional classes) + tailwind-merge (deduplicates Tailwind classes).
 *
 * Why both? `clsx` handles conditionals; `tailwind-merge` ensures that
 * conflicting Tailwind classes (e.g. p-4 and p-2) don't both end up in the output.
 *
 * Example:
 *   cn("p-4 text-sm", condition && "text-red-500", className)
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date string to a human-readable relative time ("2 days ago") */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: diffDays > 365 ? "numeric" : undefined,
  });
}

/** Convert a string to a URL-friendly slug */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")  // remove non-word characters
    .replace(/\s+/g, "-")       // spaces to hyphens
    .replace(/-+/g, "-")        // collapse multiple hyphens
    .trim();
}

/** Truncate a string to a maximum length, appending "..." */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + "...";
}

/** Estimate reading time in minutes */
export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
