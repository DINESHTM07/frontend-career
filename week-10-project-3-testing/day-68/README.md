# Day 68 — FINAL BOSS: Exercise 40 — Bookmark Manager

**Status:** 📋 READY TO START
**Week:** 10 | **Theme:** Testing + Polish + Open Source

---

## Today's Goal

This is the final boss. Exercise 40 is the bookmark manager — you build it entirely alone, from a spec, with no starter code and no guided steps. This simulates a real technical assignment.

By end of today:
- You have read the full spec and understood every requirement
- You have planned the architecture (components, state, data shape) on paper
- You have started building — ideally more than halfway done

LinkedIn post also goes out today: "Open source contribution merged! Added testing to all 3 projects. 10 weeks into my 90-day challenge."

---

## What to Open

1. `exercises/40-bookmark-manager.jsx` — THE SPEC. Read it twice.

---

## Morning (8:00 – 11:00 AM) — Read Spec + Plan Architecture

### Step 1 — Read the Spec Twice

Open `exercises/40-bookmark-manager.jsx`. Read it fully. Then read it again.

While reading, highlight:
- Every noun (potential data model field or component name)
- Every verb (potential user action or state change)
- Every "should" (a requirement, not optional)

### Step 2 — Define the Data Model

Before writing any components, define what a bookmark looks like:

```ts
interface Bookmark {
  id: string              // unique identifier — use crypto.randomUUID()
  url: string             // the bookmarked URL
  title: string           // user-provided or auto-filled from URL
  description?: string    // optional notes
  tags: string[]          // for categorization/filtering
  favicon?: string        // optional: derived from the URL's domain
  createdAt: string       // ISO date string
  isFavorite: boolean     // for quick filtering
}
```

Define any other types the spec requires. Get the data model right BEFORE writing any UI — wrong data models lead to rewrites.

### Step 3 — Plan the Component Tree

Draw (on paper or in a comment) the component hierarchy:

```
App
  BookmarkApp (holds all state)
    AddBookmarkForm     ← 'use client' — handles form input
    FilterBar           ← 'use client' — search + tag filter + sort
    BookmarkGrid
      BookmarkCard      ← renders one bookmark
        FavoriteButton  ← toggles favorite
        TagList         ← renders tags
        DeleteButton    ← removes bookmark
    EmptyState          ← shown when no bookmarks or no search results
```

### Step 4 — Plan the State

What state do you need and where does it live?

```ts
// Centralized in BookmarkApp (or a Zustand store):
const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
const [search, setSearch] = useState('')
const [selectedTag, setSelectedTag] = useState<string | null>(null)
const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest')
const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

// Derived state (computed, not stored):
const filteredBookmarks = useMemo(() => {
  return bookmarks
    .filter(b => !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.url.includes(search))
    .filter(b => !selectedTag || b.tags.includes(selectedTag))
    .filter(b => !showFavoritesOnly || b.isFavorite)
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return a.title.localeCompare(b.title)
    })
}, [bookmarks, search, selectedTag, showFavoritesOnly, sortBy])
```

### Step 5 — Plan Persistence

Bookmarks should persist across page refreshes. Options:
- **localStorage** via Zustand persist middleware (simplest)
- **localStorage** via a custom `useLocalStorage` hook
- **IndexedDB** (overkill for this exercise)

Choose the simplest approach that works. Zustand + persist is recommended.

---

## Midday (11:20 AM – 1:30 PM) — Start Building

### Build Order (follow this exactly)

1. **Data layer first** — set up Zustand store or useState + localStorage
2. **Add bookmark form** — just a URL field to start, add title/tags later
3. **Bookmark list** — render the raw array, no filtering yet
4. **Individual bookmark card** — URL, title, delete button
5. **Delete functionality** — confirm it works before adding more features
6. **Filter/search** — add after the basic CRUD works
7. **Tags** — add tag input to form, tag filter to FilterBar
8. **Favorites** — toggle button, filter by favorites
9. **Polish** — sorting, empty states, animations

### Add Bookmark Form

```tsx
// AddBookmarkForm.tsx
'use client'
import { useState } from 'react'

interface AddBookmarkFormProps {
  onAdd: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void
}

export default function AddBookmarkForm({ onAdd }: AddBookmarkFormProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')  // comma-separated input

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    onAdd({
      url: url.trim(),
      title: title.trim() || url.trim(),  // fallback: use URL as title
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      isFavorite: false,
    })

    setUrl('')
    setTitle('')
    setTags('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold">Add Bookmark</h2>
      <input
        type="url"
        placeholder="https://example.com"
        value={url}
        onChange={e => setUrl(e.target.value)}
        required
        className="w-full px-3 py-2 border rounded-lg text-sm"
      />
      <input
        type="text"
        placeholder="Title (optional)"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg text-sm"
      />
      <input
        type="text"
        placeholder="Tags (comma separated: react, tutorial, tools)"
        value={tags}
        onChange={e => setTags(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg text-sm"
      />
      <button
        type="submit"
        disabled={!url.trim()}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add Bookmark
      </button>
    </form>
  )
}
```

### Bookmark Card

```tsx
// BookmarkCard.tsx
interface BookmarkCardProps {
  bookmark: Bookmark
  onDelete: (id: string) => void
  onToggleFavorite: (id: string) => void
}

export default function BookmarkCard({ bookmark, onDelete, onToggleFavorite }: BookmarkCardProps) {
  // Extract domain for favicon
  const domain = new URL(bookmark.url).hostname

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
            alt=""
            className="w-4 h-4 flex-shrink-0"
          />
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 truncate"
          >
            {bookmark.title}
          </a>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onToggleFavorite(bookmark.id)}
            className={`text-lg ${bookmark.isFavorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
            aria-label={bookmark.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            ★
          </button>
          <button
            onClick={() => onDelete(bookmark.id)}
            className="text-gray-400 hover:text-red-500 text-sm"
            aria-label="Delete bookmark"
          >
            ✕
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-1 truncate">{bookmark.url}</p>
      {bookmark.tags.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {bookmark.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## Afternoon (1:30 – 3:00 PM) — Continue Building + LinkedIn Post

### Keep Building

By afternoon you should have:
- Add bookmark works (URL, title, tags)
- Bookmarks render in a grid
- Delete works
- Favorites toggle works

Continue with:
- Search filter
- Tag filter
- Sort
- Persistence (localStorage or Zustand persist)
- Empty state

### LinkedIn Post

Post this today (Day 68 milestone):

> 10 weeks into my 90-day frontend challenge.
>
> What's happened in the last 3 weeks:
> ✅ Built and deployed an Analytics Dashboard (React + TypeScript + Recharts)
> ✅ Built and deployed a Next.js app (Server Components, Shadcn/UI, dark mode)
> ✅ Added 20+ tests across all 3 projects (Vitest + React Testing Library)
> ✅ Submitted my first open source PR to [repo name]
> ✅ Added Framer Motion animations to all 3 projects
>
> Current projects live:
> 🔗 E-Commerce: [link]
> 🔗 Dashboard: [link]
> 🔗 Next.js App: [link]
>
> Today I started the "Final Boss" exercise — building a Bookmark Manager entirely alone from a spec.
>
> 22 days left. The job hunt starts at Day 90.
>
> #react #typescript #nextjs #frontend #buildinpublic

---

## End of Day Checklist

- [ ] Read `exercises/40-bookmark-manager.jsx` spec twice
- [ ] Data model (`Bookmark` interface) defined with all required fields
- [ ] Component tree planned on paper or in a comment
- [ ] State plan written — what is stored vs derived
- [ ] Persistence approach chosen (Zustand persist or localStorage)
- [ ] `AddBookmarkForm` working — submits new bookmarks
- [ ] `BookmarkCard` renders URL, title, tags, favorite star, delete button
- [ ] Add + Delete working end-to-end
- [ ] Favorites toggle working
- [ ] Bookmarks persist on page refresh
- [ ] LinkedIn post published with all 3 live URLs
- [ ] Completed 3 DSA problems in `day-68-dsa.js`

---

*The final boss is not graded. No one will check it. That's the point — you're building it for yourself, to prove you can. The bookmark manager you finish this week is the answer to "have you built anything on your own?" in every interview you take.*
