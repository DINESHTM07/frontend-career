"use client";

/**
 * components/blog/BlogSearch.tsx — Search + Category Filter [STUB]
 *
 * Client Component — updates the URL query params to trigger server re-fetch.
 * The pattern: push to router → page re-renders with new searchParams → data re-fetched.
 *
 * TODO (Day 1):
 *  1. Import useRouter, useSearchParams from "next/navigation"
 *  2. Import useTransition from "react"
 *  3. Read current values: searchParams.get("category"), searchParams.get("q")
 *  4. Local state: const [query, setQuery] = useState(currentQuery)
 *  5. Write updateURL(category, query) — builds URLSearchParams and calls router.push()
 *     Wrap router.push in startTransition so the UI stays responsive
 *  6. Render a search <Input> with a form onSubmit that calls updateURL
 *  7. Render category pill buttons — highlight the active one using cn()
 *  8. Show a clear (X) button when there are active filters
 *
 * Hint: URLSearchParams params = new URLSearchParams();
 *       params.set("category", newCategory);
 *       router.push(`/blog?${params.toString()}`);
 */

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface BlogSearchProps {
  categories: string[];
}

export function BlogSearch({ categories }: BlogSearchProps) {
  // TODO: implement URL-driven search + filter

  return (
    <div className="space-y-4">
      {/* TODO: Search form */}
      <div className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search posts... (TODO)" className="pl-9" readOnly />
        </div>
        <Button disabled>Search</Button>
      </div>

      {/* TODO: Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            className="rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-sm"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
