# Day 44 Tasks — Product Detail Page + Dynamic Routing

## Study Block (8:00 – 8:30 AM)
- [ ] Read `ecommerce-complete/src/App.jsx` — how is `/product/:id` route defined?
- [ ] Read `ecommerce-complete/src/components/ProductCard.jsx` — how does it navigate? where is stopPropagation?
- [ ] Read `ecommerce-complete/src/pages/ProductDetailPage.jsx` — note layout, skeleton, error handling
- [ ] Read `ecommerce-complete/src/hooks/useProduct.js` — confirm `enabled: !!id`
- [ ] CLOSE the complete version

## Morning Build Block (8:30 – 11:00 AM)
- [ ] Open `src/App.jsx` — add `<Route path="/product/:id" element={<ProductDetailPage />} />` inside MainLayout route
- [ ] Open `src/components/ProductCard.jsx`
- [ ] Import `useNavigate` from react-router-dom
- [ ] Add `onClick={() => navigate('/product/' + product.id)}` to the outer card div
- [ ] Add `cursor-pointer` and `hover:shadow-md` Tailwind classes to outer div
- [ ] Add `e.stopPropagation()` to the Add to Cart button's onClick
- [ ] Add `e.stopPropagation()` to the Favorite button's onClick
- [ ] Test: click a product card → URL changes to /product/1 (or wherever)
- [ ] Open `project-starters/ecommerce-starter/TASKS.md` — check Day 4 requirements

## Midday Build Block (11:20 AM – 1:00 PM)
- [ ] Create `src/pages/ProductDetailPage.jsx`
- [ ] `const { id } = useParams()` — reads `:id` from URL
- [ ] `const { data: product, isLoading, isError, error } = useProduct(id)`
- [ ] Loading state: render `<ProductDetailSkeleton />` (inline component in same file)
- [ ] Skeleton: grey animated blocks for image area, badge, title, price, description, button
- [ ] Error state: red error message + "Go Back" button using `navigate(-1)`
- [ ] Layout: `grid grid-cols-1 md:grid-cols-2 gap-12`
- [ ] Left column: `bg-gray-50 rounded-2xl p-8 flex items-center justify-center` with `<img>` inside
- [ ] Image: `max-h-80 w-full object-contain`
- [ ] Right column: category badge, title (text-2xl font-bold), star rating + count, price (text-3xl)
- [ ] Full `product.description` text
- [ ] "Add to Cart" button: full-width, indigo — placeholder onClick for now
- [ ] Favorite heart button: border, square — placeholder onClick for now
- [ ] "Back to Products" button: `navigate(-1)` — at top of page
- [ ] Test: click a card → detail page shows. Click another card → different product. Type `/product/999` → error shows.
- [ ] Test: detail page skeleton shows briefly before product loads (check on slow network in DevTools → Network → Slow 3G)

## Afternoon Block (2:00 – 4:00 PM)
- [ ] Create `day-44-dsa.js` in `week-07-project-1-ecommerce/day-44/`
- [ ] Open `dsa-bank/linked-lists.md`
- [ ] Solve Problem 4 — pattern + complexity
- [ ] Solve Problem 5 — pattern + complexity
- [ ] Solve Problem 6 — pattern + complexity

## Wrap Up
- [ ] Write in `journal.md` — navigate(-1) meaning, stopPropagation purpose, enabled: !!id
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 44: Product detail page with dynamic routing /product/:id"`
- [ ] Run: `git push origin main`
