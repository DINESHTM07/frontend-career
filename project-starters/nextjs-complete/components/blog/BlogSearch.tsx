"use client";

/**
 * components/blog/BlogSearch.tsx — Search + Filter (Client Component)
 *
 * Updates the URL's query params (searchParams) instead of local state.
 * This way:
 *  - The filter is shareable via URL
 *  - The server re-fetches filtered data on navigation
 *  - Back button works correctly
 *
 * Pattern: useRouter().push() to update the URL, which causes the parent
 * Server Component (blog/page.tsx) to re-render with new searchParams.
 */

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogSearchProps {
  categories: string[];
}

export function BlogSearch({ categories }: BlogSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Read current values from URL to keep UI in sync
  const currentCategory = searchParams.get("category") ?? "All";
  const currentQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(currentQuery);

  const updateURL = (newCategory: string, newQuery: string) => {
    const params = new URLSearchParams();
    if (newCategory && newCategory !== "All") params.set("category", newCategory);
    if (newQuery) params.set("q", newQuery);

    // startTransition marks the navigation as non-urgent — keeps UI responsive
    startTransition(() => {
      router.push(`/blog?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL(currentCategory, query);
  };

  const handleCategoryClick = (category: string) => {
    updateURL(category, query);
  };

  const handleClear = () => {
    setQuery("");
    updateURL("All", "");
  };

  const hasFilters = currentCategory !== "All" || currentQuery;

  return (
    <div className="space-y-4">
      {/* Search input */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Searching..." : "Search"}
        </Button>
        {hasFilters && (
          <Button type="button" variant="ghost" size="icon" onClick={handleClear}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors",
              currentCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
