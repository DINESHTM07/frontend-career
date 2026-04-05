# Exercise 40: The Final Boss — Bookmark Manager

## PATTERN: ALL 15 COMBINED

This is not a walkthrough. This is a **spec**. You build it yourself.

You've learned 15 patterns across 39 exercises. Now you combine all of them into one real, deployed application. The bookmark manager is simple enough to finish in a week, complex enough to use every skill you've built.

**Do not look for a tutorial for this.** You are the tutorial now. Use your cheatsheets, use MDN, use your previous exercises. When you're stuck, look at what you built before — not a new YouTube video.

---

## WHAT YOU'RE BUILDING

**Linkhive** — A personal bookmark manager.

Users can:
- Add bookmarks with URL, title, description, and tags
- Organize bookmarks into collections
- Search and filter bookmarks
- Mark bookmarks as favorites
- Import/export bookmarks as JSON
- Toggle dark/light mode
- All data persists in localStorage

**Live demo target:** Deployed on Vercel at `linkhive-[yourname].vercel.app`

---

## TECH STACK (ALL REQUIRED)

| Technology | How You Use It |
|-----------|----------------|
| React 18 | Component architecture, hooks, rendering |
| React Router v6 | Multi-page routing (all routes listed below) |
| Context + useReducer | Global state (bookmarks, collections, UI) |
| Custom Hooks | `useBookmarks`, `useSearch`, `useLocalStorage` |
| TypeScript | Every component, hook, and util is typed |
| Tailwind CSS | All styling — zero custom CSS |
| Framer Motion | Page transitions + bookmark card animations |
| Error Boundary | Catches rendering errors gracefully |
| Next.js (optional) | Can port to Next.js for SSG/ISR demo |
| Vercel | Deployment |

---

## ROUTES

```
/                     → Dashboard: recent bookmarks, stats, quick-add
/bookmarks            → All bookmarks with search + filter
/bookmarks/new        → Add bookmark form
/bookmarks/:id        → Bookmark detail + edit
/collections          → List all collections
/collections/:id      → Bookmarks in this collection
/favorites            → Favorited bookmarks
/settings             → Theme, import/export, clear data
```

---

## DATA MODELS

```typescript
interface Bookmark {
  id: string;                    // nanoid() — unique ID
  url: string;                   // validated URL
  title: string;
  description?: string;
  tags: string[];                // e.g. ["react", "tutorial"]
  collectionId: string | null;   // null = uncollected
  isFavorite: boolean;
  createdAt: string;             // ISO date string
  updatedAt: string;
  favicon?: string;              // derived from URL: https://favicon.plus/favicon/{domain}
}

interface Collection {
  id: string;
  name: string;
  color: string;                 // hex color for the collection badge
  icon: string;                  // emoji
  createdAt: string;
}

interface AppState {
  bookmarks: Bookmark[];
  collections: Collection[];
  ui: {
    theme: 'light' | 'dark' | 'system';
    sidebarOpen: boolean;
    searchQuery: string;
    activeFilter: FilterState;
  };
}

interface FilterState {
  tags: string[];
  collectionId: string | null;
  favoritesOnly: boolean;
  sortBy: 'createdAt' | 'title' | 'url';
  sortOrder: 'asc' | 'desc';
}
```

---

## STATE MANAGEMENT

Use Context + useReducer (Pattern #8: useReducer) for global state.

```typescript
// Define all actions as a discriminated union
type AppAction =
  | { type: 'ADD_BOOKMARK'; payload: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_BOOKMARK'; payload: { id: string } & Partial<Bookmark> }
  | { type: 'DELETE_BOOKMARK'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'ADD_COLLECTION'; payload: Omit<Collection, 'id' | 'createdAt'> }
  | { type: 'DELETE_COLLECTION'; payload: string }
  | { type: 'SET_THEME'; payload: AppState['ui']['theme'] }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_FILTER'; payload: Partial<FilterState> }
  | { type: 'IMPORT_BOOKMARKS'; payload: { bookmarks: Bookmark[], collections: Collection[] } }
  | { type: 'CLEAR_ALL' };
```

Your reducer handles each action. Your context provides `state` and `dispatch`.
Your custom hooks (`useBookmarks`, `useCollections`) wrap dispatch with convenient functions.

---

## CUSTOM HOOKS TO BUILD

### useBookmarks()
```typescript
function useBookmarks() {
  const { state, dispatch } = useApp();

  return {
    bookmarks: state.bookmarks,
    addBookmark: (data: NewBookmarkData) => dispatch({ type: 'ADD_BOOKMARK', payload: data }),
    updateBookmark: (id: string, data: Partial<Bookmark>) => dispatch({ type: 'UPDATE_BOOKMARK', payload: { id, ...data } }),
    deleteBookmark: (id: string) => dispatch({ type: 'DELETE_BOOKMARK', payload: id }),
    toggleFavorite: (id: string) => dispatch({ type: 'TOGGLE_FAVORITE', payload: id }),
    getById: (id: string) => state.bookmarks.find(b => b.id === id),
  };
}
```

### useSearch(bookmarks: Bookmark[])
```typescript
// Filters bookmarks by search query across url, title, description, tags
// Uses useMemo to avoid recomputing on every render
function useSearch(bookmarks: Bookmark[], query: string): Bookmark[] { ... }
```

### useLocalStorage(key, initialValue)
```typescript
// Persists state to localStorage automatically
// Syncs across tabs using storage event
function useLocalStorage<T>(key: string, initial: T): [T, (val: T) => void] { ... }
```

### useFilter(bookmarks: Bookmark[])
```typescript
// Applies FilterState to a list of bookmarks
// Sort + filter by tags, collection, favorites
function useFilter(bookmarks: Bookmark[], filter: FilterState): Bookmark[] { ... }
```

---

## COMPONENTS TO BUILD

### Layout
- `AppShell` — sidebar + main content wrapper
- `Sidebar` — navigation links, collection list, tag cloud
- `Header` — search bar, theme toggle, breadcrumb

### Bookmarks
- `BookmarkCard` — shows favicon, title, URL, tags, favorite toggle
  - Framer Motion: `initial={{ opacity: 0, y: 20 }}` + `animate={{ opacity: 1, y: 0 }}`
  - On hover: action buttons slide in (edit, delete, copy URL)
- `BookmarkList` — `AnimatePresence` wrapping `BookmarkCard` items (animate in/out)
- `BookmarkForm` — create/edit form with URL validation, tag input, collection selector
- `BookmarkDetail` — full view of one bookmark

### Collections
- `CollectionCard` — colored card with name, icon, bookmark count
- `CollectionForm` — name + color picker + emoji picker

### UI Components
- `SearchBar` — debounced search input (300ms)
- `TagFilter` — tag cloud with toggle-to-filter
- `SortSelect` — dropdown for sort field + order
- `EmptyState` — illustrated empty state with call-to-action
- `ConfirmDialog` — modal for destructive actions (delete)
- `Toast` — ephemeral notifications (add/delete/copy)
- `ErrorBoundary` — catches errors, shows fallback UI with refresh button

### Pages
- `Dashboard` — stats cards (total bookmarks, collections, favorites, tags) + recent bookmarks
- `BookmarksPage` — full list with filters
- `NewBookmarkPage` — form + URL preview (fetch page title via API route or proxy)
- `CollectionsPage` — collection grid
- `CollectionDetailPage` — bookmarks in one collection
- `FavoritesPage` — favorited bookmarks
- `SettingsPage` — theme, export JSON, import JSON, clear all data

---

## FRAMER MOTION ANIMATIONS

```typescript
// Page transitions — wrap routes in AnimatePresence
// Each page component uses:
const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: 20 },
};

// Bookmark card list animation
// Use AnimatePresence + layout prop for smooth reordering
<AnimatePresence>
  {bookmarks.map(bookmark => (
    <motion.div
      key={bookmark.id}
      layout                             // animate reordering
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <BookmarkCard bookmark={bookmark} />
    </motion.div>
  ))}
</AnimatePresence>

// Sidebar slide animation
// Favorite button bounce
// Toast slide-in from bottom
```

---

## ERROR BOUNDARY

```typescript
class ErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
    // In production: send to Sentry/LogRocket
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

Wrap different sections in separate boundaries:
- Wrap `Sidebar` in its own boundary (sidebar error doesn't break main content)
- Wrap each `Route` in its own boundary (one page error doesn't break the whole app)

---

## PERSISTENCE

Bookmarks and collections live in localStorage. On mount, hydrate state from localStorage. On every state change, persist to localStorage.

```typescript
// In your context provider:
const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
  try {
    const saved = localStorage.getItem('linkhive-data');
    return saved ? { ...init, ...JSON.parse(saved) } : init;
  } catch {
    return init;
  }
});

// Persist on every change:
useEffect(() => {
  localStorage.setItem('linkhive-data', JSON.stringify({
    bookmarks: state.bookmarks,
    collections: state.collections,
  }));
}, [state.bookmarks, state.collections]);
```

---

## IMPORT / EXPORT

```typescript
// Export
function exportData(state: AppState): void {
  const data = { bookmarks: state.bookmarks, collections: state.collections };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `linkhive-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Import
function importData(file: File): Promise<ImportedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        // Validate structure before importing
        if (!Array.isArray(data.bookmarks)) throw new Error('Invalid format');
        resolve(data);
      } catch (err) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
```

---

## DAY-BY-DAY BUILD PLAN

### Day 1 — Foundation
- [ ] `npx create-next-app@latest linkhive --typescript --tailwind --app`
- [ ] Install: `framer-motion`, `react-router-dom` (or use Next.js App Router), `nanoid`
- [ ] Define all TypeScript interfaces in `types/index.ts`
- [ ] Build `AppReducer` with all action types
- [ ] Build `AppContext` and `AppProvider`
- [ ] Build `useLocalStorage` hook
- [ ] Wire persistence: save/load from localStorage
- [ ] Test: dispatch `ADD_BOOKMARK` in browser console, verify localStorage

### Day 2 — Core Components
- [ ] Build `AppShell` with responsive sidebar (open/close on mobile)
- [ ] Build `Sidebar` with navigation links
- [ ] Build `Header` with search input (wired to context)
- [ ] Build `BookmarkCard` component (no animations yet)
- [ ] Build `BookmarkList` (map over bookmarks, show cards)
- [ ] Build `BookmarkForm` (create mode) with URL + title + tags
- [ ] Route: `/bookmarks` shows all bookmarks
- [ ] Route: `/bookmarks/new` shows form
- [ ] Test: add 5 bookmarks, they appear in the list and persist on refresh

### Day 3 — State and Hooks
- [ ] Build `useBookmarks` hook
- [ ] Build `useSearch` hook with `useMemo`
- [ ] Build `useFilter` hook (tags, collection, favorites, sort)
- [ ] Build `SearchBar` component (debounced, wired to context)
- [ ] Build `TagFilter` component (shows all unique tags, click to filter)
- [ ] Build `SortSelect` component
- [ ] Wire everything: search + filter + sort all work together
- [ ] Test: add bookmarks with different tags, verify search and filter work

### Day 4 — Collections + Routing
- [ ] Build `CollectionCard` and `CollectionForm`
- [ ] Route: `/collections` shows all collections
- [ ] Route: `/collections/:id` shows bookmarks in that collection
- [ ] Add collection selector to `BookmarkForm`
- [ ] Route: `/bookmarks/:id` shows bookmark detail with edit
- [ ] Build `BookmarkDetail` page with inline edit
- [ ] Test: create collections, assign bookmarks, filter by collection

### Day 5 — Polish and Animations
- [ ] Add Framer Motion to `BookmarkList` (AnimatePresence + layout)
- [ ] Add page transition animation (AnimatePresence in router)
- [ ] Add favorite button animation (scale bounce on click)
- [ ] Build `Toast` component, show on: add, delete, copy URL
- [ ] Build `ConfirmDialog` for delete actions
- [ ] Build `EmptyState` for pages with no content
- [ ] Dashboard: build stats cards + recent bookmarks section

### Day 6 — TypeScript + Error Boundary
- [ ] Audit all components — ensure every prop is typed (no `any`)
- [ ] Add generic types where applicable
- [ ] Build `ErrorBoundary` class component
- [ ] Wrap each route in its own `ErrorBoundary`
- [ ] Wrap `Sidebar` in its own `ErrorBoundary`
- [ ] Test: manually throw an error in a component, verify boundary catches it
- [ ] Build `Settings` page with theme toggle (light/dark/system)
- [ ] Build export/import functionality

### Day 7 — Deploy + Retrospective
- [ ] Push to GitHub repository
- [ ] Connect to Vercel, deploy
- [ ] Test deployed version: add bookmarks, refresh, verify persistence
- [ ] Write `RETROSPECTIVE.md`:
  - Which of the 15 patterns did you use? List them.
  - What was hardest? What broke first?
  - What would you do differently?
  - What feature would you add next?

---

## ACCEPTANCE CRITERIA

You're done when:
- [ ] All 8 routes work
- [ ] Bookmarks persist after page refresh
- [ ] Search finds bookmarks by title, URL, description, and tags
- [ ] Filtering by tag, collection, and favorites works
- [ ] Sorting by title, URL, and date works
- [ ] Dark/light/system theme toggle works and persists
- [ ] Export creates a valid downloadable JSON file
- [ ] Import reads a JSON file and adds the bookmarks
- [ ] Error boundary catches render errors and shows fallback
- [ ] Framer Motion animations run on add/delete/page transition
- [ ] TypeScript has zero `any` types in your code
- [ ] Deployed to Vercel and accessible via URL

---

## THE 15 PATTERNS — CHECK THEM OFF

| # | Pattern | Where You Used It |
|---|---------|------------------|
| 1 | Module Pattern | `types/index.ts`, utility files |
| 2 | Observer | Theme system, localStorage sync |
| 3 | Factory | `createBookmark()`, `createCollection()` utils |
| 4 | Strategy | Sort strategies (by date, title, URL) |
| 5 | Closure | Custom hooks, debounced search |
| 6 | Prototype / Class | `ErrorBoundary` class component |
| 7 | Singleton | App context (one store for everything) |
| 8 | Compound Component | `BookmarkCard` with sub-components |
| 9 | Render Props | Advanced filter component |
| 10 | HOC | `withErrorBoundary` wrapper |
| 11 | Custom Hooks | `useBookmarks`, `useSearch`, `useFilter`, `useLocalStorage` |
| 12 | Debounce/Throttle | Search input debounce (300ms) |
| 13 | Rendering Strategies | SSG pages, ISR for bookmark detail |
| 14 | Type Safety | TypeScript everywhere, no `any` |
| 15 | Generics | `useLocalStorage<T>`, `DataList<T>`, `useApi<T>` |

---

## IF YOU GET STUCK

1. Check your previous exercises — the pattern you need is already there
2. Check the TypeScript exercise (30-31) for component typing patterns
3. Check the React exercises (react-state, react-hooks) for context/reducer patterns
4. Check the custom hooks exercises for `useLocalStorage` and `useSearch`
5. Check MDN for any web API questions
6. Check the Framer Motion docs for animation APIs

**Do not watch a "build a bookmark manager" tutorial.** That defeats the entire purpose.
You have everything you need. The struggle is the learning.

---

## RETROSPECTIVE TEMPLATE

After you finish, write `exercises/final-boss/RETROSPECTIVE.md`:

```markdown
# Linkhive Retrospective

## Deployed URL
https://linkhive-[yourname].vercel.app

## Patterns Used (15/15)
<!-- List each pattern and where you used it in this project -->

## What Went Well
<!-- 3-5 things you're proud of -->

## What Was Hard
<!-- What took longer than expected? What broke unexpectedly? -->

## What I Learned
<!-- What new understanding came from building this? -->

## What I Would Change
<!-- With hindsight, what would you do differently? -->

## Next Feature
<!-- If you built one more thing, what would it be? -->

## Time Spent
Day 1: __h  Day 2: __h  Day 3: __h
Day 4: __h  Day 5: __h  Day 6: __h  Day 7: __h
Total: __h
```

---

> "The expert in anything was once a beginner who refused to stop."
>
> You started with `console.log("Hello World")`.
> Now you're building deployed, typed, animated, tested full-stack applications.
> That's not nothing. That's everything.
>
> **Ship it.** 🚀
