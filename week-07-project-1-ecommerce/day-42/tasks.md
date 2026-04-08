# Day 42 Tasks — ProductCard + Fetch + Display Products

## Study Block (8:00 – 8:30 AM) — complete version only
- [ ] Open `project-starters/ecommerce-complete/src/hooks/useProducts.js` — read it
- [ ] Open `project-starters/ecommerce-complete/src/hooks/useProduct.js` — read it
- [ ] Open `project-starters/ecommerce-complete/src/components/ProductCard.jsx` — note all props used
- [ ] Open `project-starters/ecommerce-complete/src/components/ProductGrid.jsx` — note props
- [ ] Open `project-starters/ecommerce-complete/src/components/LoadingSkeleton.jsx` — how many skeleton cards, what classes
- [ ] Open `project-starters/ecommerce-complete/src/pages/HomePage.jsx` — how are loading/error/data states handled?
- [ ] Write notes: what does a product object look like? what does useProducts return?
- [ ] CLOSE the complete version

## Morning Build Block (8:30 – 11:00 AM)
- [ ] Confirm `@tanstack/react-query` is installed; if not: `npm install @tanstack/react-query`
- [ ] Confirm `QueryClientProvider` wraps app in `main.jsx`
- [ ] Create `src/hooks/useProducts.js` — `useQuery` fetching `https://fakestoreapi.com/products`
- [ ] `staleTime: 1000 * 60 * 5` — products cached for 5 minutes
- [ ] Create `src/hooks/useProduct.js` — `useQuery` for single product, `enabled: !!id`
- [ ] Create `src/components/ProductCard.jsx`
- [ ] Card container: `bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer`
- [ ] Image: `w-full h-48 object-contain p-4` — fixed height, centered
- [ ] Category badge: `text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full capitalize`
- [ ] Title: `text-sm font-medium text-gray-900 line-clamp-2 leading-snug`
- [ ] Star rating: `★` chars repeated × `Math.round(rate)`, `☆` for the rest
- [ ] Price: `$${price.toFixed(2)}` in bold
- [ ] "Add to Cart" button: full width, indigo background, placeholder `onClick` for now
- [ ] Favorite button: heart icon, placeholder `onClick` for now
- [ ] Create `src/components/ProductGrid.jsx` — maps products to ProductCards
- [ ] Empty state: "No products found" centered message
- [ ] Create `src/components/LoadingSkeleton.jsx` — `animate-pulse` placeholder cards
- [ ] Same grid layout as ProductGrid: `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`
- [ ] Update `src/pages/HomePage.jsx`
- [ ] Call `useProducts()` — destructure `data`, `isLoading`, `isError`, `error`
- [ ] When loading: render `<LoadingSkeleton count={8} />`
- [ ] When error: render error message with product count and retry hint
- [ ] When data: render `<ProductGrid products={data} />`
- [ ] Open `TASKS.md` in starter — complete any additional Day 2 requirements listed there
- [ ] Open browser — confirm skeleton shows briefly, then 20 real products appear with images

## Afternoon Block (2:00 – 4:00 PM)
- [ ] Create `day-42-dsa.js` in `week-07-project-1-ecommerce/day-42/`
- [ ] Open `dsa-bank/trees.md`
- [ ] Solve Problem 4 — pattern + complexity
- [ ] Solve Problem 5 — pattern + complexity
- [ ] Solve Problem 6 — pattern + complexity

## Wrap Up
- [ ] Write in `journal.md` — staleTime purpose, why `enabled: !!id`, what animate-pulse animates
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 42: ProductCard + fetch and display products from API"`
- [ ] Run: `git push origin main`

## Study-Then-Build Reminder
- Stuck on something? Look at complete version for THAT SECTION ONLY → understand → close → type it yourself
- Do not keep complete version open while building
