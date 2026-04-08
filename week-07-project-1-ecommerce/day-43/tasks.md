# Day 43 Tasks — Search + Filter + Sort

## Study Block (8:00 – 8:30 AM)
- [ ] Read `ecommerce-complete/src/hooks/useDebounce.js` — how long is the delay?
- [ ] Read `ecommerce-complete/src/utils/filterProducts.js` — what parameters does it take?
- [ ] Read `ecommerce-complete/src/components/SearchBar.jsx` — what props?
- [ ] Read `ecommerce-complete/src/components/FilterBar.jsx` — what props? how is active category styled?
- [ ] Read `ecommerce-complete/src/pages/HomePage.jsx` — how are useMemo and useDebounce wired together?
- [ ] CLOSE the complete version

## Morning Build Block (8:30 – 11:00 AM)
- [ ] Create `src/hooks/useDebounce.js` — `useState` + `useEffect` with `setTimeout` + cleanup
- [ ] Default delay 400ms
- [ ] Create `src/utils/` folder
- [ ] Create `src/utils/filterProducts.js` — pure function, takes `(products, { search, category, sort })`
- [ ] Step 1 in filter: `[...products]` copy (never mutate)
- [ ] Step 2: filter by `search` — title or category includes query (lowercase)
- [ ] Step 3: filter by `category` — skip if `"all"`
- [ ] Step 4: sort by `sort` value — switch statement for price-asc, price-desc, rating-desc, default
- [ ] Returns filtered + sorted array
- [ ] Create `src/components/SearchBar.jsx`
- [ ] Controlled input: `value` + `onChange` props
- [ ] Search icon (SVG or text) on the left inside input
- [ ] Clear (✕) button appears only when `value` is truthy
- [ ] Clear button calls `onChange("")`
- [ ] Create `src/components/FilterBar.jsx`
- [ ] "All" button always first, active when `selectedCategory === "all"`
- [ ] One pill button per category from `categories` prop
- [ ] Active pill: `bg-indigo-600 text-white`; inactive: `bg-gray-100 text-gray-700`
- [ ] Sort `<select>` with 4 options: default, price-asc, price-desc, rating-desc
- [ ] Update `src/pages/HomePage.jsx`
- [ ] Add `useState` for `search`, `category` ("all"), `sort` ("default")
- [ ] `const debouncedSearch = useDebounce(search, 400)`
- [ ] `categories` = `useMemo` → `[...new Set(products.map(p => p.category))]`
- [ ] `filteredProducts` = `useMemo` → `filterProducts(products, { search: debouncedSearch, category, sort })`
- [ ] Both `useMemo` depend on `products` — only re-derive when products changes
- [ ] `filteredProducts` also depends on `debouncedSearch`, `category`, `sort`
- [ ] Render `<SearchBar value={search} onChange={setSearch} />`
- [ ] Render `<FilterBar categories={categories} selectedCategory={category} onCategoryChange={setCategory} sort={sort} onSortChange={setSort} />`
- [ ] Show result count: `{filteredProducts.length} of {products.length} products`
- [ ] Open TASKS.md in starter — complete any additional Day 3 requirements

## Test Checklist
- [ ] Type "shirt" — grid updates after 400ms pause
- [ ] Clear search — grid resets
- [ ] Click "electronics" — only electronics show
- [ ] Type "phone" with electronics active — intersection filter works
- [ ] Sort "Price: Low → High" — cheapest product first
- [ ] Change sort while category and search are active — all three apply simultaneously

## Afternoon Block (2:00 – 4:00 PM)
- [ ] Create `day-43-dsa.js` in `week-07-project-1-ecommerce/day-43/`
- [ ] Open `dsa-bank/hashmaps.md` — pick 3 medium problems
- [ ] Solve Problem 1 — pattern + complexity
- [ ] Solve Problem 2 — pattern + complexity
- [ ] Solve Problem 3 — pattern + complexity

## Wrap Up
- [ ] Write in `journal.md` — useMemo purpose, why derive categories, debouncedSearch vs search
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 43: Search with debounce + category filter + price/rating sort"`
- [ ] Run: `git push origin main`
