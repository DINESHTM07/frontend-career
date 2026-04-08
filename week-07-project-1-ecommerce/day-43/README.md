# Day 43 — Project 1 Day 3: Search + Filter + Sort

**Status:** 📋 READY TO START
**Week:** 7 | **Theme:** E-Commerce Project

---

## Today's Goal

The product grid is live. Now make it interactive. Users need to find what they're looking for — that means search, category filter, and sort.

By end of today:
- Debounced search that filters products as the user types (fires after 400ms pause)
- Category filter buttons that show only products from the selected category
- Sort dropdown: price low→high, price high→low, rating high→low
- All three work together simultaneously — search within a category, sorted by rating
- The filtering logic lives in a pure utility function, not the component

---

## Daily Rule: Study → Close → Build

Before building, open the complete version and study:
- `src/hooks/useDebounce.js`
- `src/utils/filterProducts.js`
- `src/components/SearchBar.jsx`
- `src/components/FilterBar.jsx`
- `src/pages/HomePage.jsx` — how search, filter, and sort state are wired together

Take notes. Close. Build.

---

## Morning (8:00 – 11:00 AM) — useDebounce + filterProducts Utility

### Build: useDebounce hook (or reuse from Week 6)

Create `src/hooks/useDebounce.js`:

```js
import { useState, useEffect } from 'react'

export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

---

### Build: filterProducts utility

Create `src/utils/filterProducts.js` — a pure function. No React, no hooks, no side effects:

```js
/**
 * Filter and sort an array of products.
 * @param {Array}  products   - raw product array from API
 * @param {string} search     - debounced search query
 * @param {string} category   - selected category ("all" means no filter)
 * @param {string} sort       - "price-asc" | "price-desc" | "rating-desc" | "default"
 * @returns {Array}           - filtered and sorted products
 */
export function filterProducts(products, { search, category, sort }) {
  let result = [...products];

  // 1. Filter by search query (title match, case-insensitive)
  if (search.trim()) {
    const query = search.toLowerCase();
    result = result.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }

  // 2. Filter by category
  if (category && category !== "all") {
    result = result.filter(p => p.category === category);
  }

  // 3. Sort
  switch (sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating-desc":
      result.sort((a, b) => b.rating.rate - a.rating.rate);
      break;
    default:
      break; // keep original API order
  }

  return result;
}
```

**Why a pure function?** It's trivial to test (no React needed), trivial to understand (input → output), and keeps the component clean. You can change the sorting logic without touching the component.

---

## Midday (11:20 AM – 1:00 PM) — SearchBar + FilterBar + Wire Up

### Build: SearchBar component

Create `src/components/SearchBar.jsx`:

```jsx
export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search products..."
        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
    </div>
  );
}
```

---

### Build: FilterBar component

Create `src/components/FilterBar.jsx`:

```jsx
const SORT_OPTIONS = [
  { value: "default",     label: "Sort: Default" },
  { value: "price-asc",   label: "Price: Low → High" },
  { value: "price-desc",  label: "Price: High → Low" },
  { value: "rating-desc", label: "Rating: Best First" },
];

export default function FilterBar({ categories, selectedCategory, onCategoryChange, sort, onSortChange }) {
  return (
    <div className="flex flex-wrap gap-3 items-center justify-between">

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === "all"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort dropdown */}
      <select
        value={sort}
        onChange={e => onSortChange(e.target.value)}
        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {SORT_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

    </div>
  );
}
```

---

### Wire everything in HomePage

Update `src/pages/HomePage.jsx`:

```jsx
import { useState, useMemo } from 'react'
import { useProducts } from '../hooks/useProducts.js'
import { useDebounce } from '../hooks/useDebounce.js'
import { filterProducts } from '../utils/filterProducts.js'
import ProductGrid from '../components/ProductGrid.jsx'
import SearchBar from '../components/SearchBar.jsx'
import FilterBar from '../components/FilterBar.jsx'
import LoadingSkeleton from '../components/LoadingSkeleton.jsx'

export default function HomePage() {
  const { data: products, isLoading, isError, error } = useProducts();

  const [search, setSearch]           = useState("");
  const [category, setCategory]       = useState("all");
  const [sort, setSort]               = useState("default");

  const debouncedSearch = useDebounce(search, 400);

  // Derive categories from the product data (no extra API call)
  const categories = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map(p => p.category))];
  }, [products]);

  // Apply filters — recomputes only when these values change
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return filterProducts(products, { search: debouncedSearch, category, sort });
  }, [products, debouncedSearch, category, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Search */}
      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* Filters */}
      {products && (
        <div className="mb-6">
          <FilterBar
            categories={categories}
            selectedCategory={category}
            onCategoryChange={setCategory}
            sort={sort}
            onSortChange={setSort}
          />
        </div>
      )}

      {/* Result count */}
      {products && !isLoading && (
        <p className="text-sm text-gray-500 mb-4">
          {filteredProducts.length} of {products.length} products
        </p>
      )}

      {/* Content */}
      {isLoading && <LoadingSkeleton count={8} />}
      {isError   && <p className="text-red-500 text-center py-16">{error.message}</p>}
      {!isLoading && !isError && <ProductGrid products={filteredProducts} />}

    </div>
  );
}
```

**Test everything:**
- Type "jacket" — grid filters as you type (with a 400ms delay)
- Click "electronics" — only electronics show
- Search "phone" with electronics filter active — both filters apply
- Sort by price low→high — cheapest first
- Clear search — all category results reappear

---

## Afternoon (2:00 – 4:00 PM) — DSA

Open `dsa-bank/hashmaps.md`. Solve **3 problems** from medium difficulty.

Create `day-43-dsa.js` in the `week-07-project-1-ecommerce/day-43/` folder.

---

## Wrap Up

Write in `journal.md`:
- Why use `useMemo` for `filteredProducts` — what would happen without it?
- Why derive categories from product data instead of making a separate API call?
- What is the difference between the raw `search` state and `debouncedSearch`?

```bash
git add .
git commit -m "Day 43: Search with debounce + category filter + price/rating sort"
git push origin main
```

---

## End of Day Checklist

- [ ] Studied: `useDebounce`, `filterProducts`, `SearchBar`, `FilterBar`, `HomePage` in complete version
- [ ] Built `useDebounce.js` — 400ms delay with cleanup
- [ ] Built `filterProducts.js` — pure function, handles search + category + sort
- [ ] Built `SearchBar.jsx` — clear button when value is present, search icon
- [ ] Built `FilterBar.jsx` — "All" + one pill per category, sort dropdown
- [ ] `HomePage.jsx` — all 3 states (search, category, sort) wired
- [ ] `categories` derived with `useMemo` + `Set` from product data
- [ ] `filteredProducts` derived with `useMemo` from all 3 filter values + debouncedSearch
- [ ] All three filters work together (not just individually)
- [ ] Result count shows "X of 20 products"
- [ ] Solved 3 DSA problems in `day-43-dsa.js`
- [ ] Committed and pushed
